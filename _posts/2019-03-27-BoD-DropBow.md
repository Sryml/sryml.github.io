---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      "【BoD修改】增加功能 - 丢弃弓"
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness"]
tags:       [BoD,Blade,game,技术]
date: 2019-03-27 09:28:01 +0800
# last_modified_at :
excerpt: "增加功能 - 丢弃弓
只需修改一个函数和增加一个函数"
---

* content
{:toc}

- #### 增加功能 - 丢弃弓
  **1.&nbsp;打开`../Lib/Actions.py`文件**
    *&emsp;只需修改一个函数和增加一个函数*

  1-1) 搜索`def TryDropLeft`
  **将原函数：**
  ```python
  def TryDropLeft (EntityName):
      me = Bladex.GetEntity(EntityName)
      statL=StatL(me.Name)
      if statL <> LA_NO_WEAPON and statL <> LA_BOW:
          ###Reference.debugprint(EntityName+": Left hand obj = "+me.InvLeft)
          object = Bladex.GetEntity(me.InvLeft)
          if IsValidForDropping (object.Name):
              object.ExcludeHitFor(me)
              #if object.TestHit:
              #   ###Reference.debugprint(EntityName+": Pre-colliding - abandoning drop")
              #   return FALSE
  
              # Left Handed Object Animation
              me.AddAnmEventFunc("DropLeftEvent",DropReleaseEventHandler)
              me.LaunchAnmType("drp_l")
              ###Reference.debugprint (me.AnimName)
              return TRUE
          else:
              ReportMsg ("Cannot be dropped")
      else:
          return FALSE
  ```
	**替换为：**
  ```python
  def TryDropLeft (EntityName):
      me = Bladex.GetEntity(EntityName)
      statL=StatL(me.Name)
      if statL <> LA_NO_WEAPON and statL <> LA_BOW:
          ###Reference.debugprint(EntityName+": Left hand obj = "+me.InvLeft)
          object = Bladex.GetEntity(me.InvLeft)
          if IsValidForDropping (object.Name):
              object.ExcludeHitFor(me)
              #if object.TestHit:
              #   ###Reference.debugprint(EntityName+": Pre-colliding - abandoning drop")
              #   return FALSE
  
              # Left Handed Object Animation
              me.AddAnmEventFunc("DropLeftEvent",DropReleaseEventHandler)
              me.LaunchAnmType("drp_l")
              ###Reference.debugprint (me.AnimName)
              return TRUE
          else:
              ReportMsg ("Cannot be dropped")
      # --- 新增 ---
      elif statL == LA_BOW:
          object = Bladex.GetEntity(me.InvLeft)
          object.ExcludeHitFor(me)
          if (me.InvRight and Reference.GiveObjectFlag(me.InvRight)==Reference.OBJ_ARROW):
              me.AddAnmEventFunc("ChangeREvent",Toggle4DropLeftBow)
              me.LaunchAnmType("Chg_r")
          else:
              inv=me.GetInventory()
              inv.LinkBack("None")
              me.AddAnmEventFunc("DropLeftEvent",DropReleaseEventHandler)
              me.LaunchAnmType("drp_l")
          return TRUE
      # --- 新增 ---
      else:
          return FALSE
  ```
	
  1-2) 添加一个函数`Toggle4DropLeftBow`
  *在文件底部添加即可*
  ```python
  def Toggle4DropLeftBow(EntityName, EventName):
      me=Bladex.GetEntity(EntityName)
      me.DelAnmEventFunc(EventName)
      inv=me.GetInventory()
      SheatheArrow(inv, me.InvRight)
      inv.LinkBack("None")
      
      me.Wuea= Reference.WUEA_ENDED
      me.AddAnmEventFunc("DropLeftEvent",DropReleaseEventHandler)
      me.LaunchAnmType("drp_l")
  ```
	最后，保存关闭文件。
