var express = require("express");
var router = express.Router();
var mail = require("../config/emailConf");
var mongoDB = require("../config/mongoConf");
var mysqlDB = require("../config/mysqlConf");
var session = require("express-session");
var administorRouter = require("./modules/administor");
var url = require('url');
const axios = require('axios')
router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 600000 } }));

mysqlDB.connect();

router.get('/', (req, res) => {
    res.render("start");
})

router.get('/gate', (req, res) => {
    res.render('gate');
});

router.get('/home', (req, res) => {
    try {
        mysqlDB.query('SELECT * FROM news WHERE status=1 LIMIT 0,7', function (err, result) {
            if (err) {
                throw new Error("系统异常")
            } else {
                let type1_list = []
                let type2_list = []
                let type3_list = []
                result.forEach(element => {
                    if (element.type === 1) {
                        type1_list.push(element);
                    } else if (element.type === 2) {
                        type2_list.push(element);
                    } else if (element.type === 3) {
                        type3_list.push(element);
                    }
                });
                let data = {
                    type1: type1_list,
                    type2: type2_list,
                    type3: type3_list
                }
                res.render("home", { layout: 'default', list: data });
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
});

router.get('/signup', (req, res) => {
    res.render("toRegister", { layout: 'register' });
});

router.get('/sendCode/:email', (req, res) => {
    try {
        let code = Math.random().toString().substr(2, 6);
        mongoDB.User.find({ email: req.params.email }, (err, response) => {
            if (err) {
                res.send({ code: 500, msg: err.toString() });
            }
            if (response.length != 0) {
                res.send({ code: 500, msg: "请3分钟后再请求发送验证码" })
            } else {
                mail.send(req.params.email, code, (status) => {
                    if (status == 200) {
                        let newUser = new mongoDB.User({
                            email: req.params.email,
                            code: code,
                            valid: new Date().getTime() / 1000
                        });
                        newUser.save(function (err, User) {
                            if (err) {
                                res.send({ msg: err.toString, code: 500 })
                            }
                        });
                        res.send({ msg: "邮件发送成功", code: 200 });
                    } else {
                        res.send({ msg: "邮件发送失败，请检查邮箱地址", code: 500 });
                    }
                })
            }
        })
    } catch (err) {
        res.send({ msg: err.toString(), code: 500 })
    }
})

router.post('/register', (req, res) => {
    let data = req.body;
    try {
        // 检测验证码是否过期
        mongoDB.User.find({ email: data.email, code: data.code }, (err, response) => {
            if (err) {
                res.send({ msg: err.toString(), code: 500 });
            }
            if (response.length == 0) {
                res.send({ msg: "验证码不正确或者失效", code: 500 });
            } else {
                // 检查mysql内部username有没有已注册
                mysqlDB.query('SELECT * FROM user WHERE username = ?', data.username, (err, result) => {
                    if (err) {
                        throw new Error("数据库异常");
                    }
                    if (result.length != 0) {
                        res.send({ msg: "该用户名已被注册", code: 500 });
                    } else {
                        mysqlDB.query("INSERT INTO user(username, password, type) VALUES (?, ?, ?)", [data.username, data.password, data.role], function (err, result) {
                            if (err) {
                                throw new Error("数据库异常")
                            } else {
                                res.send({ msg: "插入成功", code: 200 });
                            }
                        });
                    }
                })
            }
        })
    } catch (err) {
        res.send({ msg: err.toString(), code: 500 });
    }
})

router.post('/login', (req, res) => {
    let data = req.body;
    try {
        mysqlDB.query('SELECT * FROM user WHERE username = ? AND password = ? AND type = ?', [data.username, data.password, data.role], function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            }
            if (result.length == 0) {
                res.send({ msg: "账号密码不正确，请核实自己的账号密码以及登录的身份", code: 500 });
            } else {
                let user = { id: result[0].id, username: result[0].username, type: result[0].type }
                req.session.user = user;
                res.send({ msg: "欢迎登陆", role: result[0].type, code: 200 });
            }
        })
    } catch (err) {
        res.send({ msg: err.toString(), code: 500 });
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/home')
})

router.get('/newsPreview', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('SELECT * FROM news WHERE id = ?', id, (err, result) => {
            if (err) {
                throw new Error("数据库异常")
            } else {
                let newsData = {
                    title: result[0].title,
                    date: result[0].date,
                    content: result[0].content
                }
                res.render('news_body', { layout: 'news_preview', data: newsData });
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
})

router.get('/github', async (req, res) => {
    const code = req.query.code
    const r = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: '41464cba40217f9ecffb',
        client_secret: '89f2098606b024a4f9ee29a40c13215a83c81e18',
        code: code
    })
    if (r && r.status === 200) {
        if (r.data.split('=')[0] === 'access_token') {
            const tr = await axios.get('https://api.github.com/user?' + r.data)
            if (tr && tr.status === 200) {
                let info = {
                    userName: tr.data.login,
                    uid: tr.data.id,
                    img: tr.data.avatar_url,
                    email: tr.data.email,
                    desc: tr.data.bio
                }
                res.render('student_personal', { layout: 'student', data: info })
            } else {
                res.render('administor_homes', { layout: '404' })
            }
        } else {
            res.render('administor_home', { layout: '404' })
        }
    } else {
        res.render('administor_homes', { layout: '404' })
    }

})

router.get('/student', (req, res) => {
    res.render('student_personal', { layout: 'student' })
})

router.use('/administor', administorRouter);

module.exports = router;