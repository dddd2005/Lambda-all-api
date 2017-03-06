'use strict';

console.log('Loading function');
var mysql = require('mysql');
var sync = require('synchronize');
exports.handler = (event, context, callback) => {
    
    var connection = mysql.createConnection({
      host     : 'information1.cxyh2mj8vjjj.ap-southeast-1.rds.amazonaws.com',
      user     : 'PloyDB',
      password : 'Information',
      database : 'mydb'
    });
    //------------------------------------------

    sync(connection,'connect','query','end');
    
    sync.fiber(function(){
        connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }
         
          console.log('connected as id ' + connection.threadId);
        });
    
        var bts_normal,bts_RabbitStudent,bts_RabbitAdult;
        var queryString = 'SELECT * FROM FairBTS';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_normal = row;
            bts_RabbitStudent = row;
            bts_RabbitAdult = row;
        });
        
        var bts_extend;
        queryString = 'SELECT * FROM ExtendStation';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_extend = row;
        });
        
        var bts_RabbitSenior;
        queryString = 'SELECT * FROM CardFair WHERE CardType=3';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_RabbitSenior = row;
        });
        
        var bts_MaoStudent15;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=1 AND Round=15';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoStudent15 = row;
        });
        
        var bts_MaoStudent25;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=2 AND Round=25';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoStudent25 = row;
        });
        
        var bts_MaoStudent40;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=3 AND Round=40';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoStudent40 = row;
        });
        
        var bts_MaoStudent50;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=4 AND Round=50';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoStudent50 = row;
        });
        
        var bts_MaoAdult15;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=5 AND Round=15';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoAdult15 = row;
        });
        
        var bts_MaoAdult25;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=6 AND Round=25';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoAdult25 = row;
        });
        
        var bts_MaoAdult40;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=7 AND Round=40';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoAdult40 = row;
        });
        
        var bts_MaoAdult50;
        queryString = 'SELECT * FROM CardFair WHERE IdCardFair=8 AND Round=50';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bts_MaoAdult50 = row;
        });
        
        var mrt_normal,mrt_Adult;
        queryString = 'SELECT * FROM FairMRT';
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            mrt_normal = row;
            mrt_Adult = row;
        });
        
        var mrt_normalKid;
        queryString = 'SELECT * FROM CardFair WHERE CardType=42' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            mrt_normalKid = row;
        });
        
        var mrt_Kid;
        queryString = 'SELECT * FROM CardFair WHERE CardType=42' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            mrt_Kid = row;
        });
        
        var mrt_Student;
        queryString = 'SELECT * FROM CardFair WHERE CardType=41' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            mrt_Student = row;
        });
        
        var arl_normal,arl_Adult;
        queryString = 'SELECT * FROM FairARL' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            arl_normal = row;
            arl_Adult = row;
        });
        
        var arl_Student;
        queryString = 'SELECT * FROM CardFair WHERE CardType=46' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            arl_Student = row;
        });
        
        var arl_Senior;
        queryString = 'SELECT * FROM CardFair WHERE CardType=47' ;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            arl_Senior = row;
        });
        
        connection.end();
        callback(null, {bts_normal,bts_extend,bts_RabbitStudent,bts_RabbitAdult,bts_RabbitSenior,bts_MaoStudent15,bts_MaoStudent25,bts_MaoStudent40,bts_MaoStudent50,bts_MaoAdult15,bts_MaoAdult25,bts_MaoAdult40,bts_MaoAdult50,mrt_normal,mrt_normalKid,mrt_Adult,mrt_Kid,mrt_Student,arl_normal,arl_Adult,arl_Student,arl_Senior});  // Echo back 
    })

};
