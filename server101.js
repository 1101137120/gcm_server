// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config101'); // get our config file
var bcrypt = require('bcrypt-nodejs');
var request = require('request');
var nodemailer = require('nodemailer');
var cors = require('cors');
var schedule = require('node-schedule');
var crypto = require('crypto');
var multer = require('multer');
var FB = require('fb');
var cookieParser = require('cookie-parser');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './img/User')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+".png")
    }
});
var upload = multer({storage: storage});
var corsOption = {
  "origin": "http://www.ihoin.com",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  "credentials":true
};
app.use(cookieParser());
app.use(cors(corsOption));

////test socket.io
var app2 = require('express')();
var server2 = require('http').Server(app);
var io = require('socket.io')(server2);

server2.listen(3006);

var rule = new schedule.RecurrenceRule();  
//rule.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
//rule.second = [1,2,3,4,5,6,7,8,10,15, 20, 25, 30, 35, 40, 45, 50, 55, 59];
var times = [];

for(var i=1; i<60; i++){
　　　　times.push(i);
　　}
rule.second = times;


io.on('connection', function (socket) {

    console.log('socket.id = ');
    console.log(socket.id);
    socket.emit('onEvent1', { hello: 'world' });

    socket.on('TestEcho', function (data) {
        console.log(data);
        socket.emit('onTestEcho',{'data':data});
    });

    socket.on('OpenRoom', function (data) {
        console.log(data.roomID);
        socket.emit('onOpenRoom',{'roomID':data.roomID});
    });

    //socket.on('');
    //join room 
    socket.on('join', function (data) {

        // var counter = 1;
        // schedule.scheduleJob(rule, function(){  
            
        //     console.log('Join scheduleJob...counter = '+counter);
        //     counter++;
        //     io.to(data.roomID).emit('onWhosHere','whosHere...server say');
        // });

        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    ///process join room
                    user = data.username;   
                    socket.join(data.roomID);    // 加入房间
                    io.to(data.roomID).emit('sys', user + '加入了房间'+socket.id);  
                    console.log(user + '加入了' + data.roomID);
                    console.log('socket.room ============ ');
                    console.log(socket.rooms);
                    var roomss = Object.keys(socket.rooms);
                    console.log(roomss); // [ <socket.id>, 'room 237' ]
                    var clientss = io.nsps['/'].adapter.rooms[data.roomID];
                    console.log('********************************');
                    console.log(clientss);
                    console.log('length = ');
                    console.log(clientss.length);
                    console.log(Object.keys(clientss).length);
                    //process user count
                    //var counter = 1;
                    // schedule.scheduleJob(rule, function(){  
                        
                    //     console.log('Join scheduleJob...counter = '+counter);
                    //     counter++;
                    //     io.to(data.roomID).emit('onWhosHere','whosHere...server say');
                    //     console.log(socket.rooms);
                    // });

                    //var myData = io.sockets.clients(123);
                    //console.log(myData);
                    //next();
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
        ///process join room
        // user = data.username;   
        // socket.join(data.roomID);    // 加入房间
        // io.to(data.roomID).emit('sys', user + '加入了房间');  
        // console.log(user + '加入了' + data.roomID);
    });

    socket.on('StartSport',function(data){
        console.log('StartSport...');
        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        console.log('data.roomID = '+data.roomID);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    io.to(data.roomID).emit('onStartSport', {'event':'StartSport'});  
                    //console.log('room.......clients ='+io.rooms[data.roomID].length);

                    //var myData = io.sockets.clients(123);
                    //console.log(myData);
                    //next();
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
    });

    socket.on('STDuring',function(data){
        console.log('STDuring...');
        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        console.log('data.roomID = '+data.roomID);
        console.log('data.speed ='+data.speed);
        console.log('data.hr ='+data.hr);
        console.log('data.dist ='+data.dist);
        console.log('data.time ='+data.time);
        console.log('data.r ='+data.r);
        console.log('data.spm='+data.spm);
        console.log('data.cal='+data.cal);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    io.to(data.roomID).emit('onSTDuring', {'event':'STDuring','username':data.username,'dist':data.dist,'speed':data.speed,'hr':data.hr,'r':data.r, 'time':data.time, 'spm':data.spm, 'cal':data.cal});  
                    // console.log(user + '加入了' + data.roomID);
                    
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
    });

    socket.on('DuringCount',function(data){
        console.log('DuringCount...');
        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        console.log('data.roomID = '+data.roomID);
        //console.log('data.count = '+data.count);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    var clientss = io.nsps['/'].adapter.rooms[data.roomID];
                    console.log('********************************');
                    console.log(clientss);
                    console.log('length = ');
                    console.log(clientss.length);

                    io.to(data.roomID).emit('onDuringCount', {'event':'DuringCount','count':clientss.length,'detail':clientss});  
                    // console.log(user + '加入了' + data.roomID);
                    
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });

    });

    socket.on('EndSport',function(data){
        console.log('EndSport...');
        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        console.log('data.roomID = '+data.roomID);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data...EndSport');
                    io.to(data.roomID).emit('onEndSport', {'event':'EndSport'});  
                    // console.log(user + '加入了' + data.roomID);
                    
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
    });

    socket.on('LeaveDisconnect',function(data){
        console.log('LeaveDisconnect...');
        socket.disconnect();
    });

    socket.on('disconnecting',function(data){
        console.log('disconnecting................');
        console.log(data);
        console.log(socket.rooms);
    });

    socket.on('disconnect',function(data){
        console.log('socket disconnect!!!!!!!!!!!!!!!!!!!'+socket.room);
        io.emit('sys','user disconnect...socketID = '+socket.id+'room = '+socket.room);
    });

    socket.on('WhosHere',function(data){
        console.log('WhosHere...'+socket.id+'user = '+data.username);
        io.to(data.roomID).emit('sys','whosHere...'+data.username+'id = '+socket.id);
    });

    socket.on('PrivateCall',function(data){
        console.log('PrivateCall...');
        console.log('data.token = '+data.token);
        console.log('data.username = '+data.username);
        console.log('data.roomID = '+data.roomID);
        console.log('data.socketID ='+data.socketID);
        console.log('data.pmsg ='+data.pmsg);
        var token = data.token;
        var username = data.username;
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    //io.to(data.roomID).emit('onSTDuring', {'event':'STDuring','username':data.username,'dist':data.dist,'speed':data.speed,'hr':data.hr,'r':data.r,'time':data.time});  
                    // console.log(user + '加入了' + data.roomID);
                    socket.broadcast.to(data.socketID).emit('onPrivateCall', data.pmsg);
                    
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
    });

  socket.on('CheckToken', function(data){
    console.log('data.token = '+data.token);
    console.log('data.username = '+data.username);
    var token = data.token;
    var username = data.username;
    ////vertify token
    // verifies secret and checks exp
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
                //return res.json({ success: false, message: 'Failed to authenticate token.', error:err.message }); 
                console.log("check token error: "+err); 
                socket.emit('onCheckToken',{'event':'false'});
                socket.disconnect();
            } else {
                // if everything is good, save to request for use in other routes
                mydecodeda = decoded;   
                var myDecoded = JSON.stringify(mydecodeda);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
                console.log('myjson = '+myjson.data);
                if(myjson.data === username){
                    console.log('checkToken...username = token data');
                    socket.emit('onCheckToken',{'event':'success'});
                    //next();
                }
                else{
                    console.log('checkToken...username != token data');
                    socket.emit('onCheckToken',{'event':'false'});
                    socket.disconnect();
                    //return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });

                }
                //next();
            }
        });
    ////vertify token
  });

});
////

//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ihoin.test@gmail.com',
        pass: 'ihointest2017'
    }
});

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 9005; // used to create, sign, and verify tokens
//mongoose.connect(config.database); // connect to database
app.set('MySuperSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
/*app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());*/
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use("/Img",express.static(  __dirname + "/productImg/"));
app.use("/Member/Img",express.static(  __dirname + "/img/User/"));
// =======================
// routes ================
// =======================
// basic route
// app.get('/', function(req, res) {
//     //res.send('Hello! The API is at http://localhost:' + port + '/api');
//     res.json({'The API is at http://localhost':port});
// });
// app.post('/testPost',function(req,res){
//     console.log('...testPost, post username = '+req.body.username);
//     res.end({'get username':req.body.username});
// });

/*app.all('*', function(req, res, next) {
     res.header("Access-Control-Allow-Origin", req.headers.origin); //需要顯示設定來源
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");    
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     res.header("Access-Control-Allow-Credentials",true); //帶cookies7     res.header("Content-Type", "application/json;charset=utf-8");    next();
 });*/
//uload user img

app.post('/uploadImg', upload.any(), (req, res) => {
  let fileName = 'Not uploaded';
  console.log('req.files => '+req.files);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
  if (req.files) {
    fileName = req.files[0].filename;
    conn.connect();
    conn.query("update userData set uImagePhoto=? where userName=?", [fileName,req.body.username], function (err, rows){
        if(err){
            console.log("uploadImg... select users error="+err);
            res.json({'method':'uploadImg','data':{'event':'uploadImgError', 'error':err}, 'result':'false'});
			conn.end();
			return;
		}
        else{
			res.json({'method':'upload','data':{'event':'Image Uploaded Successfully !','detail':fileName}, 'result':'true'});
			
        }
		
		conn.end();
	});
  } else {
    res.status(200).send({
      message: 'Image for uploading not found.'
    });
  }

});


//ADDTrainPartners

app.post('/ADDTrainPartners', upload.any(), (req, res) => {
  let fileName = 'Not uploaded';
  console.log('req.files => '+req.files);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
	
	conn.query("select * from  userData where  uRankingID=?", [req.body.uRankID], function (err, rows){
        if(err){
            console.log("uploadImg... select users error="+err);
            res.json({'method':'ADDTrainPartners','data':{'event':'SelectError', 'error':err}, 'result':'false'});
			conn.end();
			return;
		}
        else{
			if(rows.length)
			{
		conn.query("insert into friendDetail (userID, friendID, license) values (?,?,?)", [req.body.uClientID,rows[0].uClientID,0], function (err, rows){
        if(err){
            console.log("uploadImg... select users error="+err);
            res.json({'method':'ADDTrainPartners','data':{'event':'InsertError', 'error':err}, 'result':'false'});
			conn.end();
			return;
		}
        else{
			res.json({'method':'upload','data':{'event':'Image Uploaded Successfully !','detail':fileName}, 'result':'true'});
			
        }
		
		conn.end();
	});
			}
			else
			{
				res.json({'method':'ADDTrainPartners','data':{'event':'ADDTrainPartners','detail':'This RankID  is null !'}, 'result':'true'});
				conn.end();
			}
        }
	});



});


///forgot password
app.post('/reSendAccSetting',function(req, res){
    console.log('reSendAccSetting');
    console.log('username = '+req.body.username);

    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from userData where userName = ? ", [req.body.username], function (err, rows){
        if(err){
            console.log("reSendAccSetting... select users error="+err);
            res.json({'method':'reSendAccSetting','data':{'event':'reSendAccSettingError', 'error':err}, 'result':'false'});
			conn.end();
			return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('reSendAccSetting... the userName found, send email for password setting');
            //res.json({'method':'signup','data':{'event':'userName already used'}, 'result':'false'});
            doSendEmailPSVertification();
            ///do sent date to client here///

        }
        else{
            console.log("reSendAccSetting...not in users");
            //doSendEmailVertification();
			
        }
		
		conn.end();
    });

    var doSendEmailPSVertification = function(){
        console.log('doSendEmailVertification...');
        var token3 = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 mon
        console.log('token3 = '+ token3);
        var myEmailTestOptions3={
                //寄件者
            from: 'account1@gmail.com',
            //收件者
            to: req.body.username, 
            //副本
            // cc: 'account3@gmail.com',
            //密件副本
            // bcc: 'account4@gmail.com',
            //主旨
            subject: 'Registered Sports Management Center - Forgot Password', // Subject line
            //純文字
            text: 'Please click on the link ', // plaintext body
            //嵌入 html 的內文 //35.167.221.25  192.168.43.114 192.168.152.175
            html: 'The <a href="http://www.ihoin.com/sports/app/resetPW.html?token='+token3+'&username='+req.body.username+'">Please click on the modification link</a>'
        };
        //'<form action="http://192.168.43.114:8080/pcReset" method="post">Reset Password: <input type="text" name="password"><br><input type="hidden" name="token" value="'+token3+'" ><input type="hidden" name="username" value="'+req.body.username+'" ><input type="submit" value="Submit"></form>'
        //發送信件方法   //'The <a href="http://35.167.221.25:8080/pcReset/'+token3+'/'+req.body.username+'/'+req.body.password+'">修改連結</a>'
        transporter.sendMail(myEmailTestOptions3, function(error, info){
            if(error){
                console.log(error);
                res.json({'method':'email send fail','error':error,'result':'false'});
            }else{
                console.log('訊息發送: ' + info.response);
                res.json({'method':'email send','result':'success'});
            }
        });

    };


});

///forgot password

///forget password url
app.post('/pcReset', function(req, res){
    console.log('pcReset...token = '+req.body.token+' user = '+req.body.username+' password = '+req.body.password);
	
	var content = req.body.password;
   var md5 = crypto.createHash('md5');
	md5.update(content);
	var passwordmd5 = md5.digest('hex');
    jwt.verify(req.body.token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
               // return res.json({ success: false, message: 'Failed to authenticate token.', error:err });  
			   
               res.redirect('http://www.ihoin.com/sports/app/fail.html?event=tokenFail');      
            } 
            else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                //res.json({result:'註冊成功'});
                //start 寫入資料庫
                doStartMysql2();

                
            }
			conn.end();
    });

    var doStartMysql2 = function(){
        console.log('doStartMysql...');
        var mysql = require('mysql');
                var conn = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',  //local : admin; AWS: root
                    password: 'ej03xu35k3',//ej03xu35k3
                    database: 'testDB2',
                    port: 3306
                    //connectionLimit : 1500
                    });
                conn.connect();

                conn.query("select * from userData where userName=?", [req.body.username], function (err, rows){
                    if(err){
                        console.log("forget password... select users error="+err);
                        //res.json({'method':'vertification','data':{'event':'vertificationError', 'error':err}, 'result':'false'});
                        res.redirect('http://www.ihoin.com/sports/app/fail.html?event=vertificationError');
						conn.end();
						return;
                    }

                    if(rows.length){
                        //////
                        console.log('forget password ... the userName already had...start update');
                        conn.query("update userData set userPassword=? where userName=?",[passwordmd5, req.body.username], function (err, rows){
                            if(err){
                                console.log("userData  error="+err); 
                                //res.json({'method':'signup', 'data':{'event':'sign up fail','error':err}, 'result':'false'});
                                res.redirect('http://www.ihoin.com/sports/app/fail.html?event=insertError');
								
                            }
                            else{ 
                                //res.json({'method':'signup','data':{'event':'signup success'}, 'result':'true'});
                                res.redirect('http://www.ihoin.com/sports/app/done.html');
                            }
                        });



                        
                    }
                    else{
                        console.log("vertification...not in users...could create new");
                        //res.json({'method':'vertification','data':{'event':'vertification fail','error':'username already have'}, 'result':'false'});
                        res.redirect('http://www.ihoin.com/sports/app/fail.html?event=usernameDup');
                        
                    }
					
					conn.end();
                });

    };
        

});
///forget password url
app.get('/pcSettingForm/:token/:username', function(req, res){
    console.log('pcSettingForm');
    var token3 =req.params.token;
    var username =req.params.username;
    var html= '<html><meta name="viewport" content="width=device-width, initial-scale=1"><form action="http://35.167.221.25:8080/pcReset" method="post">Reset Password: <input type="text" name="password"><br><input type="hidden" name="token" value="'+token3+'" ><input type="hidden" name="username" value="'+username+'" ><input type="submit" value="Submit"></form></html>';
    res.setHeader('Content-Type','text/html');
    res.setHeader('Content-Length',Buffer.byteLength(html));
    res.end(html);
});


