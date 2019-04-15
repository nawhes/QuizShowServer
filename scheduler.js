var schedule = require('node-schedule');
var FCM = require('fcm-node')
    
// var serverKey = require('path/to/privatekey.json') //put the generated private key path here    
// var fcm = new FCM(serverKey);

exports.addSchedule = function (date, kind, prize) {
    var year = date.substring(0, 4);
    var month = date.substring(4, 6);
    var day = date.substring(6, 8);
    var hour = date.substring(8, 10);
    var min = date.substring(10, 12);
    var sec = date.substring(12, 14);
    console.log(year + ',' + month + ", " + day + ", " + + min + ", " + sec);
    var date = new Date(year, month - 1, day, hour, min, sec);

    schedule.scheduleJob(date, function(){ 
        console.log('퀴즈쇼가 시작됩니다.'); 
        // sendMessageToDevice();
    });
}

function sendMessageToDevice() {
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'registration_token', 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    }
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!")
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}