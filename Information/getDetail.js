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
    
        var bus;
        var queryString = 'SELECT * FROM Bus WHERE IDStation='+event.id;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            bus = row;
        });

        var time;
        queryString = 'SELECT * FROM ServiceTime WHERE StationID='+event.id;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            time = row;
        });
        
    
        connection.end();
        callback(null, {bus,time});  // Echo back 
    })

};