app.get('/api/user', (req, res) => {
    var re;
    /*if (req.session.name)
        re = { statu: 'ok', name: req.session.name };
    else*/
	//	https://www.facebook.com/v2.8/dialog/oauth?client_id=1700561416915068&redirect_uri=http://34.216.81.49:9005/api/code&scope=email%2Cuser_birthday%2Cuser_friends%2Cuser_location%2Cuser_gender%2Cuser_photos	
        re = { statu: 'not login', url: 'https://www.facebook.com/v2.8/dialog/oauth?client_id=1700561416915068'+ '&redirect_uri=http://34.216.81.49:9005'+ '/api/code&scope=email%2Cuser_birthday%2Cuser_friends%2Cuser_location%2Cuser_gender%2Cuser_photos' };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(re));
});

app.post('/api/loginFB', function(req, res) {
	console.log("code"+req.body.token);
FB.options({version: 'v2.8'});
var fooApp = FB.extend({appId: '1700561416915068', appSecret: '489fd3f8ac29090628d73b7a85b8b915'});
			 FB.setAccessToken(req.body.token);
			 FB.api('me?fields=id,name,birthday,location,gender,picture,email', 'get', { message: "ddddddd" }, function (respones) {
  if(!respones || respones.error) {
    console.log(!respones ? 'error occurred' : respones.error);
    return;
  }
  console.log(respones);
  /*console.log('Post Id: ' + res.id);
  console.log('Post Id: ' + res.name);
  console.log('Post: ' + res.gender);
  console.log('Post: ' + res.email);
  console.log('Post: ' + res.location.name);
  console.log('Post: ' + res.birthday);
  console.log('Post: ' + res.picture.data.url);*/
      var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
	conn.query("select * from userData where uEmail = ?  and userID = ?", [respones.email,respones.id], function (err, rows){
        if(err){
            console.log("signupTemp... select users error="+err);
            res.json({'method':'signup','data':{'event':'signupError', 'error':err}, 'result':'false'});
			conn.end();
			return;
        }
		
        if(rows.length){
            ///do sent date to client here///
          //  console.log('signup... the userName already used');
           /// res.json({'method':'signup','data':{'event':'userName already used'}, 'result':'false'});

            ///do sent date to client here///

                var token = jwt.sign({data: rows[0].userName+"&&"+rows[0].uClientID}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 hr
                res.json({'method':'login','data':{'event':'correct','token':token,'uClientID':+rows[0].uClientID,'userName': rows[0].userName}, 'result':'true'});
            }
            else{
				var gender=null;
				var email = null;
				var id = null;
				var name = null;
				var country = null;
				var city = null;
				var pictureurl = null;
				var birthday = null;
				for(var i=0;i<Object.keys(respones).length;i++)
				{
					if(Object.keys(respones)[i]=='id')
						id=respones.id;
					else if(Object.keys(respones)[i]=='name')
						name=respones.name;
					else if(Object.keys(respones)[i]=='email')
						email=respones.email;
					else if(Object.keys(respones)[i]=='picture')
						pictureurl = respones.picture.data.url;
					else if(Object.keys(respones)[i]=='gender'){
						if(respones.gender=="male")
							gender = 'M';
						else if(respones.gender=="female")
							gender = 'F';						
					}
					else if(Object.keys(respones)[i]=='location'){
						country = respones.location.name.split(',')[1];
						city = respones.location.name.split(',')[0];						
					}

					else if(Object.keys(respones)[i]=='birthday'){
						var date = respones.birthday.split('/');
						birthday = date[2]+"-"+date[1]+"-"+date[0];						
					}
				}
			conn.query("insert into userData  (userName,userID,uCountry,uCity,uSex,uRegisteredDate,uImagePhoto,uCName,uEmail,uRankingID,uProfileStatus,uLogBookStatus) values (?,?,?,?,?,?,?,?,?,ROUND((RAND()*50000067)+1),?,?)", [email,id,country,city,gender,new Date(),pictureurl,name,email,0,0], function (err, rows){
				if(err){
					console.log("signupTemp... select users error="+err);
					res.json({'method':'signup','data':{'event':'signupError', 'error':err}, 'result':'false'});
					conn.end();
					return;
				}
				else{
					var token = jwt.sign({data: email+"&&"+rows.insertId}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 hr
					res.json({'method':'login','data':{'event':'correct','token':token,'uClientID':+rows.insertId,'userName': email}, 'result':'true'});
					conn.end();
				}

					});

            }
	});

			 });
});


function getUser(key) {
    return new Promise((resolve, reject) => {
		console.log("getUser");
        request('https://graph.facebook.com/v2.8/me?fields=id,name,email,birthday,location,gender,picture&access_token=' + key, (error, response, body) => {
            resolve(JSON.parse(body));
        });
    });
}
//signup and resend email vertification
app.post('/signupTemp',function(req, res){
    console.log('signupTemp');
    console.log('username = '+req.body.username + 'password = '+ req.body.password);

    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from userData where userName = ? ", [req.body.username], function (err, rows){
        if(err){
            console.log("signupTemp... select users error="+err);
            res.json({'method':'signup','data':{'event':'signupError', 'error':err}, 'result':'false'});
			conn.end();
			return;
        }

        if(rows.length){
            ///do sent date to client here///
            console.log('signup... the userName already used');
            res.json({'method':'signup','data':{'event':'userName already used'}, 'result':'false'});

            ///do sent date to client here///
        }
        else{
            console.log("signup...not in users, create temp New User and send email vertification");
            doSendEmailVertification();

        }
		conn.end();
    });

    var doSendEmailVertification = function(){
        console.log('doSendEmailVertification...');
        var token2 = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 hr
        console.log('token2 = '+ token2);
        var myEmailTestOptions2={
                //寄件者
            from: 'account1@gmail.com',
            //收件者
            to: req.body.username, 
            //副本
            // cc: 'account3@gmail.com',
            //密件副本
            // bcc: 'account4@gmail.com',
            //主旨
            subject: 'Welcome to register for Sports Management Center', // Subject line
            //純文字
            text: 'Please click on the registration link '+token2, // plaintext body
            //嵌入 html 的內文 //35.167.221.25  192.168.43.114 192.168.152.175
            html: 'The <a href="http://34.216.81.49:9004/vertification/'+token2+'/'+req.body.username+'/'+req.body.password+'/'+req.body.uCName+'/'+req.body.uBirthD+'">Please click on the registration link</a>'
        };
        //發送信件方法
        transporter.sendMail(myEmailTestOptions2, function(error, info){
            if(error){
                console.log(error);
                res.json({'method':'email send fail','error':error,'result':'false'});
            }else{
                console.log('訊息發送: ' + info.response);
                res.json({'method':'email send','result':'success'});
            }
        });

    };


});

app.get('/vertification/:checkToken/:username/:password/:uCName/:uBirthD', function(req, res){
    console.log('vertification...token = '+req.params.checkToken+' user = '+req.params.username+' password = '+req.params.password);
   var content = req.params.password;
   var md5 = crypto.createHash('md5');
	md5.update(content);
	var passwordmd5 = md5.digest('hex');
   jwt.verify(req.params.checkToken, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
               // return res.json({ success: false, message: 'Failed to authenticate token.', error:err });  
               res.redirect('http://www.ihoin.com/sports/app/fail.html?event=tokenFail');      
            } 
            else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                //res.json({result:'註冊成功'});
                //start 寫入資料庫
                doStartMysql();

                
            }
    });

	

    var doStartMysql = function(){
        console.log('doStartMysql...');
        var mysql = require('mysql');
                var conn = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',  //local : admin; AWS: root
                    password: 'ej03xu35k3',//ej03xu35k3
                    database: 'testDB2',
                    port: 3306
                    //connectionLimit : 1500
                    });
                conn.connect();

                conn.query("select * from userData where userName = ? ", [req.params.username], function (err, rows){
                    if(err){
                        console.log("vertification... select users error="+err);
                        //res.json({'method':'vertification','data':{'event':'vertificationError', 'error':err}, 'result':'false'});
                        res.redirect('http://www.ihoin.com/sports/app/fail.html?event=vertificationError');
						conn.end();
						return;
                    }

                    if(rows.length){
                        //////
                        console.log('vertification... the userName already had');
                        //res.json({'method':'vertification','data':{'event':'vertification fail','error':'username already have'}, 'result':'false'});
                        res.redirect('http://www.ihoin.com/sports/app/fail.html?event=usernameDup');
                    }
                    else{
                        console.log("vertification...not in users...could create new");
                        conn.query("insert into userData ( userName, userPassword, uRegisteredDate, uCName, uBirthD,uRankID,uProfileStatus,uLogBookStatus) values (?,?,?,?,?,ROUND((RAND()*50000067)+1),?,?)",[req.params.username, passwordmd5, new Date(),req.params.uCName, req.params.uBirthD,0,0], function (err, rows){
                            if(err){
                                console.log("userData  error="+err); 
                                //res.json({'method':'signup', 'data':{'event':'sign up fail','error':err}, 'result':'false'});
                                res.redirect('http://www.ihoin.com/sports/app/fail.html?event=insertError');
                            }
                            else{ 
                                //res.json({'method':'signup','data':{'event':'signup success'}, 'result':'true'});
                                res.redirect('http://www.ihoin.com/sports/app/done.html');
                            }
                        });
                    }
					conn.end();
                });

    };
        

});

//test
app.get('/teset', function(req, res){
	var content = 'password';var md5 = crypto.createHash('md5');
md5.update(content);var d = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
console.log("d"+d);
    });


//login
app.post('/login2Server',function(req, res){
    console.log('login2Server...username = '+ req.body.username + 'password = '+ req.body.password);
	var content = req.body.password;
	var md5 = crypto.createHash('md5');
	md5.update(content);
	var passwordmd5 = md5.digest('hex');
	console.log("req.body.password="+req.body.password);
	console.log("passwordmd5 = "+passwordmd5);
	
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3	
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
	//select * from userData where userName = ? and userID IS NOT NULL   
    conn.query("select * from userData where userName = ?", [req.body.username], function (err, rows){
        if(err){
            console.log("login... select users error="+err);
            res.json({'method':'login','data':{'event':'loginError', 'error':err}, 'result':'false'});
            conn.end();
        }

        if(rows.length){
            ///do sent date to client here///
            console.log('login... the userName check, rows[0].userPassword = '+rows[0].userPassword);
            if(passwordmd5 ===rows[0].userPassword){
                console.log('password correct!...create token...');
					
                //////record ip

                conn.query("insert into userHist (username, headers, conreadd, socreadd, consocreadd, dateTime) values (?,?,?,?,?,?)",[req.body.username , req.headers['x-forwarded-for'], req.connection.remoteAddress, req.socket.remoteAddress, req.ip, new Date()], function (err, rows){
                        if(err){ 
                            console.log("Insert  userHist error"+ err);
                            conn.end();
                            //res.json({'mtehod':'sportsInfo_insert','data':{'event':'sporstInfo_insert error','error':err}, 'result':'false'});
                        }
                        else{ 
                            console.log("userhist..."+req.body.username + req.headers['x-forwarded-for']+ req.connection.remoteAddress+req.socket.remoteAddress+ req.ip);
                            conn.end();
                            //res.json({'mtehod':'sportsInfo_insert','data':{'event':'sportsInfo_insert success'}, 'result':'true'});
                        }
                });

                //////record ip

                var token = jwt.sign({data: req.body.username+"&&"+rows[0].uClientID}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 hr
                res.json({'method':'login','data':{'event':'correct','token':token,'uClientID':+rows[0].uClientID}, 'result':'true'});
            }
            else{
                res.json({'method':'login','data':{'event':'password fail'}, 'result':'false'});
                conn.end();
            }
            
        }
        else{
            console.log("login...not in users");
            res.json({'method':'login','data':{'event':'loginfail', 'error':'not in userData'}, 'result':'false'});
            conn.end();
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
    });
});


// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 
// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('MySuperSecret'), function(err, decoded) {            
            if (err) {
				res.redirect('http://www.ihoin.com/sportyeejeeDemo/app/');     
                return res.json({ success: false, message: 'Failed to authenticate token.', error:err.message });       
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                var myDecoded = JSON.stringify(req.decoded);
                var myJsonString = myDecoded.replace('\"', '"');
                var myjson = JSON.parse(myJsonString);
                console.log('myDecoded = '+myDecoded);
				
                console.log('myjson = '+myjson.data);
				var tokenData = myjson.data.split('&&');

				console.log('myjson = '+tokenData[0]+req.body.username+tokenData[1]+req.body.uClientID);
                if(tokenData[0] == req.body.username&&tokenData[1] == req.body.uClientID){
                    console.log('checkToken...username = token data');
                    next();
                }
                else{
                    console.log('checkToken...username != token data');
                    return res.json({ 'method': 'checkID', message: 'token not match username', 'result':'false' });
                }
					//next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
        
    }
    
});
// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
// apiRoutes.get('/', function(req, res) {
//  res.json({ message: 'Welcome to the coolest API on earth!' });
// });

// apiRoutes.post('/testToken', function(req, res) {
//  console.log("get token = "+ req.body.token);

// });


apiRoutes.post('/checkToken', function(req, res){
    console.log("apiRoites.../api/checkToken...token = "+req.body.token);
    console.log("req.decoded = "+req.decoded);
    console.log(req.decoded);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('myDecoded = '+myDecoded);
    console.log('myjson = '+myjson.data);
	var tokenData = myjson.data.split('&&');
    if(tokenData[0] === req.body.username&&tokenData[1] === req.body.uClientID){
        console.log('checkToken...username = token data');
    }
    else{
        console.log('checkToken...username != token data');
    }
    res.json({'method':'api.checkToken','result':'true','data':{'token':req.body.token,'decode':myjson.data}});

});

apiRoutes.get('/check', function(req, res) {
    res.json(req.decoded);
});
apiRoutes.post('/check', function(req, res) {
    res.json(req.decoded);
});





