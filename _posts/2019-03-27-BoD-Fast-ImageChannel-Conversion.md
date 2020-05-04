---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      BoD快速图像通道转换
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness","Python"]
tags:       [BoD,Image Process,PIL]
date: 2019-03-27  09:28:02 +0800
# last_modified_at : 
excerpt: "黑刃里有一些图片在外面直接打开查看的话，颜色是偏向蓝色的，就像早期用游戏自带的F2截图出来的图片文件一样。但这些图片在游戏里显示却是正常的，这到底是为什么呢？当然是你撸多……"
---

* content
{:toc}

![blade](https://raw.githubusercontent.com/Sryml/Image/master/20190529003457.jpg)

> 黑刃里有一些图片在外面直接打开查看的话，颜色是偏向蓝色的，就像早期用游戏自带的F2截图出来的图片文件一样。但这些图片在游戏里显示却是正常的，这到底是为什么呢？当然是你撸多……哦不是！这其实是图片数据存储顺序有关，这种图片的通道存储顺序为`BGR`。<br>
现在的软件读取图片默认都是`RGB`模式，可能是历史原因，早期`BGR`模式比较流行，python的opencv使用的也是`BGR`。

那么，我们可以使用图像处理软件将图像的`R和B通道调换`即可。经测试录制PS动作批量处理效率是很慢的，又占资源。
不到20行的python代码可以帮你处理这个问题，是的，转换100张图片也只需3秒钟。
- ImageToBGR.py
  ```python
  # -*- coding: utf-8 -*-
  # python 3.7.2

  from PIL import Image
  import os

  AllFiles = os.listdir('./') #脚本与图片文件在同一目录

  for f in AllFiles:
      try:
          img = Image.open(f)
          channels = list(img.split())
          channels[0],channels[2] = channels[2],channels[0]
          img = Image.merge(img.mode,channels)
          img.save(f)
          img.close()
      except:
          pass
  ```
