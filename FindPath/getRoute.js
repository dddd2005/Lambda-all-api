'use strict';

console.log('Loading function');
var distance = require('google-distance');
var request = require('request');
var asyn = require('async');
const Graph = require('node-dijkstra');
const graph = new Graph();
distance.apiKey = 'AIzaSyDqt_4ji4n1IIwBNdJEtzwtoaMpbjPGuv8';
function weight(e) { return g.edge(e); }

exports.handler = (event, context, callback) => {
request('https://7x77tkt0pg.execute-api.ap-southeast-1.amazonaws.com/prod/getstation', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    var input = 0 ;
    request('https://7x77tkt0pg.execute-api.ap-southeast-1.amazonaws.com/prod/getmap', function (error, response, body) {
      var route = JSON.parse(body);
      request('https://7x77tkt0pg.execute-api.ap-southeast-1.amazonaws.com/prod/getprice', function (error, response, body) {
        var card = JSON.parse(body);
        var index = 0;
        var dis_source = [];
        var dis_dest = [];
        var way = [];
        var data = {index:0, origin:'' , destination:'' , mode:'driving'};
        var pos_source = {LAT : event.srclat, LNG : event.srclng};
        var pos_dest = {LAT : event.dstlat, LNG : event.dstlng};

        //source
        var cal = [];
        var cal_data = [0,0];
        for(var i = 0; i <info.length; i++){
          cal_data = [info[i].IDStation,Math.sqrt(Math.pow(info[i].LNG-pos_source.LNG,2) + Math.pow(info[i].LAT-pos_source.LAT,2))] ;
          cal.push(cal_data);
        }
        cal.sort(function(a, b) {
          return a[1] - b[1]
        })

        cal.splice(3,cal.length-3);
        var source = [];
        var source_index = 0;
        for(var i = 0; i < cal.length; i++)
          for(var j = 0; j < info.length; j++)
            if(cal[i][0] == info[j].IDStation ){
              source.push(info[j]);
              break;
            }

        cal.splice(0,cal.length-1); //clear data
        //des
        for(var i = 0; i <info.length; i++){
          cal_data = [info[i].IDStation,Math.sqrt(Math.pow(info[i].LNG-pos_dest.LNG,2) + Math.pow(info[i].LAT-pos_dest.LAT,2))] ;
          cal.push(cal_data);
        }
        cal.sort(function(a, b) {
          return a[1] - b[1]
        })
        cal.splice(3,cal.length-3);

        var des = [];
        var des_index = 0;
        for(var i = 0; i < cal.length; i++)
          for(var j = 0; j < info.length; j++)
            if(cal[i][0] == info[j].IDStation )
              des.push(info[j]);


        //google map api

        asyn.eachSeries(source, function(info, next){
          data.index = info.IDStation;
          data.origin = pos_source.LAT + ',' + pos_source.LNG;
          data.destination = info.LAT + ',' + info.LNG;
          distance.get(data,function(err, tmp) {
            dis_source.push(tmp);
            next();
          })
        },
        function(){
          dis_source.sort(function(a,b) {
            return a.distanceValue - b.distanceValue;
          });
          asyn.eachSeries(des, function(info, next){
            data.index = info.IDStation;
            data.origin = pos_dest.LAT + ',' + pos_dest.LNG;
            data.destination = info.LAT + ',' + info.LNG;
            distance.get(data,function(err, tmp) {
              dis_dest.push(tmp);
              next();
            })
          },
          function(){
            dis_dest.sort(function(a,b) {
              return a.distanceValue - b.distanceValue;
            });
            var lat_source;
            var lng_source;
            var lat_dest;
            var lng_dest;
            var index_source;
            var index_dest;
            var name_source;
            var name_dest;

            for(var i = 0; i < info.length; i++){
              if(info[i].IDStation == dis_source[0].index){
                lat_source = info[i].LAT;
                lng_source = info[i].LNG;
                index_source = info[i].IDStation + "";
                name_source = info[i].StationName + "";
              }
              if(info[i].IDStation == dis_dest[0].index){
                lat_dest = info[i].LAT;
                lng_dest = info[i].LNG;
                index_dest = info[i].IDStation + "";
                name_dest = info[i].StationName + "";
              }
            }
            data.index = 0;
            data.origin = lat_source + ',' + lng_source;
            data.destination = lat_dest + ',' + lng_dest;
            distance.get(data,function(err, tmp) {

              //when normal way is better


              for(var i = 0; i < info.length+5; i++){
                way.push("{");
              }
              for(var i = 0; i < route.length; i++){
                way[route[i].Station1-1] += '"' + route[i].Station2 + '":1,';
                way[route[i].Station2-1] += '"' + route[i].Station1 + '":1,';
              }

              for(var i = 0; i <info.length+5; i++){
                var tmp = ""+way[i];
                var size = tmp.length;
                way[i] = tmp.substring(0, size-1);
                way[i] += "}";
              }

              var check;
              var shortest;
              for(var i = 0; i <info.length+5; i++){
                var tmp = ""+way[i];
                if(tmp.length>2){ //avoid null data
                  var t = JSON.parse(way[i]);
                  var index = ""+ (i+1);
                  graph.addNode(index,t);
                }
              }
              console.log(graph.path('46','47'));
              console.log(graph.path(index_source,index_dest));
              shortest = graph.path(index_source,index_dest);
              var first,second,check = true,count,state, total;
              
              var send = {
                  "from_station": "",
                  "from_station_id": 0,
                  "to_station": "",
                  "to_station_id": 0,
                  "total_cost": 0,
                  "routes": [],
                  "error":""
              };
              if(dis_source[0].distanceValue + dis_dest[0].distanceValue >= tmp.distanceValue){
                send.error = "no"
              }
              send.from_station = name_source;
              send.to_station = name_dest;
              send.from_station_id = index_source;
              send.to_station_id = index_dest;
              var data ={
                "step": 0,
                "from": "",
                "from_type": "",
                "to": "",
                "to_type": "",
                "cost": 0
              }
              count = 0;
              var passed = false;
              var total = 0, summary = 0;
              for(var i = 1; i < shortest.length; i++){
                first = i -1;
                second = i;
                for(var j = 0; j < info.length; j++){
                  if(shortest[first] == info[j].IDStation)
                    first = info[j];
                  if(shortest[second] == info[j].IDStation)
                    second = info[j];
                }
                if(first.Type == second.Type){
                  count++;
                  if(first.Type == "BTS"){
                    if(count >= card.bts_normal.length-1)
                      count = card.bts_normal.length-1;
                    if(event.bts == 3)
                      total = card.bts_RabbitSenior[count].Fair
                    else
                      total = card.bts_normal[count].Fair
                  }
                  if(first.Type == "MRT"){
                    if(count >= card.mrt_normal.length-1)
                      count = card.mrt_normal.length-1;

                    if((event.mrt == 0 && event.status == 1) || event.mrt==2)
                      total = card.mrt_normalKid[count].Fair
                    else  if(event.mrt == 3)
                      total = card.mrt_normalKid[count].Fair
                    else
                      total = card.mrt_normal[count].Fair
                  }
                  if(first.Type == "ARL"){
                    if(count >= card.arl_normal.length-1)
                      count = card.arl_normal.length-1;
                    if(event.arl == 2)
                      total = card.arl_Student[count].Fair
                    else if(event.arl == 3)
                      total = card.arl_Senior[count].Fair
                    else
                      total = card.arl_normal[count].Fair
                  }
                }
                else {
                  summary += total;
                  total = 0;
                  count = 0;
                }
                data.step = i;
                data.from = first.StationName;
                data.from_type = first.Type;
                data.to = second.StationName;
                data.to_type = second.Type;
                data.cost = summary + total;
                send.routes.push(JSON.parse(JSON.stringify(data)));
              }
              send.total_cost = summary + total;
              console.log(card)
              callback(null, send);
            })
          })
        })
      })
    })
  }
})

};
