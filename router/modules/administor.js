const express = require("express");
const router = express.Router();
const marked = require("marked");
const url = require("url");
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mysqlDB = require("../../config/mysqlConf");

const upload = multer({ storage: multer.memoryStorage() }) // 上传文件采用缓存策略

function auth3(req, res, next) {
    if (req.session.user) {
        if (req.session.user.type == 3) {
            next();
        } else {
            res.render('administor_home', { layout: '404', data: '非法登录，请先在首页登录' })
        }
    } else {
        res.render('administor_home', { layout: '404', data: '非法登录，请先在首页登录' })
    }
}

router.get('/', auth3, (req, res) => {
    try {
        res.render('administor_home', { layout: 'administor' });
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
});

router.get('/showNews', auth3, (req, res) => {
    try {
        mysqlDB.query('SELECT * FROM news ORDER BY id DESC', function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.render('news_views', { layout: 'administor', list: result });
            }
        });
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
});

router.get('/showStudent', (req, res) => {
    try {
        try {
            mysqlDB.query('SELECT username FROM user WHERE type=1', function (err, result) {
                if (err) {
                    throw new Error("数据库异常")
                } else {
                    res.render('student_manager', { layout: 'administor', data: result });
                }
            })
        } catch (err) {
            res.render('administor_home', { layout: '404', data: '系统异常' })
        }
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
})

router.post('/newsCreate', (req, res) => {
    let data = req.body;
    try {
        mysqlDB.query('INSERT INTO news(title, type, date, status) VALUES(?,?,?,?)', [data.title, data.type, data.datetime, data.status], function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.send({ code: 500, msg: "创建成功" });
            }
        });
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.get('/editNews', (req, res) => {
    try {
        res.render('md_editor', { layout: 'news_editor' })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.post('/editNews/save', (req, res) => {
    try {
        let data = req.body;
        let content = marked(data.context);
        let newsId = data.id;
        mysqlDB.query('UPDATE news SET content = ?, status = ? WHERE id = ?', [content, 2, newsId], function (err, result) {
            if (err) {
                throw new Error("编辑失败")
            } else {
                res.send({ code: 200, msg: "编辑成功" });
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.get('/publish', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('SELECT * FROM news WHERE id = ?', id, function (err, result) {
            if (err) {
                throw new Error('数据库异常');
            } else if (result[0].content == "" || result[0].content.length == 0) {
                throw new Error('新闻内容为空，不可发布');
            } else {
                mysqlDB.query('UPDATE news SET status = ? WHERE id = ?', [1, id], function (err, result) {
                    if (err) {
                        throw new Error('数据库异常')
                    } else {
                        res.redirect('/administor/showNews');
                    }
                })
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
})

router.get('/ban', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('UPDATE news SET status = ? WHERE id = ?', [3, id], function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.redirect('/administor/showNews');
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.post('/addUsersByBatch', upload.any(), (req, res) => {
    if (!req.files || req.files.length == 0) {
        res.send({ code: 500, msg: '请上传文件' });
    } else {
        const { originalname, buffer } = req.files[0];
        if (!originalname.endsWith('xls') && !originalname.endsWith('xlsx')) {
            res.send({ code: 500, msg: '请上传xls或xlsx文件' });
        }

        const workSheet = xlsx.read(buffer, { type: "buffer" });
        let excelObj = workSheet.Sheets[workSheet.SheetNames[0]];
        let userList = xlsx.utils.sheet_to_json(excelObj);
        let values = [];
        let total = 0;
        let flag = 1;
        try {
            mysqlDB.query('SELECT * FROM user', function (err, rows) {
                if (err) {
                    throw new Error("数据库异常");
                }
                for (let i = 0; i < userList.length; i++) {
                    flag = 1;
                    let userName = userList[i].workId;
                    let type = userList[i].type || 1;
                    let password = '123qwe';
                    if (userName == "") {
                        continue;
                    } else if (type !== 1 && type !== 4) {
                        continue;
                    }
                    for (let j = 0; j < rows.length; j++) {
                        if (userName === rows[j].username) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        values.push([userName, password, type]);
                        total++;
                        flag = 1;
                    }
                }
                if (values.length === 0) {
                    res.send({ code: 500, msg: '所有用户导入失败,请检查信息填写是否符合规范或者导入了已存在的用户' });
                } else {
                    mysqlDB.query('INSERT INTO user(username, password, type) VALUES ?', [values], function (err, result) {
                        if (err) {
                            res.send({ code: 500, msg: '数据库异常' });
                        }
                        res.send({ code: 200, msg: "插入了" + total + '条数据' });
                    })
                }
            })
        } catch (err) {
            res.redirect('/administor/showStudent');
        }
    }


})

router.get('/download', (req, res) => {
    const filepath = path.join(__dirname, '../../src/user.xlsx')
    res.download(filepath)
})

module.exports = router;