var state = require('./config/config.json');
var Gpio = require("onoff").Gpio;
var unexported = false;

console.log("Starting web server...");
var express = require('express')
    , cors = require('cors');

console.log(__dirname);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/lights', (req, res) => {
    console.log("GET lights");
    result = [];
    state.lights.forEach((lamp) => {
        result.push({
            color: lamp.color,
            durationMs: lamp.counter * state.counterTickMs
        });
    });
    return res.send(result);
});

app.get('/lights/:color', (req, res) => {
    console.log("POST " + req.params.color);
    incrementCounter(req.params.color, state.blinkDurationTicks);
    return res.send("Accepted");
});

openPorts();
test();
setInterval(updateLamps, state.counterTickMs);

function incrementCounter(color, increment)
{
    state.lights.forEach(function(lamp){
        if (lamp.color === color)
        {
            console.log("Increment: " + increment);
            lamp.counter += increment;
            console.log("New counter value for " + color + " is: " + lamp.counter);
        }
    });
}

function updateLamps()
{
    state.lights.forEach(function(lamp){

        var value = lamp.gpio.readSync();
        if (lamp.counter > 0)
        {
            if (!value)
            {
                lamp.gpio.writeSync(1);
//                blink(lamp.color, state.counterTickMs);
            }
            lamp.counter--;
        }
        else if (value) {
            lamp.gpio.writeSync(0);                
        }
    });
}

function blink(color, duration)
{
    var lamp = state.lights.find(function filter(elem) { return elem.color === color;});

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
    state.lights.forEach(function(lamp){
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
        state.lights.forEach(function(lamp){
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
app.listen(port, () => {
    console.log('Server listening at %s', port); 
});
