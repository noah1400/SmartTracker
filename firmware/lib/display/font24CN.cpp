/**
  ******************************************************************************
  * @file    Font12.c
  * @author  MCD Application Team
  * @version V1.0.0
  * @date    18-February-2014
  * @brief   This file provides text Font12 for STM32xx-EVAL's LCD driver. 
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; COPYRIGHT(c) 2014 STMicroelectronics</center></h2>
  *
  * Redistribution and use in source and binary forms, with or without modification,
  * are permitted provided that the following conditions are met:
  *   1. Redistributions of source code must retain the above copyright notice,
  *      this list of conditions and the following disclaimer.
  *   2. Redistributions in binary form must reproduce the above copyright notice,
  *      this list of conditions and the following disclaimer in the documentation
  *      and/or other materials provided with the distribution.
  *   3. Neither the name of STMicroelectronics nor the names of its contributors
  *      may be used to endorse or promote products derived from this software
  *      without specific prior written permission.
  *
  * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  ******************************************************************************
  */

/* Includes ------------------------------------------------------------------*/
#include "fonts.h"


// 
//  Font data for Courier New 12pt
// 

const CH_CN Font24CN_Table[] PROGMEM = 
{
/*--  文字:  A  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{
"A",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x7C,0x00,0x00,0x00,0xFC,0x00,0x00,0x00,0xFE,0x00,0x00,0x00,0xFE,0x00,0x00,
0x01,0xFF,0x00,0x00,0x01,0xFF,0x00,0x00,0x01,0xEF,0x00,0x00,0x03,0xEF,0x80,0x00,
0x03,0xCF,0x80,0x00,0x07,0xC7,0x80,0x00,0x07,0xC7,0xC0,0x00,0x07,0x87,0xC0,0x00,
0x0F,0x83,0xE0,0x00,0x0F,0x83,0xE0,0x00,0x0F,0x01,0xE0,0x00,0x1F,0xFF,0xF0,0x00,
0x1F,0xFF,0xF0,0x00,0x3F,0xFF,0xF8,0x00,0x3E,0x00,0xF8,0x00,0x3C,0x00,0xF8,0x00,
0x7C,0x00,0x7C,0x00,0x7C,0x00,0x7C,0x00,0x78,0x00,0x3C,0x00,0xF8,0x00,0x3E,0x00,
0xF8,0x00,0x3E,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  a  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"a",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0xF8,0x00,0x00,
0x1F,0xFE,0x00,0x00,0x3F,0xFE,0x00,0x00,0x3E,0x3F,0x00,0x00,0x38,0x1F,0x00,0x00,
0x00,0x0F,0x00,0x00,0x00,0x0F,0x00,0x00,0x03,0xFF,0x00,0x00,0x1F,0xFF,0x00,0x00,
0x3F,0x8F,0x00,0x00,0x7C,0x0F,0x00,0x00,0x7C,0x0F,0x00,0x00,0x78,0x1F,0x00,0x00,
0x7C,0x1F,0x00,0x00,0x7E,0x7F,0x00,0x00,0x7F,0xFF,0x00,0x00,0x3F,0xFF,0x00,0x00,
0x0F,0xCF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  b  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"b",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,
0x3C,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,
0x3C,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,0x3C,0x00,0x00,0x00,0x3C,0xFE,0x00,0x00,
0x3D,0xFF,0x80,0x00,0x3F,0xFF,0xC0,0x00,0x3F,0x8F,0xC0,0x00,0x3F,0x07,0xE0,0x00,
0x3E,0x03,0xE0,0x00,0x3E,0x03,0xE0,0x00,0x3C,0x01,0xE0,0x00,0x3C,0x01,0xE0,0x00,
0x3C,0x01,0xE0,0x00,0x3C,0x03,0xE0,0x00,0x3E,0x03,0xE0,0x00,0x3E,0x03,0xE0,0x00,
0x3F,0x07,0xC0,0x00,0x3F,0x8F,0xC0,0x00,0x3F,0xFF,0x80,0x00,0x3F,0xFF,0x00,0x00,
0x3C,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  c  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"c",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0xFC,0x00,0x00,
0x07,0xFE,0x00,0x00,0x1F,0xFE,0x00,0x00,0x3F,0x86,0x00,0x00,0x3E,0x00,0x00,0x00,
0x7C,0x00,0x00,0x00,0x7C,0x00,0x00,0x00,0x7C,0x00,0x00,0x00,0x78,0x00,0x00,0x00,
0x78,0x00,0x00,0x00,0x7C,0x00,0x00,0x00,0x7C,0x00,0x00,0x00,0x7C,0x00,0x00,0x00,
0x3E,0x00,0x00,0x00,0x3F,0x86,0x00,0x00,0x1F,0xFE,0x00,0x00,0x0F,0xFE,0x00,0x00,
0x03,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  微  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"微",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x03,0x07,0x01,0xE0,0x07,0x87,0x01,0xE0,
0x07,0x07,0x01,0xC0,0x0F,0xF7,0x79,0xC0,0x1E,0xF7,0x7B,0xC0,0x1E,0xF7,0x7B,0x80,
0x3C,0xF7,0x7B,0xFF,0x78,0xF7,0x7B,0xFF,0xF8,0xF7,0x7F,0x9E,0xF7,0xFF,0xFF,0x9E,
0x67,0xFF,0xFF,0x9E,0x07,0x00,0x7F,0x9C,0x0F,0x00,0x0F,0x9C,0x1E,0x00,0x1F,0x9C,
0x1E,0x7F,0xFF,0xBC,0x3E,0x7F,0xF3,0xFC,0x3E,0x00,0x03,0xFC,0x7E,0x00,0x01,0xF8,
0xFE,0x00,0x01,0xF8,0xFE,0x7F,0xE1,0xF8,0xDE,0x7F,0xE1,0xF8,0x1E,0x78,0xE0,0xF0,
0x1E,0x78,0xEE,0xF0,0x1E,0x78,0xFF,0xF0,0x1E,0x78,0xFD,0xF8,0x1E,0x79,0xFB,0xFC,
0x1E,0xF1,0xF7,0xBC,0x1E,0xF0,0xEF,0x9E,0x1F,0xE0,0x0F,0x0F,0x1E,0xC0,0x1E,0x0F,
0x1E,0x00,0x0C,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  雪  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"雪",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x1F,0xFF,0xFF,0xF8,0x1F,0xFF,0xFF,0xF8,0x00,0x03,0xC0,0x00,0x00,0x03,0xC0,0x00,
0x7F,0xFF,0xFF,0xFE,0x7F,0xFF,0xFF,0xFE,0x78,0x03,0xC0,0x1E,0x78,0x03,0xC0,0x1E,
0x7F,0xFF,0xFF,0xFE,0x7F,0xFF,0xFF,0xFE,0x00,0x03,0xC0,0x00,0x00,0x03,0xC0,0x00,
0x07,0xFF,0xFF,0xE0,0x07,0xFF,0xFF,0xE0,0x00,0x03,0xC0,0x00,0x00,0x00,0x00,0x00,
0x1F,0xFF,0xFF,0xF8,0x1F,0xFF,0xFF,0xF8,0x00,0x00,0x00,0x78,0x00,0x00,0x00,0x78,
0x1F,0xFF,0xFF,0xF8,0x1F,0xFF,0xFF,0xF8,0x00,0x00,0x00,0x78,0x00,0x00,0x00,0x78,
0x00,0x00,0x00,0x78,0x3F,0xFF,0xFF,0xF8,0x3F,0xFF,0xFF,0xF8,0x00,0x00,0x00,0x78,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  电  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"电",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x07,0x80,0x00,0x00,0x07,0x80,0x00,
0x00,0x07,0x80,0x00,0x00,0x07,0x80,0x00,0x7F,0xFF,0xFF,0xF8,0x7F,0xFF,0xFF,0xF8,
0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,
0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x7F,0xFF,0xFF,0xF8,0x7F,0xFF,0xFF,0xF8,
0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,
0x78,0x07,0x80,0xF8,0x78,0x07,0x80,0xF8,0x7F,0xFF,0xFF,0xF8,0x7F,0xFF,0xFF,0xF8,
0x78,0x07,0x80,0x0E,0x78,0x07,0x80,0x0F,0x00,0x07,0x80,0x0F,0x00,0x07,0x80,0x0F,
0x00,0x07,0x80,0x1F,0x00,0x07,0x80,0x1E,0x00,0x03,0xFF,0xFE,0x00,0x01,0xFF,0xFC,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},

/*--  文字:  子  --*/
/*--  微软雅黑24;  此字体下对应的点阵为：宽x高=32x41   --*/
{"子",
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x1F,0xFF,0xFF,0xF8,0x1F,0xFF,0xFF,0xF8,0x00,0x00,0x01,0xF8,0x00,0x00,0x07,0xE0,
0x00,0x00,0x0F,0xC0,0x00,0x00,0x1F,0x80,0x00,0x00,0x3E,0x00,0x00,0x00,0xFC,0x00,
0x00,0x01,0xF8,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,
0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,
0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,
0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,0x00,0x03,0xE0,0x00,
0x00,0x03,0xE0,0x00,0x00,0x03,0xC0,0x00,0x01,0xFF,0xC0,0x00,0x00,0xFF,0x80,0x00,
0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
0x00,0x00,0x00,0x00},


};

cFONT Font24CN = {
  Font24CN_Table,
  sizeof(Font24CN_Table)/sizeof(CH_CN),  /*size of table*/
  24, /* ASCII Width */
  32, /* Width */
  41, /* Height */
};

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
