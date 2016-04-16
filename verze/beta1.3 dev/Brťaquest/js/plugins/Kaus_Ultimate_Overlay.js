//=============================================================================
// Kaus Ultimate Overlay
// Kaus_Ultimate_Overlay.js
// Version: 1.11
// Date Created: October 31, 2015
// Scripted By: Kaus
//=============================================================================

var Imported = Imported || {};
Imported.Kaus_Ultimate_Overlay = 1.11;

//=============================================================================
/*:
 * @plugindesc v1.11 Adds Overlay Images on the Map. (Ground,Parallax,Shadow,Light,Fog)
 * @author Kaus
 *
 * @param -F I L E  N A M E S-
 * @default
 * @param Organized Folders
 * @desc Use different folders for each layers instead of using default folder 'parallaxes'
 * Default: false
 * @default false
 * @param Parallax Filename
 * @desc filename used for displaying Parallax Images  
 * Default: par
 * @default par
 * @param Ground Filename
 * @desc filename used for displaying Ground Images 
 * Default: ground
 * @default ground
 * @param Light Filename
 * @desc filename used for displaying Light Images 
 * Default: light
 * @default light
 * @param Shadow Filename
 * @desc filename used for displaying Shadow Images 
 * Default: shadow
 * @default shadow
 * @param -S E T T I N G S-
 * @default
 * @param Light Opacity
 * @desc Opacity that Light Images use.  
 * Default:185
 * @default 185
 * @param Quick Start
 * @desc Starts the game with the switches on automatically to avoid fade in transition.
 * Default:true
 * @default true
 * @param Bush Region ID
 * @desc Region ID that sets tile as Bush.
 * Default:7
 * @default 7
 * @param Bind Pictures
 * @desc NOTE: Kaus_Ultimate_Overlay should be placed BELOW Galenmereth's Bind Pictures in order to work.
 * Default:false
 * @default false
 * @param Terrax Lighting
 * @desc NOTE: Kaus_Ultimate_Overlay should be placed BELOW Terrax Lighting in order to work.
 * Default:false
 * @default false
 * @param -S W I T C H E S-
 * @default
 * @param Fog Switch ID
 * @desc Overlay Switch ID used for displaying Fog
 * Default:1
 * @default 1
 * @param Light Switch ID
 * @desc Overlay Switch ID used for displaying Light
 * Default:2
 * @default 2
 * @param Parallax Switch ID
 * @desc Overlay Switch ID used for displaying Parallax
 * Default:3
 * @default 3
 * @param Shadow Switch ID
 * @desc Overlay Switch ID used for displaying Shadow
 * Default:4
 * @default 4
 *
 *@help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin lets you add overlay images on your map. 
 * You have a choice of 5 different layers on the map to put your custom images
 * 
 * ============================================================================
 * Filename and Use Instructions
 * ============================================================================
 * By Default:
 * All images must be saved in img/Parallaxes Folder.
 * ground,par,shadow and light overlays must be named designated to their mapID
 * For example: display a parallax map and light in MapID:002
 * Name your files par2 and light 2 and save it in img/Parallaxes Folder
 *
 * If Parameter Option: Organized Folders is set to true
 * Create the ff. new folders:
 * (img/overlays/grounds)
 * (img/overlays/pars)
 * (img/overlays/shadows)
 * (img/overlays/lights)
 * (img/overlays/fogs)
 * And all the overlay images you will use should be inside those folders
 * specific to their layer type.
 *
 * ============================================================================
 * Notetags Instructions
 * ============================================================================
 * Note: Input your notetags inside the map properties. The following notetags 
 *       is case sensitive and space sensitive.
 * 
 *  <all>               display all 3 overlays (ground,par,light)
 *  <ground>            display ground layer.
 *  <par>               display parallax layer.
 *  <light>             display light layer.
 *  <shadow>            display shadow layer.
 *  <fogName:filename>  display the chosen fog.
 *  <fogOpacity:number> display the fog in this opacity level.
 *  <fogBlend:number>   (OPTIONAL) changes the blend type of fog 0:NORMAL 1:ADD
 *  <fogDuration:number>(OPTIONAL) makes a transition depending on value = frames.before completing opacity.
 *  <xMove:number>      (OPTIONAL) moves the fog left or right (+ moves right, - moves left)
 *  <yMove:number>      (OPTIONAL) moves the fog up or down (+ moves down, - moves up)
 *
 * NEW: fog notetags variable use.
 * You can use Variables to fill in your notetags instead of fix value.
 * To do this simply put a '$' at the start of the value followed by the variable's id.
 * Example:
 * <fogName:$1>         This will display the fog of the value of the variable 1. 
 * <fogOpacity:$2>      This will set the opacity of the fog to the value of variable 2.
 * <xMove:$3>           This will set the x Movement of the fog to the value of variable 3.
 * <yMove:$4>           This will set the y Movement of the fog to the value of variable 4.
 * <fogBlend:$5>        This will set the Blend Mode of the fog to the value of variable 5.
 * 
 * You can use this script command to set a variable into text:
 * $gameVariables.setValue(id,"your_text")
 * so you can have a text value instead of a number.
 *
 * LAYERS:
 * Light Layer    is the highest layer and used for creating Light Effects such as Sunlight Rays, or Street Lights, etc.
 * Fog Layer      is used for creating a Fog Effect in much that is moving automatically by settings. Used for Mists Clouds etc.
 * Shadow Layer   is used for creating shadow effects.
 * Parallax Layer is used for adding an image in the map that will be OVER the character. 
 * Ground Layer   like Parallax Layer it is used for creating custom images but UNDER your characters.
 *
 *
 *
 * ============================================================================
 * Plugin Command Instructions
 * ============================================================================
 * To change the layer in current map use this Plugin Command;
 * Call Plugin Command thru event then type the following Arguments:
 *
 * Overlay layertype filename
 *      for example: Overlay light light2-1
 *
 * Layer Types:
 * ground = for ground layer
 * par = for parallax layer
 * shadow = for shadow layer
 * light = for light layer
 * fog = for fog layer
 *
 * Calling a new fog has its own arguments: (blendmode and duration is optional and doesnt need to have a value)
 * 
 * Arguments:  Overlay fog filename opacity xMove yMove blendmode duration
 * Examples:
 *             Overlay fog mist2 155 1 -0.5   //Displays 'mist2' fog in 155 Opacity that moves position x to 1 and y to -0.5 every frame. 
 *             Overlay fog shade 130 0 0 1 60 //Displays 'shade' fog in 130 Opacity, additive blend, doesnt move, fades in w/in 60 frames.
 *
 * 1.07 New Feature: Fog Fade Out
 * Function:  Fades out the current fog displayed over the duration.
 * Arguments: Overlay fadeout duration
 * Examples:  Overlay fadeout 120       //Fades out the current fog over 120 frames.
 *
 *
 * 1.08 New Feature: Multilayer-Fog System
 **** addfog Function
 * Function: Adds more fog in the map. (If argument is optional you dont need to include it to set the default)
 * Arguments: Overlay addfog filename ID Opacity xMove yMove BlendType(Optional Default=0) Depth(Optional, Default=22)
 * Examples:  
 *            Overlay addfog mist1 0 155 0 1 1       //Adds 'mist1' fog with ID set to 0 and Opacity 155 w/ Additive Blend
 *            Overlay addfog shade 3 125 1 1         //Adds 'shade' fog with ID set to 3 and Opacity 125 in Normal Blend.
 *            Overlay addfog water 2 255 -0.1 0 0 0  //Adds 'water' fog with ID set to 2 and Opacity 255 display under all overlays (0 Depth)
 *
 * 1.09 Depth Properties:
 * Depth Layer 
 * -1  - Default Parallax
 *  0  - Tilemap
 *  1  - Ground Layer
 * 20  - Par Layer
 * 21  - Shadow Layer
 * 22  - Fog Layer
 * 23  - Light Layer
 *
 **** removefog Function
 * Function: Remove a specific Fog by ID
 * Arguments: Overlay removefog ID
 * Examples:  
 *            Overlay removefog 3    //Removes the fog that have an ID set to 3.
 *
 * NOTE: -Changing Layer Images DOESN'T REQUIRE notetags in the map to display BUT REQUIRES switches.
 *       -DO NOT USE Overlay fadeout if you have map notetags exist in a map as it will not work and map notetags will persist 
 *        to display its function. USE fog switches to turn off the display of the fog completely. 
 *       -BECAREFUL on displaying too large layers as it will affect the game's performance badly. I suggest keeping it small and simple.
 */

