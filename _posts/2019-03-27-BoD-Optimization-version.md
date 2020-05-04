---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      BoD优化版（基于原版优化，win7/8/10适用）
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness"]
tags:       [BoD,Blade,game]
date: 2019-03-27 09:28:05 +0800
# last_modified_at : 
excerpt: "本版本以美版1.01为基础，进行bug修复，稳定性增强。绿色简洁，解压即可玩"
---

* content
{:toc}

- 游戏版权
  本游戏真正的全名为`Severance: Blade Of Darkness`，由西班牙工作室`Rebel Act Studios`于2001年初开发完成。
  并且由`Codemasters`公司出版，Codemasters有限公司保留所有权利。
  任何翻译名字或同名的游戏与本游戏无任何关系。
    
感谢Rebel Act Studios提供开源的Python脚本，让一切成为可能。
    
注：本资源仅限玩家之间学习、交流、娱乐之用，请勿用于任何商业用途。


<!-- - 更新至v1.9.0712 -->
<!-- [\>>> 百度云下载](https://pan.baidu.com/s/1lahoJmR7uR-sn2qJ8KoRxw) -->

<br>

### 运行方法

- 运行主目录的`快速启动程序.bat`，按照序号选择显示模式，优先兼容性最强的`2`
- win10不能玩的看注脚 [^1]

---

### 快速启动程序
![快速启动程序](https://raw.githubusercontent.com/Sryml/Image/master/%E5%BF%AB%E9%80%9F%E5%90%AF%E5%8A%A8%E7%A8%8B%E5%BA%8F02.png)
- 选择序号`1,2,3`回车可直接进入游戏，序号后面带`+`号则进入游戏并启动控制台（如`3+`）

<br>

**详细设置:**
-  选择`0`自定义，点击`Setup`配置
- rOpenGL
  > 默认窗口化，要更改再点击旁边的`Configure...`
`Windowed`为窗口化，`Full Screen`则是全屏
全屏化颜色选`32bpp`，分辨率+刷新率和你桌面一样即可
*注：窗口化后点最大化，效果和全屏差不多*

- D3d
  > 仅部分机器可以使用
  `Configure...`配置，纹理清晰度选`MAX`，`NO MIPMAPPING`此选项不点
  分辨率和你桌面一样
  *注：若全屏化时画面有问题请尝试选择`16bit`的分辨率*

ps: 自定义设置好默认值，此后启动游戏便可直接通过`快速启动程序`进入游戏

<br>

---

### 操作控制

|  |  |  |  |  |  |
| - | - | - | - | - | - |
| 前进 | `W/↑` | 视角向上 | `O` | 攻击 | `鼠标左键/右Alt` |
| 后退 | `S/↓` | 视角向下 | `L` | 格挡 | `左Ctrl/句号键` |
| 左转 | `A/←` | 切换视角 | `-/+` | 跳跃 | `鼠标右键/问号键` |
| 右转 | `D/→` | 自由视角 | `小键盘Enter` | 投掷 | `Q/Delete` |
| 潜行 | `Shift` | 选择地图物品 | `空格/End` | 使用 | `E/回车` |
| 锁定敌人/切换锁定 | `Tab/小键盘0` | 切换武器 | `滑轮上/PgUp/F` | 截图 | `F2` |
| 收起/拔出武器/解锁敌人 | `Caps Lock/PgDown` | 切换盾牌 | `滑轮下/Insert/R` | 对话 | `T` |
|   |   | 切换库存物品 | `C/Home` |   |   |

<br>

### 内容描述

* 游戏本体为"Severance: Blade Of Darkness"美版1.01，即为官方原版。

* 已集合BoD优化补丁，打开即可玩
  - BoD优化补丁即在原版基础上进行修复bug，有更好的兼容性，更精致的画面，以及更方便玩家的便利性。

* 兼容原版1.01的存档，最好是读档后再选择重新开始本关卡
<br>
* 现xp以上系统不再依靠`OpenGL`了，`dgVoodoo`使`D3d`也可在更高级的系统上正常运行，追求高画质的可以使用`D3d`试试
* 部分电脑用不了`D3d`，可能是硬件问题，但至少在我的电脑上运行完美，我的电脑信息：
  ```
  Windows 7 x64
  i5-2320 3.00GHz
  AMD Radeon HD 7850
  ```

* 如遇到移动视角卡顿降帧，可存档再读取试试
* 伽马值配置可能导致全屏游戏变白，如遇到只需删除此文件即可`.../Config/Gamma.cfg`

* 已安装MOD管理器(by Masklin)
* 已安装盟军&对话系统(by Masklin)

* 已禁用开头视频播放(防止不明错误)
* 新增运行地图时输出日志(console.log日志文件保存在对应地图的目录下)

* 关于 dgVoodoo
  dgVoodoo 2.55.4 Graphics API Wrapper by Dege
  <http://dege.fw.hu/>

---

<br>

### 更新日志

###### 2019-07-12 (v1.9.0712)
- 修复满箭袋时无法拾取补充箭袋
- 更新快速启动程序至v1.2


###### 2019-02-13 (v1.9.0213)
- 修复亚马逊第一关井里拿钥匙入口门被实体经过导致剧情不触发问题
  

###### 2018-12-05 (v1.8.1205)
- 修复雪城地图`Ice_M11`拿能量药剂后在关门前杀死骷髅不开门
- 其他小优化
- dgVoodoo更新至2.55.4
- 优化`dg_D3d` [^2] 模式的光源，只有火把火炬之类的光源粒子会被关闭，其他例如伊安娜关卡的红眼骷髅头机关则不会被关闭


###### 2018-10-20 (v1.8.1020)
- 新增`快速启动程序.bat`，可跳过启动对话框进入游戏
- 新增普通雾效版的OpenGL(`rOpenGL - Normal Fog 0.01`)，之前的为无雾版


###### 2018-08-21 (v1.8)
- 修正Ianna剑19级必杀近身攻击判定
- 修复骑士第一关"真香bug"
- 修复"D3d"模式F1出招表显示异常
- 修复文件`GameStateAux.py`里读取新成员变量的函数
- 修复把箭射到盾牌上之后无耐久也不会破碎
- 修复读档后物品可携带数减少的问题
- 修复读档后双手特效武器破碎信息丢失导致格挡耐久不减(双手Ianna剑除外，它的属性和达古拉盾一样无法击破)
- 新增存档名称显示当前游戏时间
- 扩容`SaveGame.py`文件存档时的主角名字，兼容所有MOD的保存工作


###### 2018-05-20 (v1.0)
- 已集合`OpenGL`, `dgVoodoo2_55`, `3Dfx`
  - dgVoodoo2_55 (D3d适用)
    * 开启8倍抗锯齿
    * 强制垂直同步
    * 可调节游戏亮度/饱和度/对比度
    * 流体熔岩显示已正常
    * F2截图正常
    * 使用"D3d"会导致画面在光源多的地方很卡，原因是光的可见粒子，所以我在脚本文件`Globals.py`中添加了关闭光的可见粒子的功能，每次进入新游戏或读档都会自动执行

--- 

<br> 

### 其他
  
- OpenGL
  全屏化切到桌面后，回到游戏读取另一个存档，会使画面颜色复原
  全屏化`Bandicam`录像截图时颜色偏暗

- dg_D3d [^2]
  全屏化`Bandicam`录像截图时颜色偏暗

<br>

`dg_D3d`8倍抗锯齿效果：
![dgVoodoo_D3d](https://raw.githubusercontent.com/Sryml/Image/master/Blade%202018-05-15%2001-36-59-630.jpg)
![dgVoodoo](https://raw.githubusercontent.com/Sryml/Image/master/Blade%202018-05-15%2001-43-25-243.jpg)
![dgVoodoo](https://raw.githubusercontent.com/Sryml/Image/master/Blade%202018-05-15%2001-49-16-975.jpg)
![dgVoodoo](https://raw.githubusercontent.com/Sryml/Image/master/Blade%202018-05-15%2002-01-19-041.jpg)

<br>

[^1]:`win10设置如图`![win10设置](https://raw.githubusercontent.com/Sryml/Image/master/win10%E4%B8%8D%E8%83%BD%E7%8E%A9%E7%9A%84%E7%9C%8B%E8%BF%99%E9%87%8C.png)
[^2]:`dg_D3d`就是使用了dgVoodoo的D3d模式
