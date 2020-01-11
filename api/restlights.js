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
    return res.send(state.lights);
});

app.get('/lights/:color', (req, res) => {
    console.log("POST " + req.params.color);
    incrementCounter(req.params.color);
    return res.send("Accepted");
});

openPorts();
test();
setInterval(updateLamps, 500);

function incrementCounter(color)
{
    state.lights.forEach(function(lamp){
        if (lamp.color === color)
        {
            lamp.counter++;
            console.log("New counter value: " + lamp.counter);
        }
    });
}

function updateLamps()
{
    state.lights.forEach(function(lamp){
        if (lamp.counter > 0)
        {
            var value = lamp.gpio.readSync();
            if (!value)
            {
                lamp.counter--;
                console.log("Blinking lamp " + lamp.color + ": " + lamp.counter);
                blink(lamp.color, state.counterTickMs);
            }
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
