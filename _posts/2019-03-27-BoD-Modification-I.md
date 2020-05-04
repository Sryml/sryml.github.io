---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      "BoD Modification Ⅰ: 普通脚本修改（不定时更新……）"
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness"]
tags:       [BoD,Blade,game,Mod,技术]
date: 2019-03-27 09:28:04 +0800
# last_modified_at : 
excerpt: "没有编程基础的玩家可能会对这些东西望而却步，那么普通脚本修改，到底有多普通呢！
额，没错，你只需要10个阿拉伯数字以及26个英文字母，还有一个文本编辑器（系统自带的记事本）..."
---

* content
{:toc}

没有编程基础的玩家可能会对这些东西望而却步，那么普通脚本修改，到底有多普通呢！
额，没错，你只需要10个阿拉伯数字以及26个英文字母，还有一个文本编辑器（系统自带的记事本）...
> 黑刃脚本使用python1.5.2编写，所有.py后缀文件皆可用记事本打开编辑

---

## 一、一些常用修改
  - #### 武器/盾牌/物品携带数量
    **1.&nbsp;打开`../Lib/Basic_Funcs.py`文件，搜索`inv.maxObjects = 20`**
    *ps: 两个省略点指游戏根目录*
    
    > 这句是原版定义的物品携带数量20（只不过它只是定义了初始化参数，初始化进入地图确实是20个物品可携带，但是读档后就无效了，携带数量被重置为内部默认值10）
    
    在它下面添加武器和盾牌携带数量的语句（2行语句）
    ```python
    		inv.maxObjects = 20
    		inv.maxWeapons = 15 #武器携带数
    		inv.maxShields = 12 #盾牌携带数
    ```
    > 注意这里的代码前面是有两个制表符的（即两个Tab键），`#`号后面为注释，不会被执行不用担心

    现在只是定义了初始化参数，接着搜索`self.NoFXOnHit= 1`
    在它上面添加同样的语句（4行语句）
    ```python
    		me.MutilateFunc= self.MutilateFunc
    
    		inv = me.GetInventory() #新增语句
    		inv.maxObjects = 20 #新增语句
    		inv.maxWeapons = 15 #武器携带数
    		inv.maxShields = 12 #盾牌携带数
    
    		self.NoFXOnHit= 1
    ```
	> 这里的作用就是让这些修改在读档的时候也生效，带`#`号注释的就是新增语句，要复制到位，注意每行语句前面同样有2个制表符。到这里保存关闭文件

	**2.&nbsp;打开`../Lib/Scorer.py`文件，搜索`RInitAlpha=`**
	如下修改4条语句
	```python
	RInitAlpha=[1.0,0.3,0.2,0.1,0.05] + [0.0]*100 #修改
	RInitPositions=[(5,10),(35,20),(75,30),(110,40),(140,50)] + [(140,50)]*100 #修改
	wRightHand=ScorerWidgets.B_HandWidget(wFrame,"RightHand",150,150,"Right",
                                      RInitAlpha,RInitPositions)
	LInitAlpha=[1.0,0.3,0.2,0.1] + [0.0]*100 #修改
	LInitPositions=[(5,10),(35,20),(75,30),(110,40)] + [(140,50)]*100 #修改
	wLeftHand=ScorerWidgets.B_HandWidget(wFrame,"LefttHand",150,150,"Left",
                                      LInitAlpha,LInitPositions)
	```
	> 这里是武器和盾牌切换时在屏幕上显示的图形位置，只需要把注释为`#修改`的4行复制覆盖掉原版的即可

	**3.&nbsp;打开`../Lib/Reference.py`文件，搜索`StackObjects`**
	这里是同类药剂的携带数量，4当然就是500血瓶，而2就是1000血瓶。如果你想携带多瓶满血和能量药剂，只需要把它们添加进来
	```python
	StackObjects  = {
                                'Pocima100'    :    4, #500血瓶携带数
                                'Pocima200'    :    2, #1000血瓶携带数
                                
                                'PocimaTodo'   :    2, #全满恢复剂携带数
                                'PowerPotion'  :    2, #能量药剂携带数
                }
	```

<br>

- #### 增加功能 - 丢弃弓
  [\>>>【BoD修改】增加功能 - 丢弃弓](https://sryml.github.io/2019/03/27/BoD-DropBow/)

---

<br>

## 二、解析一些Data数据文件
  - #### 主角/敌人生命、防御、力量等修改
    > 文件路径：`../Stats/CharData.py`
    
    这个文件主要统计着主角和敌人的基本数据，例如血量、力气、防御、抗性等。。。
    里面一共定义了八个字典，字典就是用来储存数据以及索引数据的。下面是每个字典对应储存的东西
    ```python
	CharMaxLifeValue     : '生命值'
	CharMaxEnergyValue   : '力气值'
	CharDamageData       : '攻击力'
	CharDefenseData      : '防御力'
	CharExperienceCost   : '升级所需经验值'
	CharExperienceReward : '被击杀后攻击者所得经验'
	CharResistances      : '抗性值'
	CharAccuracy         : '射箭准确度'
	```
	假如我要修改骑士的生命，那么我要先告诉文本搜索器一个生命值的字典，也就是`CharMaxLifeValue`，然后再告诉它骑士的代码`Knight_N` [^1]，这两个条件组合起来要这样写：
	**字典名称，后面人物代码用单引号包括放中括号里**，也就是`CharMaxLifeValue['Knight_N']`，搜索得到下面语句
	```python
	CharMaxLifeValue['Knight_N']=            [   100,    200,    300,    400,    600,    800,   1000,   1400,   1800,   2200,   2600,   3000,   3400,   3800,   4200,   4600,   5000,   5400,   5800,   6200]
	
	```
	可以看到后面的中括号里一共有20个数值，对应20个等级。所以修改的时候只需改后面中括号里值的大小即可（注意不可删减或新增值）
	<br>
    **骑士抗性值`CharResistances['Knight_N']`：**
    ```python
    CharResistances['Knight_N']=    {'Impale': 0.00, 'Slash': 0.00, 'Crush': 0.00, 'Fire': 0.00, 'Ice': 0.00, 'Venom': 0.00, 'Light': 0.00, 'Electric': 0.00, 'Acid': 0.00, 'Drain': 0.00}
    
    ```
    抗性类型后面的值为1时完全抵抗（`1-1=受到0%的属性伤害`）；为0时无抵抗（`1-0=受到100%属性伤害`）；
    为-1时（`1 - (-1)=受到200%属性伤害`）。当然也可以-2，那这样子就是三倍的伤害了，以此类推！
    这时候可能有人出现了大胆的想法，如果我将抗性值改成比1还高，2或者3，按照这算法岂不是会回血。嘿嘿！~不告诉你们，自己进游戏试。<font color="white">>>> 答案当然是不会回血啦，因为里面有个函数设定不会让你超过1</font>
    
    **抗性类型：**
    ```python
    Impale：  "穿刺"
    Slash：   "切割或砍"
    Crush：   "粉碎（钝器）"
    Fire：    "火"
    Ice：     "冰"
    Venom：   "毒"
    Light：   "光"
    Electric："电"
    Acid：    "酸"
    Drain：   "吸血"
    ```
	<br>

  ---

- #### 物品的基本属性，武器的类型、攻击力、防御力等
    > 文件路径：`..\Lib\Reference.py`
    

<br>

待更新。。。。。。

[^1]:BoD代码参考：<https://sryml.github.io/2019/03/27/Bod-Code-characters-items-maps/>
