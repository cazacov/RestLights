var blinkDuration = 10000;

var lamps = require('./config/lamps.json');
var Gpio = require("onoff").Gpio;
var unexported = false;

console.log("Starting web server...");
var express = require('express')
    , cors = require('cors')
    , app = express();

console.log(__dirname);

app.use(cors());

app.get('/blink/:color', function (req, res) {
    console.log("POST " + req.params.color);
    incrementCounter(req.params.color);
    return res.send("Accepted");
});

openPorts();
test();
setInterval(updateLamps, 500);

function incrementCounter(color)
{
    lamps.forEach(function(lamp){
        if (lamp.color === color)
        {
            lamp.counter++;
            console.log("New counter value: " + lamp.counter);
        }
    });
}

function updateLamps()
{
    lamps.forEach(function(lamp){
        if (lamp.counter > 0)
        {
            var value = lamp.gpio.readSync();
            if (!value)
            {
                lamp.counter--;
                console.log("Blinking lamp " + lamp.color + ": " + lamp.counter);
                blink(lamp.color, blinkDuration);
            }
        }
    });
}

function blink(color, duration)
{
    var lamp = lamps.find(function filter(elem) { return elem.color === color;});

    if (lamp)
    {
        lamp.gpio.writeSync(1);
        setTimeout(function() {
            lamp.gpio.writeSync(0);
        }, duration);
    }
}

function openPorts()
{
    // Initialize Raspberry GPIO
    lamps.forEach(function(lamp){
        console.log("Opening GPIO pin " + lamp.pin);
        lamp.gpio = new Gpio(lamp.pin, 'out');
    });

    var led = new Gpio(25, 'out');
    led.writeSync(1);
}

function powerOff()
{
    var led = new Gpio(25, 'out');      // Pin 22
    led.writeSync(0);
    if (!unexported) {
        unexported = true;
        lamps.forEach(function(lamp){
            console.log("Unxeporting GPIO pin " + lamp.pin);
            lamp.gpio.unexport();
        });
        console.log('bye');
    }
}

function test() {
    setTimeout(function() {blink('green', 3000);}, 1000);
    setTimeout(function() {blink('blue', 3000);}, 1500);
    setTimeout(function() {blink('yellow', 3000);}, 2000);
    setTimeout(function() {blink('red', 3000);}, 2500);
    setTimeout(function() {blink('orange', 3000);}, 3000);
    setTimeout(function() {blink('blue2', 3000);}, 3500);
}

process.on('exit', function () {
    console.log('Exit event');
    powerOff();
});

// happens when you press Ctrl+C
process.on('SIGINT', function () {
    console.log( '\nGracefully shutting down from  SIGINT (Crtl-C)' );
    powerOff();
    process.exit();
});

// usually called with kill
process.on('SIGTERM', function () {
    console.log('Parent SIGTERM detected (kill)');
    powerOff();
    process.exit(0);
});


var port = 3000;
app.listen(port, function() {
    console.log('Server listening at %s', port);
});
