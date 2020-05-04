---
layout:     
mathjax:    
author:     
# 以上属性不需设置，有默认值

title:      "BoD人物、物品、地图代码"
heading:    
header_img: 
categories: ["Severance: Blade Of Darkness"]
tags:       [BoD,Blade,game,code]
date: 2019-03-27 09:28:00 +0800
# last_modified_at : 
excerpt: "BoD人物、物品、地图代码"
---

* content
{:toc}

- ### 人物代码

  | 代码 | Biped[^1] | 英文名 | 中文名 |
  |:-|:-|:-|:-|
  | `Knight_N` | Knight | Sargon | 骑士/萨尔贡 |
  | `Dwarf_N` | Dwf | Naglfar | 矮人/纳吉尔法 |
  | `Amazon_N` | Amz | Zoe | 亚马逊/佐伊 |
  | `Barbarian_N` | Bar | Tukaram | 野蛮人/托卡兰族人 |
  | | | | |
  | `Cos` | Cos | - | 肉球怪 |
  | `Spidersmall` | Spd | Small spider | 小蜘蛛 |
  | `Salamander` | Slm | Fire Salamander | 火蝾螈 |
  | `Little_Demon` | Ldm | Little Demon | 喷火怪/猎杀者 |
  | `Great_Demon` | Gdm | Great Demon | 大火魔/大菠萝 |
  | | | | |
  | `Ork` | Ork | Orc | 哇啦怪/小兽人 |
  | `Gold_Ork` | Org | Gold Orc | 金兽人 |
  | `Dark_Ork` | Dok | Dark Orc | 暗黑兽人 |
  | `Great_Ork` | Gok | Great Orc | 大兽人 |
  | `Knight_Traitor` | Knight_Traitor | Traitor Knight | 叛逆骑士 |
  | `Dark_Knight` | Dkn | Dark Knight | 黑暗骑士 |
  | `Ragnar` | Rgn | Ragnar | 红骑士/拉格纳 |
  | | | | |
  | `Lich` | Lch | Lich | 丧尸 |
  | `Knight_Zombie` | Zkn | Zombie Knight | 僵尸骑士 |
  | `Skeleton` | Skl | Skeleton | 骷髅 |
  | `Vamp` | Vmp | Vampire | 吸血鬼 |
  | `Minotaur` | Min | Minotaur | 牛头怪 |
  | `Troll_Dark` | Trl | Dark Troll | 暗黑食人魔 |
  | `Troll_snow` | Trl | Snow Troll | 雪山食人魔 |
  | | | | |
  | `Golem_clay` | Glm_cl | Clay Golem | 泥土巨人 |
  | `Golem_lava` | Glm_lv | Lava Golem | 熔岩巨人 |
  | `Golem_metal` | Glm_mt | Metal Golem | 青铜巨人 |
  | `Golem_stone` | Glm_st | Stone Golem | 石头巨人 |
  | `Golem_ice` | Glm_ic | Ice Golem | 寒冰巨人 |
  | | | | |
  | `ChaosKnight` | Chk | Chaos Knight | 混沌骑士 |
  | `DalGurak` | Dgk | Dal Gurak | 达古拉 |
  | `DarkLord` | Ank | Dark Lord | 黑暗君主 |
  | &nbsp; | | | |
  | `Enano1` | Ena | - | 矮人NPC1 |
  | `Enano2` | Enb | - | 矮人NPC2 |
  | `Prisoner_1` | Prs_1 | - | 囚犯1 |
  | `Prisoner_2` | Prs_2 | - | 囚犯2 |
  | `Prisoner_3` | Prs_3 | - | 囚犯3 |
  | `Prisoner_4` | Prs_4 | - | 囚犯4 |
  | `Prisoner_5` | Prs_5 | - | 囚犯5 |
  | `Prisoner_6` | Prs_6 | - | 囚犯6 |

<br>

