#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif
#define PIN 32
#define NUMPIXELS 4
#define SENSOR_PIN 34
#define SENSOR_PIN2 35
#define SCHWELLENWERT 4000
bool pos = 0;
bool pos_old=1;
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {

  pixels.begin();
  Serial.begin(9600);
}

void loop() {
  int sensorWert = analogRead(SENSOR_PIN);
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(0, 0, 45));
      pos=0;
    }
  if (sensorWert < SCHWELLENWERT) {
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(40,0 ,25));
      pos=1;
    }
  }
  if(pos!=pos_old)
  {
    Serial.println("turned");
    delay(100);
    pos_old=pos;
  }
      pixels.show();
}
