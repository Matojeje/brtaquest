//=============================================================================
// VisualEquipment.js <- Please make sure it's named this.
//=============================================================================

var Imported = Imported || {};
Imported.RexalVisualEquipment = true;

var Rexal = Rexal || {};
Rexal.VE = Rexal.VE || {};
/*:
 * @plugindesc Version: 1.1b -
 * Visualize your Equipment!
 * @author Rexal
 *
 
  * @param Debug
 * @desc Log to the console?
 * This sends a LOT of logs. Use only if you're having issues.
 * @default false

 * @param One Sprite Per Layer
 * @desc Have only one sprite per layer?
 * better performance but makes it a lot more difficult to use.
 * @default false
 
 * @param Show Fadeout
 * @desc Fade out the screen when updating the actors?
 * Otherwise it will freeze until the actors are done.
 * @default false
 

 
  * @help
 --------------------------------------------------------------------------------
 Plugin Commands
 ================================================================================
 
 UpdateActors - Forces the game to update the actors, for any reason that 
 you need the game to do so.
 
 SetVEPose ActorId pose - Sets the actor with the ActorId specified to 
 search for sprites with _pose at the end of them. For example you set pose 
 to "dead", "body" becomes "body_dead".
 
 This effects characters on the map only.
 
 ClearVEPose ActorId - Restores the actor's pose to the default one.
 --------------------------------------------------------------------------------
 Parameters
 ================================================================================
Debug - Will write to the console if true. THIS SENDS A WHOLE LOT OF LOGS 
WHICH CAN LAG THE GAME, SO ONLY TURN THIS ON IF YOU ARE HAVING ISSUES

One Sprite Per Layer - By default, you can have an infinite amount of parts 
per layer. However, making this parameter true will cause only one sprite to 
show per defined layer, which saves performance. This can be rather difficult 
to use however, so I recommend using this only if you really need it.

Show Fadeout - If true, this will fade out the screen until the actors are 
done loading.
It's up to you whether you want to use this or not.

 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 [VE Actor]
 --------------------------------------------------------------------------------

Using this tag will make the actor's sprites(and any instance of them) 
invisible. This is so you can create an actor entirely from parts.
Make sure that you have a blank sprite in parts/battlers named "blank", 
otherwise it'll soft-lock in battle for some reason.

This is, of course, Actor's notes only.
 --------------------------------------------------------------------------------
VE Prefix: prefix
 --------------------------------------------------------------------------------
This can be set to actors and equipment both.

Basically, when you define a prefix, instead of searching for "hat" when 
you use VE Image, it'll search for "prefixHat".

When used with equipment, prefixes are determined by the equipment's slot 
order, but they will always override the actor's settings.

 --------------------------------------------------------------------------------
VE Image: name,layer,hue,saturation,value,ignore prefix
 --------------------------------------------------------------------------------
This be used for Actors, Weapons, and Armor. If used for actors, they 
will always have those parts no matter what...unless you use the One 
Sprite Per Layer parameter, of course.

First, ensure that you have a folder named parts, and inside that 
folder are three others named character,face, and battler.

When you use this tag, the plugin will search the folder relevant to 
the situation for the sprite with the name you've specified, For 
example, if the actor's face pops up, it'll look in the "face" folder.

The layer tells the plugin what order the part should be created in. 
It goes lowest to highest, and by default is 0.

hue is the color of the part.

saturation is how colorful the part is. 255 is completely colorless.

value is how bright the part is. 0 is the normal value, -255 is 
black, and 255 is white.

ignore prefix does exactly what it says. If set to true, it'll ignore 
the actor's prefixes.

note: everything but image can be set to an eval formula. Keep in 
mind though that right now it only sets these values the moment 
the parts are created.
 --------------------------------------------------------------------------------
VE Image Neutral: name,layer,hue,saturation,value
 --------------------------------------------------------------------------------
Exactly the same as VE Image except that it always ignores prefixes.

 --------------------------------------------------------------------------------
VE Hide: layer
 --------------------------------------------------------------------------------
 When set to equipment, it'll hide the actor's default parts on the layer 
 specified. Think of it as One Sprite Per Layer lite version.
 
  --------------------------------------------------------------------------------
VE Color: layer,hue,saturation,value
 --------------------------------------------------------------------------------
 This will color all parts in the specified layer unless said part already has
 color settings.
 
 --------------------------------------------------------------------------------
 Version Log
 ================================================================================
 1.0
 - Finished the plugin!
 
 1.1a
 - Added VE Prefix, which lets you have different images per VE Image.
 - Added VE Image Neutral, which ignores all prefix settings.
 - Added another variable to VE Image, which allows you to ignore all prefix 
 settings.
 - Added Show Fadeout parameter, which will fade out the screen whenever the 
 actors are updated.
 - Added VE Color, which allows you to change the colors settings of parts, as 
 long as those parts don't have color settings themselves.
 - Added VE Hide, which is an equipment tag that lets you hide an actor's 
 default parts.
 - Save file now properly updates with the character.
 - It no longer crashes when it can't find a part. It'll still send an error 
 to the console, though.
 - IF YOU USE [VE ACTOR] YOU MUST NOW HAVE A BLANK SPRITE NAMED "BLANK" IN 
 PARTS/BATTLERS OTHERWISE IT WILL SOFT-LOCK IN BATTLE.
 - General Improvements.
 - Added SetVEPose, which lets you set the pose for the sprites to use.
 - Added ClearVEPose, which restores the sprites to default.
 
 1.1b -
 - Actor's faces without [VE Actor] no longer disappear when equipping something.
 - Balloons should be in the right spot now.
 - ClearVEPose actually works like it's supposed to now.
 - If the plugin cannot find a sprite with the desired prefix, it'll search for the prefixless one.
 
 */
 
  
  //-----------------------------------------------------------------------------
 // Parameters
