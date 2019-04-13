//app_server_00/app.js
//0:下载mysql express模块
//1:引入二个模块 mysql express
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
//1.1 引入模块 cors
const cors = require("cors");

//2:创建连接池 很大提高效率方法
var pool = mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"qzz",
    connectionLimit:100
});

//3:创建express对象
var server = express();
//3.1 配置允许访问列 脚手架8080
server.use(cors({
  origin:["http://127.0.0.1:8080",
  "http://localhost:8080"],
  credentials:true
}));
// 3.11加载 模块 express-session
const session = require("express-session");
server.use(session({
  secret:"128为随机数字符串",
  resava:false,
  saveUninitialized:true,
  cookie:{
    maxAge:1000*60*60
  }
}))

// 3.12配置 模块
//3.2 配置静态资源目录 public
server.use(express.static("public"));
//3.3：配置第三方中间件
//3.4: 配置json是否是自动转换 
server.use(bodyParser.urlencoded({extended:false}))

//5:如果评论成功 清空原有发表内容
server.listen(3000);
//4:为express对象绑定监听端口 3000

// 添加用户日志
// insertDay
server.post("/insertDay",(req,res)=>{
  //2:获取二个参数 uname upwd
  var user_name = req.body.u;
  var user_loginTime="";
  var sql = "insert into qz_day values(null,?,now())";
  //4:执行sql
  pool.query(sql,[user_name,user_loginTime],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      //console.log(result);
      if(result.affectedRows>0){
        res.send({code:1});
      }else{

      }
  })
});

// 查询日志接口!!!!!!!!!!!!!!!!!!!!!
server.get("/selectDays",(req,res)=>{
  //2:获取二个参数 uname upwd
  var user_name = req.query.uname;
  var sql = "select user_loginTime from qz_day where user_name = ?";
  //4:执行sql
  pool.query(sql,[user_name],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      //console.log(result);
      if(result.length>=1){
        res.send({code:200,data:result});
      }else{

      }
  })
});


// 修改用户在线状态
// update
server.post("/update",(req,res)=>{
  //2:获取二个参数 uname upwd
  var uname = req.body.uu;
  // ////console.log(uname);
  var sql = "update qz_u_all set stateU = true where uname = ?";
  //4:执行sql
  pool.query(sql,[uname],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      //console.log(result);
      if(result.affectedRows>0){
        // ////console.log(result);
        res.send({code:1});
      }else{

      }
  })
});

// 访问登录请求相同用户
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
server.get("/selectXt",(req,res)=>{
  //2:获取二个参数 uname upwd
  var u = req.query.uname;
  // var stateU=true
  // ////console.log(u);
  var sql = "select stateU from qz_u_all where uname = ?";
  //4:执行sql
  pool.query(sql,[u],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      // //console.log(result[0].stateU);
      //console.log(result);
      if(result.length==0){
        //console.log("没查到")
      }else if(result[0].stateU==1){
        res.send({code:199});
        return;
      }else if(result[0].stateU==0){
        res.send({code:110});
        return;
      }
  })
});

// 修改用户推出leave时的而状态
// updateLeave
// ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
server.post("/updateLeave",(req,res)=>{
  //2:获取二个参数 uname upwd
  var uname = req.body.uname;
  // ////console.log(uname);
  var sql = "update qz_u_all set stateU = false where uname = ?";
  //4:执行sql
  pool.query(sql,[uname],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
    //console.log(result);
      if(result.affectedRows>0){
        res.send({code:1});
      }else{
        res.send({code:-1})
      }
  })
});

//检查用户好友的好友状态
// hyState
server.get("/hyState",(req,res)=>{
  //2:获取二个参数 uname upwd
  // ////console.log(id);
  //3:创建sql
  var id=req.query.id;
  // var sql = "SELECT id FROM xz_login";
  var sql = "SELECT stateU FROM qz_u_all where id = ?";
  //4:执行sql
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      if(result.length>=1){
        // //console.log(result);
        res.send({code:1,data:result})
      }else{

      }
  })
});

// 我的个人空间发表的言论
// selectMyhome
server.get("/selectMyhome",(req,res)=>{
  var id=req.query.uid;
  // var sql = "SELECT id FROM xz_login";
  var sql = "SELECT sayto,saytoTime FROM qz_sayThing WHERE id = ? order by saytoTime desc";
  //4:执行sql
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      if(result.length>=1){
        res.send({code:1,data:result})
      }else{
        res.send({code:-1})
      }
  })
});


