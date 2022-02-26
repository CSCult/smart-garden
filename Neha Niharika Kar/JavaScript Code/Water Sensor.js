var ENVIRONMENT_NAME = "Water Level";
var MIN = 0;
var MAX = 20;
var value;

function loop() {
	
	value = Environment.get(ENVIRONMENT_NAME);

	if (value < MIN)
		value = MIN;
	else if (value > MAX)
		value = MAX;
	
	setDeviceProperty(getName(), "level", value);
	value = map(value, MIN, MAX, 0, 255);
	analogWrite(A0, value);
	delay(1000);
}