//=============================================================================
  
 Rexal.VE.Parameters = PluginManager.parameters('VisualEquipment');
 Rexal.VE.OnePerLayer = eval(String(Rexal.VE.Parameters['One Sprite Per Layer']));
  Rexal.VE.Debug = eval(String(Rexal.VE.Parameters['Debug']));
    Rexal.VE.Fadeout = eval(String(Rexal.VE.Parameters['Show Fadeout']));

   //-----------------------------------------------------------------------------
 // Various Functions
//=============================================================================

Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.characterName(), actor.characterIndex(),actor];
    });
};

// Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    // if (info.characters) {
        // for (var i = 0; i < info.characters.length; i++) {
            // var data = info.characters[i];
            // this.drawCharacter(data[0], data[1], x + i * 48, y);
        // }
    // }
// };

     var gipc = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
      gipc.call(this, command, args);
        if (command === 'UpdateActors') {
                $gameSystem.updateActors();
            }
			
			 if (command === 'SetVEPose') {
                $gameSystem.setPose(Number(args[0]),String(args[1]));
            }
						 if (command === 'ClearVEPose') {
                $gameSystem.setPose(Number(args[0]));
            }
    };
 
var gsi = Game_System.prototype.initialize;
 Game_System.prototype.initialize = function() {
gsi.call(this);
this._actorFlags = [];
};
 
     Game_System.prototype.updateActors = function(actorId) {
		if(Rexal.VE.Fadeout)$gamePlayer._fadeType = 0;  else $gamePlayer._fadeType = 2; 
        SceneManager.goto(Scene_Map);
    };
	
	Game_System.prototype.setPose = function(id,pose)
	{
	if(pose)this._pose = "_" + pose;
	else
		this._pose = null;
		this._poseActor = id;
		 Game_System.prototype.updateActors();
	}
 
 var gpaa = Game_Party.prototype.addActor;
 Game_Party.prototype.addActor = function(actorId) {
gpaa.call(this,actorId);
Game_System.prototype.updateActors();
};

 var gpra = Game_Party.prototype.removeActor;
 Game_Party.prototype.removeActor = function(actorId) {
gpra.call(this,actorId);
Game_System.prototype.updateActors();
};

  //-----------------------------------------------------------------------------
 // ImageManager
