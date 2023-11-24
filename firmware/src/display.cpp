#include "LCD_Driver.h"
#include "Touch_Driver.h"
#include "GUI_Paint.h"
#include "image.h"

UBYTE flag = 0, flgh = 0;
UWORD x, y, l = 0;

void Touch_INT_callback()
{
    flag = TOUCH_IRQ;
}

void initDisplay()
{
    Touch_1IN28_XY XY;
    XY.mode = 0;
    XY.x_point = 0;
    XY.y_point = 0;
    Config_Init();
    LCD_Init();
    if (Touch_1IN28_init(XY.mode) == true)
        Serial.println("OK!");
    else
        Serial.println("NO!");
    LCD_SetBacklight(1000);
    Paint_NewImage(LCD_WIDTH, LCD_HEIGHT, 0, BLACK);
    Paint_Clear(BLACK);
    attachInterrupt(1, Touch_INT_callback, LOW);
    pinMode(TP_INT_PIN, INPUT_PULLUP);
}