//功能一:用户登录
//1:用户get 请求路径/login
server.post("/login",(req,res)=>{
  //2:获取二个参数 uname upwd
  var u = req.body.u;
  var p = req.body.p;
  // ////console.log(u+":"+p);
  //3:创建sql
  // var sql = "SELECT id FROM xz_login";
  var sql = "SELECT id,uname,avatar,email,count,stateU,ctime FROM qz_u_all";
  sql+=" WHERE uname = ? AND upwd = md5(?)";
  //4:执行sql
  pool.query(sql,[u,p],(err,result)=>{
      if(err)throw err;
      //5:获取数据库返回结果
      //6:返回客户数据
      if(result.length==0){
        res.send({code:-1,msg:"用户名或密码有误"});
      }else{
        // var uname=result[0].uanme; 
        // ////console.log(req.session.uid);
        // ////console.log(result);
        res.send({code:1,msg:"登录成功",data:result});
      }
  })
});

// 修改密码
server.get("/back",(req,res)=>{
  //2:获取二个参数 uname upwd
  var u = req.query.uname;
  var email = req.query.email;
  var p = req.query.upwd;
  // ////console.log(u+":"+p+":"+email);
  //3:创建sql
            var sql = "SELECT id FROM qz_u_all WHERE uname = ? AND email = ?";
            //4:执行sql
            pool.query(sql,[u,email],(err,result)=>{
                if(err)throw err;
                // ////console.log(result[0].id);
                //6:返回客户数据
                if(result.length==0){
                  res.send({code:-1,msg:"邮箱有误"});
                }else{
                  var uid=result[0].id;
                  var p = req.query.upwd;
                  // ////console.log(p);
                  var sql1="UPDATE qz_u_all SET upwd = md5(?),stateU = false WHERE id = ?"
                  pool.query(sql1,[p,uid],(err,result1)=>{
                    if(err) throw err;
                    res.send({code:1,msg:"修改成功",data:result1})
                    // ////console.log(result1);
                  })
                }
            })
});

// 判断用户
server.get("/pDuan",(req,res)=>{
  var uname = req.query.uname;
  var sql="SELECT id FROM qz_u_all WHERE uname=?";
  pool.query(sql,[uname],(err,result)=>{
  if(err) throw err;
  // ////console.log(result.length);
  if(result.length==0){
    res.send({code:3});
  }
})
})


// 注册
// 功能：用户注册
//用户get请求请求路径login
server.post("/reg",(req,res)=>{
  // 获取二个参数uname upwd
  // u,p,email,gender,avatar
      var u=req.body.u;
      var p=req.body.p;
      var email=req.body.email;
      var avatar=req.body.avatar;
      var gender=req.body.gender;
      var stateU=false;
      var count=0;
      var ctime="";
  // 创建sql
      // var sql="INSERT INTO qz_u_all VALUES(null,u=?,p=md5(?),email=?,avatar=?,gender=?)";
      var sql1="INSERT INTO qz_u_all VALUES(null,?,md5(?),?,?,?,now(),?,?)";
  // 执行sql

      pool.query(sql1,[u,p,email,gender,avatar,ctime,stateU,count],(err,result)=>{
          if(err) throw err;
          // 判断返回客户端的数据
          // 获取数据库返回结果
          // 返回客户数据
          if(result.affectedRows>0){
              res.send({code:200,msg:"注册成功"});
          }
      })
  })  

// 注释：验证用户名是否被注册
  server.get("/regU",(req,res)=>{
    // 获取二个参数uname upwd
        var u=req.query.uname;
    // 创建sql
        // var sql="INSERT INTO qz_u_all VALUES(null,u=?,p=md5(?),email=?,avatar=?,gender=?)";
        var sql1="SELECT * FROM qz_u_all WHERE uname = ?";
    // 执行sql
  
        pool.query(sql1,[u],(err,result)=>{
            if(err) throw err;
            if(result.length>0){
                res.send({code:401,msg:"已被注册"});
                return;
            }else{
              res.send({code:25,msg:"可以注册"});

            }
        })
    })  
  
