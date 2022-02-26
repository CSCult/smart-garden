// Purpose:
// Humiture detector.  Check environmental values to determine and display the humiture.

// Environment must have these two variables in order for this object to work.
// The tempurature must be in degrees fahrenheit.
var TEMPERATURE_NAME = "Ambient Temperature";
var HUMIDITY_NAME = 'Humidity';

// How temperatures are represented in the Environment.
// If you are storing temperature as C then this would be true.
// If as F then false.  This way the script knows how to convert it when reading from the environment.
var METRIC = true;

// Top left position and the clip area size for the text.
var textPos = {x: 30, y: 20};
var textAreaSize = {w: 230, h: 52 };

function setup() 
{
	// Necessary for display in a registration server.
	IoEClient.setup({
		type: "Humitor Sensor",
		states: [
		{
			name: "Humitor",
			type: "number",

			controllable: false
		}]
	});	
}

// Purpose:
// Update function.  Occures once each update.  Limits how over the temerature is detected to speed up the operation.
function loop() 
{
	detect();
	delay(1000);
}

// Detects when how temperature is stored in then environment is changed.
// Updates the display and handles the correct measurement type (F or C)
function measurementSystemChangeEvent() 
{
	var unit = "C";
	METRIC = isUsingMetric();
	unit = METRIC ? "C" : "F";
	detect();
}

// Purpose:
// Check the environmental value and calculate and display the humiture.
function detect()
{
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
function updateHumiture(temperature, humidity)
{
	var result = (temperature + humidity)/2;
	var text = Math.floor(result + .5);
	setCustomText(textPos.x, textPos.y, textAreaSize.w, textAreaSize.h, text);

	// Update a registration server.
	IoEClient.reportStates(text);
	setDeviceProperty(getName(), "level", text);
	
}