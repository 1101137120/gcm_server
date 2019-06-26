// app/routes.js

var jwt = require('jsonwebtoken');

module.exports = function(app, passport) {

    ///test wechat post///
    // app.post('/wechatlogin',
    //     function(req, res) {
    //         console.log("hello, this is login2");
    //         var token = jwt.sign({
    //                         data: req.body.username
    //                     }, 'mySecret', { expiresIn: 60 * 60 });
    //         res.end(token);
            
    // });

    ///test wechat post///


    ///process login and return token///

    app.post('/login2', passport.authenticate('local-login', {}),
        function(req, res) {
            console.log("hello, this is login2");
            var token = jwt.sign({
                            data: req.body.username
                        }, 'mySecret', { expiresIn: 60 * 60 });
            res.end(token);
            
    });

    ///process login and return token///

    ///Test post with token
    app.post('/checkToken', checkToken, function(req, res) {

            res.json({'data':{'event':'checkSuccess'}, 'result':'true'}); //send json to client and show user info
        });

    ///Test post with token

	// process the login form
	app.post('/login', passport.authenticate('local-login', {}),
        function(req, res) {
            console.log("hello, userSID=");
            userSID = req.sessionID;
            console.log(userSID);
            res.end(req.sessionID);
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
    });

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {}), function(req, res){
		res.json({'method':'signup','data':{'event':'signupSuccess'}, 'result':'true'});
	});

	app.post('/profile/:UserName', passport.authenticate('local-login', {}), function(req, res) {
		
		console.log("user profile here: user="+ req.params.UserName);
		//===========================================================
		//select * from UserData where UserName = req.params.UserName
		//===========================================================
		var mysql = require('mysql');
		var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
		conn.connect();
		conn.query("select * from UserData where UserName = ? ", [req.params.UserName], function (err, rows){
            if(err){
                console.log("profile.UserName select UserData error="+err);
            	res.json({'method':'profile_UserName','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
            }

            if(rows.length){
            	    var jsonDate = {
            	    	'method':'profile_UserName',
            	    	'data':{
            	    		'event':'get UserData success',
            	    		'uClientID': rows[0].uClientID,
            	    		'UserName': rows[0].UserName,
            	    		'UserID': rows[0].UserID,
            	    		'UserPassword': rows[0].UserPassword,
            	    		'uCountry': rows[0].uCountry,
            	    		'uCity': rows[0].uCity,
            	    		'uAge': rows[0].uAge,
            	    		'uSex': rows[0].uSex,
            	    		'uHeight': rows[0].uHeight,
            	    		'uWeight': rows[0].uWeight,
                            'cname': rows[0].cname,
                            'BirthDay': rows[0].BirthDay
            	    	},
            	    	'result':'true'
            	    };
            	    res.json(jsonDate);

            	}

            
            else {
            	res.json({'method':'profile_UserName','data':{'event':'get UserData empty'}, 'result':'false'});
            }
		});

	    


	});

///////////////////////////////////////DeviceRecordInfo////////////////////////////////////
app.post('/DeviceRecordInfo/:action/:sActivityNo', passport.authenticate('local-login', {}), function(req, res) {

        console.log("isAuthenticated, DeviceRecordInfo...action="+req.params.action+" where="+req.params.sActivityNo);

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into DeviceRecordInfo ( DeviceRecordInfoID, sActivityNo, sActivityName) values (?,?,?)",[req.body.DeviceRecordInfoID, req.params.sActivityNo, req.body.sActivityName], function (err, rows){
                    if(err){
                        console.log("DeviceRecordInfo.PUT.sActivity insert DeviceRecordInfo error="+err); 
                        res.json({'mtehod':'DeviceRecordInfo_Update', 'data':{'event':'may have exist sActivityNo','error':err}, 'result':'false'});
                    }
                    else{ 
                        res.json({'mtehod':'DeviceRecordInfo_Update','data':{'event':'Insert New DeviceRecordInfo success'}, 'result':'true'});
                    }
                });

                }
                if(req.params.action == 'GET'){
                    
                    conn.query("select * from DeviceRecordInfo where sActivityNo = ? ", [req.params.sActivityNo], function (err, rows){
                        if(err){
                            console.log("DeviceRecordInfo.GET.sActivity select DeviceRecordInfo error="+err);
                            res.json({'mtehod':'DeviceRecordInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///
                            
                            res.json({'method':'DeviceRecordInfo_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'DeviceRecordInfo_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });


///////////////////////////////////////DeviceRecordInfo////////////////////////////////////


///////////////////////////////////////DeviceData/////////////////////////////////////////

   app.post('/DeviceData/:action/:sDeviceID', passport.authenticate('local-login', {}), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into DeviceData ( sDeviceID, sCatelog, sCidtVersion, sManufacter, sBrands, sModels, sSoftwareVersion, sActivityNo, sctivity, sDateTime, sTotalVileage, sWorkingTime) values (?,?,?,?,?,?,?,?,?,?,?,?)",[req.params.sDeviceID, req.body.sCatelog, req.body.sCidtVersion, req.body.sManufacter, req.body.sBrands, req.body.sModels, req.body.sSoftwareVersion, req.body.sActivityNo, req.body.sctivity, req.body.sDateTime, req.body.sTotalVileage, req.body.sWorkingTime], function (err, rows){
                    if(err){ 
                        console.log("Insert New RtInfo error"+ err);
                        res.json({'mtehod':'DeviceData_Update','data':{'event':'Insert New DeviceData error','error':err}, 'result':'false'});
                    }
                    else{ 
                        res.json({'mtehod':'DeviceData_Update','data':{'event':'Insert New DeviceData success'}, 'result':'true'});
                    }
                });

                }
                if(req.params.action == 'GET'){

                    conn.query("select * from DeviceData where sDeviceID = ? ", [req.params.sDeviceID], function (err, rows){
                        if(err){
                            console.log("DeviceData select error ="+err);
                            res.json({'mtehod':'DeviceData_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'DeviceData_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'DeviceData_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });

///////////////////////////////////////DeviceData/////////////////////////////////////////

/////////////////////////RtInfoSum uClient & date/////////////////////////////////////////

app.post('/RtInfoSum/DateuClientID/:action/:timeA/:timeB/:uClientID', passport.authenticate('local-login', {
            
        }), function(req, res) {

        console.log("isAuthenticated, RtInfoSum...action="+req.params.action+" time="+req.params.timeA+" to"+req.params.timeB);

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    res.json({'method':'no api'});
                }
                if(req.params.action == 'GET'){

                    conn.query("select * from RtInfoSum where uClientID=?  and StartTime between ? and ? ", [req.params.uClientID ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum DateuClientID timaA timeB uClientID select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });


/////////////////////////RtInfoSum uClient & date/////////////////////////////////////////

//////////////////////////////////////RtInfoSum dEncoding & uClientID/////////////////////


app.post('/RtInfoSum/dEncodinguClientID/:action/:dEncoding/:uClientID', passport.authenticate('local-login', {
            
        }), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    res.json({'method':'no api'});
                }
                if(req.params.action == 'GET'){
                    console.log('GET here');
                    ////
                    conn.query("select * from RtInfoSum where uClientID=? and dEncoding = ?", [req.params.uClientID ,req.params.dEncoding], function (err, rows){
                        if(err){
                            console.log("RtInfoSum dEncodinguClientID select error="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });

//////////////////////////////////////RtInfoSum dEncoding & uClientID/////////////////////

///////////////////////////////////////RtInfoSum Day & dEncoding select///////////////////


app.post('/RtInfoSum/:action/:timeA/:timeB/:dEncoding/:uClientID', passport.authenticate('local-login', {
            
        }), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    res.json({'method':'no api'});
                }
                if(req.params.action == 'GET'){
                    
                    ////
                    conn.query("select * from RtInfoSum where uClientID=? and dEncoding = ? and StartTime between ? and ? ", [req.params.uClientID ,req.params.dEncoding ,req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum timeA timeB uClietn dEncoding select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });


///////////////////////////////////////RtInfoSum Day & dEncoding select///////////////////

///////////////////////////////////////RtInfoSum Day select///////////////////////////////
app.post('/RtInfoSum/:action/:timeA/:timeB', passport.authenticate('local-login', {
            
        }), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    res.json({'method':'no api'});
                }
                if(req.params.action == 'GET'){
                  
                    ////
                    conn.query("select * from RtInfoSum where StartTime between ? and ? ", [req.params.timeA, req.params.timeB], function (err, rows){
                        if(err){
                            console.log("RtInfoSum timeA timeB select error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });


///////////////////////////////////////RtInfoSum Day select///////////////////////////////


////////////////////////////////////////RtInfoSum/////////////////////////////////////////
app.post('/RtInfoSum/:action/:dEncoding', passport.authenticate('local-login', {
            
        }), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into RtInfoSum ( dEncoding, SportsTime, Miles, Cal, Watt, MaxWatt, MaxR, MaxS, MaxH, rtRD, AW, AR, ASS,AH,StartTime, uClientID) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.params.dEncoding, req.body.SportsTime, req.body.Miles, req.body.Cal, req.body.Watt, req.body.MaxWatt, req.body.MaxR, req.body.MaxS, req.body.MaxH, req.body.rtRD, req.body.AW, req.body.AR, req.body.ASS, req.body.AH, req.body.StartTime, req.body.uClientID], function (err, rows){
                    if(err){ 
                        console.log("RtInfoSum dEncoding PUT error = "+ err);
                        res.json({'mtehod':'RtInfoSum_Update','data':{'event':'Insert New RtInfoSum success error','error':err}, 'result':'false'});
                    }
                    else{ 
                        res.json({'mtehod':'RtInfoSum_Update','data':{'event':'Insert New RtInfoSum success'}, 'result':'true'});
                    }
                });

                }
                if(req.params.action == 'GET'){
                    
                    conn.query("select * from RtInfoSum where dEncoding = ? ", [req.params.dEncoding], function (err, rows){
                        if(err){
                            console.log("RtInfoSum dEncoding GET error ="+err);
                            res.json({'mtehod':'RtInfoSum Get','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfoSum_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfoSum_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });

////////////////////////////////////////RtInfoSum/////////////////////////////////////////

////////////////////////////////////////RtInfo////////////////////////////////////////////
    app.post('/RtInfo/:action/:dEncoding', passport.authenticate('local-login', {
            
        }), function(req, res) {

        console.log("isAuthenticated, RtInfo...action="+req.params.action+" where="+req.params.dEncoding);

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    
                    conn.query("insert into RtInfo ( dEncoding, rtDate, rtTime, rtHeartBeat, rtMiles, rtSPD, rtCounts, rtSPM, rtCal, rtRD, rtIncline, rtWatt, rtTorque, rtIntensity, rtWeight) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.params.dEncoding, req.body.rtDate, req.body.rtTime, req.body.rtHeartBeat, req.body.rtMiles, req.body.rtSPD, req.body.rtCounts, req.body.rtSPM, req.body.rtCal, req.body.rtRD, req.body.rtIncline, req.body.rtWatt, req.body.rtTorque, req.body.rtIntensity, req.body.rtWeight], function (err, rows){
                    if(err){ 
                        console.log("RtInfo dEncoding insert error"+ err);
                        res,json({'mtehod':'RtInfo_Update','data':{'event':'RtInfo_Update error','error':err}, 'result':'false'});
                    }
                    else{ 
                        
                        res.json({'mtehod':'RtInfo_Update','data':{}, 'result':'true'});
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
                    
                    for (var key in obj5.contents) {
                        console.log("obj5 Key: " + key);
                        console.log("obj5 Value: " + obj5.contents[key].rtDate);
                        //put data to mysql
                        conn.query("insert into RtInfo ( dEncoding, rtDate, rtTime, rtHeartBeat, rtMiles, rtSPD, rtCounts, rtSPM, rtCal, rtRD, rtIncline, rtWatt, rtTorque, rtIntensity, rtWeight) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.params.dEncoding, obj5.contents[key].rtDate, obj5.contents[key].rtTime, obj5.contents[key].rtHeartBeat, obj5.contents[key].rtMiles, obj5.contents[key].rtSPD, obj5.contents[key].rtCounts, obj5.contents[key].rtSPM, obj5.contents[key].rtCal, obj5.contents[key].rtRD, obj5.contents[key].rtIncline, obj5.contents[key].rtWatt, obj5.contents[key].rtTorque, obj5.contents[key].rtIntensity, obj5.contents[key].rtWeight], function (err, rows){
                            if(err){ 
                                console.log("Insert New RtInfo error"+ err);
                                errorlog=errorlog+err;
                            }
                            else{ 
                                console.log("Insert New RtInfo success");
                                //res.json({'mtehod':'RtInfo_Update','data':{}, 'result':'true'});
                            }
                        });

                        //end put data to mysql
                    }

                    if(errorlog == 'none error'){res.json({'mtehod':'RtInfo_Update','data':{'event':'MSPUT Success'}, 'result':'true'});}
                    else{
                        res.json({'mtehod':'RtInfo_Update','data':{'event':errorlog}, 'result':'false'});
                    }

                }


                //end sum data insert/////

                //start sum get///
                //end massive get/////
                if(req.params.action == 'GET'){
                    console.log('GET here');
                    ////
                    conn.query("select * from RtInfo where dEncoding = ? ", [req.params.dEncoding], function (err, rows){
                        if(err){
                            console.log("RtInfo dEncoding select error ="+err);
                            res.json({'method':'RtInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtInfo_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtInfo_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });

////////////////////////////////////////RtInfo////////////////////////////////////////////


////////////////////////////////////////RtSInfo///////////////////////////////////////////

app.post('/RtSInfo/:action/:dEncoding', passport.authenticate('local-login', {
            
        }), function(req, res) {

        var mysql = require('mysql');
        var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
        conn.connect();
                if(req.params.action == 'PUT'){
                    conn.query("insert into RtSInfo ( dEncoding, rtDate, rtTime, rtMStatus, rtSurroundings) values (?,?,?,?,?)",[req.params.dEncoding, req.body.rtDate, req.body.rtTime, req.body.rtMStatus, req.body.rtSurroundings], function (err, rows){
                    if(err){ 
                        console.log("Insert New RtSInfo error = "+ err);
                        res.json({'mtehod':'RtSInfo_Update','data':{'event':'RtSInfo_Update error','error':err}, 'result':'false'});
                    }
                    else{ 
                        res.json({'mtehod':'RtSInfo_Update','data':{}, 'result':'true'});
                    }
                });

                }
                if(req.params.action == 'GET'){
                    
                    ////
                    conn.query("select * from RtSInfo where dEncoding = ? ", [req.params.dEncoding], function (err, rows){
                        if(err){
                            console.log("RtsInfo dEncoding select error ="+err);
                            res.json({'method':'RtSInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
                        }

                        if(rows.length){
                            ///do sent date to client here///

                            res.json({'method':'RtSInfo_GET','data':{'rows':rows}, 'result':'true'});

                            ///do sent date to client here///
                        }
                        else{res.json({'method':'RtSInfo_GET','data':{'event':'empty'}, 'result':'true'});}
                    });
                    ////


                } 
                
        

    });

////////////////////////////////////////RtSInfo///////////////////////////////////////////

////////////////////////////////////////SportsInfo////////////////////////////////////////

//UserData/PUT/GET/DELETE with UserName
	app.post('/SportsInfo/:action/:who', passport.authenticate('local-login', {
            
		}), function(req, res) {

	    var mysql = require('mysql');
		var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
		conn.connect();
            	if(req.params.action == 'PUT'){
            		
            		conn.query("insert into SportsInfo ( DataName, dStartDate, dStartTime, dExerciseTime, uClientID, sDeviceID, dEncoding, dUnits, rtAppMessage, sActivityNo) values (?,?,?,?,?,?,?,?,?,?)",[req.body.DataName, req.body.dStartDate, req.body.dStartTime, req.body.dExerciseTime, req.body.uClientID, req.body.sDeviceID, req.body.dEncoding, req.body.dUnits, req.body.rtAppMessage, req.body.sActivityNo], function (err, rows){
            		if(err){ 
                        console.log("Insert New SportsInfo error"+ err);
                        res.json({'mtehod':'SportsInfo_Update','data':{'event':'SportsInfo_Update error','error':err}, 'result':'false'});
                    }
            		else{ 
            			
            			res.json({'mtehod':'SportsInfo_Update','data':{}, 'result':'true'});
            		}
            	});

            	}
            	if(req.params.action == 'GET'){
            		console.log('GET here');
            		////
            		conn.query("select * from SportsInfo where uClientID = ? ", [req.params.who], function (err, rows){
            			if(err){
                            console.log("SportsInfo_GET error="+err);
            			    res.json({'method':'SportsInfo_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
            			}

            			if(rows.length){
            				///do sent date to client here///

            				res.json({'method':'SportsInfo_GET','data':{'rows':rows}, 'result':'true'});

            				///do sent date to client here///
            			}
            			else{res.json({'method':'SportsInfo_GET','data':{'event':'empty'}, 'result':'true'});}
            		});
            		////


            	} 
            	
		

	});

////////////////////////////////////////SportsInfo////////////////////////////////////////





//////////////////////////////////////UserData/////////////////////////////////////////////

	//UserData/PUT/GET/DELETE with UserName
	app.post('/UserData/:action/:where', passport.authenticate('local-login', {
		}), function(req, res) {

		console.log("isAuthenticated, UserData...action="+req.params.action+" where="+req.params.where);
	    
	    //========================================================
	    //select * from UserData where UserName = req.params.where
	    //if empty, insert new row; else update row or delete row
	    //========================================================

	    var mysql = require('mysql');
		var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
		conn.connect();
		conn.query("select * from UserData where UserName = ? ", [req.params.where], function (err, rows){
            if(err){
                console.log("UserData select error ="+err);
            	res.json({'method':'UserData_GET','data':{'event':'SelectUserDataError', 'error':err}, 'result':'false'});
            }

            if(rows.length){

            	//res.json({'data':{'event':'UserNameExist'}, 'result':'true'});
            	//UserNameExist do update or delete data here or 
            	if(req.params.action == 'PUT'){
            		
            		var updateQuery = "update UserData set UserID = ?, UserPassword=?, uCountry=?, uCity=?, uAge=?, uSex=?, uHeight=?, uWeight=?, cname=?, BirthDay=? where UserName=?";
            		conn.query(updateQuery,[req.body.UserID, req.params.where, req.body.uCountry, req.body.uCity, req.body.uAge, req.body.uSex, req.body.uHeight, req.body.uWeight, req.body.cname, req.body.BirthDay,req.params.where], function (err, rows){
            			if(err){ 
                            console.log("Update UserData error="+err);
                            res.json({'method':'UserData_PUT','data':{'event':'UserData_PUT error','error':err}, 'result':'false'});
                        }
            			else{
                            
                            res.json({'method':'UserData_PUT','data':{'event':'UserData_PUT success'}, 'result':'true'});
                        }
            		});

            	}
            	if(req.params.action == 'DELETE'){
            		console.log('DELETE here');

            	} 
            	if(req.params.action !== 'PUT' && req.params.action !== 'DELETE'){
            		res.json({'method':'UserData_NotAllowAction','data':{'event':'UserNameExist', 'detail':'not in action list'}, 'result':'false'});
            	}


            }
            else {
            	//res.json({'data':{'event':'NewUser'}, 'result':'true'});
            	//NewUser, do Insert new row here
            	console.log('New User, insert new row here');
            	conn.query("insert into UserData ( UserName, UserID, UserPassword, uCountry, uCity, uAge, uSex, uHeight, uWeight) values (?,?,?,?,?,?,?,?,?)",[req.params.where, req.body.UserID, req.params.where, req.body.uCountry, req.body.uCity, req.body.uAge, req.body.uSex, req.body.uHeight, req.body.uWeight], function (err, rows){
            		if(err){ 
                        console.log("UserData Insert NewUser error = "+ err);
                        res.json({'method':'UserData_NewUser_Insert','data':{'event':err},'result':'false'});
                    }
            		else{ 
                        
                        res.json({'method':'UserData_NewUser_Insert','data':{'event':'Insert NewUser Success'},'result':'true'});
                    }
            	});
            }
		});
		//conn.end();


	});

//////////////////////////////////////UserData/////////////////////////////////////////////

	app.post('/profileSetting', passport.authenticate('local-login', {}), function(req, res){
	        //do profileSetting and Query testDB 
		var mysql = require('mysql');
		var conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',  //local : admin; AWS: root
            password: 'ej03xu35k3',
            database: 'testDB',
            port: 3306
            });
		    conn.connect();

        //check username here if needed
        //Select * from table where username = req.body.username
		var insertQuery = "INSERT INTO profileSetting ( uCountry, uAge, username ) values (?,?,?)";
        conn.query(insertQuery,[req.body.uCountry, req.body.uAge, req.body.username],function(err, rows) {
        
        if (err) {
            console.log("profileSetting insert error ="+err);
        	res.json({'data':{'event':'profileSetting_insert', 'error':err, 'detail':req.user.username }, 'result':'false'});
        }

        else{
        	
            var logFromPassportReqUser = '';
            var logFromPost = '';
            for(var key in req.user){
            	logFromPassportReqUser = logFromPassportReqUser+req.user[key];
            }
            for(var key in req.body){
            	logFromPost = logFromPost+req.body[key];
            }
            res.json({'data':{'event':'profileSetting_insert', 'rows':rows, 'PassPortDetail':logFromPassportReqUser, 'PostDetail':logFromPost}, 'result':'true'});

        }

       // conn.end();

                        
        });
	        ////
		

	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
    app.post('/logout', function(req, res){
        req.logout();
        req.sessionID.destroy();
        reSetSid();
        res.json({
        	'data':{
                'event':'logout'
            }, 
            'result':'true'});
    });

	app.get('/logout', function(req, res) {
		req.logout();
		req.sessionID.destroy();
		//res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		//return next();
		res.json({'isAuthenticated':'yes'});
	}
		

	// if they aren't redirect them to the home page
	//res.redirect('/');
	res.json({'data':{'event':'sidFail'}, 'result':'false'});// if unauthenticated, send json to client
}

function checkToken(req, res, next){

	var checkToken = req.body.token || req.query.token || req.headers['x-access-token'];
    //check jwt token here
    if (checkToken) {
        jwt.verify(checkToken, 'mySecret', function(err, decoded) {
        if (err) {
            return res.json({ success: false, message: 'token信息错误.', 'error':err});
        } else {
            // success and decode

            console.log("success check");
            var decoded = jwt.decode(checkToken, {complete: true});
            console.log("decoded.header= "+decoded.header.data);
            console.log("decoded.payload= "+decoded.payload.data);//decode message check here with username
            
            //if the token success, check the db user.token match or not. if match ok, else send error.
            if(req.body.username !== decoded.payload.data){
                console.log("username = "+req.body.username+" decoded.payload.data = "+decoded.payload.data);
                return res.json({'event':'fail with username'});
            }
            next();
        }
    });
    } else {
        // no token return 403 
        return res.status(403).send({
            success: false,
            message: 'No token'
        });
    }

}





