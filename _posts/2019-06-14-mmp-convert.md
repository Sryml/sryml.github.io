---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      Python - BoD's MMP文件转换
heading:    
header_img: 
categories: ["Python","Severance: Blade Of Darkness"]
tags:       [Image Process,PIL,二进制]
date: 2019-06-14 00:13:21 +0800
# last_modified_at : 2019-06-14 00:13:36
excerpt: 
---

* content
{:toc}

`.MMP`文件格式应该是BoD游戏中最简单的编译文件了，虽然网上已经有三款针对此文件格式的转换程序，有官方的纹理编译器`BaB`、民间的`mmp_dump`、还有最强的sgi的`SGIMMPWorkstation`。




但它们之间的优缺点良莠不一，像有的只能导出、另一个只能导入，一个是控制台操作，一个是命令行。`SGIMMPWorkstation`就很强，可以双向转换并且有良好的交互界面，但唯一让我感到不足的就是自动化工作将变得困难。
幸好除了官方软件，其它gamer的程序是附带开源代码的。虽然没学过C++（这是硬伤），但是我觉得还是有可能使用Python重写这些功能的。前面也说过这种格式的编译原理比较简单，我甚至认为它只是单纯的将bmp位图给打包成一个文件方便管理而已。

所以我选择了最简单的mmp_dump开刀，它的源文件只有3个：
![ ](https://raw.githubusercontent.com/Sryml/Image/master/mmp_dump.png)

```c++
#include <stdio.h>
#include "BMPFile.h"


int main(int argc, char **argv)
{
	if (argc < 2) {
		printf("Format: mmp_dump file.mmp\n");
		return 1;
	}
```

没错，这是一个命令行调用的方式运行的。这不意味着可以很方便的和Python结合自动化操作，这个火苗我擦出过，但是被一个致命的缺陷浇灭了。
原来这个程序不支持32bpp位图的导出，我曾想稍微修改下C++源码，装了编译器，生成了新的exe文件。结果没有我想象中的那么简单，仍然无法导出32位的bmp图片。
后来我想，为什么不用Python重现这个过程呢！首先讲一下MMP文件结构。

## 一、MMP格式结构
参考源码文件`mmp_dump.cpp`得出以下信息。
MMP文件只有二个部分组成（MMP文件头+位图文件），每个位图文件分为三部分（信息头，图像数据，调色板）
- ### MMP文件头
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th>变量名</th>
        <th>大小（小端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>nTextures</td>
        <td>4 Bytes</td>
        <td>位图总数量</td>
      </tr>
    </tbody>
  </table>

- ### 位图信息头
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th>变量名</th>
        <th>大小（小端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>two</td>
        <td>2 Bytes</td>
        <td>固定为数值2</td>
      </tr>
      <tr>
        <td>checksum</td>
        <td>4 Bytes</td>
        <td>图片校检和</td>
      </tr>
      <tr>
        <td>size</td>
        <td>4 Bytes</td>
        <td>图像总大小(12个标识字节+图像数据+调色板)</td>
      </tr>
      <tr>
        <td>name_len</td>
        <td>4 Bytes</td>
        <td>位图名字长度</td>
      </tr>
      <tr>
        <td>name</td>
        <td>由上面记录的长度决定</td>
        <td>位图名字<code>(大端读取)</code></td>
      </tr>
      <tr>
        <td>im_type</td>
        <td>4 Bytes</td>
        <td>图像类型(标识字符)</td>
      </tr>
      <tr>
        <td>width</td>
        <td>4 Bytes</td>
        <td>图像宽度(标识字符)</td>
      </tr>
      <tr>
        <td>height</td>
        <td>4 Bytes</td>
        <td>图像高度(标识字符)</td>
      </tr>
    </tbody>
  </table>

- ### 图像数据区
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th width="15%">名字</th>
        <th width="29%">大小（大端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>图像数据区总大小</td>
        <td><code>size - 12</code> Bytes</td>
        <td>由上面的图像总大小减去12个标识字节可得<code>im_data</code></td>
      </tr>
      <tr>
        <td>图像数据</td>
        <td><code>width * height * (bpp/8)</code> Bytes</td>
        <td>若图像类型非调色板，那么图像数据为<code>im_data</code>。否则为<code>im_data[:-768]</code></td>
      </tr>
      <tr>
        <td>调色板</td>
        <td>根据类型决定</td>
        <td>若图像类型为调色板，那么调色板数据为后面768个字节<code>im_data[-768:]</code>。否则为0</td>
      </tr>
    </tbody>
  </table>

读取完第一张位图后，后面紧接着下一张位图信息头，也就是重复第二部分。

## 二、MMP文件导出

```python
# -*- coding: utf-8 -*-
# python 3.7.2
# 2019/06/13 by sryml.

import os
import binascii
import struct

#
from PIL import Image

# -------------------
RES_FOLDER = 'Textures/'
getmode    = {1:'P' , 2:'L' , 3:'P' , 4:'RGB' , 5:'RGBA'}
bpp2mode   = {8:'P' , 24:'RGB' , 32:'RGBA'}

Palette         = 1
Alpha           = 2
PaletteAlpha    = 3
TrueColour      = 4
TrueColourAlpha = 5
# -------------------

# 解包mmp文件
def mmp_unpacking(mmp_name,bpp=None):
    f=open(RES_FOLDER+mmp_name,'rb')
    nTextures= struct.unpack('<I', f.read(4))[0] #读取小端数据4字节无符号整型
    unpack_dir= RES_FOLDER + os.path.splitext(mmp_name)[0]
    if not os.path.exists(unpack_dir):
        os.makedirs(unpack_dir)

    for i in range(nTextures):
        two,checksum,size,name_len = struct.unpack('<HIII', f.read(14))
        name                       = f.read(name_len)
        im_type,width,height       = struct.unpack('<III', f.read(12))

        data= f.read(size-12)

        if im_type == Palette:
            img= Image.frombytes(getmode[im_type],(width,height),data[:-768])
            # 调色板像素乘以4恢复亮度
            palette= map(lambda i:min(i<<2 , 255),data[-768:])
            img.putpalette(palette)
        else:
            img= Image.frombytes(getmode[im_type],(width,height),data)
        if bpp in bpp2mode:
            mode= bpp2mode[bpp]
            img= (img.mode!=mode and img.convert(mode)) or img
        img.save(unpack_dir + '/' + name.decode()+'.bmp')
    f.close()
```

短短50行代码，运行完我都惊了。完美重现了C++写的mmp_dump中的功能，并且可以导出32位bmp，效率也很快。
实际上我没了解MMP中图片像素的存放规则，正所谓人帅自有天帮，PIL的`frombytes`来自字节流图像的导入方法完美的加载了MMP文件中的图像序列，从而我可以直接将它保存到硬盘上。

---

## 三、bmp打包生成MMP
首先，当然是BMP位图的文件结构。

### BMP格式结构
- #### BMP文件头
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th>变量名</th>
        <th>大小（小端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td colspan='3'>总大小：14 Bytes</td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td>bfType</td>
        <td>2 Bytes</td>
        <td>文件标识符，必须为<code>BM</code></td>
      </tr>
      <tr>
        <td>bfSize</td>
        <td>4 Bytes</td>
        <td>BMP文件大小</td>
      </tr>
      <tr>
        <td>bfReserved</td>
        <td>4 Bytes</td>
        <td>保留0</td>
      </tr>
      <tr>
        <td>bfOffBits</td>
        <td>4 Bytes</td>
        <td>从文件头到像素数据的偏移(受调色板影响)</td>
      </tr>
    </tbody>
  </table>

- #### BMP信息头
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th>变量名</th>
        <th>大小（小端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td colspan='3'>总大小：40 Bytes</td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td>biSize</td>
        <td>4 Bytes</td>
        <td>位图信息头所需的字节数</td>
      </tr>
      <tr>
        <td>biWidth</td>
        <td>4 Bytes</td>
        <td>图像宽度</td>
      </tr>
      <tr>
        <td>biHeight</td>
        <td>4 Bytes</td>
        <td>图像高度(正数表示行序为从下往上，读取alpha后需水平翻转。负数无需翻转)</td>
      </tr>
      <tr>
        <td>biPlanes</td>
        <td>2 Bytes</td>
        <td>默认值为1</td>
      </tr>
      <tr>
        <td>biBitCount</td>
        <td>2 Bytes</td>
        <td>表示每个像素占几位（bpp），其值可为1,4,8,16,24或32</td>
      </tr>
      <tr>
        <td>biCompression</td>
        <td>4 Bytes</td>
        <td>
          图像数据的压缩类型，取值范围为：<br><a style="text-decoration: underline;" href="javascript:void(0)" title="BI_RGB 不压缩（最常用）">&emsp;0&emsp;</a> ， <a style="text-decoration: underline;" href="javascript:void(0)" title="BI_RLE8 8比特游程编码（BLE），只用于8位位图">&emsp;1&emsp;</a> ， <a style="text-decoration: underline;" href="javascript:void(0)" title="BI_RLE4 4比特游程编码（BLE），只用于4位位图">&emsp;2&emsp;</a> ， <a style="text-decoration: underline;" href="javascript:void(0)" title="BI_BITFIELDS比特域（BLE），只用于16/32位位图">&emsp;3&emsp;</a> ， <a style="text-decoration: underline;" href="javascript:void(0)" title="None">&emsp;4&emsp;</a>
        </td>
      </tr>
      <tr>
        <td>biSizeImage</td>
        <td>4 Bytes</td>
        <td>图像数据的大小<code>(不含调色板)</code></td>
      </tr>
      <tr>
        <td>biXPelsPerMeter</td>
        <td>4 Bytes</td>
        <td>水平分辨率，用像素/米表示，<code>有符号整数</code></td>
      </tr>
      <tr>
        <td>biYPelsPerMeter</td>
        <td>4 Bytes</td>
        <td>垂直分辨率，用像素/米表示，<code>有符号整数</code></td>
      </tr>
      <tr>
        <td>biClrUsed</td>
        <td>4 Bytes</td>
        <td>实际使用的调色板索引数，0则使用所有索引</td>
      </tr>
      <tr>
        <td>biClrImportant</td>
        <td>4 Bytes</td>
        <td>重要的调色板索引数，0表示都重要。</td>
      </tr>
    </tbody>
  </table>

- #### BMP图像数据区
  <table width="100%">
    <thead>
      <tr style="text-align: left;">
        <th width="9%">名字</th>
        <th width="17%">大小（大端）</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>调色板</td>
        <td>根据位数决定</td>
        <td>8bpp（2的8次方=256色）及以下的位图才有调色板，调色板索引数最多为256个像素，每个调色板像素使用<code>BGRA</code>的颜色顺序，Alpha一般不需要，保留0。<br>因此，2,16和256色图像使用的调色板占用大小分别为：<code>2*4=8 Bytes</code>，<code>16*4=64 Bytes</code>，<code>256*4=1024 Bytes</code></td>
      </tr>
      <tr>
        <td rowspan="4">图像数据</td>
        <td>当biBitCount=1时，<br>8个像素占1个字节</td>
        <td rowspan="4">
          图像数据记录了位图的每一个像素值，记录顺序是从左到右扫描行，扫描行之间是从下到上，个别翻转行序则为从上到下。<br>32bpp的颜色通道顺序同样是<code>BGRA</code>，Windows规定一个扫描行所占的字节数必须是4的倍数，不足的以0填充，所以图像的宽高相乘未必等于biSizeImage。<br>一个扫描行所占的字节数计算方法：<br><code>skip = 4 - (biWidth*biBitCount)>>3 & 3</code><br><code>biWidth += (skip!=4 and skip) or 0</code>
        </td>
      </tr>
      <tr>
        <td>当biBitCount=4时，<br>2个像素占1个字节</td>
      </tr>
      <tr>
        <td>当biBitCount=8时，<br>1个像素占1个字节</td>
      </tr>
      <tr>
        <td>当biBitCount=24时，<br>1个像素占3个字节</td>
      </tr>
    </tbody>
  </table>