(function() {
    
function boolFunc(str) {
    return Function("return " + str + " === true")();
  } 
    
var parameters = PluginManager.parameters('Kaus_Ultimate_Overlay');
var parallax_FN = String(parameters['Parallax Filename']);
var ground_FN = String(parameters['Ground Filename']);
var light_FN = String(parameters['Light Filename']);
var shadow_FN = String(parameters['Shadow Filename']);
var light_OP = Number(parameters['Light Opacity']);
var fogSwitch = Number(parameters['Fog Switch ID']);
var lightSwitch = Number(parameters['Light Switch ID']);
var parSwitch = Number(parameters['Parallax Switch ID']);
var shadowSwitch = Number(parameters['Shadow Switch ID']);
var startSwitch = boolFunc(parameters['Quick Start']);
var useBindPictures = boolFunc(parameters['Bind Pictures']);
var useTerrax = boolFunc(parameters['Terrax Lighting'])
var useFolder = boolFunc(parameters['Organized Folders'])
var bushRegion = String(parameters['Bush Region ID']);


var overlayType = "";
var overlayName = "";
var overlayOpacity = 0;
var overlayxMove = 0;
var overlayyMove = 0;
var overlayDuration;
var overlayBlend = 0;
var overlayFadeOut = false;
var lightcall = false;
var parcall = false;
var shadowcall = false;
var groundcall = false;
var groundName = "";
var shadowName = "";
var lightName = "";
var parName = "";
var fogFadeOut;
var multifog = [];
var mFogCall = false;
var mFogName = "";
var mFogID = 0;
var mFogOpacity = 0;
var mFogBlend = 0;
var mFogxMove = 0;
var mFogyMove = 0;
var mFogRemoveCall = false;
var mFogZ = 22;
var defOpacity = 0;

    
    
//Initializing Automatic Switch on New Game.
var Kaus_setupNewGame = DataManager.setupNewGame;
        DataManager.setupNewGame = function() {
        Kaus_setupNewGame.call(this);
        if(startSwitch==true){
        $gameSwitches.setValue(parSwitch,true);
        $gameSwitches.setValue(lightSwitch,true);
        $gameSwitches.setValue(fogSwitch,true);
        $gameSwitches.setValue(shadowSwitch,true);
    }
};
    

Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    overlayType = "";
    overlayName = "";
    overlayOpacity = 0;
    overlayxMove = 0;
    overlayyMove = 0;
    overlayBlend = 0;
    overlayFadeOut = false;
    overlayDuration;
    parcall = false;
    parName = "";
    lightcall = false;
    lightName = "";
    shadowcall = false;
    shadowName = "";
    groundcall = false;
    groundName = "";
    mFogCall = false;
    mFogName = "";
    mFogID = 0;
    mFogOpacity = 0;
    mFogBlend = 0;
    mFogxMove = 0;
    mFogyMove = 0;
    this._xMove = [];
    this._yMove = [];
    this._multifog = [];
    this._multinewX = [];
    this._multinewY = [];
    mFogRemoveCall = false;
    fogFadeOut;
    map = $dataMap;
    if(useBindPictures==true) this.createPicturesLayer('bottom', this._baseSprite);
    this.createParallax();
    if(useBindPictures==true) this.createPicturesLayer('below_tilemap', this._baseSprite);
    this.createTilemap();
    this.createGroundMap();
    if(useBindPictures==true) this.createPicturesLayer('below_characters', this._tilemap);
    this.createCharacters();
    if(useBindPictures==true) this.createPicturesLayer('above_characters', this);
    this.createParMap();
    this.createShadowMap();
    this.createFogMap();
    this.createLightMap();
    this.createShadow();
    if(useBindPictures==true) this.createPicturesLayer('below_weather', this._tilemap, 8); 
    this.createWeather();
    if(useBindPictures==true) this.createPicturesLayer('top', this);
    if(useTerrax==true) this.createLightmask();   
    this.createDestination();
};
  
    
Spriteset_Map.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateTileset();
    this.updateGroundMap();
    this.updateParallax();
    this.updateParMap();
    this.updateShadowMap();
    this.updateFogMap();
    this.updateLightMap();
    this.updateTilemap();
    this.updateShadow();
    this.updateWeather();
    if(this._multifog.length!=0){
       for(var i = 0; i < this._multifog.length; i++) {
           if(typeof this._multifog[i] !== 'undefined') this.updateMultiFog(i);
       };
    };
    if(useBindPictures==true) this.updatePictures();
    if(mFogCall){ 
        this.createMultiFog(Number(mFogID),mFogName,mFogxMove,mFogyMove,mFogOpacity,mFogBlend,mFogZ);
    }
    if(mFogRemoveCall){
        this.removeMultiFog(Number(mFogID));
    }
};  
//===================M U L T I F O G  S E T U P=====================    
Spriteset_Map.prototype.createMultiFog = function(id,filename,xMove,yMove,opacity,blend,zproperty){
    if(typeof this._multifog[id] == 'undefined'){
    this._xMove[id] = Number(xMove);
    this._yMove[id] = Number(yMove);
    this._multifog[id] = new TilingSprite();
    if(useFolder) this._multifog[id].bitmap = ImageManager.loadBitmap('img/overlays/fogs/',filename);
    else this._multifog[id].bitmap = ImageManager.loadParallax(filename);
    this._multifog[id].move(0, 0, Graphics.width, Graphics.height);
    this._multifog[id].opacity = Number(opacity);
    this._multifog[id].blendMode = Number(blend);
    this._multifog[id].z = Number(mFogZ);
    this._multinewX[id] = 0;
    this._multinewY[id] = 0;
    this._tilemap.addChild(this._multifog[id]);
    }
    mFogCall = false;
};
    
