var express = require("express");
var router = express.Router();
var mysqlDB = require("../config/mysqlConf");
var http = require('http');
var url = require('url');
var querystring = require("querystring");
var session = require("express-session");
var smsCode = require("sms-code");
var administorRouter = require("./modules/administor");
var url = require('url');
const multer = require('multer');
const {randomCode,sendCode}=require("../config/teleCode");
const upload = multer({ storage: multer.memoryStorage() }) // 上传文件采用缓存策略

router.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { maxAge: 600000 } }));

mysqlDB.connect();

router.get('/', (req, res) => {
    res.render("home");
})
//知识普及
router.get('/knowledge', (req, res) => {
    var arg =url.parse(req.url, true).query; 
    var id = arg.id;
    let user=req.session.user;
    // console.log(user);
    try {
        mysqlDB.query('SELECT * FROM knowledge WHERE k_status=?',[1],function (err,result) {
            if (err) {
                throw new Error("系统异常");
            } if (result.length == 0) {
                res.send({ msg: "数据库内还没有消息", code: 500 });
            }else{
                console.log("id是"+id);
                if (!id) {
                res.render('knowledge-empty', { layout: 'knowledge', list: result});   
                } else {
                res.render('knowledge-body', { layout: 'knowledge', list: result});  
                }
            }
        })
    } catch (error) {
        res.send({ code: 500, msg: err.toString() })
    }
});

//检测是否已经进行过证型分析
router.post('/checking',(req,res)=>{

    let data=req.body;
    // console.log("====>"+data.id);
    try {
        mysqlDB.query('SELECT type FROM userinfo WHERE id=?',[data.id],function (err,result) {
            // console.log("=============================");
            // console.log(result[0].type);
            if(result[0].type==""||result[0].type==null){
                res.send({msg:"您未填写证型辨识表",code:200});
            } else{
                res.send({msg:"您已填写，您的证型是"+result[0].type,code:500});
            }           
        });
        
    } catch (error) {
        res.send({ code: 500, msg: error.toString() })
    }
});
//证型分析题目
router.get('/typeAnalyse',(req,res)=>{
    try {
        mysqlDB.query('SELECT * FROM question',function (err,result) {
            if (err) {
                throw new Error("系统异常");
            } if (result.length == 0) {
                res.send({ msg: "数据库没有题目", code: 500 });
            }else{    
                res.render('typeAnalyse_body', {layout: 'typeAnalyse',list:result});
            }
        });
    } catch (error) {
        res.send({ code: 500, msg: error.toString() })
    }
});