//验证邮箱是否被注册
    server.get("/regE",(req,res)=>{
      // 获取二个参数uname upwd
          var email=req.query.email;
      // 创建sql
          // var sql="INSERT INTO qz_u_all VALUES(null,u=?,p=md5(?),email=?,avatar=?,gender=?)";
          var sql1="SELECT * FROM qz_u_all WHERE email = ?";
      // 执行sql
    
          pool.query(sql1,[email],(err,result)=>{
              if(err) throw err;
              if(result.length>0){
                  res.send({code:16,msg:"已被注册"});
                  return;
              }else{
                res.send({code:25,msg:"可以注册"});
                
              }
          })
      })  


// 用户查询收听数据
server.get("/searchLogin",(req,res)=>{
  //2:获取二个参数 uname upwd
  var id = req.query.id;
  ////console.log(id);
  //3:创建sql
  var sql = "SELECT uname FROM qz_u_all WHERE id=?";
  //4:执行sql
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      ////console.log(result[0].uname);
      //5:获取数据库返回结果
      //6:返回客户数据
      if(result.length>=1){
         res.send({code:1,data:result});
        return;
      }else{
        // res.send({code:-1,msg:"不存在的用户"})
        //  return;
      }
  })
});
// 添加好友信息
// 用户查询收听数据
server.get("/insertUname",(req,res)=>{
  //2:获取 参数
  var id=req.query.id;
  var uname=req.query.uname;
  var friendid = req.query.friendid;
  var friendname = req.query.frienduname;
  // ////console.log(friendname,friendid,uname,id);
  //3:创建sql
  var sql = "INSERT INTO qz_speak VALUES(null,?,?,?,?),(null,?,?,?,?);";
  //4:执行sql
  pool.query(sql,[id,uname,friendid,friendname,friendid,friendname,id,uname],(err,result)=>{
      if(err)throw err;
      ////console.log(result);
      res.send({code:1,msg:"添加成功"})
  })
});

// 查询好友信息
// 用户查询收听数据
server.get("/selectUid",(req,res)=>{
  //2:获取 参数
  var id=req.query.id;
  var friendid = req.query.friendid;
  var uname = req.query.uname;
  // or uname like concat('%',?,'%')
  ////console.log(friendid);
      var sql = "select uname from qz_u_all where id = ?";
      //4:执行sql
      pool.query(sql,[friendid,uname],(err,result)=>{
          if(err)throw err;
          ////console.log(result);
            if(result.length>=1){
              var sql1="select frienduname from qz_speak where friendid = ? and id = ?";
              pool.query(sql1,[friendid,id,uname],(err,result1)=>{
                if(err) throw err;
                if(result1.length==0){
                  res.send({code:1,data:result})
                  ////console.log(result)
                  return;
                }
                else{
                  res.send({code:2})
                  return;
                }
              })
              return;
            }else if(result.length==0){
              res.send({code:-1});
              return;
            }
      })
});

// 修改

// 查询好友栏
server.get("/selectUname",(req,res)=>{
  //2:获取 参数
  var id=req.query.id;
  ////console.log(id);
  //3:创建sql
  var sql = "select frienduname,friendid from qz_speak where id = ?";
  //4:执行sql
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      ////console.log(result);
      if(result.length>=1){
        res.send({code:1,result})
        return;
      }else{
        res.send({code:-1});
        return;
      } 
  })
});


// 用户聊天展示
server.get("/speakBoth",(req,res)=>{
  var id=req.query.id;
  var uname=req.query.uname;
  var friendid = req.query.friendid;
  var friendname = req.query.frienduname;
  var say = req.query.say;
  var sayTime="";
  ////console.log(friendname,friendid,uname,id,say);
  var sql = "INSERT INTO qz_speak_s VALUES(null,?,?,?,?,?,now())";
  //4:执行sql
  pool.query(sql,[friendname,friendid,uname,id,say,sayTime],(err,result)=>{
      if(err)throw err;
      res.send({code:1,msg:"添加成功"})
  })
})

