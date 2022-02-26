var ENVIRONMENT_NAME = "Water Level";	//global environment variable to hold the water level
var METRIC = true; //use cm when set to true and inch when set to false
var level = 0; //level of water measured in either inch or cm

//set up metric, initialize state and client to talk to IoE registration server
function setup() {
	
	var unit = "in";
	
	if ( METRIC )
		unit = "cm";
		
	IoEClient.setup({
		type: "Water Level Monitor",
		states: [
		{
			name: "Water Level",
			type: "number",
			"unit": "cm",
            "imperialUnit": "in",
            "toImperialConversion": "x/2.54",
            "toMetricConversion": "x*2.54",
            "decimalDigits": 1,
			controllable: false
		}]
	});
	
	setState(level);
	setCustomText(35,20,200,20, level.toFixed(2) );
	sendReport();
}

//continuosly detecting water level and send report to server
function loop() {
	detect();
	sendReport();
	delay(1000);
}

//get WATER_LEVEL measurement defined in Environment
function detect()
{
	var value = Environment.get(ENVIRONMENT_NAME);
	setLevel(value.toFixed(2));
}

//send water level in desired metric to the server
function sendReport()
{
	var report = level;	// comma seperated states
	IoEClient.reportStates(report);
	setDeviceProperty(getName(), "level", report);
}

//set state and update component image to reflect the current state
function setState()
{
	if ( level > 0 )
		digitalWrite(1, HIGH);
	else
		digitalWrite(1, LOW);
	
	sendReport();
}

//set water level
function setLevel(newLevel)
{
	if  (level == newLevel)
		return;
		
	level = newLevel;
	var convertedLevel = convertLength(level);
	setCustomText(35,20,200,20, convertedLevel);
	setState();
}


function convertLength(value) {
	if (isUsingMetric())
		return value;
	else
		return value / 2.54;
}

