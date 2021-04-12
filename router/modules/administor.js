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
        if (req.session.user.role == 1) {
            next();
        } else {
            res.render('administor_home', { layout: '404', data: '非法登录，请先在首页登录' })
        }
    } else {
        res.render('administor_home', { layout: '404', data: '非法登录，请先在首页登录' })
    }
}

router.get('/', (req, res) => {
    try {
        res.render('administor_home', { layout: 'administor' });
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
});

router.get('/showNews', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('SELECT * FROM knowledge ORDER BY k_status DESC,k_type', function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.render('news_views', { layout: 'administor', list: result });
                console.log(result[0]);
            }
        });
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
});

router.get('/showWays', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('SELECT * FROM intervention ORDER BY ways_status,waystype_id,typename', function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.render('ways_views', { layout: 'administor', list: result });
                console.log(result[0]);
            }
        });
    } catch (err) {
        res.render('administor_home', { layout: '404', data: '系统异常' })
    }
});

router.get('/showStudent', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    try {
        try {
            mysqlDB.query('SELECT * FROM userinfo WHERE role=0 ORDER BY status DESC,role', function (err, result) {
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
    console.log(data);
    try {
            mysqlDB.query('INSERT INTO knowledge(k_title, k_content) VALUES(?,?)', [data.title, data.content], function (err, result) {
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

router.post('/waysCreate', (req, res) => {
    let data = req.body;
    console.log(data);
    try {
            mysqlDB.query('INSERT INTO intervention(typename,ways_name,ways_content, waystype_id) VALUES(?,?,?,?)', [data.typename, data.waysname, data.content, data.typeid], function (err, result) {
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
    let id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('SELECT * FROM knowledge WHERE k_id = ?',id,function(err,result){
            if (err) {
                throw new Error("数据库错误")
            } else {
                console.log(result[0])
                res.render('newschange', { layout: 'news_editor',data:result[0] })
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.post('/newsChange', (req, res) => {
    try {
        let data = req.body;
        console.log("========================")
        console.log(data);
        mysqlDB.query('UPDATE knowledge SET k_content = ?, k_title = ? WHERE k_id = ?', [data.content, data.title, data.id], function (err, result) {
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

router.get('/editWays', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    console.log(id)
    try {
        mysqlDB.query('SELECT * FROM intervention LEFT JOIN ways_type ON intervention.waystype_id=ways_type.ways_id WHERE intervention.id = ?',id,function(err,result){
            if (err) {
                throw new Error("数据库错误")
            } else {
                console.log(result[0])
                res.render('wayschange', { layout: 'news_editor',data:result[0] })
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

router.post('/waysChange', (req, res) => {
    try {
        let data = req.body;
        console.log("========================")
        console.log(data);
        mysqlDB.query('UPDATE intervention SET ways_content = ?, ways_name = ?,waystype_id = ?, typename = ? WHERE id = ?', [data.content, data.title,data.waystype, data.typename, data.id], function (err, result) {
            if (err) {
                throw new Error("编辑失败"+err)
            } else {
                res.send({ code: 200, msg: "编辑成功" });
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

//普及信息处理
router.get('/publish', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    
    console.log(id);
    try {
        mysqlDB.query('SELECT * FROM knowledge WHERE k_id = ?', id, function (err, result) {
            if (err) {
                throw new Error('数据库异常'+err);
            } else if (result[0].k_content == "" || result[0].k_content.length == 0) {
                throw new Error('内容为空，不可发布');
            } else {
                mysqlDB.query('UPDATE knowledge SET k_status = ? WHERE k_id = ?', [1, id], function (err, result) {
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
    var id = url.parse(req.url, true).query.id;

    try {
        mysqlDB.query('UPDATE knowledge SET k_status = ? WHERE k_id = ?', [0, id], function (err, result) {
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

//干预方法控制
router.get('/publish2', (req, res) => {
    let id = url.parse(req.url, true).query.id;
    
    try {
        mysqlDB.query('SELECT * FROM intervention WHERE id = ?', id, function (err, result) {
            if (err) {
                throw new Error('数据库异常'+err);
            } else if (result[0].ways_content == "" || result[0].ways_content.length == 0) {
                throw new Error('内容为空，不可发布');
            } else {
                mysqlDB.query('UPDATE intervention SET ways_status = ? WHERE id = ?', [1, id], function (err, result) {
                    if (err) {
                        throw new Error('数据库异常')
                    } else {
                        res.redirect('/administor/showWays');
                    }
                })
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() })
    }
})

router.get('/ban2', (req, res) => {
    var id = url.parse(req.url, true).query.id;
    try {
        mysqlDB.query('UPDATE intervention SET ways_status = ? WHERE id = ?', [2, id], function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.redirect('/administor/showWays');
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

//管理员查看个人信息
router.get('/information',(req,res)=>{
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
                res.render('toInformation', { layout: 'information',list: userinfo});
           
            }
        })
    } catch (error) {
        res.send({ code: 500, msg: error.toString() })
    }

});

router.get('/dele',(req,res)=>{
    let id = url.parse(req.url, true).query.id;
    console.log("idshi"+id)
    try {
        mysqlDB.query('UPDATE userinfo SET status = ? WHERE id = ?',[0,id],function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.redirect('/administor/showStudent');
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
});
router.get('/undele',(req,res)=>{
    let id = url.parse(req.url, true).query.id;
    console.log("idshi"+id)
    try {
        mysqlDB.query('UPDATE userinfo SET status = ? WHERE id = ?',[1,id],function (err, result) {
            if (err) {
                throw new Error("数据库异常");
            } else {
                res.redirect('/administor/showStudent');
            }
        })
    } catch (err) {
        res.send({ code: 500, msg: err.toString() });
    }
})

//用户批量插入
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
            mysqlDB.query('SELECT * FROM userinfo', function (err, rows) {
                if (err) {
                    throw new Error("数据库异常");
                }
                for (let i = 0; i < userList.length; i++) {
                    flag = 1;
                    let telephone = userList[i].telephone;
                    let role = userList[i].role || 0;
                    let password = '123456';
                    if (telephone == "") {
                        continue;
                    } else if (role !== 1 && role !== 0) {
                        continue;
                    }
                    for (let j = 0; j < rows.length; j++) {
                        if (telephone === rows[j].telephone) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        values.push([telephone, password, role]);
                        total++;
                        flag = 1;
                    }
                }
                if (values.length === 0) {
                    res.send({ code: 500, msg: '所有用户导入失败,请检查信息填写是否符合规范或者导入了已存在的用户' });
                } else {
                    mysqlDB.query('INSERT INTO userinfo(telephone, password, role) VALUES ?', [values], function (err, result) {
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

router.post('/addUsersBySingle',(req,res)=>{
    var data=req.body;
    mysqlDB.query('SELECT * FROM userinfo WHERE telephone = ? AND role=?', [data.tele,data.role], (err, result) => {

        if (err) {
            throw new Error("数据库异常"+err);
        }
        if (result.length != 0) {
            
            res.send({ msg: "该手机号已被注册", code: 500 });
        } else {
            // res.send({ msg: "注册成功", code: 200 });

            mysqlDB.query('INSERT INTO userinfo(password, telephone,role,status) VALUES (?,?,?,?)',[123456,data.tele,data.role,1], function (err, result) {
                if (err) {
                    throw new Error("数据库异常"+err);
                } else {
                    res.send({ msg: "注册成功", code: 200 });
                }
            });
        }
    })
})

router.get('/download', (req, res) => {
    const filepath = path.join(__dirname, '../../src/user.xlsx')
    res.download(filepath)
})

module.exports = router;