//=============================================================================
 
 //TODO look into $gameMap.requestRefresh();
 Rexal.ImageManager = ImageManager;
 
  Rexal.ImageManager.loadCharacterPart = function(filename, hue, prefix, pose) {
		if(!prefix)prefix = "";
		if(!pose)pose = "";
		bitmap = this.loadBitmap('img/parts/character/', prefix+filename+pose, hue, false);
		if(bitmap.isError()&&prefix)
		bitmap = this.loadBitmap('img/parts/character/',filename+pose, hue, false);
		if(bitmap.isError())
		bitmap = this.loadBitmap('img/parts/character/','blank', hue, false);			
	
	  return bitmap;
};

  Rexal.ImageManager.loadBattlerPart = function(filename, hue, prefix) {
	if(!prefix)prefix = "";
   bitmap = this.loadBitmap('img/parts/battler/', prefix+filename, hue, false);
		if(bitmap.isError()&&prefix)
	bitmap = this.loadBitmap('img/parts/battler/', filename, hue, false);
		if(bitmap.isError())
		bitmap = this.loadBitmap('img/parts/battler/','blank', hue, false);		
	  return bitmap;
};

Rexal.ImageManager.loadFacePart = function(filename, hue, prefix) {
	if(!prefix)prefix = "";
    bitmap = this.loadBitmap('img/parts/face/', prefix+filename, hue, true);
		if(bitmap.isError()&&prefix)	
 bitmap = this.loadBitmap('img/parts/face/', filename, hue, true);		
		if(bitmap.isError())
		bitmap = this.loadBitmap('img/parts/face/','blank', hue, false);			
	  return bitmap;
};

Rexal.ImageManager.isReady = function() {
    for (var key in this._cache) {
        var bitmap = this._cache[key];
        if (bitmap.isError()) {
			bitmap = this.loadEmptyBitmap();
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};

  //-----------------------------------------------------------------------------
 // Sprite
//=============================================================================

Sprite.prototype.createCharacter = function(actor){

	this.dontdoit = true;
	var sprites = [];
	 if(!actor) return;
	
var act = $dataActors[actor.actorId()];
	$gameSystem._actorFlags[actor.actorId()] = false;
Rexal.VE.processPartNoteTag(act);
this._prefix = act.prefix;
this._visual = act._visual;
this._colors = act.colors;
this._hide = act.hide;
if(act.sprites)sprites = this.combineParts(sprites,act.sprites); else return;

var length = actor.equips().length;

if(Rexal.VE.Debug)console.debug('actor = ' + actor.name());
if(Rexal.VE.Debug)console.debug('amount of equips = ' + length);

	for(var i = 0; i<length; i++){

	var equip = actor.equips()[i];
		if(equip){
		if(Rexal.VE.Debug)console.log('reading ' + equip.name +"...");
		equip._isItem = true;
		Rexal.VE.processPartNoteTag(equip);
if(equip.prefix)this._prefix = equip.prefix;
	if(equip.sprites)sprites = this.combineParts(sprites,equip.sprites);
	if(equip.hide)this._hide = this.combineParts(this._hide,equip.hide);
	//this._colors += equip.colors;
	}
	   else if(Rexal.VE.Debug)console.warn('Not wearing any ' + $dataSystem.equipTypes[i+1] + ' equipment...');
   }
   
	if(sprites && actor){
		actor._sprites = sprites;
		actor._prefix = this._prefix;
		actor._colors = this._colors;
		actor._hide = this._hide;
		if(Rexal.VE.Debug)console.info('creating parts...')
		this.createParts(sprites);
	}
	
 
	 
}

Sprite.prototype.findHighestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n>layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the highest layer');
	return layer;
};

Sprite.prototype.combineParts = function(array,array2){
var ar = array;
if(!ar)ar = [];
	for(var i = 0; i<array2.length; i++)
	{
		ar.push(array2[i]);
		if(Rexal.VE.Debug)console.info('added '+ array2[i]);
	}
	return ar;
};

Sprite.prototype.createParts = function(array,sprite,actor){
var min = this.findLowestPart(array);
var max = this.findHighestPart(array)+1;
var newArray = [];



for(var i = min; i<max; i++)
{

	
	for(var s = 0; s<array.length; s++){
this._dot = false;

		
		var n = parseInt(array[s].split(',')[1]);
		
		if(Rexal.VE.Debug)console.log('Layer ' + i + ': '+'checking '+ name + '...');
		if(n == i){
		
		if( !eval(array[s].split(',')[7]) ){

			for(var s2 = 0; s2<array.length; s2++)
			{	
			var hides = array[s2].split(',')[6].split('|');
		for(var h = 0; h<hides.length; h++)
		{ 
			if(eval(hides[h]) == i){
							if(Rexal.VE.Debug)console.log("hiding " +array[s].split(',')[0] +'...'); 
				this._dot = true; 
				break;
				}
		}
			}

		}
			var name = array[s].split(',')[0];

		var hue = eval(array[s].split(',')[2]);
		var saturation = eval(array[s].split(',')[3]);
		var value = eval(array[s].split(',')[4]);
		
		t =[hue,saturation,value];
		
		for(var c = 0; c<this._colors.length; c++)
		{
		if(eval(this._colors[c].split(',')[0])==i){
		if(t[0]==0)hue = eval(this._colors[c].split(',')[1]);
		if(t[1]==0)saturation = eval(this._colors[c].split(',')[2]);
		if(t[2]==0)value = eval(this._colors[c].split(',')[3]);

		}
		
		}
		
		var hsv = [hue,saturation,value];
		var neutral = eval(array[s].split(',')[5]);
		
			
			this._neutral = neutral;
			if(actor&&!actor._hsv)actor._hsv = [];
			if(actor)actor._hsv[s] = hsv; 
			if(!this._dot)this.createPart(name,hsv);
			if(Rexal.VE.Debug)console.info(name + ' is layer ' + i);
			if(Rexal.VE.OnePerLayer)break;
		}
	
	}
}

};

Sprite.prototype.findLowestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n<layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the lowest layer');
	return layer;
};

