#include "Arduino.h"

class RotaryEncoder
{
public:
    RotaryEncoder(int pinRS1, int pinRS2);

    void initEncoder();

    int getEncoderPos() const;

private:
    const int pinRS1;
    const int pinRS2;
    int encoderPos;
    int lastEncoded;
    long lastMillis;

    static void updateEncoder();

    void updateEncoderImpl();

    static RotaryEncoder &instance();
};