Spriteset_Map.prototype.updateMultiFog = function(id) {
    this._multinewX[id] += Number(this._xMove[id]);
    this._multinewY[id] += Number(this._yMove[id]);
    if(this._multinewX[id]!=0) this._multifog[id].origin.x =  ($gameMap.displayX() * $gameMap.tileWidth()) - this._multinewX[id];
                          else this._multifog[id].origin.x =  ($gameMap.displayX() * $gameMap.tileWidth());
    if(this._multinewY[id]!=0) this._multifog[id].origin.y =  ($gameMap.displayY() * $gameMap.tileHeight()) - this._multinewY[id];
                          else this._multifog[id].origin.y =  ($gameMap.displayY() * $gameMap.tileHeight());
};
    
Spriteset_Map.prototype.removeMultiFog = function(id){
    this._tilemap.removeChild(this._multifog[id]);
    this._multifog[id] = undefined;
    this._xMove[id] = 0;
    this._yMove[id] = 0;
    this._multinewX[id] = 0;
    this._multinewY[id] = 0;
    mFogRemoveCall = false;
};    

    
//==================== G R O U N D  M A P ======================    
Spriteset_Map.prototype.createGroundMap = function() {
    this._groundMap = new Sprite();
    if(map.meta.ground || map.meta.all){
        if(useFolder) this._groundMap.bitmap = ImageManager.loadBitmap('img/overlays/grounds/',ground_FN+$gameMap.mapId());
        else this._groundMap.bitmap = ImageManager.loadParallax(ground_FN+$gameMap.mapId());
    };
    this._groundMap.move(0, 0, Graphics.width, Graphics.height);
    this._groundMap.z = 1;
    this._tilemap.addChild(this._groundMap);
    };
    