Sprite.prototype.HSV = function(sprite,hsv){
	var sat = hsv[1];
	var val = hsv[2];
	sprite.setColorTone([val, val, val, sat]);
};

Sprite.prototype.createPart = function(name,hsv,sprite) {
	if(Rexal.VE.Debug)console.log('creating ' + name + '...');
	if(!this._neutral)sprite._prefix = this._prefix;
    sprite._part = name;
	sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
	sprite.innit(hsv);
	sprite._battlerName = this._battlerName;
	sprite.HSV();
   return sprite;
};

Sprite.prototype.innit = function(hsv){
	this._hsv = hsv;
}

  //-----------------------------------------------------------------------------
 // Sprite_Actor
//=============================================================================
 
Rexal.VE.saupdatebitmap = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function() {
    Rexal.VE.saupdatebitmap.call(this);
        	if(!this.dontdoit && this._actor)this.createCharacter();
};

Sprite_Actor.prototype.createCharacter = function() {
	var actor = Rexal.VE.findActorByBattleSprite(this._actor.battlerName());
	Sprite.prototype.createCharacter.call(this,actor);
};

Sprite_Actor.prototype.createParts = function(array){
	
	Sprite.prototype.createParts.call(this,array,this._mainSprite);
};

Sprite_Actor.prototype.createPart = function(name,hsv) {
    var sprite = new Sprite_PartBattle(this._actor);
		sprite._hsv = hsv;
	this.addChild(Sprite.prototype.createPart.call(this,name,hsv,sprite));
	
};

var sau = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function(){
sau.call(this);
if(this._visual)this._mainSprite.bitmap = Rexal.ImageManager.loadBattlerPart("blank");
}

 //-----------------------------------------------------------------------------
// Sprite_Character
//=============================================================================

 Rexal.VE.scsetbit =  Sprite_Character.prototype.setCharacterBitmap;
 Sprite_Character.prototype.setCharacterBitmap = function() {
	Rexal.VE.scsetbit.call(this);
	if(!this.dontdoit)this.createCharacter();
};

var scu = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function(){
scu.call(this);
if(this._visual)this.bitmap = Rexal.ImageManager.loadCharacterPart("blank");
var actor =  Rexal.VE.findActorBySprite(this._character.characterName(),this._character.characterIndex());
};

var gacebi = Game_Actor.prototype.changeEquipById;
Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
gacebi.call(this,etypeId, itemId);
$gameSystem.updateActors();
};

