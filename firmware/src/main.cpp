#include "display.h"
#include "encoder.h"

void setup()
{
    initDisplay();
    testDisplay();
    Serial.begin(9600);
    delay(1000);
    Serial.println("testscript");
        delay(10000);
    Serial.println("testscript2");
}

void loop()
{
}