Spriteset_Map.prototype.updateGroundMap = function() {
        this._groundMap.x =  $gameMap.displayX() * -$gameMap.tileWidth();
        this._groundMap.y =  $gameMap.displayY() * -$gameMap.tileHeight();
        //Plugin Command Update
       if(groundcall){
           if(useFolder) this._groundMap.bitmap = ImageManager.loadBitmap('img/overlays/grounds/',groundName);
           else this._groundMap.bitmap = ImageManager.loadParallax(groundName);
       }
    };

        
//======================= P A R  M A P =========================    
Spriteset_Map.prototype.createParMap = function() {
    this._parMap = new Sprite();
    if(map.meta.par || map.meta.all){
        if(useFolder) this._parMap.bitmap = ImageManager.loadBitmap('img/overlays/pars/',parallax_FN+$gameMap.mapId());
        else this._parMap.bitmap = ImageManager.loadParallax(parallax_FN+$gameMap.mapId());
    };
    this._parMap.move(0, 0, Graphics.width, Graphics.height);
    this._parMap.z = 20
    this._tilemap.addChild(this._parMap);
    if($gameSwitches.value(parSwitch)== true) 
      this._parMap.opacity = 255;
     else
      this._parMap.opacity = 0;
};

Spriteset_Map.prototype.updateParMap = function() {
        this._parMap.x =  $gameMap.displayX() * -$gameMap.tileWidth();
        this._parMap.y =  $gameMap.displayY() * -$gameMap.tileHeight();
       //Switch Checking
       if($gameSwitches.value(parSwitch)== true){
        if(this._parMap.opacity < 255) this._parMap.opacity += 10; }
     else
        if(this._parMap.opacity!=0) this._parMap.opacity -= 10;
    
    //Plugin Command Update
     if(parcall){
        if(useFolder) this._parMap.bitmap = ImageManager.loadBitmap('img/overlays/pars/',parName);
        else this._parMap.bitmap = ImageManager.loadParallax(parName);
    };
 };
    
        