scub = Sprite_Character.prototype.updateBalloon;
Sprite_Character.prototype.updateBalloon = function() {
scub.call(this);
    if (this._balloonSprite) {
        this._balloonSprite.x = 0;
        this._balloonSprite.y = -this.height;
        }
};


 Sprite_Character.prototype.createCharacter = function() {
	if(Rexal.VE.Debug)console.debug('characterName = ' + this._character.characterName());if(Rexal.VE.Debug)console.debug('characterId = ' + this._character.characterIndex());

	var actor =  Rexal.VE.findActorBySprite(this._character.characterName(),this._character.characterIndex());
	
	
	Sprite.prototype.createCharacter.call(this,actor);
};

Sprite_Character.prototype.createParts = function(array){
	var actor =  Rexal.VE.findActorBySprite(this._character.characterName(),this._character.characterIndex());
	Sprite.prototype.createParts.call(this,array,this,actor);
};

Sprite_Character.prototype.createPart = function(name,hsv) {
    var sprite = new Sprite_Part();
	sprite._actor =  Rexal.VE.findActorBySprite(this._character.characterName(),this._character.characterIndex());
	this.addChild(Sprite.prototype.createPart.call(this,name,hsv,sprite));
};

  //-----------------------------------------------------------------------------
// Sprite_Part
//=============================================================================
 
function Sprite_Part() {
    this.initialize.apply(this, arguments);
}

Sprite_Part.prototype = Object.create(Sprite_Character.prototype);
Sprite_Part.prototype.constructor = Sprite_Part;
 
 Sprite_Part.prototype.initialize = function(character) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();

};

 Sprite_Part.prototype.setCharacterBitmap = function() {
	 this.HSV( this.bitmap,this._hsv);
	  this._isBigCharacter = true;
};
 
 Sprite_Part.prototype.HSV = function(){
	Sprite.prototype.HSV.call(this,this,this._hsv);
	if($gameSystem._poseActor == this._actor._actorId){this._pose = $gameSystem._pose;}
	this.bitmap = Rexal.ImageManager.loadCharacterPart(this._part, this._hsv[0],this._prefix,this._pose);
};
 
Sprite_Part.prototype.update = function() {
	this.HSV();
		 	this.setCharacter(this.parent._character);
	    Sprite_Character.prototype.update.call(this);

	this._bushDepth = this.parent._bushDepth;
		this.x = 0; this.y = 0;
    this.updateBitmap();
    this.updateFrame();
    this.updateOther();
};

 //-----------------------------------------------------------------------------
// Sprite_PartBattle
//=============================================================================
 
function Sprite_PartBattle() {
    this.initialize.apply(this, arguments);
}

Sprite_PartBattle.prototype = Object.create(Sprite_Actor.prototype);
Sprite_PartBattle.prototype.constructor = Sprite_PartBattle;
 
Sprite_PartBattle.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this.moveToStartPosition();
};

Sprite_PartBattle.prototype.setBattler = function(battler) {
    Sprite_Actor.prototype.setBattler.call(this, battler);
};

Sprite_PartBattle.prototype.createShadowSprite = function() {
    this._shadowSprite = new Sprite();
};

 Sprite_PartBattle.prototype.innit = function(hsv) {

		 this.updateBitmap();
    if(Rexal.VE.Debug)console.warn('successfully created '+ this._part + '!');
	this.y = 0;
	this.x = 0;
	if(Rexal.VE.Debug)console.info(this._mainSprite.bitmap);

};

Sprite_PartBattle.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
	this._motion = this.parent._motion;
	this._pattern = this.parent._pattern;
	this.x = 0;
	this.y = 0;
};

Sprite_PartBattle.prototype.setActorHome = function(index) {
    this.setHome(0,0);
};

Sprite_PartBattle.prototype.updateBitmap = function(hsv) {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name; 
		this.HSV();
			
    }
};

 Sprite_PartBattle.prototype.HSV = function(){
	Sprite.prototype.HSV.call(this,this._mainSprite,this._hsv);
	this._mainSprite.bitmap = Rexal.ImageManager.loadBattlerPart(this._part, this._hsv[0],this._prefix);
};

 //-----------------------------------------------------------------------------
// Window_Base
//=============================================================================

