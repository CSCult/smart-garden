// Purpose:
// Humiture sensor.  Check environmental values to determine the humiture.

// Environment must have these two variables in order for this object to work.
// The tempurature must be in degrees fahrenheit.
var TEMPERATURE_NAME = "Ambient Temperature";
var HUMIDITY_NAME = 'Humidity';
var MIN = 0;
var MAX = 100;

// How temperatures are represented in the Environment.
// If you are storing temperature as C then this would be true.
// If as F then false.  This way the script knows how to convert it when reading from the environment.
var METRIC = true;

function setup() {
}

// Purpose:
// Update function.  Occures once each update.  Limits how over the temerature is detected to speed up the operation.
function loop() {
	detect();
	delay(1000);
}

// Detects when how temperature is stored in then environment is changed.
// Updates the display and handles the correct measurement type (F or C)
function measurementSystemChangeEvent() {
	METRIC = isUsingMetric();
	detect();
}

// Purpose:
// Check the environmental value and calculate and display the humiture.
function detect() {
	var temperature = Environment.get(TEMPERATURE_NAME);
	var humidity = Environment.get(HUMIDITY_NAME);
	if(0 > humidity)
		humidity = 0;

	if(METRIC)
		temperature = (temperature * 1.8) + 32;	

	updateHumiture(temperature,  humidity);
}


// Purpose:
// Compute the humature and update the text display.
function updateHumiture(temperature, humidity) {
	var result = (temperature + humidity)/2;
	if (result < MIN)
		result = MIN;
	else if (result > MAX)
		result = MAX;
	setDeviceProperty(getName(), "level", Math.floor(result + .5));
	result = Math.floor(map(result, MIN, MAX, 0, 255));
	analogWrite(A0, result);
}