//======================= S H A D O W  M A P =========================    
Spriteset_Map.prototype.createShadowMap = function() {
    this._shadowMap = new Sprite();
     if(map.meta.shadow || map.meta.all){
         if(useFolder) this._shadowMap.bitmap = ImageManager.loadBitmap('img/overlays/shadows/',shadow_FN+$gameMap.mapId());
         else this._shadowMap.bitmap = ImageManager.loadParallax(shadow_FN+$gameMap.mapId());
     }
    this._shadowMap.move(0, 0, Graphics.width, Graphics.height);
    this._shadowMap.z = 21
    this._tilemap.addChild(this._shadowMap);
    if($gameSwitches.value(shadowSwitch)== true) 
      this._shadowMap.opacity = 255;
     else
      this._shadowMap.opacity = 0;
};

Spriteset_Map.prototype.updateShadowMap = function() {
        this._shadowMap.x =  $gameMap.displayX() * -$gameMap.tileWidth();
        this._shadowMap.y =  $gameMap.displayY() * -$gameMap.tileHeight();
       //Switch Checking
       if($gameSwitches.value(shadowSwitch)== true){
        if(this._shadowMap.opacity < 255) this._shadowMap.opacity += 10; }
     else
        if(this._shadowMap.opacity!=0) this._shadowMap.opacity -= 10;
    
    //Plugin Command Update
     if(shadowcall){
        if(useFolder) this._shadowMap.bitmap = ImageManager.loadBitmap('img/overlays/shadows/',shadowName);
         else this._shadowMap.bitmap = ImageManager.loadParallax(shadowName);
     };
};
    
