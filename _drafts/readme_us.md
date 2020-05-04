
## Installation
1. Unzip and overlay into main directory of game.

2. Run the quick start program`Blade - QuickLaunch.bat`, recommended option 2(OpenGL) is the best compatibility.

3. Win10 settings see footnote[^1]
[^1]:`Win10 settings as shown`![ ](https://raw.githubusercontent.com/Sryml/Image/master/win10-Legacy%20Components.jpg)

You can set the resolution yourself, and then enter the game by quickly launching `Blade - QuickLaunch`.
Recommended windowed play, the best effect on the windowed, and the color of the recording and screenshot are normal.
The OpenGL windowed can be maximized by pressing the key combination `Win+↑`.

p.s. If you enter the game from the start menu, it is recommended to rename the intro video file first. Otherwise, the screen will be misplaced in **dg_D3d** mode.
File path`..\Data\video\EnglishUS\main.mpg`, or search for a video file name`main.mpg`
e.g. I changed it to`main_bak.mpg`

## Description
BoD's optimized configuration, a collection of multiple graphics renderers, all configurations have been provisioned with default values, and an accelerated one-click start game.

"D3d+dgVoodoo" works very well on my PC(win7), hardware information:
> Windows 7 x64 sp1
> i5-2320 3.00GHz
> 16G RAM
> AMD Radeon HD 7850

- **About dgVoodoo**
  dgVoodoo 2.55.4 Graphics API Wrapper by Dege
  <http://dege.fw.hu/>

- **Blade - QuickLaunch v1.1**
  ![Blade - QuickLaunch](https://raw.githubusercontent.com/Sryml/Image/master/Blade%20-%20QuickLaunch.png)

  <br>

  In win7 or higher, there is a game manager that comes with the system. Press the Win button and there is a game option in the sidebar of the Start menu.

  ![game manager](https://raw.githubusercontent.com/Sryml/Image/master/%E6%88%AA%E5%9B%BE20190709222427.png)

  It will automatically collect the game information you played. When you run a game, the system will run `rundll32.exe` to call a library `gameux.dll`, which is the case in many old games.
  This library will update the game information online. When there is no network or no game information, it will block all the time and the game will not start. This is a bug in the win7 system, I have never used this game manager.
  Since win xp does not have the file gameux.dll, this has never happened before.

  I found three solutions:
  1. I have provided a batch script `Blade-QuickLaunch.bat`, which runs ".exe" twice. When the second ".exe" window appears, the script will automatically close the first Blade.exe and rundll32.exe.
  This is a very effective method, and I added an option to quickly launch the console.
  I have perfected the script and updated it to 1.1.

  2. Rename the gameux.dll file so that it cannot be loaded.
  At `C:\Windows\SysWOW64\gameux.dll`
  change into
  `gameux.dll.bak`

  3. Modify the registry at `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\GameUX\`
      There is an item like `S-1-5-21-284290709...` which contains some custom game information.
      Just change the data of a key `ConfigInstallType` to `4` and the game manager will no longer check and update the game.
      Multiple game versions need to modify the key ConfigInstallType in all items.
      
      > @echo off
      >
      > set r=HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\GameUX
      > for /f "tokens=2" %%i in ('whoami /user ^| find /i "%username%"') do set "SID=%%i"
      >
      > for /f %%i in ('reg query %r%\%SID%') do reg add %%i /v ConfigInstallType /t REG_SZ /d 4 /f
      >
      > pause

      Copy the code to a text document and save it as `DisableUpdate.bat`. Running it will automatically disable the update information feature for all current games.
      One defect is that if you add a copy of the game, its ConfigInstallType value defaults to 3, and you need to re-run DisableUpdate.bat once.

  These three methods work well now.

<br>

- **Graphics renderers**
  - D3d + *dgVoodoo*
    *version: from usa patch 1.01*
    - Only some machines can use it normally
    - The effect is perfect, anti-aliasing, anisotropic filtering, excellent foggy environment, bright colors and fast loading speed
    - Defect: Light particles will reduce the number of frames`"Entity Spot".Visible`

  - OpenGL
    *version: Alpha 2*
    - Best compatibility
    - The graphics quality is not as good as dg_D3d, the foggy environment is poor
    - To enable MipMapping, you need to set the Filter Mode to an option with `MIPMAP`, but the screen may be a bit slow.
    - Defect: Light particle texture's alpha transparency is invalid`"Entity Spot".GlowTexture`

  - r3Dfx Voodoo 1-2 + *dgVoodoo*
    *version: from usa patch 1.01*
    - The graphics quality is poor, the effect of water is very poor, especially in the Island of Karum`Island_M8`, the fog and water are very uncoordinated.
    - If you want to change the resolution you need to set it in `dgVoodooCpl.exe`
    - Defect: Textures larger than 256x256 are not supported
  <br>

  `p.s. dgVoodoo is not compatible with ENBSeries`


## Update log
- 2019-05-30
  * According to the method provided by **sgi1981**, I changed the fog value of OpenGL to 0.007 (Although the effect does not change much. [sgi version](http://www.arokhslair.net/forum/viewtopic.php?f=11&t=3760&start=15#p31358) is 0.004)
  * Because `r3Dfx Voodoo 1-2.dll` file name with spaces cannot be used in Quick Launch, so I change it to `r3Dfx_Voodoo_1_2.dll`

- 2018-12-05
  * Optimize the light source of the `dg_D3d` mode, only the light source particles such as the torch oil lamp will be turned off.

- 2018-05-14
  * Using `dg_D3d` will cause the screen to be slow in multiple light sources because of the visible particles of light, so I added a function in the script file `Globals.py` to turn off visible particles, each time entering a new game or loading the function will be executed automatically.

---

- dgVoodoo2_55
  * Fluid lava display is normal
  * F2 screenshot is normal

- dgVoodoo2_54
  * Supports 8x anti-aliasing
  * Support 16x anisotropic filtering
  * Force Vertical sync
  * Adjustable game brightness/saturation/contrast
  * Fluid lava cannot be displayed
  * F2 cannot be screenshot

  

## Cautions
- If you encounter a slow moving view, try to save game and then load it
- The gamma configuration may cause a full screen game white screen, in which case you only need to delete this file `../Config/Gamma.cfg`
- Recording and screenshot are darker when the game is full screen.

---

## dg_D3d and OpenGL graphics quality comparison
**Windowed resolution 1600x900**

- Left: `dg_D3d | 8x Anti-aliasing`&emsp;&emsp;Right: `OpenGL`

  [[img1]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B01%5D.jpg)
  [[img2]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B02%5D.jpg)
  [[img3]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B03%5D.jpg)
  [[img4]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B04%5D.jpg)
  [[img5]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B05%5D.jpg)
  [[img6]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B06%5D.jpg)
  [[img7]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B07%5D.jpg)

- Left: `dg_D3d | 8x anti-aliasing | 16x Anisotropic filtering`&emsp;&emsp;Right: `OpenGL`
  [[img8]](https://raw.githubusercontent.com/Sryml/Image/master/OpenGL%26dg_D3d%20%5B08%5D.jpg)
