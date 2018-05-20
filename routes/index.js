var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
});


var firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "serviceAccountKey.json",
    databaseURL: "https://iotdemo-f09e4.firebaseio.com"
});
var controlRef = firebase.database().ref('control');

function firebaseSwitch(state){
    switch(state){
        case 1: 
            controlRef.set({
                state: state,
                light1: 1
            });
            port.write('1'); 
            break;
        case 2:
            controlRef.set({
                state: state,
                light1: 0
            });
            port.write('2'); 
            break;            
    }
}

controlRef.on('value',function(snapshot){
    firebaseSwitch(snapshot.val().state);
    console.log(snapshot.val().state);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/1', function(req, res, next) {
    firebaseSwitch(1);
    res.render('index', { title: 'Express' });
});

router.get('/2', function(req, res, next) {
    firebaseSwitch(2);
    res.render('index', { title: 'Express' });
});



module.exports = router;