- ### 武器、盾牌、物品代码
  ##### 骑士武器

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Gladius     ` | Gladius      | 罗马短剑    |
    | `Maza        ` | Mace         | 权杖        |
    | `Espadaromana` | Combat Sword | 格斗剑      |
    | `Espadaelfica` | Elf Sword    | 精灵之剑    |
    | `Maza2       ` | Heavy Mace   | 重杖        |
    | `HookSword   ` | Hooked Sword | 钩形剑      |
    | `Espadacurva ` | Curved Sword | 弧形剑      |
    | `Dagesse     ` | Dagesse      | 锥形剑      |
    | `Cimitarra   ` | Scimitar     | 弯刀        |
    | `Maza3       ` | Great Mace   | 神圣之杖    |
    | `DoubleSword ` | Double Sword | 双头剑      |
    | `Espadafilo  ` | Sharp Sword  | 利刃剑      |
    | `Espada      ` | Heavy Sword  | 究极重剑    |
    | `FireSword   ` | Fire Sword   | 火之剑      |
    | `IceSword    ` | Ice Sword    | 冰之剑      |
    | `Sablazo     ` | Sablazo      | 护手刀      |
    | `LightEdge   ` | Light Edge   | 光明利刃    |
    | `Orksword    ` | Orc Sword    | 兽人之剑    |
    | `EgyptSword  ` | Snake Sword  | 蛇形剑      |
    | `Ninjato     ` | Zatoichi     | 杖刀/座头市 |
    | `TaiSword    ` | Thai Sword   | 冰柱        |
    | `Katana      ` | Katana       | 武士刀      |

  ##### 矮人武器

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Garrote    ` | Club         | 棒       |
    | `Hacha      ` | Axe          | 斧       |
    | `Hacha5     ` | Biting Axe   | 尖斧     |
    | `Garropin   ` | Spiked Club  | 狼牙棒   |
    | `Hacha4     ` | War Axe      | 战斧     |
    | `Hacha3     ` | Sharp Axe    | 利刃斧   |
    | `Martillo   ` | War Hammer   | 战锤     |
    | `Martillo2  ` | Great Hammer | 神圣之锤 |
    | `Garrote2   ` | Heavy Club   | 重棒     |
    | `MazaDoble  ` | Double Mace  | 双头杖   |
    | `Hacha6     ` | Killer Axe   | 杀手斧   |
    | `Hacha2     ` | Combat Axe   | 格斗斧   |
    | `Martillo3  ` | Doom Hammer  | 毁灭之锤 |
    | `IceHammer  ` | Ice Hammer   | 冰锤     |
    | `FireAxe    ` | Fire Axe     | 火斧     |
    | `CrushHammer` | Vemon Hammer | 毒锤     |
    | `Alabarda   ` | Helberd      | 戟       |
    | `VampWeapon ` | Blood Sword  | 血统之剑 |

  ##### 亚马逊武器

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Bo           ` | Bo                 | 棍       |
    | `Bichero      ` | Boathook           | 钩竿     |
    | `Lanza        ` | Spear              | 矛       |
    | `Naginata     ` | Naginata           | 长柄刀   |
    | `Tridente     ` | Trident            | 三叉戟   |
    | `Axpear       ` | Axe Spear          | 斧头矛   |
    | `DeathBo      ` | Death Bo           | 死亡之棒 |
    | `Crosspear    ` | Cross Tipped Spear | 十字矛   |
    | `Hachacuchilla` | Sharp Axe          | 利斧矛   |
    | `CrushBo      ` | Crush Bo           | 粉碎之棒 |
    | `Arpon        ` | Harpoon            | 鱼叉枪   |
    | `Naginata2    ` | Heavy Naginata     | 长柄重刀 |
    | `LanzaAncha   ` | Demon Spear        | 魔鬼之矛 |
    | `IceWand      ` | Ice Wand           | 冰棍     |
    | `FireBo       ` | Fire Bo            | 火棍     |
    | `SteelFeather ` | Steel Feather      | 钢铁羽毛 |

  ##### 野蛮人武器

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Chaosword   ` | Chaos Sword      | 混浊之剑 |
    | `Eclipse     ` | Eclipse          | 环形斧   |
    | `DeathSword  ` | Death Sword      | 死亡之剑 |
    | `Guadanya    ` | Scythe           | 大镰刀   |
    | `LongSword   ` | Long Sword       | 长剑     |
    | `Alfanje     ` | Slaying Sword    | 杀伐之剑 |
    | `Hacha2hojas ` | Double Edge      | 双刃斧   |
    | `FlatSword   ` | Flat Sword       | 平刃剑   |
    | `BigSword    ` | Big Sword        | 巨剑     |
    | `RhinoClub   ` | Rhino Club       | 犀牛棒   |
    | `Hacharrajada` | Doom Axe         | 毁灭之斧 |
    | `SawSword    ` | Shark Sword      | 鲨之剑   |
    | `FireBigSword` | Great Fire Sword | 圣火之剑 |
    | `IceAxe      ` | Ice Axe          | 冰斧     |

  ##### 神器、弓箭、盾牌

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `BladeSword2`(单手) <br> `BladeSword2Barbarian` | Sword of Ianna | 伊安娜之剑 |
    | `BladeSword`(单手) <br> `BladeSwordBarbarian`   | Sword of Ianna | 伊安娜之剑(古字不全) |
    | `QueenSword      ` | Queen's Sword      | 女王之剑   |
    | `DalWeapon       ` | Dal Gurak's Blade  | 达古拉之剑 |
    | `Espadon         ` | Chaos              | 混沌       |
    | - | - | - |
    | `Arco2           ` | Heavy Bow          | 重型弓     |
    | `Arco3           ` | Medium Bow         | 中型弓     |
    | `Arco            ` | Light Bow          | 轻型弓     |
    | `Flecha          ` | Arrow              | 箭矢       |
    | `Carcaj          ` | Quiver             | 箭筒       |
    | `FlechaEnvenenada` | Vemon Arrow        | 毒箭矢     |
    | `CarcajEnvenenado` | Vemon Quiver       | 毒箭筒     |
    | `FlechaFuego     ` | Fire Arrow         | 火箭矢     |
    | `CarcajFuego     ` | Fire Quiver        | 火箭筒     |
    | - | - | - |
    | `Escudo5         ` | Comet Shield       | 星盾       |
    | `Escudo2         ` | Wood Shield        | 木盾       |
    | `Escudo1         ` | Round Shield       | 圆盾       |
    | `KingShield      ` | King's Shield      | 君主之盾   |
    | `VampShield      ` | Vampire Shield     | 吸血鬼之盾 |
    | `Escudo9         ` | Barbarian's Shield | 野蛮人之盾 |
    | `Escudo4         ` | Wall Shield        | 墙盾       |
    | `Escudo8         ` | Shield             | 盾         |
    | `Escudo3         ` | Small Shield       | 小型盾     |
    | `Escudo7         ` | Skull Shield       | 头骨盾     |
    | `Escudo6         ` | Heated Shield      | 火盾       |
    | `DalShield       ` | Dal Gurak's Shield | 达古拉之盾 |
    | `Escudon         ` | Chaoser            | 混盾       |

  ##### 消耗品、道具

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Hogaza` | Crust            | 干面包          |
    | `Manzana` | Apple            | 苹果            |
    | `Paletilla` | Meat             | 肉              |
    | `Queso` | Cheese           | 干酪            |
    | `Rabano         ` | Radish           | 萝卜            |
    | `Raiz           ` | Health root      | 止血草          |
    | `Saquito        ` | Travel rations   | 干粮            |
    | `Seta           ` | Little mushroom  | 小蘑菇          |
    | `Setas          ` | Mushroom         | 蘑菇            |
    | - | - | - |
    | `Pocima25` | Life Potion 50   | 生命回复剂 50   |
    | `Pocima50` | Life Potion 150  | 生命回复剂 150  |
    | `Pocima100` | Life Potion 500  | 生命回复剂 500  |
    | `Pocima200` | Life Potion 1000 | 生命回复剂 1000 |
    | `PocimaTodo` | Full Life Potion | 生命回复剂 全满 |
    | `PowerPotion` | Power Potion     | 能量药剂        |
    | - | - | - |
    | `Amuletofantasma` | Ghost Medallion  | 幽灵徽章        |
    | `Brazalete` | Bracelet         | 手镯            |
    | `Corona` | Crown            | 王冠            |

<br>

- ### 地图代码

    | 代码 | 英文名 | 中文名 |
    |:-|:-|:-|
    | `Casa`         | Home  | 家园(初始选角关卡) |
    | `Tutorial`     | Tutorial | 教程关卡 |
    | | | |
    | `Barb_M1`      | Kashgar | 喀什葛尔山脉(野蛮人关卡) |
    | `Ragnar_M2`    | Tabriz | 大不里士城堡(骑士关卡) |
    | `Dwarf_M3`     | Khazel Zalam | 卡泽尔·扎拉姆(矮人关卡) |
    | `Ruins_M4`     | Marakamda | 失落的马拉坎达(亚马逊关卡) |
    | | | |
    | `Mine_M5`      | Mines of Kelbegen | 卡尔贝根矿山 |
    | `Labyrinth_M6` | Fortress of Tell Halaf | 塔尔哈拉堡垒(雾城) |
    | `Tomb_M7`      | Tombs of Ephyra | 伊菲拉墓地 |
    | `Island_M8`    | Island of Karum | 卡伦岛 |
    | `Orc_M9`       | Shalatuwar Fortress | 沙拉图沃堡垒(兽人城) |
    | `Orlok_M10`    | The Gorge of Orlok | 奥罗峡谷(雪山) |
    | `Ice_M11`      | Fortress of Nemrut | 南鲁特要塞(雪城) |
    | `Btomb_M12`    | The Oasis of Nejeb | 纳义夫绿洲 |
    | `Desert_M13`   | Temple of Al Farum | 埃尔法鲁神庙 |
    | `Volcano_M14`  | Forge of Xshathra | 柯莎兹拉铸造厂(火山) |
    | `Palace_M15`   | The Temple of Ianna | 伊安娜神殿 |
    | `Tower_M16`    | Tower of Dal Gurak | 达古拉塔楼 |
    | `Chaos_M17`    | The Abyss | 深渊 |

<br>

[^1]:*Biped骨骼名称*