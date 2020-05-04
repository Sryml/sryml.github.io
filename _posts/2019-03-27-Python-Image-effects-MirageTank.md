---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      Python - 批量生成幻影坦克图片
heading:    
header_img: 
categories: ["Python"]
tags:       [Image Process,PIL,幻影坦克]
date: 2019-03-27 09:28:13 +0800
# last_modified_at : 
excerpt: "幻影坦克（Mirage Tank），《红色警戒2》以及《尤里的复仇》中盟军的一款伪装坦克，盟军王牌坦克之一。是爱因斯坦在德国黑森林中研发的一种坦克。"
---

* content
{:toc}

说到幻影坦克，我就想起红色警戒里的……

> ~~幻影坦克（Mirage Tank），《红色警戒2》以及《尤里的复仇》中盟军的一款伪装坦克，盟军王牌坦克之一。是爱因斯坦在德国黑森林中研发的一种坦克。虽然它无法隐形，但它却可以利用先进的光线偏折原理可以伪装成树木（岩石或草丛）来隐藏自己。~~
> 在一些MOD中，幻影坦克可以选择变换的树木，这样便可以和背景的树木融合，而不会令人生疑。

额！这是从什么百科ctrl+v过来的吗。我跟你说个P~ UBG
不过话说回来，里面有一句说到<span style="background-color:yellow;">和背景融合</span>，这大概就是这种图片的原理所在了。
一些聊天软件或网站总是以白色背景和黑色背景（夜间模式）显示图片，你在默认的白色背景下看到一张图（图A），但是点击放大却变成另一张图（图B）。这是因为查看详情使用的背景是黑色背景。

之前在网上看到用PS制作幻影坦克效果图的方法，了解到几个图层混合模式的公式，也录制过PS动作来自动化操作。但总感觉不够效率，作为极客嘛，当然是要用代码来完成这些事情。