// 用户聊天信息
server.get("/speakShow",(req,res)=>{
        // var id=req.query.id;
  var uname=req.query.uname;
  var pageSize =parseInt(req.query.pageSize);
  // var friendid = req.query.friendid;
  var frienduname = req.query.frienduname;
  ////console.log(frienduname,uname);
  // var sql = "select say,sayTime from qz_speak_s where id = ? and frienduname = ? and uname = ?";
  var sql = "select id from qz_speak_s where frienduname = ? and uname = ? or frienduname = ? and uname = ? order by sayTime desc";
  // limit 0,5
  //4:执行sql
  pool.query(sql,[frienduname,uname,uname,frienduname],(err,result)=>{
      if(err) throw err;
      ////console.log(pageSize)
      ////console.log(result.length);
      if(result.length>=pageSize){
        ////console.log(pageSize);
        var sql1 = "select id,friendid,say,sayTime from qz_speak_s where frienduname = ? and uname = ? or frienduname = ? and uname = ? order by sayTime desc limit 0,?";
        pool.query(sql1,[frienduname,uname,uname,frienduname,pageSize],(err,result1)=>{
          if(err) throw err;
          res.send({code:1,data:result1})
        }
        )
      }else if(result.length<pageSize){
        if(result.length<=5 && result.length>=0){
          var sql2 = "select id,friendid,say,sayTime from qz_speak_s where frienduname = ? and uname = ? or frienduname = ? and uname = ? order by sayTime desc";
          pool.query(sql2,[frienduname,uname,uname,frienduname,pageSize],(err,result2)=>{
            if(err) throw err;
            res.send({code:1,data:result2})
          })
        }else if(result.length>5 && result.length<=pageSize){
          var sql3 = "select id,friendid,say,sayTime from qz_speak_s where frienduname = ? and uname = ? or frienduname = ? and uname = ? order by sayTime desc";
          pool.query(sql3,[frienduname,uname,uname,frienduname,pageSize],(err,result3)=>{
            if(err) throw err;
            res.send({code:1,data:result3})
          })
        }else{
          res.send({code:-1,msg:"到顶了"});
          return;
        }   
      }
  })
})

// 发表朋友圈
// qz_sayThing
server.post("/sayThings",(req,res)=>{
  var id=req.body.id;
  var uname=req.body.uname;
  var sayto=req.body.sayto;
  var sql="INSERT INTO qz_sayThing VALUES(null,?,?,?,now())";
  pool.query(sql,[id,uname,sayto],(err,result)=>{
    if(err) throw err;
    if(result.affectedRows>0){
      res.send({code:1});
    }
  })
})

// 查询友圈
// qz_sayThing
server.get("/selectThings",(req,res)=>{
  // var uname=req.query.uname;
  // var id=req.query.id;
  // 全部渲染到朋友圈，不区分好友
  // 将数据库全部添加
  var sql="SELECT id,uname,sayto,saytoTime FROM qz_sayThing order by saytoTime desc";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    // 查询获取的朋友圈信息
    ////console.log(result);
    if(result.length>=0){
      res.send({code:1,data:result,length:result})
    }else{
      res.send({code:-1})
    }
  })
})
server.get("/selectThingss",(req,res)=>{
  // var uname=req.query.uname;
  // var id=req.query.id;
  // var pageSize=parseInt(req.query.pageSize);
  // 全部渲染到朋友圈，不区分好友
  // 将数据库全部添加
  var sql="SELECT id,uname,sayto,saytoTime,sayid FROM qz_sayThing order by saytoTime desc";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    // 查询获取的朋友圈信息
    ////console.log(result.length);
    if(result.length>=0){
          pageSize=result.length;
         res.send({code:1,data:result,length:result.length})
      }else{
      res.send({code:-1})
    }
  })
})

// 查询个人发言的消息
server.get("/selectThingsMine",(req,res)=>{
  // var uname=req.query.uname;
  var id=req.query.id;
  // 全部渲染到朋友圈，不区分好友
  // 将数据库全部添加
  var sql="SELECT id,uname,sayto FROM qz_sayThing WHERE id = ?";
  pool.query(sql,(err,result)=>{
    if(err) throw err;
    // 查询获取的朋友圈信息
    ////console.log(result);
    if(result.length>=0){
      res.send({code:1,data:result})
    }else{
      res.send({code:-1})
    }
  })
})

//好友点赞
// inserToqzuall
server.post("/inserToqzuall",(req,res)=>{
  var uname=req.body.uname;
  var id=req.query.id;
  var count=req.query.countU;
  // 全部渲染到朋友圈，不区分好友
  // 将数据库全部添加
  var sql="update qz_u_all set count=? where id=?";
  pool.query(sql,[count,id],(err,result)=>{
    if(err) throw err;
    // 查询获取的朋友圈信息
    ////console.log(result);
    if(result.length>=0){
      res.send({code:1,data:result})
    }else{
      res.send({code:-1})
    }
  })
})

