var blinkDuration = 10000;

var lamps = [
    {
        pin: 12,
        color: "green",
        counter: 0
    },
    {
        pin: 18,
        color: "yellow",
        counter: 0
    },
    {
        pin: 16,
        color: "blue",
        counter: 0
    },
    {
        pin: 15,
        color: "blue2",
        counter: 0
    },
    {
        pin: 7,
        color: "red",
        counter: 0
    },
    {
        pin: 13,
        color: "orange",
        counter: 0
    }
];

var gpio = require("pi-gpio");

console.log("Starting web server...");
var express = require('express')
    , cors = require('cors')
    , app = express();

console.log(__dirname);

app.use(cors());
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');
app.set('view engine', 'jade');

app.use('/css', express.static(__dirname + '/css/'));
app.use('/app', express.static(__dirname + '/app/'));


app.get('/', function (req, res) {
    res.render('index', { model: lamps });
    //res.render('index');
});

app.get('/blink/:color', function (req, res) {
    console.log("POST " + req.params.color);

    // Find the lamp and increment counter

    incrementCounter(req.params.color);
    res.render('index', { model: lamps });
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
            gpio.read(lamp.pin, function(err, value)
            {
                if (err)
                {
                    console.log("Cannot read pin");
                }
                else if (!value)
                {
                    lamp.counter--;
                    console.log("Blinking lamp " + lamp.color + ": " + lamp.counter);
                    blink(lamp.pin, blinkDuration);
                }
            });
        }
    });
}

function blink(pin, duration)
{
    gpio.write(pin, 1, function(err) {
        if (err)
        {
            console.log("Write 1 failed: " + err);
        }
        setTimeout(function() {
            gpio.write(pin, 0, function(err) {
                if (err) {
                    console.log("Write 0 failed: " + err);
                }

            });
        }, duration);
    });
}

function openPorts()
{
    // Initialize Raspberry GPIO
    lamps.forEach(function(lamp){
        gpio.open(lamp.pin, "output", function(err) {
            if (err)
            {
                console.log(err)
            }
            else {
                gpio.write(lamp.pin, 0);
            }
        });
    });

    gpio.open(22, "output", function(err) {
        gpio.write(22, 1);
    });
}

function closePorts()
{
    gpio.write(22, 0);
    lamps.forEach(function(lamp){
        try {
            console.log("CLosing pin " + lamp.pin);
            gpio.close(lamp.pin, function(err) {
                console.log("Pin " + lap.pin + " closed " + err);
            });
        }
        catch (err){
            console.log("Pin " + lap.pin + " closed with an error " + err);
        }
    });
    gpio.close(22, function(err) {
        console.log("Pin 22 closed " + err);
    });
}

function test() {
    setTimeout(function() {blink(16, 3000);}, 1000);
    setTimeout(function() {blink(18, 3000);}, 1500);
    setTimeout(function() {blink(7, 3000);}, 2000);
    setTimeout(function() {blink(13, 3000);}, 2500);
    setTimeout(function() {blink(15, 3000);}, 3000);
    setTimeout(function() {blink(12, 3000);}, 3500);
}

process.on('exit', function () {
    console.log('Exiting ...');
    closePorts();
    // close other resources here
    console.log('bye');
});

// happens when you press Ctrl+C
process.on('SIGINT', function () {
    console.log( '\nGracefully shutting down from  SIGINT (Crtl-C)' );
    closePorts();
    process.exit();
});

// usually called with kill
process.on('SIGTERM', function () {
    console.log('Parent SIGTERM detected (kill)');
    closePorts();
    process.exit(0);
});


var port = 80;
app.listen(port, function() {
    console.log('Server listening at %s', port);
});
