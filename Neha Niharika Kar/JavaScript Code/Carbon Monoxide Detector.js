var ALARM_LEVEL = 20;
var ENVIRONMENT_NAME = "CO";

var state = 0;
var level = 0;

function setup() {
	
	IoEClient.setup({
		type: "Carbon Monoxide Detector",
		states: [{
			name: "Alarm",
			type: "bool",
			controllable: false
		},
		{
			name: "Level",
			type: "number",
			controllable: false
		}]
	});
	
	state = restoreProperty("state", 0);
	setState(state);
	sendReport();
}

function restoreProperty(propertyName, defaultValue)
{
	var value = getDeviceProperty(getName(), propertyName);
	if ( !(value === "" || value == "undefined") ){
		if ( typeof(defaultValue) == "number" )
			value = Number(value);
		
		setDeviceProperty(getName(), propertyName, value);
		return value;
	}
	
	return defaultValue;
}


function loop() {
	detect();
	delay(1000);
}

function detect()
{
	var value = Environment.get(ENVIRONMENT_NAME);
	if (value >= 0 )
		setLevel( Environment.get(ENVIRONMENT_NAME));
}

function sendReport()
{
	var report = state +","+level;	// comma seperated states
	IoEClient.reportStates(report);
	setDeviceProperty(getName(), "state", state);
	setDeviceProperty(getName(), "level", level);
}

function setState(newState)
{
	if ( newState === 0 )
		digitalWrite(1, LOW);
	else
		digitalWrite(1, HIGH);
	
	state = newState;
	
	sendReport();
}

function setLevel(newLevel)
{
	if  (level == newLevel)
		return;
		
	level = newLevel;
	if ( level > ALARM_LEVEL)
		setState(1);
	else
		setState(0);
	
	sendReport();
	
}
