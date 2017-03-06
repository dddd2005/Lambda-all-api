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
    
        var allstation;
        var queryString = 'SELECT * FROM Station';
    
        connection.query(queryString, function(err, row, fields) {
            if (err) throw err;
            allstation = row;
            // console.log(allstation);
        });
        
        connection.end();
        callback(null, allstation);  // Echo back 
    })

};
