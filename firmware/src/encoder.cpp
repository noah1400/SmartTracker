#include "Arduino.h"

class RotaryEncoder
{
public:
    RotaryEncoder(int pinRS1, int pinRS2) : pinRS1(pinRS1), pinRS2(pinRS2), encoderPos(0), lastEncoded(0), lastMillis(0) {}

    void initEncoder()
    {
        pinMode(pinRS1, INPUT);
        pinMode(pinRS2, INPUT);
        attachInterrupt(digitalPinToInterrupt(pinRS1), updateEncoder, CHANGE);
        attachInterrupt(digitalPinToInterrupt(pinRS2), updateEncoder, CHANGE);
    }

    int getEncoderPos() const
    {
        return encoderPos;
    }

private:
    const int pinRS1;
    const int pinRS2;
    int encoderPos;
    int lastEncoded;
    long lastMillis;

    static void updateEncoder()
    {
        instance().updateEncoderImpl();
    }

    void updateEncoderImpl()
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

    static RotaryEncoder &instance()
    {
        static RotaryEncoder encoderInstance(2, 3);
        return encoderInstance;
    }
};
