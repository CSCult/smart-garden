function setup() {
	pinMode(1, OUTPUT);
	Serial.println("Blinking");
}

function loop() {
	digitalWrite(1, HIGH);
	delay(1000);
	digitalWrite(1, LOW);
	delay(500);
}
