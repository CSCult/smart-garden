var ENVIRONMENT_NAME = "Atmospheric Pressure";
var P_MIN = 0;    // assumed minimum pressure value in the environment
var P_MAX = 100*1000;  // (Pa) assumed maximum pressure value in the environment

var level = 0;
var unit;

function setup() {
	
	IoEClient.setup({
		type: "Atm. Pressure Sensor",
		states: [
		{
			name: "Atm. Pressure",
			type: "number",
			unit: unit,
			controllable: false
		}]
	});
	

//	setCustomText(30,18,200,20, level );
	
	sendReport();

}

function loop() {

	detect();
	sendReport();
	delay(1000);
}

function detect()
{
	var value = Environment.get(ENVIRONMENT_NAME) * 1000; // sale to Pa from kPa
	if (value >= 0 )
		setLevel( value );
}

function sendReport()
{
	var report = level;	// comma seperated states
	
	IoEClient.reportStates(report);
	setDeviceProperty(getName(), "level", level + " Pa");
}

function setLevel(newLevel)
{
	if  (level == newLevel)
		return;
		
	level = Math.floor(parseFloat(newLevel));
	
	var avalue = level;
	
	if(avalue < P_MIN)
		avalue = P_MIN;
	if(avalue > P_MAX)
		avalue = P_MAX;
		
	setCustomText(20,18,200,20, Environment.getValueWithUnit(ENVIRONMENT_NAME) );
	
	
//	var out_avalue = Math.floor((avalue - P_MIN)/(P_MAX - P_MIN) * 255);
	// 50% at sea level
	var out_avalue = 128/101.325 * Environment.getMetricValue(ENVIRONMENT_NAME);
	
	analogWrite(A0, out_avalue);

//	Serial.println(Environment.getValueWithUnit(ENVIRONMENT_NAME) +", "+out_avalue);
	
	sendReport();
	delay(500);
}

