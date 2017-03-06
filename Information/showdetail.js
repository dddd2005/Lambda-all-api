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
    
        var url,name;
        var queryString = 'SELECT * FROM PicStationData WHERE IDStation='+event.id;
    
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
         
            url = row[0].Link;
            console.log(url);
        });
        
        queryString = 'SELECT * FROM Station WHERE IDStation='+event.id;
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
         
            name = row[0].StationName;
            console.log(name);
             
        });
    
    
        connection.end();
        callback(null, [event.id,name,url]);  // Echo back 
    })

};
