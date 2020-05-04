---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      Python - 批量制作图种
heading:    
header_img: 
categories: ["Python"]
tags:       [Image Process,PIL,图种]
date: 2019-03-27 09:28:14 +0800
# last_modified_at : 
excerpt: "什么是图种，就是一种包含压缩文件的图片。改后缀名可以正常解压，改为图片格式又可以正常预览。"
---

* content
{:toc}

&emsp;&emsp;什么是图种，就是一种包含压缩文件的图片。改后缀名可以正常解压，改为图片格式又可以正常预览。
简单的说就是把图片与压缩文件用二进制的方式合并起来。图片数据在前，压缩文件数据在后。

虽然Batch脚本一条语句就可以生成，但是我们要讲究批量和自动化嘛，所以用python来实现。

![ ](https://raw.githubusercontent.com/Sryml/Image/master/%E5%9B%BE%E7%A7%8D%E5%88%B6%E4%BD%9C.png)

### 1. 设置任务列表
- 创建一个`Import`文件夹，将要处理的图片和压缩包放进去。
- 与压缩包同名的图片将优先和压缩包合并，没有则与默认图片`default.*`合并，没有放入默认图片则自动生成黑色图片与之合并。
- 支持的图片格式：`*.jpg`，`*.png`，`*.bmp`
- 支持的压缩格式：`*.rar`，`*.zip`，`*.7z`

```python
# -*- coding: utf-8 -*-
# python 3.7.2

import os
import io

from timeit import timeit

#
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

# ---
ALL_TASK= []
IMPORT_FOLDER= 'Import/'
EXPORT_FOLDER= 'Export/'
# ---


def SetTaskList():
    global ALL_TASK
    ALL_TASK= []
    if not os.path.exists(EXPORT_FOLDER):
        os.makedirs(EXPORT_FOLDER)
    
    files= os.listdir(IMPORT_FOLDER)
    default_img= ['default'+i for i in ('.jpeg','.jpg','.png','.bmp')]
    ImgM= None
    ext= '.jpeg'
    # 判断是否存在默认图，没有则自动创建
    for img in default_img:
        if img in files:
            ImgM= Image.open(IMPORT_FOLDER+img)
            ext= os.path.splitext(img)[1]
            ext= '.jpeg' if ext=='.jpg' else ext
            files.remove(img)
            break
    if not ImgM:
        ImgM= Image.new('L', (32,32), (60,))
        
    # 第一行写入图片扩展名
    ImgM_Bytes= io.BytesIO()
    ImgM_Bytes.write(ext.encode()+ b'\n')
    ImgM.save(ImgM_Bytes, ext[1:])

    # 判断是否有对应的'同名字'图片，没有则与默认图合成
    for f in files:
        split= os.path.splitext(f)
        if split[1].lower() in ('.rar','.zip','.7z'):
            imgs= [split[0]+i for i in ('.jpeg','.jpg','.png','.bmp')]
            cover_image= None
            for img in imgs:
                if img in files:
                    cover_image= img
                    break
            
            ALL_TASK.append((f,cover_image or ImgM_Bytes))
```

<br>

### 2. 多线程分配任务
```python
def AssignTask():
    pool = ThreadPoolExecutor()
    results = list(pool.map(CreateImgSeed, ALL_TASK))
    pool.shutdown()
    
    print ('{}个图种制作完毕！'.format(len(ALL_TASK)))
```

<br>

### 3. 创建图种
- 用二进制格式打开
- 最终输出文件以压缩包名字命名，保持对应图片扩展名
```python
def CreateImgSeed(task):
    pack, img= task
    with open(IMPORT_FOLDER+pack,'rb') as p:
        if type(img)==str:
            with open(IMPORT_FOLDER+img, 'rb') as i:
                ext= os.path.splitext(img)[1]
                img_data= i.read()
        else:
            datas= img.getvalue()
            i= datas.index(b'\n')
            ext= datas[:i].decode()
            img_data= datas[i+1:]
                
        # 最终输出文件以压缩包名字命名，保持对应图片扩展名
        out_file= open(EXPORT_FOLDER + os.path.splitext(pack)[0] + ext, 'wb')
        out_file.write(img_data)
        out_file.write(p.read())
        out_file.close()
```

<br>

---

### 完整代码
- ImgSeed.py

```python
# -*- coding: utf-8 -*-
# python 3.7.2

import os
import io

from timeit import timeit

#
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

# ---
ALL_TASK= []
IMPORT_FOLDER= 'Import/'
EXPORT_FOLDER= 'Export/'
# ---


def SetTaskList():
    global ALL_TASK
    ALL_TASK= []
    if not os.path.exists(EXPORT_FOLDER):
        os.makedirs(EXPORT_FOLDER)
    
    files= os.listdir(IMPORT_FOLDER)
    default_img= ['default'+i for i in ('.jpeg','.jpg','.png','.bmp')]
    ImgM= None
    ext= '.jpeg'
    # 判断是否存在默认图，没有则自动创建
    for img in default_img:
        if img in files:
            ImgM= Image.open(IMPORT_FOLDER+img)
            ext= os.path.splitext(img)[1]
            ext= '.jpeg' if ext=='.jpg' else ext
            files.remove(img)
            break
    if not ImgM:
        ImgM= Image.new('L', (32,32), (60,))
        
    # 第一行写入图片扩展名
    ImgM_Bytes= io.BytesIO()
    ImgM_Bytes.write(ext.encode()+ b'\n')
    ImgM.save(ImgM_Bytes, ext[1:])

    # 判断是否有对应的'同名字'图片，没有则与默认图合成
    for f in files:
        split= os.path.splitext(f)
        if split[1].lower() in ('.rar','.zip','.7z'):
            imgs= [split[0]+i for i in ('.jpeg','.jpg','.png','.bmp')]
            cover_image= None
            for img in imgs:
                if img in files:
                    cover_image= img
                    break
            
            ALL_TASK.append((f,cover_image or ImgM_Bytes))
    
    
def CreateImgSeed(task):
    pack, img= task
    with open(IMPORT_FOLDER+pack,'rb') as p:
        if type(img)==str:
            with open(IMPORT_FOLDER+img, 'rb') as i:
                ext= os.path.splitext(img)[1]
                img_data= i.read()
        else:
            datas= img.getvalue()
            i= datas.index(b'\n')
            ext= datas[:i].decode()
            img_data= datas[i+1:]
                
        # 最终输出文件以压缩包名字命名，保持对应图片扩展名
        out_file= open(EXPORT_FOLDER + os.path.splitext(pack)[0] + ext, 'wb')
        out_file.write(img_data)
        out_file.write(p.read())
        out_file.close()


def AssignTask():
    pool = ThreadPoolExecutor()
    results = list(pool.map(CreateImgSeed, ALL_TASK))
    pool.shutdown()
    
    print ('{}个图种制作完毕！'.format(len(ALL_TASK)))
    
    
def start():
    SetTaskList()
    sec = timeit(lambda:AssignTask(),number=1)
    print ('Time used: {0:.3f} sec\n'.format(sec))
    s= input('按回车键退出...\n')
    
    
    
if __name__ == '__main__':
    while True:
        s= input('开始制作图种(Y/N): ')
        if s.lower()== 'y':
            start()
            break
        elif not s or s.lower()== 'n':
            break
    
    
```
