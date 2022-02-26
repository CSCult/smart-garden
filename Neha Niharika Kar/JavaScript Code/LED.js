var MAX_LIGHT_PERCENT = 1;
var VOLUME_AT_RATE = 100000;
var input;
var value;

function setup() {
	setComponentOpacity("black", 1);
	attachInterrupt(0, isr);
	isr();
}

function isr() {
	input = analogRead(0);
	value = map(input, 0, 1023, 0, 1);
	
	setComponentOpacity("black", 1-value);
	setDeviceProperty(getName(), "level",input);
}

var lastTimeInSeconds = 0;
function loop()
{
	updateEnvironment();
	
	delay(1000);
}

function updateEnvironment()
{
	var rate = value*MAX_LIGHT_PERCENT*VOLUME_AT_RATE / Environment.getVolume();
	// rate equals limit because we want it to happen immediately
	Environment.setContribution("Visible Light", rate, rate, false);
}