Rexal.VE.drawMessageFace = Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace = function() {
		this.removeParts();
    Rexal.VE.drawMessageFace.call(this);
};

//Rexal.VE.drawItemImage = Window_MenuStatus.prototype.drawItemImage;
Window_MenuStatus.prototype.drawAllItems = function() {
	this.removeParts();
	Window_Selectable.prototype.drawAllItems.call(this);
};

Rexal.VE.drawBlock2 = Window_Status.prototype.drawBlock2;
Window_Status.prototype.drawBlock2 = function(y) {

	this.removeParts();
Rexal.VE.drawBlock2.call(this,y);
};

Rexal.VE.drawFace = Window_Base.prototype.drawFace;
Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
	this._visual=false;
	Rexal.VE.drawFace.call(this);
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
	var bitmap = ImageManager.loadFace(faceName);
	this._fax = x;
	this._fay = y;
	var pw = Window_Base._faceWidth;

    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
	var actor = Rexal.VE.findActorByFace(faceName, faceIndex);
	this.createCharacter(actor);
    if(this._visual)bitmap = ImageManager.loadFacePart("blank");
	this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};


Window_Base.prototype.removeParts = function(){
	
	for(var i = 0; i<this.children.length; i++)
	{
		if(Rexal.VE.Debug)console.info(this.children[i]._isPart);
		
		if(this.children[i]._isPart)
		this.children[i].remove();
	
	}
	
}

Window_Base.prototype.createCharacter = function(actor) {
	

var sprites = [];

	if(Rexal.VE.Debug)console.debug('faceName = ' + faceName);if(Rexal.VE.Debug)console.debug('FaceIndex = ' + faceIndex);
   
   
   
   if(actor)
   {	
var act = $dataActors[actor.actorId()];
Rexal.VE.processPartNoteTag(act);
this._visual = act._visual;
this._colors = act.colors;
this._prefix = act.prefix;
	if(act.sprites){
sprites = this.combineParts(sprites,act.sprites);
	}
	   var length = actor.equips().length;
	   if(Rexal.VE.Debug)console.debug('actor = ' + actor.name());
	   if(Rexal.VE.Debug)console.debug('amount of equips = ' + length);
	for(var i = 1; i<length; i++){

	var equip = actor.equips()[i];

	if(equip){
			equip._isItem = true;
if(Rexal.VE.Debug)console.log('reading ' + equip.name +"...")
Rexal.VE.processPartNoteTag(equip);
if(equip.prefix) this._prefix = equip.prefix;

	if(equip.sprites)
	{
		sprites = this.combineParts(sprites,equip.sprites);
	}
	
	}
	   else if(Rexal.VE.Debug)console.warn('Not wearing any ' + $dataSystem.equipTypes[i+1] + ' equipment...');
   }

   
   }
 
	if(sprites && actor){
		actor._prefix = this._prefix;
		this.createParts(sprites);
	}
		
	
 
//this.bitmap = Rexal.ImageManager.loadCharacterPart(act.sprite); 

};

Window_Base.prototype.combineParts = function(array,array2){
var ar = array;
	for(var i = 0; i<array2.length; i++)
	{
		ar.push(array2[i]);
		if(Rexal.VE.Debug)console.info('added '+ array2[i]);
	}
	return ar;
}

Window_Base.prototype.findHighestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n>layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the highest layer');
	return layer;
}


Window_Base.prototype.createParts = function(array){
		var min = this.findLowestPart(array);
		
		var max = this.findHighestPart(array)+1;

		var newArray = [];

for(var i = min; i<max; i++)
{


	
	for(var s = 0; s<array.length; s++){
	this._dot = false;	
	var n = parseInt(array[s].split(',')[1]);
			if(n == i){
		
		
		if( !eval(array[s].split(',')[7]) ){

			for(var s2 = 0; s2<array.length; s2++)
			{	
			var hides = array[s2].split(',')[6].split('|');
		for(var h = 0; h<hides.length; h++)
		{ 
			if(eval(hides[h]) == i){
						if(Rexal.VE.Debug)	console.log("hiding face " +array[s].split(',')[0] +'...'); 
				this._dot = true; 
				break;
				}
		}
			}

		}

	
			var name = array[s].split(',')[0];

		var hue = eval(array[s].split(',')[2]);
		var saturation = eval(array[s].split(',')[3]);
		var value = eval(array[s].split(',')[4]);
		
		t =[hue,saturation,value];
		
		for(var c = 0; c<this._colors.length; c++)
		{
		if(eval(this._colors[c].split(',')[0])==i){
		if(t[0]==0)hue = eval(this._colors[c].split(',')[1]);
		if(t[1]==0)saturation = eval(this._colors[c].split(',')[2]);
		if(t[2]==0)value = eval(this._colors[c].split(',')[3]);

		}
		
		}
		
		var hsv = [hue,saturation,value];
		var neutral = eval(array[s].split(',')[5]);
			
			
			this._neutral = neutral;

	if(!this._dot)this.createPart(name,hsv);
	
	if(Rexal.VE.Debug)console.info(name + ' is layer ' + i);
	}
	
	}
}

}

