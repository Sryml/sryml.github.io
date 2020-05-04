---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      BoD优化配置 (for win7/8/10)
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness"]
tags:       [BoD,Blade,game,patch]
date: 2019-06-02 19:08:09 +0800
# last_modified_at : 2019-06-02 19:08:09 +0800
excerpt: "BoD优化配置，集合多种图形渲染器，所有配置均已调配默认值，加速一键启动游戏。"
---

## 使用方法
1. 将压缩包里的所有文件解压覆盖到游戏主目录

2. 运行快速启动程序`Blade - QuickLaunch.bat`，推荐选项2为兼容性最强的OpenGL

3. Win10设置见脚注[^1]
[^1]:`Win10设置如图`![ ](https://raw.githubusercontent.com/Sryml/Image/master/win10%E4%B8%8D%E8%83%BD%E7%8E%A9%E7%9A%84%E7%9C%8B%E8%BF%99%E9%87%8C.png)

你可以自己设置分辨率，此后通过快速启动`Blade - QuickLaunch`进入游戏。推荐窗口化玩，在窗口化下的画面效果最佳，而且录制和截图颜色皆为正常。OpenGL窗口可以按组合键`Win+↑`最大化。

p.s. 如果你从启动菜单进入游戏，建议先将开头视频文件更名，否则在**dg_D3d**模式下会出现画面错位，文件路径`..\Data\video\EnglishUS\main.mpg`，或搜索视频文件名`main.mpg`
如：我将它改为`main_bak.mpg`


> 想要运行天人互动汉化版程序`cblade.exe`，需要选择`D3d i740 Windows98`，否则会出错，这个的缺点是看不到光源粒子，例如伊安娜关射骷髅头的机关，会看不到两只红眼效果。还有全屏的话分辨率最好不要和你桌面一样
  (不过个人还是不建议玩天人互动的汉化版，因为这个不够稳定容易崩溃，而且缺少流血/阴影等效果)


## 描述
BoD优化配置，集合多种图形渲染器，所有配置均已调配默认值，加速一键启动游戏。

我的台式win7系统可以完美使用D3d+dgVoodoo，硬件信息：
> Windows 7 x64 sp1
> i5-2320 3.00GHz
> 16G RAM
> AMD Radeon HD 7850

- **关于dgVoodoo**
  dgVoodoo 2.55.4 Graphics API Wrapper by Dege
  <http://dege.fw.hu/>

- **快速启动BoD v1.1**
  ![Blade - QuickLaunch](https://raw.githubusercontent.com/Sryml/Image/master/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8%E7%A8%8B%E5%BA%8F02.png)

  <br>

  在win7或更高级的系统，有一个系统自带的游戏管理器，按下Win键，在开始菜单的侧边栏有一个游戏选项。

  ![游戏管理器](https://raw.githubusercontent.com/Sryml/Image/master/%E6%88%AA%E5%9B%BE20190709222427.png)

  它会自动收集你玩过的游戏信息，当你运行一个游戏，系统会运行`rundll32.exe`来调用一个库`gameux.dll`，很多老游戏都有这个情况。
  这个库会联网更新游戏信息，当没有网络或者检查不到游戏信息就会一直阻塞导致游戏无法正常运行。这属于win7系统的bug，我几乎没使用过这个游戏管理器。
  因为win xp不存在gameux.dll这个文件，所以以前从来没出现过这种情况。

  我找到了三种解决方法：
  1. 一个batch脚本`Blade - QuickLaunch.bat`，运行两次.exe，当第二个.exe的窗口出现后脚本会自动关闭第一个Blade.exe和rundll32.exe。
  这是很有效的方法，还有添加了快速启动控制台的功能。
  我已经完善了脚本并更新到了1.1。

  2. 将gameux.dll文件重命名，使它无法被加载。
  在`C:\Windows\SysWOW64\gameux.dll`
  修改为
  `gameux.dll.bak`

  3. 修改注册表，在`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\GameUX\`
      有一个类似`S-1-5-21-284290709...`这样的项，里面是一些自定义游戏信息。
      只需要将一个键值`ConfigInstallType`的数据修改为`4`，游戏管理器将不再检查和更新这个游戏。
      多个游戏版本需要修改所有项中的键ConfigInstallType。

      ```batch
      @echo off

      set r=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\GameUX
      for /f "tokens=2" %%i in ('whoami /user ^| find /i "%username%"') do set "SID=%%i"

      for /f %%i in ('reg query %r%\%SID%') do reg add %%i /v ConfigInstallType /t REG_SZ /d 4 /f

      pause
      ```

      将代码复制到一个文本文档并保存为`DisableUpdate.bat`，运行它会自动禁用当前所有游戏的更新信息功能。
      有一个缺陷是，如果你新增了游戏的拷贝副本，它的ConfigInstallType值默认为3，你需要重新运行一次DisableUpdate.bat。

  目前这三个方案工作良好。

<br>

- **图形渲染器**
  - D3d + *dgVoodoo*
    *version: from usa patch 1.01*
    - 仅部分机器可以正常使用
    - 效果非常完美，抗锯齿，各向异性过滤，大雾环境，画面色彩鲜艳，加载速度非常快
    - 缺陷：光源粒子会降低画面帧数

  - OpenGL
    *version: Alpha 2*
    - 兼容性最强的选择
    - 画面效果比不上dg_D3d，大雾环境较差
    - 要开启MipMapping，需要将Filter Mode设置为带`MIPMAP`的选项，不过可能出现画面卡顿现象
    - 缺陷：光源粒子贴图的Alpha透明效果无效

  - r3Dfx Voodoo 1-2 + *dgVoodoo*
    *version: from usa patch 1.01*
    - 画质较差，水的效果很差，特别在卡轮岛`Island_M8`，大雾和水很不协调
    - 分辨率需要在`dgVoodooCpl.exe`里更改
    - 缺陷：最重要的是不支持大于256x256的贴图
  <br>
    
  `注：dgVoodoo与ENBSeries不兼容`


## 更新日志
- 2019-05-30
  * 根据**sgi1981**提供的方法，我将OpenGL的大雾值修改为0.007（虽然没有太大变化，[sgi版本](http://www.arokhslair.net/forum/viewtopic.php?f=11&t=3760&start=15#p31358)为0.004）
  * 由于`r3Dfx Voodoo 1-2.dll`文件名带空格无法在快速启动中使用，所以将其更改为`r3Dfx_Voodoo_1_2.dll`

- 2018-12-05
  * 优化`dg_D3d`模式的光源，只有火把火炬之类的光源粒子会被关闭，其他例如伊安娜关卡的红眼骷髅头机关则不会被关闭

- 2018-05-14
  * 使用`dg_D3d`会导致画面在光源多的地方很卡，原因是光的可见粒子，所以我在脚本文件`Globals.py`中添加了关闭光的可见粒子的功能，每次进入新游戏或读档都会自动执行

---

- dgVoodoo2_55
  * 流体熔岩显示已正常
  * F2截图正常

- dgVoodoo2_54
  * 支持8倍抗锯齿
  * 支持16倍各向异性过滤
  * 强制垂直同步
  * 可调节游戏亮度/饱和度/对比度
  * 流体熔岩无法显示
  * F2无法截图

  

## 注意事项
- 如遇到移动视角卡顿降帧，可存档再读取试试
- 伽马值配置可能导致全屏游戏变白，如遇到只需删除此文件即可`../Config/Gamma.cfg`
- 全屏化录像截图颜色偏暗

---

## dg_D3d与OpenGL画质对比
**窗口化分辨率1600x900**

- 左：`dg_D3d | 8倍抗锯齿`&emsp;&emsp;右：`OpenGL`

  [[图1]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B01%5D.jpg)
  [[图2]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B02%5D.jpg)
  [[图3]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B03%5D.jpg)
  [[图4]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B04%5D.jpg)
  [[图5]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B05%5D.jpg)
  [[图6]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B06%5D.jpg)
  [[图7]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B07%5D.jpg)

- 左：`dg_D3d | 8倍抗锯齿 | 16倍各向异性过滤`&emsp;&emsp;右：`OpenGL`
  [[图8]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B08%5D.jpg)