// 注释>壁纸更新
server.get("/getPhoto",(req,res)=>{
  var photo=[
    {photoid:1,img:"http://127.0.0.1:3000/bg01.jpg",title:"雪地"},
    {photoid:2,img:"http://127.0.0.1:3000/bg02.jpg",title:"枫叶"},
    {photoid:3,img:"http://127.0.0.1:3000/bg03.jpg",title:"曦夜"},
    {photoid:4,img:"http://127.0.0.1:3000/bg04.jpg",title:"墙壁"},
    {photoid:5,img:"http://127.0.0.1:3000/bg05.jpg",title:"水漾"},
    {photoid:6,img:"http://127.0.0.1:3000/bg06.jpg",title:"紫色的夜"},
    {photoid:7,img:"http://127.0.0.1:3000/bg07.jpg",title:"海岸"},
    {photoid:8,img:"http://127.0.0.1:3000/bg08.jpg",title:"小城"},
    {photoid:9,img:"http://127.0.0.1:3000/bg09.jpg",title:"眺望"},
    {photoid:10,img:"http://127.0.0.1:3000/bg10.jpg",title:"三色"},
    {photoid:11,img:"http://127.0.0.1:3000/bg11.jpg",title:"柯兰"},
    {photoid:12,img:"http://127.0.0.1:3000/bg12.jpg",title:"抽象"},
    {photoid:13,img:"http://127.0.0.1:3000/bg13.jpg",title:"冰山"},
    {photoid:14,img:"http://127.0.0.1:3000/bg14.jpg",title:"深渊"},
    {photoid:15,img:"http://127.0.0.1:3000/bg15.jpg",title:"星空"},
    {photoid:16,img:"http://127.0.0.1:3000/bg16.jpg",title:"玺"},
    {photoid:17,img:"http://127.0.0.1:3000/bg17.jpg",title:"抽象"},
  ];
  res.send({code:1,data:photo})
})

server.get("/imglist",(req,res)=>{
  var rows = [
    {id:1,img_url:"http://127.0.0.1:3000/bg12.jpg"},
    {id:2,img_url:"http://127.0.0.1:3000/bg13.jpg"},
    {id:3,img_url:"http://127.0.0.1:3000/bg06.jpg"},
    {id:4,img_url:"http://127.0.0.1:3000/bg05.jpg"},
  ];
  res.send({code:1,data:rows});
});
//功能四:首页九宫格
server.get("/grid",(req,res)=>{
  var rows = [
    // {id:1,title:"Reflection",img_url:"http://127.0.0.1:3000/img/grid/menu1.png"},
    {id:2,title:"Time",img_url:"http://127.0.0.1:3000/img/grid/menu2.png"},
    {id:3,title:"Chat",img_url:"http://127.0.0.1:3000/img/grid/menu3.png"},
    {id:4,title:"Tool",img_url:"http://127.0.0.1:3000/img/grid/menu4.png"},
    {id:5,title:"Diary",img_url:"http://127.0.0.1:3000/img/grid/menu5.png"},
    {id:6,title:"Make friends+",img_url:"http://127.0.0.1:3000/img/grid/menu6.png"},            
  ];
  res.send(rows);
});

// 16上传图
const multer=require("multer");
const fs=require("fs");
var upload=multer({dest:"public/upload/"})
  // 接收post请求multer
server.post("/uploadFile",upload.single("mypic"),(req,res)=>{
    // 时间
      var time=new Date().getTime();
      var rr=Math.floor(Math.random()*9999);
      var src=req.file.originalname;
      var i3=src.lastIndexOf(".");
      var suff=src.substring(i3);
      var newFile=__dirname+"/public/upload/"+time+rr+suff;

      fs.renameSync(req.file.path,newFile);
      res.send({code:1,msg:"上传成功"});
})


// 关于
// selectAbout
server.get("/selectAbout",(req,res)=>{
    var sql="SELECT header,body,foot from qz_about";
    pool.query(sql,(err,result)=>{
      if(err) throw err;
      //console.log(result);
      if(result.length>0){
        res.send({code:1,data:result})
      }
    })
})