//===================== L I G H T  M A P =======================
Spriteset_Map.prototype.createLightMap = function() {
    map = $dataMap;
    this._lightMap = new Sprite();
     if(map.meta.light || map.meta.all){
        if(useFolder) this._lightMap.bitmap = ImageManager.loadBitmap('img/overlays/lights/',light_FN+$gameMap.mapId());
         else this._lightMap.bitmap = ImageManager.loadParallax(light_FN+$gameMap.mapId());
     };
    this._lightMap.move(0, 0, Graphics.width, Graphics.height);
    this._lightMap.blendMode = 1;
    this._lightMap.z = 23;
    this._tilemap.addChild(this._lightMap);
    if($gameSwitches.value(lightSwitch)== true) 
      this._lightMap.opacity = light_OP;
     else
      this._lightMap.opacity = 0;
};

Spriteset_Map.prototype.updateLightMap = function() {
        this._lightMap.x =  $gameMap.displayX() * -$gameMap.tileWidth();
        this._lightMap.y =  $gameMap.displayY() * -$gameMap.tileHeight();
        //Switch Checking
       if($gameSwitches.value(lightSwitch)== true){
        if(this._lightMap.opacity < light_OP) this._lightMap.opacity += 1; }
     else
        if(this._lightMap.opacity!=0) this._lightMap.opacity -= 1;
    
    //Plugin Command Update
     if(lightcall){
        if(useFolder) this._lightMap.bitmap = ImageManager.loadBitmap('img/overlays/lights/',lightName);
         else this._lightMap.bitmap = ImageManager.loadParallax(lightName);
         };
};
    
//======================= F O G  M A P ==========================
Spriteset_Map.prototype.createFogMap = function() {
    map = $dataMap;
    this._fogMap = new TilingSprite();
    fogfileUse = map.meta.fogName;
    fogOpacityUse = map.meta.fogOpacity;
    fogxMove = map.meta.xMove || 0;
    fogyMove = map.meta.yMove || 0;
    fogBlendUse = map.meta.fogBlend;
        if(map.meta.fogName){
            if(map.meta.fogName.charAt(0)=='$') fogfileUse = $gameVariables.value(map.meta.fogName.substring(1));
        }
        if(map.meta.fogOpacity){
            if(map.meta.fogOpacity.charAt(0)=='$') fogOpacityUse = $gameVariables.value(map.meta.fogOpacity.substring(1));
        }
        if(map.meta.xMove){
            if(map.meta.xMove.charAt(0)=='$') fogxMove = $gameVariables.value(map.meta.xMove.substring(1));
        }
        if(map.meta.yMove){
            if(map.meta.yMove.charAt(0)=='$') fogyMove = $gameVariables.value(map.meta.yMove.substring(1));
        }
        if(map.meta.fogBlend){
            if(map.meta.fogBlend.charAt(0)=='$') fogBlendUse = $gameVariables.value(map.meta.fogBlend.substring(1));
        }
    if(map.meta.fogName){
        if(useFolder) this._fogMap.bitmap = ImageManager.loadBitmap('img/overlays/fogs/',fogfileUse);
        else this._fogMap.bitmap = ImageManager.loadParallax(fogfileUse);
    };
    this._fogMap.move(0, 0, Graphics.width, Graphics.height);
    this._fogMap.blendMode = Number(fogBlendUse) || 0;
    this._fogMap.opacity = 0;
    this._fogMap.origin.x =  $gameMap.displayX() * $gameMap.tileWidth();
    this._fogMap.origin.y =  $gameMap.displayY() * $gameMap.tileHeight();
    this._fogMap.z = 22;
    newX = 0;
    newY = 0;
    this._tilemap.addChild(this._fogMap);
};