apiRoutes.post('/profileGet', function(req, res) {
    console.log('profileGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    conn.query("select * from userData where userName = ? ", [req.body.username], function (err, rows){
        if(err){
            console.log("profileGet... select users error="+err);
            res.json({'method':'profileGet','data':{'event':'profileGetError', 'error':err}, 'result':'false'});
            conn.end();
			return;
        }

        if(rows.length){
            ///do sent date to client here///
            console.log('profileGet... '+rows);
           
            res.json({'method':'profileGet','data':{'event':'profileGet','detail':rows}, 'result':'true'});
            conn.end();
            
        }
        else{
            console.log("profileGet...not in users");
            res.json({'method':'profileGet','data':{'event':'profileGetfail', 'error':'not in userData'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            conn.end();
        }
    });
});

//ranking profileget
apiRoutes.post('/rankProfileGet', function(req, res) {
    console.log('profileGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    conn.query("select * from userData where uRankingID = ? ", [req.body.uRankID], function (err, rows){
        if(err){
            console.log("profileGet... select users error="+err);
            res.json({'method':'profileGet','data':{'event':'profileGetError', 'error':err}, 'result':'false'});
            conn.end();
			return;
        }

        if(rows.length){
            ///do sent date to client here///
            console.log('profileGet... '+rows);
           
            res.json({'method':'profileGet','data':{'event':'profileGet','detail':rows}, 'result':'true'});
            conn.end();
            
        }
        else{
            console.log("profileGet...not in users");
            res.json({'method':'profileGet','data':{'event':'profileGetfail', 'error':'not in userData'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            conn.end();
        }
    });
});

apiRoutes.post('/profileSet', function(req, res) {
    console.log('profileSet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    var updateQuery = "update userData set userID = ?, uCountry=?, uCity=?, uAge=?, uSex=?, uHeight=?, uWeight=?, uRegisteredDate=?, uImagePhoto=?, uCheck=?, uCName=?, uBirthD=? where userName=?";
    var updateData = [req.body.userID, req.body.uCountry, req.body.uCity, req.body.uAge, req.body.uSex, req.body.uHeight, req.body.uWeight, req.body.uRegisteredDate, req.body.uImagePhoto, req.body.uCheck,req.body.uCName, req.body.uBirthD,req.body.username];
    conn.query(updateQuery, updateData, function (err, rows){
        if(err){
            console.log("profileSet... update users error="+err);
            res.json({'method':'profileSet','data':{'event':'profileSetError', 'error':err}, 'result':'false'});
            conn.end();
			return;
        }
        else{
            console.log("profileSet...success");
            res.json({'method':'profileSet','data':{'event':'profileSet success'}, 'result':'true'});
            conn.end();
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
    });
});

///sportInfo DB ////
apiRoutes.post('/sportInfo/:action/:uClientID', function(req, res) {
    console.log('sportInfo...');
    //var mySelect = req.params.selectWhere;
    console.log('action = '+req.params.action +' uClientID = '+req.params.uClientID);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into sportsInfo (uClientID, sDeviceID, dStartDate, dStartTime, DataName, dExerciseTime, dUnits, rtAppMessage, rtDataRate, rtDSRate) values (?,?,?,?,?,?,?,?,?,?)",[req.params.uClientID, req.body.sDeviceID, req.body.dStartDate, req.body.dStartTime, req.body.DataName, req.body.dExerciseTime, req.body.dUnits, req.body.rtAppMessage, req.body.rtDataRate, req.body.rtDSRate], function (err, rows){
                        if(err){ 
                            console.log("Insert New sportsInfo error"+ err);
                            res.json({'mtehod':'sportsInfo_insert','data':{'event':'sporstInfo_insert error','error':err}, 'result':'false'});
                            conn.end();
                        }
                        else{ 
                            
                            res.json({'mtehod':'sportsInfo_insert','data':{'event':'sportsInfo_insert success'}, 'result':'true'});
                            conn.end();
                        }
                    });

                }
                if(req.params.action == 'GET'){
                    console.log('GET here');
                    ////
                    conn.query("select * from sportsInfo where uClientID = ? ", [req.params.uClientID], function (err, rows){
                        if(err){
                            console.log("sportsInfo Get error="+err);
                            res.json({'method':'sportsInfo_Get','data':{'event':'sportInfo_Get error', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'sportInfo_Get','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'sportInfo_Get','data':{'event':'empty'}, 'result':'true'});
                            conn.end();

                        }
                    });
                    ////


                } 
});

///sportsInfo DB find SportsInfoID value
apiRoutes.post('/sportInfo/SportsInfoID', function(req, res) {
    console.log('sportInfo...check SportsInfoID');
    //var mySelect = req.params.selectWhere;
    console.log('dStartDate = '+req.body.dStartDate +' dStartTime = '+req.body.dStartTime);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
                
                    
                    
                    conn.query("select * from sportsInfo where uClientID=?  and dStartDate = ? and dStartTime =? ", [req.body.uClientID ,req.body.dStartDate, req.body.dStartTime], function (err, rows){
                        if(err){
                            console.log("sportsInfo Get error="+err);
                            res.json({'method':'sportsInfo_Get_SportsInfoID','data':{'event':'sportInfo_GetSportsInfoID error', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'sportInfo_Get_SportsInfoID','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'sportInfo_Get_SportsInfoID','data':{'event':'empty'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


                
});

///rtInfo DB
apiRoutes.post('/rtInfo/:action', function(req, res) {
    console.log('rtInfo...');
    //var mySelect = req.params.selectWhere;
    console.log('action = '+req.params.action );
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 150
        });
    conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP, rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp,rtPace) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.SportsInfoID, req.body.rtDate, req.body.rtTime, req.body.rtSpeed, req.body.rtRV, req.body.rtTime2, req.body.rtDistance, req.body.rtHR, req.body.rtRPM, req.body.rtEnergy, req.body.rtPower, req.body.rtFAT, req.body.iFTP, req.body.rtCHO,req.body.iVSpeed,req.body.iVRV,req.body.iVElevation,req.body.iVTime,req.body.iVMiles,req.body.iVH,req.body.iVC1,req.body.iVC2,req.body.iVRPM,req.body.iVEnergy,req.body.iVPower,req.body.iVDistance,req.body.iVTq,req.body.iVEf,req.body.iVWeight,req.body.iWheel,req.body.iFAT,req.body.iFTP2,req.body.iCHO,req.body.iSPM,req.body.iCaloriell,req.body.i1,req.body.i2,req.body.iMaxRPM,req.body.iMaxSpeed,req.body.iMinSpeed,req.body.iMaxRV,req.body.iMinRV,req.body.iMaxUp,req.body.iMinUp,req.body.rtPace], function (err, rows){
                    if(err){ 
                        console.log("RtInfo dEncoding insert error"+ err);
                        res.json({'mtehod':'rtInfo_insert','data':{'event':'RtInfo_Update error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfo_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
                });

                }
                //start massive data insert///
                if(req.params.action == 'MSPUT'){


                    //get json data, must know how many(dataNum) data in this action
                    var dataNum = req.body.dataNum;
                    console.log("dataNum=" + req.body.dataNum);
                    var jsonstring = JSON.stringify(req.body.dataCtx);
                    var obj = JSON.parse(jsonstring);

                    var obj5=JSON.parse(req.body.dataCtx);
                    var errorlog = 'none error';
                    
                    console.log('obj='+typeof(obj)+' req.body.dataCtx='+typeof(req.body.dataCtx)+' obj5='+typeof(obj5));
                    var insertSQL="";
					var rtInfoDataSQL="";
					var rtInfoDataArr=[];
					var insertSQLArr="";
					for (var key in obj5.contents) {
					console.log(key+"obj5.contents"+obj5.contents[key].SportsInfoID);
					rtInfoDataArr[key] = [ obj5.contents[key].SportsInfoID, obj5.contents[key].rtDate, obj5.contents[key].rtTime, obj5.contents[key].rtSpeed, obj5.contents[key].rtRV, obj5.contents[key].rtTime2, obj5.contents[key].rtDistance, obj5.contents[key].rtHR, obj5.contents[key].rtRPM, obj5.contents[key].rtEnergy, obj5.contents[key].rtPower, obj5.contents[key].rtFAT, obj5.contents[key].iFTP, obj5.contents[key].rtCHO, obj5.contents[key].iVSpeed, obj5.contents[key].iVRV,obj5.contents[key].iVElevation,obj5.contents[key].iVTime,obj5.contents[key].iVMiles,obj5.contents[key].iVH,obj5.contents[key].iVC1,obj5.contents[key].iVC2,obj5.contents[key].iVRPM,obj5.contents[key].iVEnergy,obj5.contents[key].iVPower,obj5.contents[key].iVDistance,obj5.contents[key].iVTq,obj5.contents[key].iVEf,obj5.contents[key].iVWeight,obj5.contents[key].iWheel,obj5.contents[key].iFAT,obj5.contents[key].iFTP2,obj5.contents[key].iCHO,obj5.contents[key].iSPM,obj5.contents[key].iCaloriell,obj5.contents[key].i1,obj5.contents[key].i2,obj5.contents[key].iMaxRPM,obj5.contents[key].iMaxSpeed,obj5.contents[key].iMinSpeed,obj5.contents[key].iMaxRV,obj5.contents[key].iMinRV,obj5.contents[key].iMaxUp,obj5.contents[key].iMinUp,obj5.contents[key].rtPace];
					/*	if(rtInfoDataSQL!="")
							rtInfoDataSQL=rtInfoDataSQL+",";
						if(!obj5.contents[key].rtTime)
							obj5.contents[key].rtTime = null;
						if(!obj5.contents[key].rtMask)
							obj5.contents[key].rtMask = null;
						if(!obj5.contents[key].rtSpeed)
							obj5.contents[key].rtSpeed = null;
						if(!obj5.contents[key].rtRV)
							obj5.contents[key].rtRV = null;
						if(!obj5.contents[key].rtTime2)
							obj5.contents[key].rtTime2 = null;
						if(!obj5.contents[key].rtDistance)
							obj5.contents[key].rtDistance = null;
						if(!obj5.contents[key].rtHR)
							obj5.contents[key].rtHR = null;
						if(!obj5.contents[key].rtRPM)
							obj5.contents[key].rtRPM = null;
						if(!obj5.contents[key].rtEnergy)
							obj5.contents[key].rtEnergy = null;
						if(!obj5.contents[key].rtPower)
							obj5.contents[key].rtPower = null;	
						if(!obj5.contents[key].rtFAT)
							obj5.contents[key].rtFAT = null;
						if(!obj5.contents[key].iFTP)
							obj5.contents[key].iFTP = null;	
						if(!obj5.contents[key].rtCHO)
							obj5.contents[key].rtCHO = null;
						if(!obj5.contents[key].iVSpeed)
							obj5.contents[key].iVSpeed = null;
						if(!obj5.contents[key].iVRV)
							obj5.contents[key].iVRV = null;
						if(!obj5.contents[key].iVElevation)
							obj5.contents[key].iVElevation = null;
						if(!obj5.contents[key].iVTime)
							obj5.contents[key].iVTime = null;
						if(!obj5.contents[key].iVMiles)
							obj5.contents[key].iVMiles = null;
						if(!obj5.contents[key].iVH)
							obj5.contents[key].iVH = null;
						if(!obj5.contents[key].iVC1)
							obj5.contents[key].iVC1 = null;
						if(!obj5.contents[key].iVC2)
							obj5.contents[key].iVC2 = null;
						if(!obj5.contents[key].iVRPM)
							obj5.contents[key].iVRPM = null;
						if(!obj5.contents[key].iVEnergy)
							obj5.contents[key].iVEnergy = null;
						if(!obj5.contents[key].iVPower)
							obj5.contents[key].iVPower = null;
						if(!obj5.contents[key].iVDistance)
							obj5.contents[key].iVDistance = null;
						if(!obj5.contents[key].iVTq)
							obj5.contents[key].iVTq = null;
						if(!obj5.contents[key].iVEf)
							obj5.contents[key].iVEf = null;
						if(!obj5.contents[key].iVWeight)
							obj5.contents[key].iVWeight = null;
						if(!obj5.contents[key].iWheel)
							obj5.contents[key].iWheel = null;
						if(!obj5.contents[key].iFAT)
							obj5.contents[key].iFAT = null;
						if(!obj5.contents[key].iFTP2)
							obj5.contents[key].iFTP2 = null;	
						if(!obj5.contents[key].iCHO)
							obj5.contents[key].iCHO = null;
						if(!obj5.contents[key].iSPM)
							obj5.contents[key].iSPM = null;
						if(!obj5.contents[key].iCaloriell)
							obj5.contents[key].iCaloriell = null;
						if(!obj5.contents[key].i1)
							obj5.contents[key].i1 = null;
						if(!obj5.contents[key].i2)
							obj5.contents[key].i2 = null;
						if(!obj5.contents[key].iMaxRPM)
							obj5.contents[key].iMaxRPM = null;
						if(!obj5.contents[key].iMaxSpeed)
							obj5.contents[key].iMaxSpeed = null;
						if(!obj5.contents[key].iMinSpeed)
							obj5.contents[key].iMinSpeed = null;
						if(!obj5.contents[key].iMaxRV)
							obj5.contents[key].iMaxRV = null;
						if(!obj5.contents[key].iMinRV)
							obj5.contents[key].iMinRV = null;
						if(!obj5.contents[key].iMaxUp)
							obj5.contents[key].iMaxUp = null;
						if(!obj5.contents[key].iMinUp)
							obj5.contents[key].iMinUp = null;*/
						
						rtInfoDataSQL=rtInfoDataSQL+"('"+obj5.contents[key].SportsInfoID+"','"+obj5.contents[key].rtDate+"','"+obj5.contents[key].rtTime+"','"+obj5.contents[key].rtSpeed+"','"+obj5.contents[key].rtRV+"','"+obj5.contents[key].rtTime2+"','"+obj5.contents[key].rtDistance+"','"+obj5.contents[key].rtHR+"','"+obj5.contents[key].rtRPM+"','"+obj5.contents[key].rtEnergy+"','"+obj5.contents[key].rtPower+"','"+obj5.contents[key].rtFAT+"','"+obj5.contents[key].iFTP+"','"+obj5.contents[key].rtCHO+"','"+obj5.contents[key].iVSpeed+"','"+obj5.contents[key].iVRV+"','"+obj5.contents[key].iVElevation+"','"+obj5.contents[key].iVTime+"','"+obj5.contents[key].iVMiles+"','"+obj5.contents[key].iVH+"','"+obj5.contents[key].iVC1+"','"+obj5.contents[key].iVC2+"','"+obj5.contents[key].iVRPM+"','"+obj5.contents[key].iVEnergy+"','"+obj5.contents[key].iVPower+"','"+obj5.contents[key].iVDistance+"','"+obj5.contents[key].iVTq+"','"+obj5.contents[key].iVEf+"','"+obj5.contents[key].iVWeight+"','"+obj5.contents[key].iWheel+"','"+obj5.contents[key].iFAT+"','"+obj5.contents[key].iFTP2+"','"+obj5.contents[key].iCHO+"','"+obj5.contents[key].iSPM+"','"+obj5.contents[key].iCaloriell+"','"+obj5.contents[key].i1+"','"+obj5.contents[key].i2+"','"+obj5.contents[key].iMaxRPM+"','"+obj5.contents[key].iMaxSpeed+"','"+obj5.contents[key].iMinSpeed+"','"+obj5.contents[key].iMaxRV+"','"+obj5.contents[key].iMinRV+"','"+obj5.contents[key].iMaxUp+"','"+obj5.contents[key].iMinUp+"','"+obj5.contents[key].rtPace+"')";
						
					}
					
					//insertSQL="insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtMask, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp) values "+rtInfoDataSQL+"";
                   insertSQLArr="insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp,rtPace) values ?";
				   // for (var key in obj5.contents) {
                       // console.log("obj5 Key: " + key);
                        console.log("insertSQL: " + insertSQL);
                        //put data to mysql
						//conn.query("insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtMask, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[ obj5.contents[key].SportsInfoID, obj5.contents[key].rtDate, obj5.contents[key].rtTime, obj5.contents[key].rtMask, obj5.contents[key].rtSpeed, obj5.contents[key].rtRV, obj5.contents[key].rtTime2, obj5.contents[key].rtDistance, obj5.contents[key].rtHR, obj5.contents[key].rtRPM, obj5.contents[key].rtEnergy, obj5.contents[key].rtPower, obj5.contents[key].rtFAT, obj5.contents[key].iFTP, obj5.contents[key].rtCHO, obj5.contents[key].iVSpeed, obj5.contents[key].iVRV,obj5.contents[key].iVElevation,obj5.contents[key].iVTime,obj5.contents[key].iVMiles,obj5.contents[key].iVH,obj5.contents[key].iVC1,obj5.contents[key].iVC2,obj5.contents[key].iVRPM,obj5.contents[key].iVEnergy,obj5.contents[key].iVPower,obj5.contents[key].iVDistance,obj5.contents[key].iVTq,obj5.contents[key].iVEf,obj5.contents[key].iVWeight,obj5.contents[key].iWheel,obj5.contents[key].iFAT,obj5.contents[key].iFTP2,obj5.contents[key].iCHO,obj5.contents[key].iSPM,obj5.contents[key].iCaloriell,obj5.contents[key].i1,obj5.contents[key].i2,obj5.contents[key].iMaxRPM,obj5.contents[key].iMaxSpeed,obj5.contents[key].iMinSpeed,obj5.contents[key].iMaxRV,obj5.contents[key].iMinRV,obj5.contents[key].iMaxUp,obj5.contents[key].iMinUp], function (err, rows){
                        conn.query(insertSQLArr,[rtInfoDataArr], function (err, rows){
                            if(err){ 
                                console.log("Insert New RtInfo error"+ err);
                                errorlog=errorlog+err;
                                conn.end();
                            }
                            else{ 
                                console.log("Insert New RtInfo success");
                                conn.end();
                                //res.json({'mtehod':'RtInfo_Update','data':{}, 'result':'true'});
                            }
                        });

                        //end put data to mysql
                    //}

                    if(errorlog == 'none error'){res.json({'mtehod':'rtInfo_insert','data':{'event':'MSPUT Success'}, 'result':'true'});}
                    else{
                        res.json({'mtehod':'rtInfo_insert','data':{'event':errorlog}, 'result':'false'});
                    }

                }


                //end sum data insert/////

                //start sum get///
                //end massive get/////
                if(req.params.action == 'GET'){
                    console.log('GET here');
                    ////
                    conn.query("select * from rtInfo where SportsInfoID = ? ", [req.body.SportsInfoID], function (err, rows){
                        if(err){
                            console.log("rtInfo SportsInfoID select error ="+err);
                            res.json({'method':'rtInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfo_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfo_GET','data':{'event':'empty'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


                } 
				
				
				if(req.params.action == 'rtInfoShortTime'){
                     console.log('testjson...'+ req.body.rtInfoShortTime);
	    var rtInfoShortTimeData = req.body.rtInfoShortTime;
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
			
			             var insertSQL="";
					var rtInfoDataSQL="";
					var rtInfoShortTimeDataArr=[];
					var insertSQLArr="";
					for(var i =0;i<rtInfoShortTimeData.length;i++) {
						console.log("rtInfoShortTimeData[i].sTimeT"+rtInfoShortTimeData[i].sTimeT);
					rtInfoShortTimeDataArr[i] = [ rtInfoShortTimeData[i].sTimeT, rtInfoShortTimeData[i].distT, rtInfoShortTimeData[i].calT, rtInfoShortTimeData[i].Count1T, rtInfoShortTimeData[i].Count2T, rtInfoShortTimeData[i].wattMax, rtInfoShortTimeData[i].wattAvg, rtInfoShortTimeData[i].rpmMax, rtInfoShortTimeData[i].rpmAvg, rtInfoShortTimeData[i].speedMax, rtInfoShortTimeData[i].speedAvg, rtInfoShortTimeData[i].hrMax, rtInfoShortTimeData[i].hrAvg, rtInfoShortTimeData[i].tgMax, rtInfoShortTimeData[i].tgAvg, rtInfoShortTimeData[i].efMax, rtInfoShortTimeData[i].efAvg,rtInfoShortTimeData[i].weightMax,rtInfoShortTimeData[i].weightAvg,rtInfoShortTimeData[i].cust1,rtInfoShortTimeData[i].cust2,rtInfoShortTimeData[i].cust3,rtInfoShortTimeData[i].StartTime,rtInfoShortTimeData[i].SportsInfoID,rtInfoShortTimeData[i].uClientID,rtInfoShortTimeData[i].wattT,rtInfoShortTimeData[i].sDeiveID,rtInfoShortTimeData[i].paceAvg];
						rtInfoDataSQL=rtInfoDataSQL+"('"+rtInfoShortTimeData[i].sTimeT+"','"+rtInfoShortTimeData[i].distT+"','"+rtInfoShortTimeData[i].calT+"','"+rtInfoShortTimeData[i].Count1T+"','"+rtInfoShortTimeData[i].Count2T+"','"+rtInfoShortTimeData[i].wattMax+"','"+rtInfoShortTimeData[i].wattAvg+"','"+rtInfoShortTimeData[i].rpmMax+"','"+rtInfoShortTimeData[i].rpmAvg+"','"+rtInfoShortTimeData[i].speedMax+"','"+rtInfoShortTimeData[i].speedAvg+"','"+rtInfoShortTimeData[i].hrMax+"','"+rtInfoShortTimeData[i].hrAvg+"','"+rtInfoShortTimeData[i].tqMax+"','"+rtInfoShortTimeData[i].tqAvg+"','"+rtInfoShortTimeData[i].efMax+"','"+rtInfoShortTimeData[i].efAvg+"','"+rtInfoShortTimeData[i].weightMax+"','"+rtInfoShortTimeData[i].weightAvg+"','"+rtInfoShortTimeData[i].cust1+"','"+rtInfoShortTimeData[i].cust2+"','"+rtInfoShortTimeData[i].cust3+"','"+rtInfoShortTimeData[i].StartTime+"','"+rtInfoShortTimeData[i].SportsInfoID+"','"+rtInfoShortTimeData[i].uClientID+"','"+rtInfoShortTimeData[i].wattT+"','"+rtInfoShortTimeData[i].paceAvg+"')";
					}
					
					//insertSQL="insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtMask, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp) values "+rtInfoDataSQL+"";
                   insertSQLArr="insert into rtInfoShortTime ( sTimeT, distT, calT, Count1T, Count2T, wattMax, wattAvg, rpmMax, rpmAvg, speedMax, speedAvg, hrMax, hrAvg, tqMax, tqAvg, efMax, efAvg,weightMax,weightAvg,cust1,cust2,cust3,StartTime,SportsInfoID,uClientID,wattT,sDeiveID,paceAvg) values ?";
			

        conn.connect();
        conn.query(insertSQLArr,[rtInfoShortTimeDataArr], function (err, rows){
            if(err){ 
                        console.log("rtInfoSum  insert error"+ err);
                        res.json({'mtehod':'rtInfoSum_insert','data':{'event':'rtInfoSum_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfoSum_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });
                    ////


                } 
});

///rtInfoSumSet
apiRoutes.post('/rtInfoSumSet', function(req,res){
    console.log('rtInfoSumSet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("insert into rtInfoSum ( sTimeT, distT, calT, Count1T, Count2T, wattMax, wattAvg, rpmMax, rpmAvg, speedMax, speedAvg, hrMax, hrAvg, tqMax, tqAvg, efMax, efAvg,weightMax,weightAvg,cust1,cust2,cust3,StartTime,SportsInfoID,uClientID,wattT,paceAvg,eventType,event,spmT) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.sTimeT, req.body.distT, req.body.calT, req.body.Count1T, req.body.Count2T, req.body.wattMax, req.body.wattAvg, req.body.rpmMax, req.body.rpmAvg, req.body.speedMax, req.body.speedAvg, req.body.hrMax, req.body.hrAvg, req.body.tqMax, req.body.tqAvg,req.body.efMax,req.body.efAvg,req.body.weightMax,req.body.weightAvg,req.body.cust1,req.body.cust2,req.body.cust3,req.body.StartTime,req.body.SportsInfoID,req.body.uClientID, req.body.wattT, req.body.paceAvg, req.body.Type, req.body.TypeValue, req.body.stroke], function (err, rows){
                    if(err){ 
                        console.log("rtInfoSum  insert error"+ err);
                        res.json({'mtehod':'rtInfoSum_insert','data':{'event':'rtInfoSum_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfoSum_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });        
            
                
});


//rtInfoSumTotal
apiRoutes.post('/rtInfoSumTotal', function(req,res){
    console.log('rtInfoSumTotal...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT Sum(sTimeT) as TotalTime,Sum(calT) as TotalCal,Sum(distT) as TotalDis,Count(uClientID) as TotalCount FROM testDB2.rtInfoSum where uClientID=? group by uClientID ;",[req.body.uClientID], function (err, rows){
                    if(err){ 
                        console.log("rtInfoSumTotal  error"+ err);
                        res.json({'mtehod':'rtInfoSumTotal','data':{'event':'rtInfoSumTotal error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfoSumTotal','data':{}, 'result':'true'});
                        conn.end();
                    }
        });        
            
                
});


///rtInfoSum date  & uClientID 年統計
apiRoutes.post('/rtInfoSum/:uClientID/yearly/:timeA/:timeB', function(req,res){
    console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT YEAR(StartTime) as year, SUM(distT) as TotalDIS, SUM(sTimeT) as TotalsTimeT ,SUM(calT) as TotalcalT  FROM rtInfoSum  where uClientID = ? and StartTime between ? and ? GROUP BY YEAR(StartTime)", [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///rtInfoSum date  & uClientID 月統計
apiRoutes.post('/rtInfoSum/:uClientID/monthly/:timeA/:timeB', function(req,res){
    console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT YEAR(StartTime) as year, MONTH(StartTime) as month, SUM(distT) as TotalDIS, SUM(sTimeT) as TotalsTimeT ,SUM(calT) as TotalcalT  FROM rtInfoSum  where uClientID = ? and StartTime between ? and ? GROUP BY YEAR(StartTime), MONTH(StartTime)", [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///rtInfoSum date  & uClientID 周統計
apiRoutes.post('/rtInfoSum/:uClientID/weekly/:timeA/:timeB', function(req,res){
    console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT YEAR(StartTime) as year, MONTH(StartTime) as month,date_format(date_sub(StartTime,INTERVAL WEEKDAY(StartTime) + 1 DAY),'%Y-%m-%d')  as week, SUM(distT) as TotalDIS, SUM(sTimeT) as TotalsTimeT ,SUM(calT) as TotalcalT  FROM rtInfoSum  where uClientID = ? and StartTime between ? and ? GROUP BY YEAR(StartTime), MONTH(StartTime),date_format(date_sub(StartTime,INTERVAL WEEKDAY(StartTime) + 1 DAY),'%Y-%m-%d')", [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoMonthSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoMonthSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///myfrienddatalist uClientID
apiRoutes.post('/friendList', function(req,res){
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT * FROM friendDetail,testDB2.userData   where friendDetail.friendID=userData.uClientID   and friendDetail.delStatus  is not true  and  friendDetail.userID=?", [req.body.uClientID], function (err, rows){
                        if(err){
                            console.log("friendList  uClientID select error ="+err);
                            res.json({'mtehod':'friendList Get','data':{'event':'SelectFriendDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'friendDetail_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'friendDetail_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///friend html  search user
apiRoutes.post('/SearchUserDataByRankID', function(req,res){
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT * FROM userData where uRankingID=?;", [req.body.RankID], function (err, rows){
                        if(err){
                            console.log("userData  uRankingID error ="+err);
                            res.json({'mtehod':'userData Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'userData_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'userData_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///friend html  search user
apiRoutes.post('/SearchUserDataByEmail', function(req,res){
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("SELECT * FROM userData where uEmail=?;", [req.body.Email], function (err, rows){
                        if(err){
                            console.log("userData  uRankingID error ="+err);
                            res.json({'mtehod':'userData Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'userData_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'userData_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});

///friendDataSent uClientID
apiRoutes.post('/friendDataSent', function(req,res){
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("insert into friendDetail (userID,friendID,license,friendRankID) values(?,?,?,?)", [req.body.uClientID,req.body.friendID,0,req.body.fRankID], function (err, rows){
                        if(err){
                            console.log("friendDataSent  uClientID,fRankID insert error ="+err);
                            res.json({'mtehod':'friendDataSent Insert','data':{'event':'InsertFriendDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }
                        else{
                            res.json({'method':'friendDataSent','data':{'event':'success'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


            
                
});

///friendDataSent uClientID
apiRoutes.post('/friendDataDel', function(req,res){
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("Update  friendDetail set delStatus=true where userID=? and friendRankID=?", [req.body.uClientID,req.body.fRankID], function (err, rows){
                        if(err){
                            console.log("friendDataSent  uClientID,fRankID insert error ="+err);
                            res.json({'mtehod':'friendDataSent Insert','data':{'event':'InsertFriendDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }
                        else{
                            res.json({'method':'friendDataSent','data':{'event':'success'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


            
                
});
//tInfoSum date  & uClientID 會員資料修改
apiRoutes.post('/profileDataUpdate', function(req,res){
	var uCName = req.body.Name ;
	var uAge = req.body.Age ;
	var uSex = req.body.Sex ;
	var uHeight = req.body.Height ;
	var uWeight = req.body.Weight ;
	var uEmail = req.body.uEmail ;
	var uProfileStatus = req.body.ProfileStatus ;
	var uLogBookStatus = req.body.LogBookStatus ;
	var uCountry = req.body.Country ;
	var uCity = req.body.City ;
	//var uImagePhoto = req.body.ImagePhoto ;
	var uFaceBook = req.body.FaceBook ;
	var uTwitter = req.body.Twitter ;
	var uInstagram = req.body.Instagram ;
	var userPassword = req.body.NewPW;
	var uClientID = req.body.uClientID ;
   var md5 = crypto.createHash('md5');
	md5.update(userPassword);
	var passwordmd5 = md5.digest('hex');
    //console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
			var updateQuery = "update userData set uCName=?, uAge=?, uSex=?, uHeight=?, uWeight=?,uEmail=?, uProfileStatus=?, uLogBookStatus=?, uCountry=?, uCity=?, uFaceBook=?, uTwitter=?, uInstagram=?, userPassword=?  where uClientID=?";
			var updateData = [uCName,uAge,uSex,uHeight,uWeight,uEmail,uProfileStatus,uLogBookStatus,uCountry,uCity,uFaceBook,uTwitter,uInstagram,passwordmd5,uClientID];
                    conn.query(updateQuery, updateData, function (err, rows){
                        if(err){
                            console.log("profileDataUpdate DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'profileDataUpdate','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }
                        else{
                            res.json({'method':'profileDataUpdate','data':{'event':'success'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///rtInfoSum  RID  & 權限
apiRoutes.post('/RankIDUserData/:rankID/', function(req,res){
   console.log('rtInfoSum...timeA = '+req.params.rankID );
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
		var isLookUserData=false;
		var isLookLogBook = false;
		var friendDetail = false;
		var UserData=null;
		var LogBookData=null;
                    conn.query("select * from userData where uRankingID=? ", [req.body.RankID], function (err, rowsuser){
                        if(err){
                            console.log("userData DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'userData Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }
//console.log("rows"+rows[0].uProfileStatus+rows[0].uLogBookStatus);
                        if(rowsuser.length){
                            ///do sent date to client here///

							
							conn.query("select * from rtInfoSum,userData where rtInfoSum.uClientID=userData.uClientID and userData.uRankingID=? ", [req.body.RankID], function (err, rows){
									 if(err){
										console.log("RtInfoSum   select error ="+err);
										res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
										conn.end();
										return;
										}
										
								conn.query("select * from rtInfoSum,userData where rtInfoSum.uClientID=userData.uClientID and userData.uRankingID=? ", [req.body.RankID], function (err, rowsrtInfoSum){
									 if(err){
										console.log("RtInfoSum   select error ="+err);
										res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
										conn.end();
										return;
										}
										
							if(rowsuser[0].uProfileStatus==0)
							{
								isLookUserData=true;
								UserData=rowsuser;
							}
							else if(rowsuser[0].uProfileStatus==1)
							{
								isLookUserData=true;
								UserData=rowsuser;
							}
							else if(rowsuser[0].uProfileStatus==2)
							{
								if(rows.length)
								{
									isLookUserData=true;
									UserData=rowsuser;
								}
							}
							else if(rowsuser[0].uProfileStatus==3)
							{
								isLookUserData=false;
								UserData=null;
							}
							
							
							if(rowsuser[0].uLogBookStatus==0)
							{
								isLookLogBook=true;
								LogBookData=rowsrtInfoSum;
							}
							else if(rowsuser[0].uLogBookStatus==1)
							{
								isLookLogBook=true;
								LogBookData=rowsrtInfoSum;

							}
							else if(rowsuser[0].uLogBookStatus==2)
							{

									if(rows.length){
										LogBookData=rowsrtInfoSum;
										isLookLogBook=true;
									}
							}
							else if(rowsuser[0].uLogBookStatus==3)
							{
								isLookLogBook=false;
							}
										 res.json({'method':'RtInfoSum_GET','data':{'rows':'data','userdata':UserData,'LogBook':LogBookData}, 'result':'true'});
										conn.end();    
									});

							  
									});
						}
                        else{
                            res.json({'method':'userData','data':{'rows':'empty'}, 'result':'true'});
                            conn.end();
                        }
                    });

					
      
                
});

//rangings data search
apiRoutes.post('/rankingDataSearch', function(req,res){
    var mysql = require('mysql');
	var sportMechanical = req.body.sportMechanical ;
	var rowerType = req.body.rowerType ;
	var Sex = req.body.sex ;
	var Country = req.body.country ;
	var ageRangeMax = req.body.ageRangeMax ;
	var ageRangeMin = req.body.ageRangeMin ;
	var season = req.body.season ;
	var eventValue = req.body.eventValue ;
	console.log("eventValue"+req.body.eventValue);
	var Arr = [];
	var wheredata="";
	var selectAvg ="";
	/*if(sportMechanical){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+ "sportMechanical= ?";
		Arr.push(sportMechanical);
	}
	if(rowerType){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+" rowerType = ?";
		Arr.push(rowerType);
	}*/
	if(Sex){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata +"uSex= ?";
		Arr.push(Sex);

	}
	if(Country){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+"uCountry = ?";
		Arr.push(Country);

	}
	if(ageRangeMax){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+"uAge < ?";
		Arr.push(ageRangeMax);
		
	}
	if(ageRangeMin){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+"uAge >?";
		Arr.push(ageRangeMin);
	
	}
	if(season){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+"Year(StartTime) = ?";
		console.log("season"+season);
		Arr.push(season);
	
	}
	if(eventValue){
	if(eventValue>60)
	{
		 selectAvg = ",sum(sTimeT)/sum(distT)*"+eventValue+" as AvgTimeT";
	}	
	if(eventValue<=60)
	{
		 selectAvg = ",sum(distT)/sum(sTimeT)*"+eventValue+" as AvgDisT";
	}	
	}
	if(wheredata!="")
		wheredata = "where  " +wheredata;
	
	var SQL = "select userName,uCName,uAge,uCountry"+selectAvg+",uRankingID FROM userData  left join  rtInfoSum  on userData.uClientID = rtInfoSum.uClientID "+wheredata +"  group by userData.uClientID";
console.log("SQL"+SQL);
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
            conn.query(SQL, Arr, function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});
///rtInfoSum date  & uClientID
apiRoutes.post('/rtInfoSum/:uClientID/:timeA/:timeB', function(req,res){
    console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("select * from rtInfoSum where uClientID=?  and StartTime between ? and ? ", [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});


///rtInfoSum date  & uClientID & type select
apiRoutes.post('/rtInfoSum/:uClientID/:timeA/:timeB/:type', function(req,res){
    console.log('rtInfoSum...timeA = '+req.params.timeA +' timeB = '+req.params.timeB+'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
		if(req.params.type=="all")
		{
			var SQL ="select * from rtInfoSum where uClientID=?  and StartTime between ? and ? ";
		}
		else
		{
			var SQL = "select * from rtInfoSum where uClientID=?  and eventType= "+req.params.type+ " and StartTime between ? and ? ";
		}
                    conn.query(SQL, [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});

//rtInfoSumTypeUpdate  SportsInfoID
apiRoutes.post('/rtInfoSumTypeUpdate/', function(req,res){
    
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("UPDATE  rtInfoSum SET state = 0 where SportsInfoID=?  and uClientID = ? ", [req.body.SportsInfoID ,req.body.uClientID], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSumUpdate Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSumUpdate_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSumUpdate_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});

//rtInfoSum uClientID & SportsInfoID
apiRoutes.post('/rtInfoSum/:uClientID/:SportsInfoID', function(req,res){
    console.log('rtInfoSum...SportsInfoID = '+req.params.SportsInfoID +'uClientID = '+req.params.uClientID);
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
                    conn.query("select * from rtInfoSum where SportsInfoID=?  and uClientID = ? ", [req.params.SportsInfoID ,req.params.uClientID], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'false'});
                            conn.end();
                        }
                    });
                    ////


            
                
});

///deviceDataGet who
apiRoutes.post('/deviceDataGet/:who', function(req, res) {
    console.log('deviceDataGet... who = '+req.params.who);
    var mySelectWho = req.params.who;
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    
            conn.query("select * from deviceData where "+mySelectWho+" = ? ", [req.body.who], function (err, rows){
            if(err){
                console.log("deviceDataGet whi... select sDeviceID error="+err);
                res.json({'method':'deviceDataGetWho','data':{'event':'deviceDataGetWhoError', 'error':err}, 'result':'false'});
                conn.end();
				return;
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('profileGet... '+rows);
            
                res.json({'method':'deviceDataGetWho','data':{'event':'deviceDataGetWho','detail':rows}, 'result':'true'});
                conn.end();
                
            }
            else{
                console.log("deviceDataGetWho...not in list");
                res.json({'method':'deviceDataGetWho','data':{'event':'deviceDataGetWhofail', 'error':req.body.sDeviceID+' not in list'}, 'result':'false'});
                conn.end();
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});

///deviceDataGet who and sDeviceID
apiRoutes.post('/deviceDataGet/:who/:sDeviceID', function(req, res) {
    console.log('deviceDataGet... who = '+req.params.who+' sDeviceID = '+req.params.sDeviceID);
    var mySelectWho = req.params.who;
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    
            conn.query("select * from deviceData where "+mySelectWho+" = ? and sDeviceID = ?", [req.body.who, req.params.sDeviceID], function (err, rows){
            if(err){
                console.log("deviceDataGet who sDeviceID... select sDeviceID error="+err);
                res.json({'method':'deviceDataGetWhosDeviceID','data':{'event':'deviceDataGetWhosDeviceIDError', 'error':err}, 'result':'false'});
                conn.end();
				return;
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('profileGet... '+rows);
            
                res.json({'method':'deviceDataGetWhosDeviceID','data':{'event':'deviceDataGetWhosDeviceID','detail':rows}, 'result':'true'});
                conn.end();
                
            }
            else{
                console.log("deviceDataGetWhosDeviceID...not in list");
                res.json({'method':'deviceDataGetWhosDeviceID','data':{'event':'deviceDataGetWhosDeviceIDfail', 'error':req.params.sDeviceID+' and '+req.body.who+' not in list'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                conn.end();
            }
        });
    
});
/*http://127.0.0.1:9004/api/deviceDataGetMulti/test/sBrand/sModal/sManufacterA/sManufacterB/ucMFClassA/ucMFnumberA/ucMFnameA/ucMFClassB/ucMFnumberB/ucMFnameB/ucMFClassC/ucMFnumberC/ucMFnameC/ucMFClassD/ucMFnumberD/ucMFnameD/ucMFClassE/ucMFnumberE/ucMFnameE/sSEID*/
///deviceDataGetMulti 1
//  /deviceDataGetMulti/*
apiRoutes.post('/deviceDataGetMulti/*', function(req, res) {
   // console.log('deviceDataGetor '+req.params.A+' = '+req.body.A);
	var paramsdata =req.url.split("/");
	console.log('sssss '+paramsdata[1]);
    var mysql = require('mysql');
	var Arr = [];
	var wheredata="";
	if(req.body.A){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[2]+"= ?";
		Arr.push(req.body.A);
		console.log("req.body.A"+req.body.A);
	}
	if(req.body.B){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[3]+"= ?";
		Arr.push(req.body.B);
		console.log("req.body.B"+req.body.B);
	}
	if(req.body.C){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[4]+"= ?";
		Arr.push(req.body.C);
		console.log("req.body.C"+req.body.C);
	}
	if(req.body.D){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[5]+"= ?";
		Arr.push(req.body.D);
		console.log("req.body.D"+req.body.D);
	}
	if(req.body.E){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[6]+"= ?";
		Arr.push(req.body.E);
		console.log("req.body.E"+req.body.E);
	}
	if(req.body.F){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[7]+"= ?";
		Arr.push(req.body.F);
		console.log("req.body.F"+req.body.F);
	}
	if(req.body.G){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[8]+"= ?";
		Arr.push(req.body.G);
		console.log("req.body.G"+req.body.G);
	}
	if(req.body.H){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[9]+"= ?";
		Arr.push(req.body.H);
		console.log("req.body.H"+req.body.H);
	}
	if(req.body.I){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[10]+"= ?";
		Arr.push(req.body.I);
		console.log("req.body.I"+req.body.I);
	}
	if(req.body.J){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[11]+"= ?";
		Arr.push(req.body.J);
		console.log("req.body.J"+req.body.J);
	}
	if(req.body.K){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[12]+"= ?";
		Arr.push(req.body.K);
		console.log("req.body.K"+req.body.K);
	}
	if(req.body.L){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[13]+"= ?";
		Arr.push(req.body.L);
		console.log("req.body.L"+req.body.L);
	}
	if(req.body.M){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[14]+"= ?";
		Arr.push(req.body.M);
		console.log("req.body.M"+req.body.M);
	}
	if(req.body.N){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[15]+"= ?";
		Arr.push(req.body.N);
		console.log("req.body.N"+req.body.N);
	}
	if(req.body.O){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[16]+"= ?";
		Arr.push(req.body.O);
		console.log("req.body.O"+req.body.O);
	}
	if(req.body.P){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[17]+"= ?";
		Arr.push(req.body.P);
		console.log("req.body.P"+req.body.P);
	}
	if(req.body.Q){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[18]+"= ?";
		Arr.push(req.body.Q);
		console.log("req.body.Q"+req.body.Q);
	}
	if(req.body.R){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[19]+"= ?";
		Arr.push(req.body.R);
		console.log("req.body.R"+req.body.R);
	}
	if(req.body.S){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[20]+"= ?";
		Arr.push(req.body.S);
		console.log("req.body.S"+req.body.S);
	}
	if(req.body.T){
		if(wheredata)
			wheredata=wheredata+" and ";
		wheredata=wheredata+paramsdata[21]+"= ?";
		Arr.push(req.body.T);
		console.log("req.body.T"+req.body.T);
	}
	
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();

	if(wheredata!="")
		wheredata = "where  " +wheredata;
	
	var ddd = "select sDeviceID from deviceData "+wheredata;
	console.log('dddSQL... '+ddd);
	//var ddd ="select sDeviceID from deviceData sModels= and ucMFnameC= ? and ucMFClassA= ? and ucMFClassC= ? and ucMFnumberA= ? and ucMFnumberB= ? and ucMFnameD= ? and ucMFnumberC= ? and ucMFnameA= ? and ucMFnumberD= ? and ucMFClassE= ? and ucMFnumberE= ? and ucMFClassB= ? and ucMFnameE= ? and sSEID= ? and ucMFClassD= ? and ucMFnameB= ?"
	
            conn.query(ddd,Arr, function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1Err', 'error':err}, 'result':'false'});
				conn.end();
				return;
		   }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti1...not in list");
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
			conn.end();
        });
    
});



apiRoutes.post('/deviceDataGetMulti', function(req, res) {
    console.log('ddddddddddddddddddddddddd');
		res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1', 'detail':'error'}, 'result':'false'});

    
});
/*
///deviceDataGetMulti 1
apiRoutes.post('/deviceDataGetMulti/1/:A', function(req, res) {
    console.log('deviceDataGetor '+req.params.A+' = '+req.body.A);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 15
        });
    conn.connect();
    
            conn.query("select sDeviceID from deviceData where "+req.params.A+" = ?", [req.body.A], function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1Err', 'error':err}, 'result':'false'});
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti1...not in list");
                res.json({'method':'deviceDataGetMulti1','data':{'event':'deviceDataGetMulti1', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});

///deviceDataGetMulti 2
apiRoutes.post('/deviceDataGetMulti/2/:A/:B', function(req, res) {
    console.log('deviceDataGetor 2'+req.params.A+' = '+req.body.A);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    
            conn.query("select sDeviceID from deviceData where "+req.params.A+" = ? and "+req.params.B+" = ?", [req.body.A, req.body.B], function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti2','data':{'event':'deviceDataGetMulti2Err', 'error':err}, 'result':'false'});
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti2','data':{'event':'deviceDataGetMulti2','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti2...not in list");
                res.json({'method':'deviceDataGetMulti2','data':{'event':'deviceDataGetMulti2', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});

///deviceDataGetMulti 3
apiRoutes.post('/deviceDataGetMulti/3/:A/:B/:C', function(req, res) {
    console.log('deviceDataGetor 3'+req.params.A+' = '+req.body.A);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    
            conn.query("select sDeviceID from deviceData where "+req.params.A+" = ? and "+req.params.B+" = ? and "+req.params.C+" = ?", [req.body.A, req.body.B, req.body.C], function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti3','data':{'event':'deviceDataGetMulti3Err', 'error':err}, 'result':'false'});
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti3','data':{'event':'deviceDataGetMulti3','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti3...not in list");
                res.json({'method':'deviceDataGetMulti3','data':{'event':'deviceDataGetMulti3', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});

///deviceDataGetMulti 4
apiRoutes.post('/deviceDataGetMulti/4/:A/:B/:C/:D', function(req, res) {
    console.log('deviceDataGetor 3'+req.params.A+' = '+req.body.A);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    
            conn.query("select sDeviceID from deviceData where "+req.params.A+" = ? and "+req.params.B+" = ? and "+req.params.C+" = ? and "+req.params.D+" = ?", [req.body.A, req.body.B, req.body.C, req.body.D], function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti4','data':{'event':'deviceDataGetMulti4Err', 'error':err}, 'result':'false'});
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti4','data':{'event':'deviceDataGetMulti4','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti4...not in list");
                res.json({'method':'deviceDataGetMulti4','data':{'event':'deviceDataGetMulti4', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});

///deviceDataGetMulti 5
apiRoutes.post('/deviceDataGetMulti/5/:A/:B/:C/:D/:E', function(req, res) {
    console.log('deviceDataGetor 3'+req.params.A+' = '+req.body.A);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    
            conn.query("select sDeviceID from deviceData where "+req.params.A+" = ? and "+req.params.B+" = ? and "+req.params.C+" = ? and "+req.params.D+" = ? and "+req.params.E+" = ?", [req.body.A, req.body.B, req.body.C, req.body.D, req.body.E], function (err, rows){
            if(err){
                console.log("deviceDataGetMulti  select sDeviceID error="+err);
                res.json({'method':'deviceDataGetMulti5','data':{'event':'deviceDataGetMulti5Err', 'error':err}, 'result':'false'});
            }

            if(rows.length){
                ///do sent date to client here///
                console.log('orSelect... '+rows);
            
                res.json({'method':'deviceDataGetMulti5','data':{'event':'deviceDataGetMulti5','detail':rows}, 'result':'true'});
                
                
            }
            else{
                console.log("deviceDataGetMulti5...not in list");
                res.json({'method':'deviceDataGetMulti5','data':{'event':'deviceDataGetMulti5', 'detail':'empty'}, 'result':'false'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
        });
    
});
*/
///deviceData
apiRoutes.post('/deviceDataGet', function(req, res) {
    console.log('deviceDataGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from deviceData where sDeviceID = ? ", [req.body.sDeviceID], function (err, rows){
        if(err){
            console.log("deviceDataGet... select sDeviceID error="+err);
            res.json({'method':'deviceDataGet','data':{'event':'deviceDataGetError', 'error':err}, 'result':'false'});
			conn.end();
        return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('profileGet... '+rows);
           
            res.json({'method':'deviceDataGet','data':{'event':'deviceDataGet','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("deviceDataGet...not in list");
            res.json({'method':'deviceDataGet','data':{'event':'deviceDataGetfail', 'error':req.body.sDeviceID+' not in list'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});




apiRoutes.post('/rtInfotestjson/:action', function(req, res) {
    console.log('devicetestjson...');
	var rtInfoDataArr=[];
    //var myDecoded = JSON.stringify(req.decoded);
	/*console.log(req.body);
	console.log(req.body.rtInfo);
	console.log(req.body.rtInfo[1]);*/
	//console.log(req.body.rtInfo[1].length);

/*	for (var key in req.body.rtInfo) {
					rtInfoDataArr[key] = [req.body.rtInfo[key][0],req.body.rtInfo[key][1],req.body.rtInfo[key][2],req.body.rtInfo[key][3],req.body.rtInfo[key][4],req.body.rtInfo[key][5],req.body.rtInfo[key][6],req.body.rtInfo[key][7],req.body.rtInfo[key][8],req.body.rtInfo[key][9],req.body.rtInfo[key][10],req.body.rtInfo[key][11],req.body.rtInfo[key][12],req.body.rtInfo[key][13],req.body.rtInfo[key][14],req.body.rtInfo[key][15],req.body.rtInfo[key][16],req.body.rtInfo[key][17],req.body.rtInfo[key][18],req.body.rtInfo[key][19],req.body.rtInfo[key][20],req.body.rtInfo[key][21],req.body.rtInfo[key][22],req.body.rtInfo[key][23],req.body.rtInfo[key][24],req.body.rtInfo[key][25],req.body.rtInfo[key][26],req.body.rtInfo[key][27],req.body.rtInfo[key][28],req.body.rtInfo[key][29],req.body.rtInfo[key][30],req.body.rtInfo[key][31],req.body.rtInfo[key][32],req.body.rtInfo[key][33],req.body.rtInfo[key][34],req.body.rtInfo[key][35],req.body.rtInfo[key][36],req.body.rtInfo[key][37],req.body.rtInfo[key][38],req.body.rtInfo[key][39],req.body.rtInfo[key][40],req.body.rtInfo[key][41],req.body.rtInfo[key][42],req.body.rtInfo[key][43],req.body.rtInfo[key][44],req.body.rtInfo[key][45]]
	}*/
	
				    var mysql = require('mysql');
		var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
		if(req.params.action == 'MSPUT')
		{
			
				rtInfoDataArr = req.body.rtInfo;

				 insertSQLArr="insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtSpeed, rtRV, rtElevation , rtTime2, rtDistance, rtHR, rtC1,rtC2, rtRPM, rtEnergy, rtPower,rtLeffectStroke,rtReffectStroke,rtLWeight,rtRWeight,rtSPM,rtWheel,rt500MTime,rtLSwing,rtRSwing,rtMaxRPM,rtLBandFS,rtRBandFS,rtPull,rtAvePull,rtAve500MTime,rtPaddleCount,rtPaddleLength,rtSPaddleT,rtTabataR,rtTabataAS,rtTabataRS,rtDragC,rtMaxPull,rtLTreadPower,rtRTreadPower,rtSAngle,rtEAngle,rtBFR,rtExerciseI,rtEnergV,rtTq,rtRVU,rtElevationU,rtEnergyU,rtSwingU) values ?";
				   // for (var key in obj5.contents) {
                       // console.log("obj5 Key: " + key);
                       // console.log("insertSQL: " + insertSQL);
                        //put data to mysql
						//conn.query("insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtMask, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[ obj5.contents[key].SportsInfoID, obj5.contents[key].rtDate, obj5.contents[key].rtTime, obj5.contents[key].rtMask, obj5.contents[key].rtSpeed, obj5.contents[key].rtRV, obj5.contents[key].rtTime2, obj5.contents[key].rtDistance, obj5.contents[key].rtHR, obj5.contents[key].rtRPM, obj5.contents[key].rtEnergy, obj5.contents[key].rtPower, obj5.contents[key].rtFAT, obj5.contents[key].iFTP, obj5.contents[key].rtCHO, obj5.contents[key].iVSpeed, obj5.contents[key].iVRV,obj5.contents[key].iVElevation,obj5.contents[key].iVTime,obj5.contents[key].iVMiles,obj5.contents[key].iVH,obj5.contents[key].iVC1,obj5.contents[key].iVC2,obj5.contents[key].iVRPM,obj5.contents[key].iVEnergy,obj5.contents[key].iVPower,obj5.contents[key].iVDistance,obj5.contents[key].iVTq,obj5.contents[key].iVEf,obj5.contents[key].iVWeight,obj5.contents[key].iWheel,obj5.contents[key].iFAT,obj5.contents[key].iFTP2,obj5.contents[key].iCHO,obj5.contents[key].iSPM,obj5.contents[key].iCaloriell,obj5.contents[key].i1,obj5.contents[key].i2,obj5.contents[key].iMaxRPM,obj5.contents[key].iMaxSpeed,obj5.contents[key].iMinSpeed,obj5.contents[key].iMaxRV,obj5.contents[key].iMinRV,obj5.contents[key].iMaxUp,obj5.contents[key].iMinUp], function (err, rows){
                        conn.query(insertSQLArr,[rtInfoDataArr], function (err, rows){
                            if(err){ 
                                console.log("Insert New RtInfo error"+ err);
                              //  errorlog=errorlog+err;
                                conn.end();
                            }
                            else{ 
                                console.log("Insert New RtInfo success");
                                conn.end();
                                res.json({'mtehod':'RtInfo_Update','data':{}, 'result':'true'});
                            }
                        });
		}

	                //end sum data insert/////

                //start sum get///
                //end massive get/////
                if(req.params.action == 'GET'){
                    console.log('GET here');
                    ////
                    conn.query("select * from rtInfo where SportsInfoID = ? ", [req.body.SportsInfoID], function (err, rows){
                        if(err){
                            console.log("rtInfo SportsInfoID select error ="+err);
                            res.json({'method':'rtInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                            conn.end();
							return;
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfo_GET','data':{'rows':rows}, 'result':'true'});
                            conn.end();

                            ///do sent date to client here///
                        }
                        else{
                            res.json({'method':'RtInfo_GET','data':{'event':'empty'}, 'result':'true'});
                            conn.end();
                        }
                    });
                    ////


                } 
				
				
				if(req.params.action == 'rtInfoShortTime'){
                     console.log('testjson...'+ req.body.rtInfoShortTime);
	    var rtInfoShortTimeData = req.body.rtInfoShortTime;
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
			
			             var insertSQL="";
					var rtInfoDataSQL="";
					var rtInfoShortTimeDataArr=[];
					var insertSQLArr="";
					for(var i =0;i<rtInfoShortTimeData.length;i++) {
						console.log("rtInfoShortTimeData[i].sTimeT"+rtInfoShortTimeData[i].sTimeT);
					rtInfoShortTimeDataArr[i] = [ rtInfoShortTimeData[i].sTimeT, rtInfoShortTimeData[i].distT, rtInfoShortTimeData[i].calT, rtInfoShortTimeData[i].Count1T, rtInfoShortTimeData[i].Count2T, rtInfoShortTimeData[i].wattMax, rtInfoShortTimeData[i].wattAvg, rtInfoShortTimeData[i].rpmMax, rtInfoShortTimeData[i].rpmAvg, rtInfoShortTimeData[i].speedMax, rtInfoShortTimeData[i].speedAvg, rtInfoShortTimeData[i].hrMax, rtInfoShortTimeData[i].hrAvg, rtInfoShortTimeData[i].tgMax, rtInfoShortTimeData[i].tgAvg, rtInfoShortTimeData[i].efMax, rtInfoShortTimeData[i].efAvg,rtInfoShortTimeData[i].weightMax,rtInfoShortTimeData[i].weightAvg,rtInfoShortTimeData[i].cust1,rtInfoShortTimeData[i].cust2,rtInfoShortTimeData[i].cust3,rtInfoShortTimeData[i].StartTime,rtInfoShortTimeData[i].SportsInfoID,rtInfoShortTimeData[i].uClientID,rtInfoShortTimeData[i].wattT,rtInfoShortTimeData[i].sDeiveID,rtInfoShortTimeData[i].paceAvg];
						rtInfoDataSQL=rtInfoDataSQL+"('"+rtInfoShortTimeData[i].sTimeT+"','"+rtInfoShortTimeData[i].distT+"','"+rtInfoShortTimeData[i].calT+"','"+rtInfoShortTimeData[i].Count1T+"','"+rtInfoShortTimeData[i].Count2T+"','"+rtInfoShortTimeData[i].wattMax+"','"+rtInfoShortTimeData[i].wattAvg+"','"+rtInfoShortTimeData[i].rpmMax+"','"+rtInfoShortTimeData[i].rpmAvg+"','"+rtInfoShortTimeData[i].speedMax+"','"+rtInfoShortTimeData[i].speedAvg+"','"+rtInfoShortTimeData[i].hrMax+"','"+rtInfoShortTimeData[i].hrAvg+"','"+rtInfoShortTimeData[i].tqMax+"','"+rtInfoShortTimeData[i].tqAvg+"','"+rtInfoShortTimeData[i].efMax+"','"+rtInfoShortTimeData[i].efAvg+"','"+rtInfoShortTimeData[i].weightMax+"','"+rtInfoShortTimeData[i].weightAvg+"','"+rtInfoShortTimeData[i].cust1+"','"+rtInfoShortTimeData[i].cust2+"','"+rtInfoShortTimeData[i].cust3+"','"+rtInfoShortTimeData[i].StartTime+"','"+rtInfoShortTimeData[i].SportsInfoID+"','"+rtInfoShortTimeData[i].uClientID+"','"+rtInfoShortTimeData[i].wattT+"','"+rtInfoShortTimeData[i].paceAvg+"')";
					}
					
					//insertSQL="insert into rtInfo ( SportsInfoID, rtDate, rtTime, rtMask, rtSpeed, rtRV, rtTime2, rtDistance, rtHR, rtRPM, rtEnergy, rtPower, rtFAT, iFTP,rtCHO, iVSpeed,iVRV,iVElevation,iVTime,iVMiles,iVH,iVC1,iVC2,iVRPM,iVEnergy,iVPower,iVDistance,iVTq,iVEf,iVWeight,iWheel,iFAT,iFTP2,iCHO,iSPM,iCaloriell,i1,i2,iMaxRPM,iMaxSpeed,iMinSpeed,iMaxRV,iMinRV,iMaxUp,iMinUp) values "+rtInfoDataSQL+"";
                   insertSQLArr="insert into rtInfoShortTime ( sTimeT, distT, calT, Count1T, Count2T, wattMax, wattAvg, rpmMax, rpmAvg, speedMax, speedAvg, hrMax, hrAvg, tqMax, tqAvg, efMax, efAvg,weightMax,weightAvg,cust1,cust2,cust3,StartTime,SportsInfoID,uClientID,wattT,sDeiveID,paceAvg) values ?";
			

        conn.connect();
        conn.query(insertSQLArr,[rtInfoShortTimeDataArr], function (err, rows){
            if(err){ 
                        console.log("rtInfoSum  insert error"+ err);
                        res.json({'mtehod':'rtInfoSum_insert','data':{'event':'rtInfoSum_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfoSum_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });
                    ////


                } 
console.log(rtInfoDataArr);
});

apiRoutes.post('/deviceDataUpdate', function(req, res) {
    console.log('deviceDataUpdate...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
	console.log('req = '+req.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();

    // conn.query("select * from deviceData where sDeviceID = ? ", [req.body.sDeviceID], function (err, rows){
    //     if(err){
    //         console.log("deviceDataUpdate... select sDeviceID error="+err);
    //         res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdateError', 'error':err}, 'result':'false'});
    //     }

    //     if(rows.length){
    //         ///do sent date to client here///
    //         console.log('deviceDataUpdate... the sDeviceID already have...could update');
    //         doMyUpdate();
    //         //res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdate success'}, 'result':'false'});

    //         ///do sent date to client here///
    //     }
    //     else{
    //         console.log("deviceDataUpdate...sDeviceID not in list, cannot update deviceData...");
    //         res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdate Error, sDeviceID not in list'}, 'result':'false'});

    //         //doMyUpdate();

    //     }
    // });


    //var doMyUpdate  = function(){
	var wheredata="";
	var Arr=[];
	if(!req.body.sDeviceID){
		   console.log("deviceDataGet... select sDeviceID error="+err);
            res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdateError', 'error':'sDeviceID  is  NULL'}, 'result':'false'});
	}
	console.log("sModels"+req.body.sModels);
	console.log("sCatelog"+req.body.sCatelog);
	console.log("sActivity"+req.body.sActivity);
	console.log("sSEID"+req.body.sSEID);
	console.log("iRealDataRate"+req.body.iRealDataRate);
		console.log("iEnvirDataRate"+req.body.iEnvirDataRate);
			console.log("sTotalVileage"+req.body.sTotalVileage);
				console.log("sWorkingTime"+req.body.sWorkingTime);
				console.log("sDeviceID"+req.body.sDeviceID);
	if(req.body.sBrands){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sBrands= ?";
		Arr.push(req.body.sBrands);
	}
	
	if(req.body.sModels){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sModels= ?";
		Arr.push(req.body.sModels);
	}
	
	if(req.body.sCatelog){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sCatelog= ?";
		Arr.push(req.body.sCatelog);
	}
	if(req.body.sCidtVersion){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sCidtVersion= ?";
		Arr.push(req.body.sCidtVersion);
	}
	if(req.body.sManufacterA){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sManufacterA= ?";
		Arr.push(req.body.sManufacterA);
	}
	if(req.body.sManufacterB){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sManufacterB= ?";
		Arr.push(req.body.sManufacterB);
	}
	if(req.body.ucMFClassA){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFClassA= ?";
		Arr.push(req.body.ucMFClassA);
	}
	if(req.body.ucMFnumberA){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnumberA= ?";
		Arr.push(req.body.ucMFnumberA);
	}
	if(req.body.ucMFnameA){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnameA= ?";
		Arr.push(req.body.ucMFnameA);
	}
	if(req.body.ucMFClassB){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFClassB= ?";
		Arr.push(req.body.ucMFClassB);
	}
	if(req.body.ucMFnumberB){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnumberB= ?";
		Arr.push(req.body.ucMFnumberB);
	}
	if(req.body.ucMFnameB){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnameB= ?";
		Arr.push(req.body.ucMFnameB);
	}
	if(req.body.ucMFClassC){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFClassC= ?";
		Arr.push(req.body.ucMFClassC);
	}
	if(req.body.ucMFnumberC){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnumberC= ?";
		Arr.push(req.body.ucMFnumberC);
	}
	if(req.body.ucMFnameC){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnameC= ?";
		Arr.push(req.body.ucMFnameC);
	}
	if(req.body.ucMFClassD){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFClassD= ?";
		Arr.push(req.body.ucMFClassD);
	}
	if(req.body.ucMFnumberD){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnumberD= ?";
		Arr.push(req.body.ucMFnumberD);
	}
	if(req.body.ucMFnameD){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnameD= ?";
		Arr.push(req.body.ucMFnameD);
	}
	if(req.body.ucMFClassE){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFClassE= ?";
		Arr.push(req.body.ucMFClassE);
	}
	if(req.body.ucMFnumberE){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnumberE= ?";
		Arr.push(req.body.ucMFnumberE);
	}	
	if(req.body.ucMFnameE){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"ucMFnameE= ?";
		Arr.push(req.body.ucMFnameE);
	}
	
	if(req.body.sSoftwareVersion){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sSoftwareVersion= ?";
		Arr.push(req.body.sSoftwareVersion);
	}
	if(req.body.sActivity){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sActivity= ?";
		Arr.push(req.body.sActivity);
	}
	if(req.body.sSEID){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sSEID= ?";
		Arr.push(req.body.sSEID);
	}
	if(req.body.sctivity){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sctivity= ?";
		Arr.push(req.body.sctivity);
	}
	if(req.body.sDateTime){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sDateTime= ?";
		Arr.push(req.body.sDateTime);
	}
	if(req.body.iRealDataRate){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"iRealDataRate= ?";
		Arr.push(req.body.iRealDataRate);
	}	
	if(req.body.iEnvirDataRate){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"iEnvirDataRate= ?";
		Arr.push(req.body.iEnvirDataRate);
	}	
	if(req.body.sTotalVileage){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sTotalVileage= ?";
		Arr.push(req.body.sTotalVileage);
	}
	if(req.body.sWorkingTime){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sWorkingTime= ?";
		Arr.push(req.body.sWorkingTime);
	}	
	if(req.body.sEnableDate){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sEnableDate= ?";
		Arr.push(req.body.sEnableDate);
	}	
	if(req.body.sCheck){
		if(wheredata)
			wheredata=wheredata+" , ";
		wheredata=wheredata+"sCheck= ?";
		Arr.push(req.body.sCheck);
	}		
	Arr.push(req.body.sDeviceID);
	console.log("update deviceData set "+wheredata+" where sDeviceID=?");
        var updateQuery = "update deviceData set "+wheredata+" where sDeviceID=?";
        //var updateData = [req.body.sBrands, req.body.sModels, req.body.sCatelog, req.body.sCidtVersion,req.body.sManufacterA,req.body.sManufacterB, req.body.ucMFClassA,req.body.ucMFnumberA, req.body.ucMFnameA, req.body.ucMFClassB,req.body.ucMFnumberB, req.body.ucMFnameB, req.body.ucMFClassC,req.body.ucMFnumberC, req.body.ucMFnameC, req.body.ucMFClassD,req.body.ucMFnumberD, req.body.ucMFnameD, req.body.ucMFClassE,req.body.ucMFnumberE, req.body.ucMFnameE, req.body.sSoftwareVersion, req.body.sActivity, req.body.sSEID, req.body.sctivity, req.body.sDateTime, req.body.iRealDataRate, req.body.iEnvirDataRate, req.body.sTotalVileage, req.body.sWorkingTime, req.body.sEnableDate, req.body.sCheck,req.body.sDeviceID];
        conn.query(updateQuery, Arr, function (err, rows){
            if(err){
                console.log("deviceDataUpdate... update sDeviceID error="+err);
                res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdateError', 'error':err}, 'result':'false'});
            }
            else{
                console.log("deviceDataUpdate...success");
                res.json({'method':'deviceDataUpdate','data':{'event':'deviceDataUpdate success'}, 'result':'true'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
			conn.end();
        });
    //};
    
});

apiRoutes.post('/deviceDataSet', function(req, res) {
    console.log('deviceDataSet...');
    console.log('sDeviceID = '+ req.body.sDeviceID);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from deviceData where sBrands = ? and sModels = ? and sManufacterA = ? and sManufacterB = ? and ucMFClassA = ? and ucMFnumberA = ? and ucMFnameA = ? and ucMFClassB = ? and ucMFnumberB = ? and ucMFnameB = ? and ucMFClassC = ? and ucMFnumberC = ? and ucMFnameC = ? and ucMFClassD = ? and ucMFnumberD = ? and ucMFnameD = ? and ucMFClassE = ? and ucMFnumberE = ? and ucMFnameE = ? and sSEID = ?", [req.body.sBrands, req.body.sModels, req.body.sManufacterA, req.body.sManufacterB,req.body.ucMFClassA,req.body.ucMFnumberA, req.body.ucMFnameA, req.body.ucMFClassB,req.body.ucMFnumberB, req.body.ucMFnameB, req.body.ucMFClassC,req.body.ucMFnumberC, req.body.ucMFnameC, req.body.ucMFClassD,req.body.ucMFnumberD, req.body.ucMFnameD, req.body.ucMFClassE,req.body.ucMFnumberE, req.body.ucMFnameE, req.body.sSEID], function (err, rows){
        if(err){
            console.log("deviceDataSet... select sDeviceID error="+err);
            res.json({'method':'deviceDataSet','data':{'event':'deviceDataSetError', 'error':err}, 'result':'false'});
        conn.end();
		return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('deviceDataSet... same data');
            res.json({'method':'deviceDataSet','data':{'event':'same data'}, 'result':'false'});

            ///do sent date to client here///
        }
        else{
            console.log("deviceDataSet...sDeviceID not in list, create sDeviceID data...");
            doMyCreate();

        }
		conn.end();
    });

    var doMyCreate = function(){
        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 1500
            });
        conn.connect();


        conn.query("insert into deviceData ( sBrands, sModels, sCatelog, sCidtVersion, sManufacterA, sManufacterB,ucMFClassA, ucMFnumberA, ucMFnameA, ucMFClassB, ucMFnumberB, ucMFnameB, ucMFClassC, ucMFnumberC, ucMFnameC, ucMFClassD, ucMFnumberD, ucMFnameD, ucMFClassE, ucMFnumberE, ucMFnameE, sSoftwareVersion, sActivity, sSEID, sctivity, sDateTime, iRealDataRate, iEnvirDataRate, sTotalVileage, sWorkingTime, sEnableDate, sCheck) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[ req.body.sBrands, req.body.sModels, req.body.sCatelog, req.body.sCidtVersion, req.body.sManufacterA, req.body.sManufacterB, req.body.ucMFClassA,req.body.ucMFnumberA, req.body.ucMFnameA, req.body.ucMFClassB,req.body.ucMFnumberB, req.body.ucMFnameB, req.body.ucMFClassC,req.body.ucMFnumberC, req.body.ucMFnameC, req.body.ucMFClassD,req.body.ucMFnumberD, req.body.ucMFnameD, req.body.ucMFClassE,req.body.ucMFnumberE, req.body.ucMFnameE,req.body.sSoftwareVersion, req.body.sActivity, req.body.sSEID, req.body.sctivity, req.body.sDateTime, req.body.iRealDataRate, req.body.iEnvirDataRate, req.body.sTotalVileage, req.body.sWorkingTime, req.body.sEnableDate, req.body.sCheck], function (err, rows){
                            if(err){
                                console.log("userData  error="+err); 
                                res.json({'method':'deviceDataSet', 'data':{'event':'deviceDataSet fail','error':err}, 'result':'false'});
                                
                            }
                            else{ 
                                res.json({'method':'deviceDataSet','data':{'event':'deviceDataSet success'}, 'result':'true'});
                                
                            }
							conn.end();
        });

    };

});

//deviceStatus
apiRoutes.post('/deviceStatusGet', function(req, res) {
    console.log('deviceStatusGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from deviceStatus where sDeviceID = ? ", [req.body.sDeviceID], function (err, rows){
        if(err){
            console.log("deviceStatusGet... select sDeviceID error="+err);
            res.json({'method':'deviceStatusGet','data':{'event':'deviceStatusGetError', 'error':err}, 'result':'false'});
        conn.end();
		return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('deviceStatusGet... '+rows);
           
            res.json({'method':'deviceStatusGet','data':{'event':'deviceStatusGet','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("deviceStatusGet...not in list");
            res.json({'method':'deviceStatusGet','data':{'event':'deviceStatusGetfail', 'error':req.body.sDeviceID+' not in list'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

apiRoutes.post('/deviceStatusUpdate', function(req, res) {
    console.log('deviceStatusUpdate...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    
        var updateQuery = "update deviceStatus set iddeviceStatus=?, rtDate=?, rtTime=?, rtMStatus=?, repaireNo=? where sDeviceID=?";
        var updateData = [req.body.iddeviceStatus, req.body.rtDate, req.body.rtTime, req.body.rtMStatus, req.body.repaireNo, req.body.sDeviceID];
        conn.query(updateQuery, updateData, function (err, rows){
            if(err){
                console.log("deviceStatusUpdate... update sDeviceID error="+err);
                res.json({'method':'deviceStatusUpdate','data':{'event':'deviceStatusUpdateError', 'error':err}, 'result':'false'});
            }
            else{
                console.log("deviceStatusUpdate...success");
                res.json({'method':'deviceStatusUpdate','data':{'event':'deviceStatusUpdate success'}, 'result':'true'});
                //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
            }
			conn.end();
        });
   
    
});

apiRoutes.post('/deviceStatusSet', function(req, res) {
    console.log('deviceStatusSet...');
    console.log('sDeviceID = '+ req.body.sDeviceID);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("insert into deviceStatus ( iddeviceStatus, sDeviceID, rtDate, rtTime, rtMStatus, repaireNo) values (?,?,?,?,?,?)",[req.body.iddeviceStatus, req.body.sDeviceID, req.body.rtDate, req.body.rtTime, req.body.rtMStatus, req.body.repaireNo], function (err, rows){
                if(err){
                    console.log("userData  error="+err); 
                    res.json({'method':'deviceStatusSet', 'data':{'event':'deviceStatusSet fail','error':err}, 'result':'false'});
                                
                }
                else{ 
                    res.json({'method':'deviceStatusSet','data':{'event':'deviceStatusSet success'}, 'result':'true'});
                                
                }
				conn.end();
    });

});

//cpDataSet
app.post('/cpDataSet', function(req, res) {
    console.log('cpDataSet...');
    console.log();
    // var myDecoded = JSON.stringify(req.decoded);
    // var myJsonString = myDecoded.replace('\"', '"');
    // var myjson = JSON.parse(myJsonString);
    // console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("insert into cpData ( cpName, taxID, cpPassword, cpAcc, cpType, others) values (?,?,?,?,?,?)",[req.body.cpName, req.body.taxID, req.body.cpPassword, req.body.cpAcc, req.body.cpType, req.body.others], function (err, rows){
                if(err){
                    console.log("cpData  error="+err); 
                    res.json({'method':'cpDataSet', 'data':{'event':'cpDataSet fail','error':err}, 'result':'false'});
                                
                }
                else{ 
                    res.json({'method':'cpDataSet','data':{'event':'cpDataSet success'}, 'result':'true'});
                                
                }
				conn.end();
    });

});

//cpLogin
app.post('/cpLogin',function(req, res){
    console.log('cpLogin...cpAcc = '+ req.body.cpAcc + 'cpPassword = '+ req.body.cpPassword);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from cpData where cpAcc = ? ", [req.body.cpAcc], function (err, rows){
        if(err){
            console.log("cpLogin... select users error="+err);
            res.json({'method':'cpLogin','data':{'event':'cpLoginError', 'error':err}, 'result':'false'});
        conn.end();
		return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('cpLogin... the cpAcc check, rows[0].cpPassword = '+rows[0].cpPassword);
            if(req.body.cpPassword ===rows[0].cpPassword){
                console.log('password correct!...create token...');
                var token = jwt.sign({data: req.body.cpAcc}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24 * 30});// 1 hr
                res.json({'method':'cpLogin','data':{'event':'correct','token':token}, 'result':'true'});
            }
            else{
                res.json({'method':'cpLogin','data':{'event':'password fail'}, 'result':'false'});
            }
            
        }
        else{
            console.log("login...not in users");
            res.json({'method':'cpLogin','data':{'event':'cpLoginfail', 'error':'not in cpData'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

///cpDataGet
apiRoutes.post('/cpDataGet', function(req, res) {
    console.log('cpDataGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from cpData where cpAcc = ? and cpPassword = ?", [req.body.cpAcc, req.body.cpPassword], function (err, rows){
        if(err){
            console.log("cpDataGet... select error="+err);
            res.json({'method':'cpDataGet','data':{'event':'cpDataGetError', 'error':err}, 'result':'false'});
       conn.end();
	   return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('cpDataGet... '+rows);
           
            res.json({'method':'cpDataGet','data':{'event':'cpDataGet','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("cpDataGet...not in list");
            res.json({'method':'cpDataGet','data':{'event':'cpDataGetFail', 'error':'not in list'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

///cpDeviceDataGet
apiRoutes.post('/cpDeviceDataGet', function(req, res) {
    console.log('cpDeviceDataGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from deviceData where ucMFnameA = ? or ucMFnameB = ? or ucMFnameC = ? or ucMFnameD = ? or ucMFnameE = ?", [req.body.cpName, req.body.cpName, req.body.cpName, req.body.cpName, req.body.cpName], function (err, rows){
        if(err){
            console.log("cpDeviceDataGet... select sDeviceID error="+err);
            res.json({'method':'cpDeviceDataGet','data':{'event':'cpDeviceDataGetError', 'error':err}, 'result':'false'});
        conn.end();
		return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('cpDeviceDataGet... '+rows);
           
            res.json({'method':'cpDeviceDataGet','data':{'event':'cpDeviceDataGet','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("cpDeviceDataGet...not in list");
            res.json({'method':'cpDeviceDataGet','data':{'event':'cpDeviceDataGetFaol', 'error':req.body.sDeviceID+' not in list'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
	
});

//cpDeviceStatusGet
apiRoutes.post('/cpDeviceStatusGet', function(req, res) {
    console.log('cpDeviceStatusGet...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    var myQueryString = '?';
    var obj5 = JSON.parse(req.body.sDeviceID);
    var myQueryArray =[];
    console.log('dataNum = '+req.body.dataNum);
    for(var i = 1; i <= parseInt(req.body.dataNum); i++){

        console.log("for: myQueryString = "+myQueryString);
        myQueryString = myQueryString +" , ?";
        myQueryArray.push(obj5.contents[i-1].sDeviceID);
        console.log('i = '+i);
        console.log('for :'+myQueryArray);
        console.log('for :'+myQueryString);

    }
    console.log('myQueryString = '+myQueryString);
    console.log('myQueryArray = '+myQueryArray);
    myQueryString = myQueryString.substring(0, myQueryString.length-3);
    console.log('after substring myQueryString = '+myQueryString);

    conn.query("select * from deviceStatus where sDeviceID in ("+myQueryString+")", myQueryArray, function (err, rows){
        if(err){
            console.log("cpDeviceStatusGet... select sDeviceID error="+err);
            res.json({'method':'cpDeviceStatusGet','data':{'event':'cpDeviceStatusGetError', 'error':err}, 'result':'false'});
        conn.end();
		return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('cpDeviceStatusGet... '+rows);
           
            res.json({'method':'cpDeviceStatusGet','data':{'event':'cpDeviceStatusGet','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("cpDeviceStatusGet...not in list");
            res.json({'method':'cpDeviceStatusGet','data':{'event':'cpDeviceStatusGetFail', 'error':'not in list'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

//cpAccSet
app.post('/cpAccSet', function(req, res) {
    console.log('cpAccSet...');
    // var myDecoded = JSON.stringify(req.decoded);
    // var myJsonString = myDecoded.replace('\"', '"');
    // var myjson = JSON.parse(myJsonString);
    // console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    var updateQuery = "update cpData set cpPassword=? where cpName=?";
    var updateData = [req.body.cpPassword, req.body.cpName];
    conn.query(updateQuery, updateData, function (err, rows){
        if(err){
            console.log("cpAccSet... update users error="+err);
            res.json({'method':'cpAccSet','data':{'event':'cpAccSetError', 'error':err}, 'result':'false'});
        }
        else{
            console.log("cpAccSet...success");
            res.json({'method':'cpAccSet','data':{'event':'cpAccSet success'}, 'result':'true'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

///////find user ip info
apiRoutes.post('/profileGetIp', function(req, res) {
    console.log('profileGetIp...');
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("select * from userHist where userName = ? ", [req.body.username], function (err, rows){
        if(err){
            console.log("profileGetIp... select users error="+err);
            res.json({'method':'profileGetIp','data':{'event':'profileGetIpError', 'error':err}, 'result':'false'});
       conn.end();
	   return;
		}

        if(rows.length){
            ///do sent date to client here///
            console.log('profileGetIp... '+rows);
           
            res.json({'method':'profileGetIp','data':{'event':'profileGetIp','detail':rows}, 'result':'true'});
            
            
        }
        else{
            console.log("profileGetIp...not in users");
            res.json({'method':'profileGetIp','data':{'event':'profileGetIpfail', 'error':'not in userData'}, 'result':'false'});
            //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
        }
		conn.end();
    });
});

///sportClass insert
apiRoutes.post('/sportClassSetStart', function(req,res){
    console.log('sportClassSetStart...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("insert into sportClass ( startTime, classID, className, gymName, CName) values (?,?,?,?,?)",[new Date(), req.body.classID, req.body.myclassName, req.body.gymName, req.body.CName], function (err, rows){
                    if(err){ 
                        console.log("sportClassSetStart  insert error"+ err);
                        res.json({'mtehod':'sportClassSetStart_insert','data':{'event':'sportClassSetStart_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'sportClassSetStart_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });        
            
                
});
///sportClass insert

///sportClassEnd insert
apiRoutes.post('/sportClassSetEnd', function(req,res){
    console.log('sportClassSetEnd...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("update sportClass set endTime=?, memberNum=?, result1=?, result2=? where classID=?",[new Date(), req.body.memberNum, req.body.result1, req.body.result2, req.body.classID ], function (err, rows){
                    if(err){ 
                        console.log("sportClassSetEnd  insert error"+ err);
                        res.json({'mtehod':'sportClassSetEnd_insert','data':{'event':'sportClassSetEnd_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'sportClassSetEnd_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });        
            
                
});
///sportClassEnd insert

///sportClass Get
apiRoutes.post('/sportClassGet', function(req,res){
    console.log('sportClassGet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("select * from sportClass where classID = ?",[req.body.classID], function (err, rows){
                if(err){
                        console.log("sportClassGet... select users error="+err);
                        res.json({'method':'sportClassGet','data':{'event':'sportClassGetError', 'error':err}, 'result':'false'});
                conn.end();
				return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('sportClassGet... '+rows);
                   
                    res.json({'method':'sportClassGet','data':{'event':'sportClassGet','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("sportClassGet...not in users");
                    res.json({'method':'sportClassGet','data':{'event':'sportClassGet', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
				conn.end();
        });        
            
                
});


///payment Get
//付款清單
//------------------------------------------------------

/*apiRoutes.post('/paymentGet', function(req,res){
    console.log('paymentGet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT * FROM paymentRecords", function (err, rows){
                if(err){
                        console.log("paymentGet... select users error="+err);
                        res.json({'method':'paymentGet','data':{'event':'paymentGetError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('paymentGet... '+rows);
                   
                    res.json({'method':'paymentGet','data':{'event':'paymentGet','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("paymentGet...not in users");
                    res.json({'method':'paymentGet','data':{'event':'sportClassGet', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});

//
//5分鐘資料集合
//
---------------------------
apiRoutes.post('/testjson', function(req,res){
    console.log('rtInfoSumSet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("insert into rtInfoSum ( sTimeT, distT, calT, Count1T, Count2T, wattMax, wattAvg, rpmMax, rpmAvg, speedMax, speedAvg, hrMax, hrAvg, tqMax, tqAvg, efMax, efAvg,weightMax,weightAvg,cust1,cust2,cust3,StartTime,SportsInfoID,uClientID,wattT) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.sTimeT, req.body.distT, req.body.calT, req.body.Count1T, req.body.Count2T, req.body.wattMax, req.body.wattAvg, req.body.rpmMax, req.body.rpmAvg, req.body.speedMax, req.body.speedAvg, req.body.hrMax, req.body.hrAvg, req.body.tqMax, req.body.tqAvg,req.body.efMax,req.body.efAvg,req.body.weightMax,req.body.weightAvg,req.body.cust1,req.body.cust2,req.body.cust3,req.body.StartTime,req.body.SportsInfoID,req.body.uClientID, req.body.wattT], function (err, rows){
                    if(err){ 
                        console.log("rtInfoSum  insert error"+ err);
                        res.json({'mtehod':'rtInfoSum_insert','data':{'event':'rtInfoSum_insert error','error':err}, 'result':'false'});
                        conn.end();
                    }
                    else{ 
                        
                        res.json({'mtehod':'rtInfoSum_insert','data':{}, 'result':'true'});
                        conn.end();
                    }
        });        
            
                
});

//
//排名查詢
//rankings
-------------------------
apiRoutes.get('/rankingsSearch', function(req, res) {
    console.log('rankingsSearch...');
    console.log('sDeviceID = '+ req.body.sDeviceID);
    var myDecoded = JSON.stringify(req.decoded);
    var myJsonString = myDecoded.replace('\"', '"');
    var myjson = JSON.parse(myJsonString);
    console.log('data = '+myjson.data);
    var mysql = require('mysql');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',  //local : admin; AWS: root
        password: 'ej03xu35k3',//ej03xu35k3
        database: 'testDB2',
        port: 3306
        //connectionLimit : 1500
        });
    conn.connect();
    conn.query("insert into deviceStatus ( iddeviceStatus, sDeviceID, rtDate, rtTime, rtMStatus, repaireNo) values (?,?,?,?,?,?)",[req.body.iddeviceStatus, req.body.sDeviceID, req.body.rtDate, req.body.rtTime, req.body.rtMStatus, req.body.repaireNo], function (err, rows){
                if(err){
                    console.log("userData  error="+err); 
                    res.json({'method':'deviceStatusSet', 'data':{'event':'deviceStatusSet fail','error':err}, 'result':'false'});
                                
                }
                else{ 
                    res.json({'method':'deviceStatusSet','data':{'event':'deviceStatusSet success'}, 'result':'true'});
                                
                }
				conn.end();
    });

});
//repairRecoeds Get
//維修清單

apiRoutes.post('/repairRecoedsGet', function(req,res){
    console.log('repairRecoeds...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT * FROM repairRecords", function (err, rows){
                if(err){
                        console.log("repairRecoeds... select users error="+err);
                        res.json({'method':'repairRecoeds','data':{'event':'paymentGetError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('repairRecoeds... '+rows);
                   
                    res.json({'method':'repairRecoeds','data':{'event':'repairRecoeds','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("repairRecoeds...not in users");
                    res.json({'method':'repairRecoeds','data':{'event':'repairRecoeds', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});


//paymentStatusUpdate
//付款->權限修改

apiRoutes.post('/paymentStatusUpdate', function(req,res){
    console.log('paymentStatusUpdate...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("update userData set review=? where pID=?",[req.body.review, req.body.pID], function (err, rows){
                if(err){
                        console.log("paymentStatusUpdate... select users error="+err);
                        res.json({'method':'paymentStatusUpdate','data':{'event':'paymentStatusUpdateError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('paymentStatusUpdate... '+rows);
                   
                    res.json({'method':'paymentStatusUpdate','data':{'event':'paymentStatusUpdate','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("paymentStatusUpdate...not in users");
                    res.json({'method':'paymentStatusUpdate','data':{'event':'paymentStatusUpdate', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});


//paymentInsert
//付款清單新增

apiRoutes.post('/paymentInsert', function(req,res){
    console.log('paymentInsert...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("insert into paymentRecords (cpID, invoiceID, review, oDateTime,cDateTime,paymentItems,paymentMethod) values (?,?,?,?,?,?,?)",[req.body.cpID, req.body.invoiceID, req.body.review, new Date(),null,req.body.paymentItems,req.body.paymentMethod], function (err, rows){
                if(err){
                        console.log("paymentInsert... select users error="+err);
                        res.json({'method':'paymentInsert','data':{'event':'paymentInsertError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('paymentInsert... '+rows);
                   
                    res.json({'method':'paymentInsert','data':{'event':'paymentInsert','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("paymentInsert...not in users");
                    res.json({'method':'paymentInsert','data':{'event':'paymentInsert', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});


//loginCpIDGet
//公司登入ID get

apiRoutes.post('/loginCpIDGet', function(req,res){
    console.log('loginCpIDGet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT * FROM cpData WHERE cpName=? and cpPassword=?",[req.body.cpName, req.body.cpPassword], function (err, rows){
                if(err){
                        console.log("loginCpIDGet... select users error="+err);
                        res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGetError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('loginCpIDGet... '+rows);
                   
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("loginCpIDGet...not in users");
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});



//loginCpIDGet


apiRoutes.post('/loginCpIDGet', function(req,res){
    console.log('loginCpIDGet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT * FROM cpData WHERE cpName=? and cpPassword=?",[req.body.cpName, req.body.cpPassword], function (err, rows){
                if(err){
                        console.log("loginCpIDGet... select users error="+err);
                        res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGetError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('loginCpIDGet... '+rows);
                   
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("loginCpIDGet...not in users");
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});

//cpDataAuthoritySet
apiRoutes.post('/cpDataAuthoritySet', function(req,res){
    console.log('loginCpIDGet...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("SELECT * FROM cpData WHERE cpName=? and cpPassword=?",[req.body.cpName, req.body.cpPassword], function (err, rows){
                if(err){
                        console.log("loginCpIDGet... select users error="+err);
                        res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGetError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('loginCpIDGet... '+rows);
                   
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("loginCpIDGet...not in users");
                    res.json({'method':'loginCpIDGet','data':{'event':'loginCpIDGet', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});



//repairRecodesSearch  可能會改
apiRoutes.post('/repairRecodesSearch', function(req,res){
    console.log('repairRecodesSearch...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("select* from repairRecords,(select sDeviceID FROM deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?)as a where repairRecords.deviceID=a.sDeviceID",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
                if(err){
                        console.log("repairRecodesSearch... select users error="+err);
                        res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearchError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('repairRecodesSearch... '+rows);
                   conn.query("SELECT sDeviceID FROM testDB2.deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
					   
				   });
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("repairRecodesSearch...not in users");
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});

//repairRecodesSearch  可能會改
apiRoutes.post('/repairRecodesSearch', function(req,res){
    console.log('repairRecodesSearch...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admi	n; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("select* from repairRecords,(select sDeviceID FROM deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?)as a where repairRecords.deviceID=a.sDeviceID",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
                if(err){
                        console.log("repairRecodesSearch... select users error="+err);
                        res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearchError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('repairRecodesSearch... '+rows);
                   conn.query("SELECT sDeviceID FROM testDB2.deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
					   
				   });
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("repairRecodesSearch...not in users");
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});


//repairRecodesSearch  完成付款修改權限
apiRoutes.post('/user', function(req,res){
    console.log('repairRecodesSearch...');
    var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admi	n; AWS: root
            password: 'ej03xu35k3',//ej03xu35k3
            database: 'testDB2',
            port: 3306
            //connectionLimit : 15
            });
        conn.connect();
        conn.query("select* from repairRecords,(select sDeviceID FROM deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?)as a where repairRecords.deviceID=a.sDeviceID",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
                if(err){
                        console.log("repairRecodesSearch... select users error="+err);
                        res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearchError', 'error':err}, 'result':'false'});
                return;
				}

                if(rows.length){
                    ///do sent date to client here///
                    console.log('repairRecodesSearch... '+rows);
                   conn.query("SELECT sDeviceID FROM testDB2.deviceData WHERE ucMFnumberA=? or ucMFnumberB=? or ucMFnumberC=? or ucMFnumberD=? or ucMFnumberE=?",[req.body.cpID, req.body.cpID,req.body.cpID,req.body.cpID,req.body.cpID], function (err, rows){
					   
				   });
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch','detail':rows}, 'result':'true'});
                    
                    
                }
                else{
                    console.log("repairRecodesSearch...not in users");
                    res.json({'method':'repairRecodesSearch','data':{'event':'repairRecodesSearch', 'error':'not in sportClass'}, 'result':'false'});
                    //var token = jwt.sign({data: req.body.username}, app.get('MySuperSecret'), { expiresIn: 60 * 60 * 24});// 1 hr
                }
        });        
            
                
});*/


app.use('/api', apiRoutes);

// API ROUTES -------------------


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