![ ](https://raw.githubusercontent.com/Sryml/Image/master/%E5%B9%BB%E5%BD%B1%E5%9D%A6%E5%85%8B.png)

这个脚本生成的最终效果：
*点击放大查看，这类图片使用手机QQ浏览效果最佳*
<img src='https://raw.githubusercontent.com/Sryml/Image/master/Izumi%20Sagiri.png' alt='幻影坦克效果' style='max-width:60%;background-color: white;'>

---

### 一、准备图片
- 创建一个文件夹`Import`，将你要处理的所有图片都放到这个文件夹里
- 图片的命名方式：
  - 白色背景显示图A、黑色背景显示图B这种形式的，图B的文件名字是图A的名字加后缀`_d`
  例如，图A为`1.png`，图B则为`1_d.png`，与之配对成为一组即可
  - 表面是白色图片（图A），点击显示隐藏图片（图B）。这里并不需要你指定一张白色图片，不需要更改图片名字，程序找不到与之配对的后缀`_d`图片，会自动生成白色图片（图A）
  - 相反的，表面看是图片（图A），点击却消失成纯黑色（图B）。只需要在图片名字加后缀`_black`
<br>

### 二、Python+PIL代码实现过程
#### Ⅰ. 初始化
*注：脚本文件与 `Import`文件夹在同一目录*
- 运行，导入模块，定义变量，创建导出目录`Export`，并将工作目录切换到`Import`

  ```python
  # -*- coding: utf-8 -*-
  # python 3.7.2
  # 2019/04/21 by sryml.

  import os
  import math

  from timeit import timeit
  from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
  from multiprocessing import cpu_count

  #
  import numba as nb
  import numpy as np

  from PIL import Image


  # ---
  IMPORT_FOLDER = 'Import'
  EXPORT_FOLDER = 'Export'
  IMAGE_FILES = []

  #
  ALIGN2_A = 0
  ALIGN2_B = 1
  ALIGN2_MAX = 'max'

  NO_MODIFT = 0
  STRETCH = 1
  CONSTRAINT_RATIO = 2

  # ---


  if __name__ == '__main__':
      if not os.path.exists(EXPORT_FOLDER):
          os.makedirs(EXPORT_FOLDER)
      os.chdir(IMPORT_FOLDER)
  ```

<br>

#### Ⅱ. 将所有要处理的图片文件添加到列表
- 执行`all_img2list()`
  获取当前目录（Import）所有文件，按名字升序排序。将后缀带`_d`的图B与图A配对一组，白图到原图，原图到黑图的图片也进行相关标记并存到一个列表。*每个元组将生成一张幻影坦克图片*

  ```python
  def all_img2list():
      global IMAGE_FILES
      IMAGE_FILES= []
      Imgs = os.listdir('./')
      Imgs.sort(key= lambda i: os.path.splitext(i)[0])
      
      for i in Imgs:
          name = os.path.splitext(i)
          imgB= name[0]+'_d' + name[1]
          
          if imgB in Imgs:
              Imgs.remove(imgB)
              img_group= (i,imgB)
          elif name[0][-6:].lower() == '_black':
              img_group= (i,'_black')
          else:
              img_group= (i,None)
              
          IMAGE_FILES.append(img_group)
  ```

<br>

#### Ⅲ. 自动化处理，多进程任务分配
- 执行`AutoMTank()`
  不想让cpu满载运行，进程数量为cpu总核心减1，将列表里所有元组分成N等份集合的列表`task_assign`（N为进程数量）

  ```python
  def AutoMTank():
      cpu  = cpu_count()-1
      pool = ProcessPoolExecutor(cpu) #max_workers=4
      L    = IMAGE_FILES
      F    = int(len(L)/cpu)
      task_assign = [L[n*F:] if (n+1)==cpu else L[n*F:(n+1)*F] for n in range(cpu)]
      results = list(pool.map(FlashMakeMTank, task_assign))

      pool.shutdown()
          
      print ('\n%d辆幻影坦克制作完成！' % len(IMAGE_FILES))
  ```

- 每个进程对接到的任务列表进行多线程处理：`FlashMakeMTank`
  因为是图片算法处理，属于计算密集型，线程数量不需要太多。经过测试多线程还是有点效率提升的，线程数就设置为cpu核心数吧。

  ```python
  def FlashMakeMTank(task):
      pool = ThreadPoolExecutor(cpu_count())
      results = list(pool.map(MakeMTank, task))
      pool.shutdown()
  ```

<br>

#### Ⅳ. 盟军战车工厂
- 每个线程都将它接到的任务 - **图片组**丢给我们的盟军战车工厂：`MakeMTank` 来生产幻影坦克
- 开头是打开图A和图B文件对象赋值给`imgA`和`imgB`，判断到那些想要`白图到原图`效果的图片，则在内存中生成一张纯白色的图片对象赋值给`imgA`。`原图到黑图`则生成纯黑色图片对象赋值给`imgB`
- 别以为这战车工厂看起来这么短，实际上算法都是通过调用函数获得返回结果，解释起来可有点费劲

  ```python
  def MakeMTank(i_group):
      ratios= [0,0]
      align= []
      if not i_group[1]:
          imgB= Image.open(i_group[0])
          imgA= Image.new('L',imgB.size,(255,))
      elif i_group[1]=='_black':
          imgA= Image.open(i_group[0])
          imgB= Image.new('L',imgA.size,(0,))
      else:
          imgA= Image.open(i_group[0])
          imgB= Image.open(i_group[1])
          ratios= [0.5,-0.5] #明度比值
          
          # ALIGN2_MAX(取最大的宽和最大的高) ALIGN2_A(缩放到图A) ALIGN2_B(缩放到图B) 
          # NO_MODIFT(不修改)  STRETCH(拉伸)  CONSTRAINT_RATIO(约束比例)
          align= [ALIGN2_B, CONSTRAINT_RATIO]
          
      A_Size,B_Size= imgA.size,imgB.size
      img_objs= [imgA,imgB]
      for n,img in enumerate(img_objs):
          if img.mode== 'RGBA':
              img= img.convert('RGB')
          img_array= np.array(img)
          if img.mode != 'L' and ( [(img_array[:,:,i]==img_array[:,:,2]).all() for i in range(2)]!= [True,True] ):
              img= Desaturate(img_array) #去色
          else:
              img= img.convert('L')
              
          if align and (A_Size!=B_Size):
              img= ImgAlign(n,img,A_Size,B_Size,align) #图像对齐
                      
          if ratios[n]:
              img= Lightness(img,ratios[n]) #明度
          img_objs[n]= img
          
      imgA,imgB = img_objs
      
      imgA = Invert(imgA) #反相
      imgO = LinearDodge(imgA, imgB) #线性减淡（添加）
      imgR = Divide(imgO, imgB) #划分
      imgR_mask = AddMask(imgR, imgO) #添加透明蒙版

      name= os.path.splitext(i_group[0])[0]
      imgR_mask.save('../'+EXPORT_FOLDER+'/' + name+'.png')
  ```

- 图片对象打开完成之后呢，把它们放到一个列表里遍历它进行操作
- 首先判断到图片模式是否为`RGBA`，最后的A表示这张图片是带有透明通道的。而我们的幻影坦克原理就是利用的透明通道，怎能让它来胡搅蛮缠呢，速速将它转换为`RGB`模式
- 接着将图像对象转为数组，判断这张图片如果不是`灰度`模式并且还没有`去色`的情况下，那就要对它进行去色操作了。
 去完色的再将它转为灰度模式。<br>
  有些人可能对`灰度`和`去色`有什么误解，<span style="background-color:yellow;">灰度 ≠ 去色</span>，这是重点。虽然它们的结果都是灰色的图片，但是算法不一样，呈现的图片对比度也不一样，<span style="background-color:yellow;">直接转成灰度的坦克是没有灵魂的</span>。RGB图片直接转灰度会丢失一些细节，所以要对它进行去色操作。**下面的操作都是仿照PS的步骤来处理了**
<br>

- ##### (1) <font color='Crimson'>去色函数：<code>Desaturate</code></font>
  - **公式：( max(r,g,b) + min(r,g,b) ) / 2**
  *每个像素取其RGB颜色中最大与最小值的均数*
  - **这个函数接受一个数组参数**<br><br>
  
  例如某个像素RGB值`(233,50,23)`，计算得出 **(233+23) / 2 = 128**，这时候此像素点三个通道都是同一个值`(128,128,128)`
  这个算法过程消耗的性能较多，像一张1000*1000的图片就得进行一百万次计算，因此我使用了`numba.jit`加速。
  对图片数组进行操作，使用`argsort()`将所有像素的RGB值从小到大排序并返回一个索引数组。
  `uint8`类型的值的范围在0~255，若计算出的值不在这范围则会抛出溢出错误，因此使用了`int`。
  我创建了一个灰度图片数组`data`，将每一个对应像素的均值赋值给它，相当于去色后再转为灰度模式。
  最后返回由数组转换成的图片对象

  ```python
  @nb.jit
  def Desaturate(img_array):
      idx_array = img_array.argsort()
      width   = img_array.shape[1]
      height  = img_array.shape[0]
      data    = np.zeros((height,width),dtype=np.uint8)
      for x in range(height):
          for y in range(width):
              idx= idx_array[x,y]
              color_min= img_array[x,y, idx[0]]
              color_max= img_array[x,y, idx[2]]
              data[x,y]= round( (int(color_min) + int(color_max)) / 2 )
      return Image.fromarray(data)
  ```

<br>

- ##### (2) <font color='Crimson'>图像对齐：<code>ImgAlign</code></font>
  - **对齐方式（列表类型两个值）**
  
    <table width='100%'>
        <tr>
            <th colspan='2' width='50%'>
                对齐目标
            </th>
            <th colspan='2' width='50%'>
                缩放图像
            </th>
        </tr>
        <tr>
            <td align="left" width='25%'>
                ALIGN2_MAX
            </td>
            <td align="left" width='25%'>
                取最大的宽和最大的高
            </td>
            <td align="left" width='25%'>
                NO_MODIFT
            </td>
            <td align="left" width='25%'>
                不修改（缩小或仅画布）
            </td>
        </tr>
        <tr>
            <td align="left" width='25%'>
                ALIGN2_A
            </td>
            <td align="left" width='25%'>
                图A
            </td>
            <td align="left" width='25%'>
                STRETCH
            </td>
            <td align="left" width='25%'>
                拉伸
            </td>
        </tr>
        <tr>
            <td align="left" width='25%'>
                ALIGN2_B
            </td>
            <td align="left" width='25%'>
                图B
            </td>
            <td align="left" width='25%'>
                CONSTRAINT_RATIO
            </td>
            <td align="left" width='25%'>
                约束比例
            </td>
        </tr>
    </table>
    
    例如我要把图A对齐到图B且按比例缩放：`mode = [ALIGN2_B, CONSTRAINT_RATIO]`
  - **这个函数接受5个参数**
    ①当前图片序号（0代表图A，1代表图B）
    ②当前图片对象
    ③ - ④图A和图B的尺寸
    ⑤对齐方式

  ```python
  def ImgAlign(idx,img,A_Size,B_Size,mode):
      size= img.size
      old_size= (A_Size,B_Size)

      if mode[0]== ALIGN2_MAX:
          total_size= max(A_Size[0], B_Size[0]), max(A_Size[1], B_Size[1])
          if size != total_size:
              if mode[1]== STRETCH:
                  img= img.resize(total_size, Image.ANTIALIAS)
              else:
                  new_img= Image.new('L',total_size, (255 if idx==0 else 0,))
                  diff= (total_size[0]-size[0],total_size[1]-size[1])
                  min_diff= min(diff[0],diff[1])
                  if min_diff != 0 and mode[1]:
                      idx= diff.index(min_diff)
                      scale= total_size[idx] / size[idx]
                      resize= [total_size[idx], round(size[1-idx]*scale)]
                      if idx:
                          resize.reverse()
                      img= img.resize(resize, Image.ANTIALIAS)
                  new_img.paste(img, [(total_size[i]-img.size[i])//2 for i in range(2)])
                  img= new_img
      elif idx != mode[0]:
          total_size= old_size[mode[0]]
          if mode[1]== STRETCH:
              img= img.resize(total_size, Image.ANTIALIAS)
          else:
              new_img= Image.new('L',total_size, (255 if idx==0 else 0,))
              diff= (total_size[0]-size[0],total_size[1]-size[1])
              min_diff= min(diff[0],diff[1])
              if (min_diff > 0 and mode[1]) or (min_diff < 0):
                  idx= diff.index(min_diff)
                  scale= total_size[idx] / size[idx]
                  resize= [total_size[idx], round(size[1-idx]*scale)]
                  if idx:
                      resize.reverse()
                  img= img.resize(resize, Image.ANTIALIAS)
              new_img.paste(img, [(total_size[i]-img.size[i])//2 for i in range(2)])
              img= new_img
              
      return img
  ```

<br>

- ##### (3) <font color='Crimson'>明度函数：<code>Lightness</code></font>
  - **公式：255 \* ratio + img \* (1-ratio)**
    &emsp;&emsp;&emsp; &nbsp;&nbsp;&nbsp;**0 \* ratio + img \* (1-ratio)**
  *为什么是两条公式呢，可以看到只有 255和 0的区别，一个是提高明度，一个是降低*
  - 注意，<span style="background-color:yellow;">明度 ≠ 亮度</span>，用亮度做出来的坦克是畸形的。亮度对颜色0和255不会起任何作用，任你怎么加亮度，我白是白，黑仍然是黑。这又涉及到幻影坦克效果的原理了，**图A每个像素值必须大于图B对应的像素值**，否则将没有透明度效果。
  - 所以，最好的效果就是图A明度提高50%，图B降低50%
  - **这个函数接受2个参数**
    ①图片对象
    ②明度比值（-1~1）
    尽量仿照PS的算法结果，提高明度的值为向下取整，降低明度为向上取整

    ```python
    def Lightness(img,ratio):
        if ratio>0:
            return img.point(lambda i: int(i*(1-ratio) + 255*ratio))
        return img.point(lambda i: math.ceil(i*(1+ratio)))
    ```

  - 实际上这是图层的`不透明度混合公式`，PS中，明度的实现就是在当前图层的上方创建一个白色或黑色图层，然后调整其透明度即可。所以，
  明度调 &nbsp;**100%** 相当于**白色图层**的不透明度为100%，显示纯白
  明度调 **-100%** 相当于**黑色图层**的不透明度为100%，显示纯黑。

看到这里，要暂停一下了。是不是感觉说了这么多都没有提到幻影坦克的详细原理，是的，只有当你理解了PS的`不透明度混合公式`，你才能理解后面的步骤。
<br>

- ##### (3-x) 重点！！推导幻影坦克的原理……
  - 这里需要用到PS的几个图层混合模式
  - **不透明度混合公式：`Img输出 = Img上 * o + Img下 * (1 - o)`**
    小字母`o`代表不透明度。想一想，把两张图片导入到PS，上面的图层命名为imgA，下面的图层为imgB。
    当imgA的不透明度为100%（o=1）时，根据图层混合公式得到`img输出=imgA`，也就是完全显示上层图像。
    当imgA的不透明度为0%（o=0）时，得到`img输出=imgB`，完全显示下层图像。
    当不透明度为50%，自然就看到了A与B的混合图像。
    
    但是我们要将这两张图给整进一张图里，然后在类似手机QQ这种只有白色背景和黑色背景的环境下，分别显示出imgA和imgB。听起来有点抽象，不要慌，我们来列方程。假设这张最终成果图为`imgR`
    
    <table width='100%'>
        <tr>
            <td align='left' width='35%'>
                ① <b>ImgA = ImgR * o + 255 * (1 - o)</b>
            </td>
            <td align='left'>
                白色背景下
            </td>
        </tr>
        <tr>
            <td align='left'>
                ② <b>ImgB = ImgR * o + &nbsp;&nbsp;&nbsp;&nbsp;0 * (1 - o)</b>
            </td>
            <td align='left'>
                黑色背景下（点击放大后）
            </td>
        </tr>
    </table>
    
    这时候`ImgR`充当上图层（**Img上**）。它有一个固定不透明度`o`，或者说是它的图层蒙版（`ImgO`表示ImgR的蒙版），蒙版的像素值为0~255的单通道灰度色值。填充为黑色0相当于图层的不透明度为0%，填充为白色相当于图层不透明度为100%。那么这个固定不透明度 o 实际上就是 **⑨ o = ImgO / 255**
    而**Img下**就是聊天软件中的白色背景和黑色背景两种可能了。
    
  **现在来解一下方程，由②得：**
  
    <table>
        <tr>
            <td align='left' bgcolor='#f7f7f7'>
                <font size=3>ImgR = ImgB / o<br>
                将⑨ o = ImgO / 255 代入得<br>
                ③ <b>ImgR = ImgB / ImgO * 255</font></b>
            </td>
        </tr>
    </table>
    
    将③和⑨代入①得：
    
    <table width='100%'>
        <tr>
            <td align='left' bgcolor='#f7f7f7'>
                <font size=3>ImgA = (ImgB / ImgO * 255) * (ImgO / 255) + 255 * (1 - ImgO / 255)<br>
                ImgA = ImgB / ImgO * ImgO / 255 * 255 + 255 * (1 - ImgO / 255)<br><br>
                ImgA = ImgB + 255*1 - 255*(ImgO / 255)<br>
                ImgA = ImgB + 255 - ImgO<br><br>
                ④ <b>ImgO = (255 - ImgA) + ImgB</font></b>
            </td>
        </tr>
    </table>
    
    那么现在，**ImgB**是我们已知的要在黑色背景下显示的图像，只要拿到**ImgO**就可以得出成品图**ImgR**了。
    (255 - ImgA) 这个是什么意思，就是PS中的反相操作啦。让我们回到代码操作
    <br>

- ##### (4) <font color='Crimson'>反相函数：<code>Invert</code></font>
  - **公式：255 - Img**
    *即对每个像素进行 255-像素值*
    ```python
    def Invert(img):
        return img.point(lambda i: 255-i)
    ```
	**反ImgA = Invert(ImgA )**
	然后这个反相后的ImgA（反ImgA）与ImgB相加，即PS中的**线性减淡**模式
	<br>

- ##### (5) <font color='Crimson'>线性减淡（添加）：<code>LinearDodge</code></font>
  - **公式：Img上 + Img下**
    ```python
    def LinearDodge(imgA, imgB):
        size = imgA.size
        imgO = Image.new('L',size,(0,))
        pxA= imgA.load()
        pxB= imgB.load()
        pxO= imgO.load()
        for x in range(size[0]):
            for y in range(size[1]):
                pxO[x,y] = (pxA[x,y]+pxB[x,y],)
        return imgO
    ```
	至此得到 **ImgO = LinearDodge(反ImgA, ImgB)**
	注：之前我们说过ImgA的所有像素值必须大于ImgB。如果小于或等于，那么反相后加自身（或加比自身大的值）就是255了。因为ImgO是成果图ImgR的透明蒙版，ImgO=255意味着不透明度为100%，就没有透明效果了。
	
	接着看方程式子③ **ImgR = ImgB / ImgO * 255**，这便是PS的一种图层混合模式**划分**了
	<br>

- ##### (6) <font color='Crimson'>划分：<code>Divide</code></font>
  - **公式：Img下 / Img上 * 255**
  - 几个注意的条件
    ①若混合色为黑色，基色非黑结果为白色、基色为黑结果为黑色（混合色是Img上，基色是Img下）
    ②若混合色为白色则结果为基色
    ③若混合色与基色相同则结果为白色
    *不妨可以在PS中一试便知真假*
	```python
	def Divide(imgO, imgB):
	    size = imgB.size
	    imgR = Image.new('L',size,(0,))
	    pxB= imgB.load()
	    pxO= imgO.load()
	    pxR= imgR.load()
	    for x in range(size[0]):
	        for y in range(size[1]):
	            o=pxO[x,y]
	            b=pxB[x,y]
	            if o==0:
	                #如混合色为黑色，基色非黑结果为白色、基色为黑结果为黑色
	                color= (b and 255 or 0,)
	            elif o==255:
	                #混合色为白色则结果为基色
	                color=(b,)
	            elif o==b:
	                #混合色与基色相同则结果为白色
	                color=(255,)
	            else:
	                color=(round((b/o)*255),)
	            pxR[x,y] = color
	    return imgR
	```
	调用划分函数**ImgR = Divide(ImgO, ImgB)**，终于，我们得到了梦寐以求的成果图**ImgR**
	但不要忘了它的不透明度，把**ImgO**添加为它的图层蒙版
	<br>

- ##### (6) 最后：添加透明蒙版并保存
  ```python
  def AddMask(imgR,imgO):
      img = imgR.convert("RGBA")
      img.putalpha(imgO)
      return img
  ```
  **imgR_mask = AddMask(imgR, imgO)**
  ```python
  name= os.path.splitext(i_group[0])[0]
  imgR_mask.save('../'+EXPORT_FOLDER+'/' + name+'.png')
  ```
保存在导出文件夹。。。
- ##### 个人感觉
  这个脚本生成的幻影坦克与PS做的相比就犹如真假美猴王一般，~~说到美猴王，我就想起……~~

---

<br>

### 三、完整代码文件
- MirageTank.py

```python
# -*- coding: utf-8 -*-
# python 3.7.2
# 2019/04/21 by sryml.

import os
import math

from timeit import timeit
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
from multiprocessing import cpu_count

#
import numba as nb
import numpy as np

from PIL import Image


# ---
IMPORT_FOLDER = 'Import'
EXPORT_FOLDER = 'Export'
IMAGE_FILES = []

#
ALIGN2_A = 0
ALIGN2_B = 1
ALIGN2_MAX = 'max'

NO_MODIFT = 0
STRETCH = 1
CONSTRAINT_RATIO = 2

# ---




### 图像对齐
def ImgAlign(idx,img,A_Size,B_Size,mode):
    size= img.size
    old_size= (A_Size,B_Size)

    if mode[0]== ALIGN2_MAX:
        total_size= max(A_Size[0], B_Size[0]), max(A_Size[1], B_Size[1])
        if size != total_size:
            if mode[1]== STRETCH:
                img= img.resize(total_size, Image.ANTIALIAS)
            else:
                new_img= Image.new('L',total_size, (255 if idx==0 else 0,))
                diff= (total_size[0]-size[0],total_size[1]-size[1])
                min_diff= min(diff[0],diff[1])
                if min_diff != 0 and mode[1]:
                    idx= diff.index(min_diff)
                    scale= total_size[idx] / size[idx]
                    resize= [total_size[idx], round(size[1-idx]*scale)]
                    if idx:
                        resize.reverse()
                    img= img.resize(resize, Image.ANTIALIAS)
                new_img.paste(img, [(total_size[i]-img.size[i])//2 for i in range(2)])
                img= new_img
    elif idx != mode[0]:
        total_size= old_size[mode[0]]
        if mode[1]== STRETCH:
            img= img.resize(total_size, Image.ANTIALIAS)
        else:
            new_img= Image.new('L',total_size, (255 if idx==0 else 0,))
            diff= (total_size[0]-size[0],total_size[1]-size[1])
            min_diff= min(diff[0],diff[1])
            if (min_diff > 0 and mode[1]) or (min_diff < 0):
                idx= diff.index(min_diff)
                scale= total_size[idx] / size[idx]
                resize= [total_size[idx], round(size[1-idx]*scale)]
                if idx:
                    resize.reverse()
                img= img.resize(resize, Image.ANTIALIAS)
            new_img.paste(img, [(total_size[i]-img.size[i])//2 for i in range(2)])
            img= new_img
            
    return img


### 去色
@nb.jit
def Desaturate(img_array):
    idx_array = img_array.argsort()
    width   = img_array.shape[1]
    height  = img_array.shape[0]
    data    = np.zeros((height,width),dtype=np.uint8)
    for x in range(height):
        for y in range(width):
            idx= idx_array[x,y]
            color_min= img_array[x,y, idx[0]]
            color_max= img_array[x,y, idx[2]]
            data[x,y]= round( (int(color_min) + int(color_max)) / 2 )
    return Image.fromarray(data)
                

### 明度
def Lightness(img,ratio):
    if ratio>0:
        return img.point(lambda i: int(i*(1-ratio) + 255*ratio))
    return img.point(lambda i: math.ceil(i*(1+ratio)))

    
### 反相
def Invert(img):
    return img.point(lambda i: 255-i)
    

### 线性减淡（添加）
def LinearDodge(imgA, imgB):
    size = imgA.size
    imgO = Image.new('L',size,(0,))
    pxA= imgA.load()
    pxB= imgB.load()
    pxO= imgO.load()
    for x in range(size[0]):
        for y in range(size[1]):
            pxO[x,y] = (pxA[x,y]+pxB[x,y],)
    return imgO

    
### 划分
def Divide(imgO, imgB):
    size = imgB.size
    imgR = Image.new('L',size,(0,))
    pxB= imgB.load()
    pxO= imgO.load()
    pxR= imgR.load()
    for x in range(size[0]):
        for y in range(size[1]):
            o=pxO[x,y]
            b=pxB[x,y]
            if o==0:
                #如混合色为黑色，基色非黑结果为白色、基色为黑结果为黑色
                color= (b and 255 or 0,)
            elif o==255:
                #混合色为白色则结果为基色
                color=(b,)
            elif o==b:
                #混合色与基色相同则结果为白色
                color=(255,)
            else:
                color=(round((b/o)*255),)
            pxR[x,y] = color
    return imgR

    
def AddMask(imgR,imgO):
    img = imgR.convert("RGBA")
    img.putalpha(imgO)
    return img



####
#### 将所有要处理的图片文件添加到列表
def all_img2list():
    global IMAGE_FILES
    IMAGE_FILES= []
    Imgs = os.listdir('./')
    Imgs.sort(key= lambda i: os.path.splitext(i)[0])
    
    for i in Imgs:
        name = os.path.splitext(i)
        imgB= name[0]+'_d' + name[1]
        
        if imgB in Imgs:
            Imgs.remove(imgB)
            img_group= (i,imgB)
        elif name[0][-6:].lower() == '_black':
            img_group= (i,'_black')
        else:
            img_group= (i,None)
            
        IMAGE_FILES.append(img_group)
    

def MakeMTank(i_group):
    ratios= [0,0]
    align= []
    if not i_group[1]:
        imgB= Image.open(i_group[0])
        imgA= Image.new('L',imgB.size,(255,))
    elif i_group[1]=='_black':
        imgA= Image.open(i_group[0])
        imgB= Image.new('L',imgA.size,(0,))
    else:
        imgA= Image.open(i_group[0])
        imgB= Image.open(i_group[1])
        ratios= [0.5,-0.5] #明度比值
        
        # ALIGN2_MAX(取最大的宽和最大的高) ALIGN2_A(缩放到图A) ALIGN2_B(缩放到图B) 
        # NO_MODIFT(不修改)  STRETCH(拉伸)  CONSTRAINT_RATIO(约束比例)
        align= [ALIGN2_B, CONSTRAINT_RATIO]
        
    A_Size,B_Size= imgA.size,imgB.size
    img_objs= [imgA,imgB]
    for n,img in enumerate(img_objs):
        if img.mode== 'RGBA':
            img= img.convert('RGB')
        img_array= np.array(img)
        if img.mode != 'L' and ( [(img_array[:,:,i]==img_array[:,:,2]).all() for i in range(2)]!= [True,True] ):
            img= Desaturate(img_array) #去色
        else:
            img= img.convert('L')
            
        if align and (A_Size!=B_Size):
            img= ImgAlign(n,img,A_Size,B_Size,align) #图像对齐
                    
        if ratios[n]:
            img= Lightness(img,ratios[n]) #明度
        img_objs[n]= img
        
    imgA,imgB = img_objs
    
    imgA = Invert(imgA) #反相
    imgO = LinearDodge(imgA, imgB) #线性减淡（添加）
    imgR = Divide(imgO, imgB) #划分
    imgR_mask = AddMask(imgR, imgO) #添加透明蒙版

    name= os.path.splitext(i_group[0])[0]
    imgR_mask.save('../'+EXPORT_FOLDER+'/' + name+'.png')


    
def FlashMakeMTank(task):
    pool = ThreadPoolExecutor(cpu_count())
    results = list(pool.map(MakeMTank, task))
    pool.shutdown()
    
        
def AutoMTank():
    cpu  = cpu_count()-1
    pool = ProcessPoolExecutor(cpu) #max_workers=4
    L    = IMAGE_FILES
    F    = int(len(L)/cpu)
    task_assign = [L[n*F:] if (n+1)==cpu else L[n*F:(n+1)*F] for n in range(cpu)]
    results = list(pool.map(FlashMakeMTank, task_assign))

    pool.shutdown()
        
    print ('\n%d辆幻影坦克制作完成！' % len(IMAGE_FILES))

        
    
# ---

def Fire():
    all_img2list()
    sec = timeit(lambda:AutoMTank(),number=1)
    print ('Time used: {} sec'.format(sec))
    s= input('\n按回车键退出...\n')



if __name__ == '__main__':
    if not os.path.exists(EXPORT_FOLDER):
        os.makedirs(EXPORT_FOLDER)
    os.chdir(IMPORT_FOLDER)
    
    while True:
        s= input('>>> 按F进入坦克：')
        if s.upper()== 'F':
            print ('少女祈祷中...')
            Fire() #开炮
            break
        elif not s:
            break
```
