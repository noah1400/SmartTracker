#include <Adafruit_NeoPixel.h>

#define PIN            32
#define NUMPIXELS      4

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);
  pixels.begin();
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    if (input.startsWith("rgb(") && input.endsWith(")")) {
      input.remove(0, 4);
      input.remove(input.length() - 1);
      int comma1 = input.indexOf(',');
      int comma2 = input.lastIndexOf(',');
      int red = input.substring(0, comma1).toInt();
      int green = input.substring(comma1 + 1, comma2).toInt();
      int blue = input.substring(comma2 + 1).toInt();

      for (int i = 0; i < NUMPIXELS; i++) {
        pixels.setPixelColor(i, pixels.Color(red, green, blue));
      }
      pixels.show();
    }
  }
}
