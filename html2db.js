/**
 * Created by usama on 4/25/2017.
 */
var express = require('express');
var app = express();
var mysql      = require('mysql');
//var json2html =  require('json-to-htmltable');
const path = require('path');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'usama999',
    database:'phoneorder'
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected successfully');
})


console.log(app.method);
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/client.html'));

});



app.listen(3001)