//证型判断
router.post('/zxpd',(req,res)=>{
    let data=req.body;
   console.log("您的id是"+data.id);
    console.log(data);
    try { 
        if(data.total==15){
            mysqlDB.query('UPDATE userinfo SET type = ? WHERE id=?',[data.str,data.id],function(err,result){
                if (err) {
                    throw new Error("系统异常");
                } else {
                    res.send({msg:"您的中医证型是"+data.str,code: 200})
                }
            });
        }else{
            res.send({ code: 500, msg: "您还有"+data.str1+"没有填写" })
        }     
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
});
//体检报告分析页面搭建
router.get('/reportAnalyse',(req,res)=>{
    //获取url中的id
    var arg =url.parse(req.url, true).query; 
    var id = arg.id;
    console.log(id);
    try {
        res.render('reportAnalyse_body', {layout: 'reportAnalyse'});
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
        
    }
})


//健康干预方法查看
router.get('/intervention',(req,res)=>{
    let user=req.session.user;
    //获取url中的id
    var arg =url.parse(req.url, true).query; 
    var id = arg.id;
    console.log(id);
    try {
        mysqlDB.query('SELECT type FROM userinfo WHERE id=?',[id],function(err,result){
            var a=result[0].type;
            console.log(a)
            mysqlDB.query('SELECT * FROM intervention WHERE typename=? ORDER BY waystype_id',[a],function(err,result){
                var b=result[0].ways_name
                console.log(b)
                res.render('intervention_body', { layout: 'intervention', list: result});
            })
        })
    } catch (error) {
        res.send({ code: 500, msg: error.toString() })
    }
});
//个人信息查看
router.get('/show',(req,res)=>{
    let user=req.session.user;
    //获取url中的id
    var arg =url.parse(req.url, true).query; 
    var id = arg.id;
    
    console.log(id);
    try {
        mysqlDB.query('SELECT * FROM userinfo WHERE id=?',[id],function (err,result) {
            if (err) {
                throw new Error("系统异常");
            } if (result.length == 0) {
                res.send({ msg: "数据库没有此人", code: 500 });
            }else{
                let userinfo = {
                    username: result[0].username,
                    tele: result[0].telephone,
                    password: result[0].password
                }
                console.log(userinfo);
                res.render('toShow', { layout: 'show',list: userinfo});
           
            }
        })
    } catch (error) {
        res.send({ code: 500, msg: error.toString() })
    }

});
//个人信息修改
router.post('/change',(req,res)=>{
    let data = req.body;
    console.log(data);
    try {
        mysqlDB.query('UPDATE userinfo SET password = ? , username = ? WHERE telephone = ?',[data.surePassword,data.username,data.tele],function(err,result){
            if(err){
                throw new Error("数据库异常"+err);
            }else{
                res.send({msg:"修改成功,请重新登录",code:200});
            }
        });
    } catch (error) {
        res.send({msg:error.toString(),code:500});
    }
});
//首页
router.get('/home', (req, res) => {
    try {
        mysqlDB.query('SELECT * FROM userinfo', function (err, result) {
            if (err) {
                throw new Error("系统异常");
            } else {
                let type1_list = []
                let type2_list = []
                result.forEach(element => {
                    if (element.role === 0) {
                        type1_list.push(element);
                    } else if (element.role === 1) {
                        type2_list.push(element);
                    } 
                });
                let data = {
                    type1: type1_list,
                    type2: type2_list
                }
                 res.render("home", { layout: 'default', list: data });
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
});
//注册页面
router.get('/signup', (req, res) => {
    
    res.render("toRegister", { layout: 'register' });
});

//发送验证码
router.get('/sendCode/:tele', (req, res) => {
    try {
        var tele = req.params.tele;
        
        const code = smsCode.getCode(tele);
        
        console.log(code);
        sendCode(tele,code,function(success){
        if(success){
            res.send("短信验证码已发送");
        }else{
            res.send("短信验证码发送失败");
        }
    })

    } catch (err) {
        res.send({ msg: err.toString(), code: 500 })
    }
})

//注册提交
router.post('/register', (req, res) => {
    let data = req.body;
    console.log(data);
    try {
        // 判断验证码是否一致
        if (smsCode.verifyCode(data.tele, data.code)) {
            // 检查mysql内部telephone有没有已注册
            mysqlDB.query('SELECT * FROM userinfo WHERE telephone = ? AND role=?', [data.tele,0], (err, result) => {

                if (err) {
                    throw new Error("数据库异常"+err);
                }
                if (result.length != 0) {
                    
                    res.send({ msg: "该手机号已被注册", code: 500 });
                } else {
                    mysqlDB.query('INSERT INTO userinfo(username, password, telephone,role,status) VALUES (?,?,?,?,?)',[data.username,data.password,data.tele,0,1], function (err, result) {
                        if (err) {
                            throw new Error("数据库异常"+err);
                        } else {
                            res.send({ msg: "注册成功", code: 200 });
                        }
                    });
                }
            })
        } else {
            res.send({ msg: "验证码有问题请确认！！！", code: 500 });
        }

    } catch (err) {
        res.send({ msg: err.toString(), code: 500 });
    }
})

//登录
router.post('/login', (req, res) => {
    let data = req.body;
    console.log(data);
    try {
        mysqlDB.query('SELECT * FROM userinfo WHERE telephone = ? AND password = ? AND role = ?', [data.tele, data.password, data.role], function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            }
            if (result.length == 0) {             
                res.send({ msg: "账号密码不正确，请核实自己的账号密码以及登录的身份", code: 500 });
            } else {
                let user = { id: result[0].id, username: result[0].username, role: result[0].role }
                req.session.user = user;
                res.send({ msg: "欢迎登陆", role: result[0].role,id:result[0].id, code: 200 });
            }
        })
    } catch (err) {
        res.send({ msg: err.toString(), code: 500 });
    }
})

//登出
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/home')
})


router.use('/administor', administorRouter);

module.exports = router;