Window_Base.prototype.findLowestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n<layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the lowest layer');
	return layer;
}

Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.characterName(), actor.characterIndex(),actor.equips()];
    });
};

dmmsfi = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function() {
var info = dmmsfi.call(this);
info.actors   = $gameParty.battleMembers();

return info;
};


Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters && info.actors) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
			var actor = info.actors[i];
            this.drawCharacter(data[0], data[1],  x + i * 48, y,actor);
        }
		
    }
};

Window_SavefileList.prototype.drawCharacter = function(characterName, characterIndex, x, y,actor) {
		var baseActor = actor;
		
	
		if(baseActor._sprites){
			
					var min = this.findLowestPart(actor._sprites);
		
		var max = this.findHighestPart(actor._sprites)+1;

		var newArray = [];

for(var m = min; m<max; m++)
{


	
		for(var i = 0; i<baseActor._sprites.length; i++)
		{
		this._dot = false;
				if( !eval(baseActor._sprites[i].split(',')[7]) ){

			for(var s2 = 0; s2<baseActor._sprites.length; s2++)
			{	
			var hides = baseActor._sprites[s2].split(',')[6].split('|');
		for(var h = 0; h<hides.length; h++)
		{ 
			if(eval(hides[h]) == m){
							if(Rexal.VE.Debug)console.log("hiding " +baseActor._sprites[i].split(',')[0] +'...'); 
				this._dot = true; 
				break;
				}
		}
			}

		}
			
			var l = eval(baseActor._sprites[i].split(',')[1]);
			if(l==m){
	    var sprite = new Sprite_WindowPart();
		this.addChild(sprite);
		var name = baseActor._sprites[i].split(',')[0];
		var hsv = actor._hsv[i];
		neutral = eval(baseActor._sprites[i].split(',')[5]);
		sprite.bitmap = Rexal.ImageManager.loadCharacterPart(name,hsv[0],(neutral ? "" : baseActor._prefix));
		sprite.setColorTone([hsv[2], hsv[2], hsv[2], hsv[1]]);

		sprite.HSV(sprite,hsv);
	


	sprite.anchor.x = .5;
    sprite.anchor.y = 1;
	sprite._isPart = true;
	sprite._isCharacter = true;
sprite.x = x;
sprite.y = y;

if(!this._dot)	this.addChild(sprite);
	
   // this.contents.blt(sprite.bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
			if(Rexal.VE.Debug)console.info(sprite.parent);
			}
			
		}	
		
		}
		
		}
};


Window_Base.prototype.createPart = function(name,hsv) {

    var sprite = new Sprite_WindowPart();
		if(!this._neutral)sprite._prefix = this._prefix;
	sprite.bitmap = Rexal.ImageManager.loadFacePart(name,hsv[0],sprite._prefix);

	var sat = hsv[1]; if(Rexal.VE.Debug)console.info('updating hue, saturation and value...');
	var val = hsv[2];
	sprite.setColorTone([val, val, val, sat]);
	sprite.x = this._fax;
	sprite.y = this._fay;
	sprite.anchor.x = -.123;
    sprite.anchor.y = -.123;
	sprite.parent = this;
	sprite._isPart = true;
    this.addChild(sprite);
			if(Rexal.VE.Debug)console.info(sprite.parent);
	
};

