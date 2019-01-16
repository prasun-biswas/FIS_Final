var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var fs=require('fs');
var mysql      = require('mysql');
// var xmler = require('node-xmler');

var index = require('./routes/index');
var users = require('./routes/users');
// var WS_Agent = require('./WS_Agent');
// var Pallet_Agent = require('./Pallet_Agent');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hostname = 'localhost';
var port = 4444;
// const path = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '256470',
    database:'phoneorder'
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected successfully');
})

app.get('/index', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//---------to receive data from HTML input
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/Order.html'));
});
var ocus_name;
var ocus_phone;
var oFrame;
var oFrame_color;
var oScreen;
var oScreen_color;
var oKeyboard;
var oKeyboard_color;
function setOFrame(Frame) {
    if (Frame==1||Frame==2||Frame==3){
        oFrame=Frame;
        console.log("Frame type "+Frame);
    }
    else {
        console.log("something wrong with Frame type")
    }

}
function setOFrame_color(Frame_color) {
    oFrame_color=Frame_color;
    console.log(oFrame_color);
}
function setOScreen(Screen) {
    if(Screen==4){
        oScreen=Screen;
        console.log("Screen type 1");}
    else if(Screen==5){
        oScreen=Screen;
        console.log("Screen type 2");}
    else if(Screen==6){
        oScreen=Screen;
        console.log("Screen type 3");}
    else{console.log("something wrong with Screen type")}

}
function setOScreen_color(Screen_color) {
    oScreen_color=Screen_color;
    console.log(oScreen_color);
}
function setOKeyboard(Keyboard) {
    if(Keyboard==7){
        oKeyboard=Keyboard;
        console.log("Keyboard type 1");}
    else if(Keyboard==8){
        oKeyboard=Keyboard;
        console.log("Keyboard type 2");}
    else if(Keyboard==9){
        oKeyboard=Keyboard;
        console.log("Keyboard type 3");}
    else{console.log("something wrong with Keyboard type")}

}
function setOKeyboard_color(Keyboard_color) {
    oKeyboard_color=Keyboard_color;
    console.log(oKeyboard_color);
}

function setOcus_name(cus_name){
    ocus_name=cus_name;
    console.log(ocus_name);
}
function setOcus_phone(cus_phone){
    ocus_phone=cus_phone;
    console.log(ocus_name);
}
function getOFrame(){
    return oFrame;
}








app.post('/spec',function (req,res) {
    console.log('in');
    var cus_phone=req.body.cus_phone;
    var cus_name=req.body.cus_name;
    var Frame = req.body.Frame;
    var Frame_color = req.body.Frame_color;
    var Screen = req.body.Screen;
    var Screen_color = req.body.Screen_color;
    var Keyboard = req.body.Keyboard;
    var Keyboard_color = req.body.Keyboard_color;
    // setOcus_name(cus_name);
    // setOcus_phone(cus_phone);
    // setOFrame(Frame);
    // setOFrame_color(Frame_color);
    // setOScreen(Screen);
    // setOScreen_color(Screen_color);
    // setOKeyboard(Keyboard);
    // setOKeyboard_color(Keyboard_color);
    var sql = `INSERT INTO phoneorders (Name, Phone_No, Frame, FrameColor, Screen, ScreenColor, Keyboard, KeyboardColor) VALUES ('${cus_name}','${cus_phone}','${Frame}','${Frame_color}','${Screen}','${Screen_color}','${Keyboard}','${Keyboard_color}')`;
    console.log(sql);
    connection.query(sql, function (error, result){
        if (error) {
            console.log(error);
            console.log('Error while Performing Query');

            if (error) {
                console.log('Error while Performing Query');
                //     res.writeHead(404, {'Content-Type': 'text/html'});
                //     res.write("<html><head>");
                //     res.write("<style>");
                //     res.write("body {")
                //     res.write("    background-image: url('https://s2.postimg.org/sbbwyyf55/Background2.jpg');");
                //     res.write("    -webkit-background-size: cover;");
                //     res.write("    -moz-background-size: cover;");
                //     res.write("    -o-background-size: cover;");
                //     res.write("    background-size: cover;}");
                //     res.write("</style>");
                //     res.write("</head><body><h1>Error While Placing Order</h1>");
                //     res.write("<br><br>Please try again. To go back to the home screen Click <a href='/'>here</a></body></html>")
            }
            res.end();
        }else{
            console.log(result);
            res.end();
        }
    });
});





app.post('/notifs',function (req,res) {
    console.log("request arrived");
    console.log(req.body.id+" "+req.body.senderID + " "+req.body.payload.PalletID);

        io.emit('chat message', req.body);
        res.end();
});


//----------------------------------------
app.use('/', index);
app.use('/users', users);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




// io.on('connection', function(socket) {
//     console.log('connected');
// });
server.listen(port, hostname, function () {
    console.log("server listening at " + port);
});



//-------------workstations

var Workstation=function Workstation (capability) {
    this.capability= capability;
    console.log(this.capability);
    // this.portID=port;
    // this.stationID=station;
}

Workstation.prototype.operateServer=function(port,station){
    var express=require('express');
    var app=express();
    var bodyParser = require('body-parser');
    var http = require('http').Server(app);
    var logger = require('morgan');
    var request = require('request');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    request.post('http://localhost:3000/RTU/SimROB'+station+'/events/PenChanged/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimROB'+station+'/events/DrawStartExecution/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimROB'+station+'/events/DrawEndExecution/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});

    request.post('http://localhost:3000/RTU/SimCNV'+station+'/events/Z1_Changed/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimCNV'+station+'/events/Z2_Changed/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimCNV'+station+'/events/Z3_Changed/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimCNV'+station+'/events/Z4_Changed/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});
    request.post('http://localhost:3000/RTU/SimCNV'+station+'/events/Z5_Changed/notifs',{form:{destUrl:"http://localhost:4444/notifs"}}, function(err,httpResponse,body){console.log(port+' hi '+station);});

    app.listen(port,function () {
        //var ref=this;
        console.log("stat inside WS is "+station);
    });

}

var WS_8=new Workstation("RED");
WS_8.operateServer(4008,8);
//-------------------------





// module.exports = app;


