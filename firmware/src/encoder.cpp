#include "Arduino.h"
const int pinRS1 = 2;
const int pinRS2 = 3;

volatile int encoderPos = 0;
volatile int lastEncoded = 0;
volatile long lastMillis = 0;

void updateEncoder()
{
    int MSB = digitalRead(pinRS1);
    int LSB = digitalRead(pinRS2);
    int encoded = (MSB << 1) | LSB;
    int sum = (lastEncoded << 2) | encoded;
    if (sum == 0b1101 || sum == 0b0100 || sum == 0b0010 || sum == 0b1011)
    {
        encoderPos++;
    }
    else if (sum == 0b1110 || sum == 0b0111 || sum == 0b0001 || sum == 0b1000)
    {
        encoderPos--;
    }
    lastEncoded = encoded;
}

void initEncoder()
{
    pinMode(pinRS1, INPUT);
    pinMode(pinRS2, INPUT);
    attachInterrupt(digitalPinToInterrupt(pinRS1), updateEncoder, CHANGE);
    attachInterrupt(digitalPinToInterrupt(pinRS2), updateEncoder, CHANGE);
}