function Sprite_WindowPart() {

    this.initialize.apply(this, arguments);
}

 //-----------------------------------------------------------------------------
// Sprite_WindowPart
//=============================================================================

Sprite_WindowPart.prototype = Object.create(Sprite.prototype);
Sprite_WindowPart.prototype.constructor = Sprite_WindowPart;

Sprite_WindowPart.prototype.update = function() {
    Sprite.prototype.update.call(this);
if(this._remove)this.parent.removeChild(this);
	
	if(this._isCharacter)
	{
		    var pw = this.bitmap.width / 3;
    var ph = this.bitmap.height / 4;
    var n = 0;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
this.setFrame(sx, sy, pw, ph);
}
	
};

Sprite_WindowPart.prototype.remove = function() {
	if(Rexal.VE.Debug)console.warn('removing ' + this);
	this._remove = true;
}



 //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================

Object.defineProperties(Game_Actor.prototype, {
  colors: { get: function() { return this._colors; }, configurable: true },
  hide: { get: function() { return this._hide; }, configurable: true },
  prefix: { get: function() { return this._prefix; }, configurable: true },
  sprites: { get: function() { return this._sprites; }, configurable: true }

});

Rexal.VE.findActorBySprite = function(name,index){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' + index + ' -> '+actor._name);
		if(actor._characterName == name && actor._characterIndex == index)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + '!');
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error('Could not find the actor specified!');
}

Rexal.VE.findActorByFace = function(name,index){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' + index + ' -> '+actor._name);
		if(actor._faceName == name && actor._faceIndex == index)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + "'s face!");
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error("Could not find the actor's face!");
}

Rexal.VE.findActorByBattleSprite = function(name){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' +' -> '+actor._battlerName);
		if(actor._battlerName == name)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + "'s battler!");
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error("Could not find the actor's battler!");
}


Rexal.VE.processPartNoteTag = function(obj) {
	if(!obj)return;
	var index = 0;
	obj.layer = [];
	obj.sprites = [];
	obj.colors = [];
	obj.hide = [];
	if(!obj.hideLayer)obj.hideLayer= "";
	//obj.hideLayer = [];
Rexal.VE._visual = false;
if(Rexal.VE.Debug)console.log('reading ' + obj.name + "'s notes");


		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		if(Rexal.VE.Debug)console.debug('reading ' + line + '...');
		var lines = line.split(': ');
		switch (lines[0].toLowerCase()) {
		
		case '[ve actor]' :
		obj._visual = true;
		break;
		
		case 've prefix' :
		obj.prefix = lines[1];
		break;

		
		case 've color' :
		obj.colors.push(lines[1]);
		break;
		
				case 've hide' :
		obj.hide.push(lines[1]);
		if(lines[1])obj.hideLayer+= "|"+lines[1];
		break;
		
		case 've image' :
		if(lines[1].split(',').length == 1)lines[1]+= ",0";
		if(lines[1].split(',').length == 2)lines[1]+= ",0";
		if(lines[1].split(',').length == 3)lines[1]+= ",0";
		if(lines[1].split(',').length == 4)lines[1]+= ",0";
		if(lines[1].split(',').length == 5)lines[1]+= ",false";	
		if(obj.hideLayer){lines[1]+= ','+obj.hideLayer;} else {lines[1]+= ",";}
		if(obj._isItem)lines[1]+= ',true'; else lines[1]+= ',false';
        obj.sprites.push(lines[1]);
		if(Rexal.VE.Debug)console.info(lines[1]);
		break;
		


		
				case 've image neutral' :
		if(lines[1].split(',').length == 1)lines[1]+= ",0";
		if(lines[1].split(',').length == 2)lines[1]+= ",0";
		if(lines[1].split(',').length == 3)lines[1]+= ",0";
		if(lines[1].split(',').length == 4)lines[1]+= ",0";	
		lines[1]+= ",true";
		if(obj.hideLayer){lines[1]+= ','+obj.hideLayer;} else {lines[1]+= ",";}
		if(obj._isItem)lines[1]+= ',true'; else lines[1]+= ',false';

        obj.sprites.push(lines[1]);
		if(Rexal.VE.Debug)console.info(lines[1]);
		break;
		
		}
		
			
		}
};