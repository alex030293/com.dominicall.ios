var express = require('express');
var router = express.Router();
var config = require('./../config');
var Parse = require('parse').Parse;

//Remove globals, send number in post
var fromNumber;

router.get('/', function(request, response) {
    response.render('index', {title: "hue"});
});

// Handle an AJAX POST request to place an outbound call
router.post('/call', function(request, response) {
    console.log('------------------------------------------------------------------------------');
    fromNumber = request.body.From;
    var from = request.body.From;
    var to = request.body.To;


    console.log('[CALL]     ' + from + ' -> ' + to);
    var res = "";

    //international forwarding
    if (to === "+34911980567") {
        res = ('<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/endCall" timeout="20" record="false" callerId="+18299479006">+18299226595</Dial></Response>');
    } else if (to === "+18299479006") {
        res = ('<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/endCall" timeout="20" record="false" callerId="+18299479006">+34603847010</Dial></Response>');
    } else if (config.whitelist.indexOf(from) > -1) {
    //read number.
        res = ('<?xml version="1.0" encoding="UTF-8"?><Response><Gather action="/makeCall" numDigits="13" timeout="20"></Gather></Response>');
    } else {
        res = ('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="es-es">No puedes hacer llamadas desde este número.</Say></Response>');
    }

    response.send(res);
});

// Return TwiML instuctions for the outbound call
router.post('/makeCall', function(request, response) {
    console.log(request.body.Digits);
    console.log("Got " + request.body.Digits.length + " digits.");
    if(request.body.Digits.length < 12){
        console.log("Not enough, repeat");
        response.send('<?xml version="1.0" encoding="UTF-8"?><Response><Gather action="/makeCall" numDigits="13" timeout="20"><Say voice="woman" language="es-es">El número no es válido. Marca el número de teléfono al que quieres llamar con su código de país.</Say></Gather></Response>');
    }else{
        response.send('<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="/endCall" timeout="20" record="false" callerId="'+fromNumber+'">'+request.body.Digits+'</Dial></Response>');
    }
});

router.post('/endCall', function(req, res) {
    console.log("[CALL]     ended");
    var User = Parse.Object.extend("_User");
    var query = new Parse.Query(User);
    query.equalTo("username", req.body.From);
    query.find().then(function(results) {
        console.log("userId: " + results[0].id);
        var Call = Parse.Object.extend("Call");
        var call = new Call();
        call.set("status",   req.body.DialCallStatus);
        call.set("to",  global.queue[req.body.From].to);
        call.set("fromCountry",  req.body.FromCountry);
        call.set("toCountry",  req.body.ToCountry);
        call.set("callSid", req.body.CallSid);
        call.set("deleted", false);
        call.set("from",  results[0]);
        call.set("duration",req.body.DialCallDuration);
        call.setACL(new Parse.ACL(results[0]));

        call.save(null, {
            success: function(call) {
                // Execute any logic that should take place after the object is saved.
                console.log("[CALL]     saved 0K");
                try{
                    global.queue[req.body.From] = undefined;
                }catch(e){
                    console.log(e);
                    console.log("[ERROR]    "+req.body.From+"not dequeued");
                }
                console.log('------------------------------------------------------------------------------\n');
                res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>');
            },
            error: function(call, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log("[ERROR]     not saved");
                console.log(error);
                try{
                    global.queue[req.body.From] = undefined;
                }catch(e){
                    console.log(e);
                    console.log("[ERROR]    "+req.body.From+"not dequeued");
                }
                console.log('------------------------------------------------------------------------------\n');
                res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>');
            }
        });
    });

});

//Error fallback
router.post('/call', function(request, response) {
    response.send('<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="woman" language="es-es">Se ha producido un error, inténtalo de nuevo.</Say></Response>');
});

module.exports = router;