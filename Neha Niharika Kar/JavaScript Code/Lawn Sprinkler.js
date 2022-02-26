var WATERLEVEL_RATE = 0.1;	// 0.1 cm per second
var HUMIDITY_RATE = 5/3600; // 5% per hour
var VOLUME_AT_RATE = 100000;

var state = 0;	// 0 off, 1 on

function setup() {
	
	IoEClient.setup({
		type: "Lawn Sprinkler",
		states: [
		{
			name: "Status",
			type: "bool",
			controllable: true
		}			
		]
	});
	
	IoEClient.onInputReceive = function(input) {
		processData(input, true);
	};
	
	attachInterrupt(0, function() {
		processData(customRead(0), false);
	});
	
	state = restoreProperty("state", 0);
	setState(state);
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

function mouseEvent(pressed, x, y, firstPress) {
	if (firstPress)
		setState(state ? 0 : 1);
}

function processData(data, bIsRemote) {
	if ( data.length <= 0  )
		return;
	setState(parseInt(data));
}

function setState(newState)
{
	state = newState;
	
	digitalWrite(5, state);
	customWrite(0, state);
	IoEClient.reportStates(state);
	setDeviceProperty(getName(), "state", state);
	updateEnvironment();
}


function updateEnvironment()
{
	if ( state == 1){
		var volumeRatio = VOLUME_AT_RATE / Environment.getVolume();
		Environment.setContribution("Water Level", WATERLEVEL_RATE*volumeRatio);
		Environment.setContribution("Humidity", HUMIDITY_RATE*volumeRatio);
	}
	else
	{
		Environment.setContribution("Water Level", 0);
		Environment.setContribution("Humidity", 0);
	}
}