Spriteset_Map.prototype.updateFogMap = function() {
        map = $dataMap;
        if(overlayBlend!=0) this._fogMap.blendMode = 1;
        if(overlayxMove!=0){ newX += Number(overlayxMove); }
         else newX += Number(fogxMove) || 0;
        if(overlayyMove!=0){ newY += Number(overlayyMove); }
         else newY += Number(fogyMove) || 0;
        if(newX!=0) this._fogMap.origin.x =  ($gameMap.displayX() * $gameMap.tileWidth()) - newX;
         else this._fogMap.origin.x =  ($gameMap.displayX() * $gameMap.tileWidth());
        if(newY!=0) this._fogMap.origin.y =  ($gameMap.displayY() * $gameMap.tileHeight()) - newY;
         else this._fogMap.origin.y =  ($gameMap.displayY() * $gameMap.tileHeight());
    //Switch Checking 
     if($gameSwitches.value(fogSwitch)== true){
         if(overlayOpacity!=0){ //if plugin call opacity exist
          defOpacity = Number(overlayOpacity); }
          else{ //if not
           defOpacity = Number(fogOpacityUse); }
         if(overlayDuration){ //if plugin call duration exist
             fogDuration = overlayDuration; }
          else{ //if not
              fogDuration = Number(map.meta.fogDuration) || 1 ;  }
         fogTransition = defOpacity / fogDuration; 
     }
    else if(this._fogMap.opacity!=0) this._fogMap.opacity -= 10;
    // Transition Effect
    if(overlayFadeOut){ // Fade Out
               fogTransition = defOpacity / fogFadeOut;
               if(this._fogMap.opacity!=0) this._fogMap.opacity -= fogTransition;
               else if(this._fogMap.opacity==0){ //reset variables if opacity is 0
                   overlayFadeOut = false;
                   overlayOpacity = 0;
               }
         }
    else if(this._fogMap.opacity < defOpacity){ //Fade In
             this._fogMap.opacity += fogTransition; 
         }
    //Plugin Command Update
     if(overlayType=="fog"){
        if(useFolder) this._fogMap.bitmap = ImageManager.loadBitmap('img/overlays/fogs/',overlayName);
         else this._fogMap.bitmap = ImageManager.loadParallax(overlayName);
     };
};
    
//====================P L U G I N   C O M M A N D==================
    var _GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
      _GameInterpreter_pluginCommand.call(this, command, args);
  	if (command == "Overlay") {
      this._waitCount = 0.1;
  	  if (args[0] == "fog") { //Fog Call
  	  	if (args[1]) { //filename
  	  	  if (args[2]){ //opacity
              if (args[3]){ //xMove
                if (args[4]){ //yMove
                    overlayType = args[0];
                    overlayName = args[1];
                    overlayOpacity = args[2];
                    overlayxMove = args[3];
                    overlayyMove = args[4];
                    if (args[5]) overlayBlend = args[5]; //fogBlend
                    if (args[6]) overlayDuration = args[6]; //fogDuration
              }
            }
          }
  	  	}
  	  } else if(args[0] == "fadeout" ){ //fog fadeout
          if (args[1]){
              overlayFadeOut = true;
              fogFadeOut = args[1]; //fadeout duration
          }
      }
        else if(args[0] == "light"){ //light layer
          if (args[1]) { //filename
                lightcall = true;
                lightName = args[1];
          }
      }
        else if(args[0] == "shadow"){ //shadow layer
          if (args[1]) { //filename
                shadowcall = true;
                shadowName = args[1];
          }
      }
        else if(args[0] == "par"){ //par layer
          if (args[1]) { //filename
                parcall = true;
                parName = args[1];
          }
      }
        else if(args[0] == "ground"){ //ground layer
          if (args[1]) { //filename
                groundcall = true;
                groundName = args[1];
          }
      }
        else if(args[0] == "addfog"){ //add multifog layer
          if (args[1]) { //filename
                mFogCall = true;
                mFogName = args[1];
                mFogID = args[2];
                mFogOpacity = args[3];
                mFogxMove = args[4];
                mFogyMove = args[5];
                if(args[6]) mFogBlend = args[6]; else mFogBlend = 0;
                if(args[7]) mFogZ = args[7]; else mFogZ = 22;
          }
      }
         else if(args[0] == "removefog"){ //remove multifog layer
          if (args[1]) { //id
                mFogRemoveCall = true;
                mFogID = args[1];
          }
      }
  	}//Command Overlay End
  };

//BUSH REGION CHECK
Game_Map.prototype.isBush = function(x, y) {
    return (this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40)) || (this.isValid(x, y) && this.regionId(x, y) == bushRegion);
};    
    
})();
