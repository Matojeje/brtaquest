//=============================================================================
// SpriteZoom
// By Aramis-IX
//=============================================================================
// 12-08-2015 - Version 1.0.0 - Initial release.
//=============================================================================
// Terms & Conditions:
// This plugin is free for both non-commercial and commercial use. 
//=============================================================================
var Imported = Imported || {};
Imported.SpriteZoom = true;

var SpriteZoom = SpriteZoom || {};
//-----------------------------------------------------------------------------
 /*:
 * @plugindesc Zoom events, the player and follower sprites! View the plugin
 * "Help" for instructions and SCRIPT calls.
 *
 * @author Aramis-IX  
 *
 * @help
 * Sprite Zooming
 * ----------------------------------------------------------------------------
 * This script allows users to control the zoom-level for character sprites; 
 * events, the player and followers. The available SCRIPT calls are listed
 * below.
 * ----------------------------------------------------------------------------
 * SCRIPT calls for SpriteZoom
 * ----------------------------------------------------------------------------
 * SpriteZoom.zoom(ID, zoom);
 * SpriteZoom.zoom(ID, zoom, duration);
 * SpriteZoom.zoom(Id, zoom, duration, zoom_y);
 * SpriteZoom.zoom(ID, zoom, duration, zoom_y, duration_y);
 *
 *	**ID is the ID of the event in question**
 *	1-9999 	= Event number on the map.
 *	0 	= Your player.
 *	-1 	= Follower 1.
 *	-2 	= Follower 2.
 *	-3 	= Follower 3.
 *
 *	NOTE: If no ID is passed to the script, the default ID is 0 (i.e.: the
 *	player).
 *
 *	**ZOOM is a percentage**
 *	1 equates to 100%.
 *	0.5 to 50% (half the size).
 *	2 to 200% (double the size).
 *	
 * NOTE: Negative zoom values flip the sprite on its axes; the default x-axis
 * is the sprite's centre, and the default y-axis is the sprite's bottom. 
 *
 * The duration value allows you to create a zoom animation over-time. It can
 * be an integer that is 0 or higher.
 *
 * When only one 'zoom' value is specified, it assumes both the x and y 
 * dimensions will be zoomed proportionally. The same can be said for duration.
 *
 * You can specify separate zoom behaviours (zoom and duration) for each 
 * direction by passing in additional arguments.
 *
 *  **EXAMPLES**
 *
 *	SpriteZoom.zoom();
 *	The code above will reset the player to 100% original size in 0 frames.
 *
 *	SpriteZoom.zoom(0, 2, 120);
 *	The code above will zoom the player 200% in 120 frames.
 *
 *	SpriteZoom.zoom(-2, .5, 30, 1);
 *	The code above will shrink follower 2's width by 50%, while maintaining
 * 	their height over the coarse of 30 frames.
 *
 *	SpriteZoom.zoom(23, 0, 200, 1.35, 250);
 *	The code above will shrink event-23's width to nothing over 200 frames 
 *	while stretching their height 135% over 120 frames.
 */         
            

(function($) {

//=============================================================================
// Code: Special thanks to Hime from Himeworks
//=============================================================================
	var Sprite_Zoom_Sprite_Update_Alias = Sprite_Character.prototype.updateOther;
	Sprite_Character.prototype.updateOther = function() {
		Sprite_Zoom_Sprite_Update_Alias.call(this);
		this.scale.x = this._character._zoom_x;
		this.scale.y = this._character._zoom_y;
	};
	
	var Sprite_Zoom_Character_Init_Members_Alias = Game_Character.prototype.initMembers;
	Game_Character.prototype.initMembers = function() {
		Sprite_Zoom_Character_Init_Members_Alias.call(this);
		this._zoom_x = 1.0;
		this._zoom_y = 1.0;
		this._target_zoom_duration = 0;
		this._target_zoom_duration_y = 0;
		this._is_zooming = false;
	};
	
	Game_Character.prototype.start_zoom = function(zoom, zoom_duration, zoom_y, zoom_duration_y) {
		this._target_zoom = zoom;
		this._target_zoom_y = zoom_y;
		this._target_zoom_duration = zoom_duration;
		this._target_zoom_duration_y = zoom_duration_y;
		this._is_zooming = true;	
	};
	
	// Update Game_CharacterBase ALIAS 
	var Sprite_Zoom_Character_Update_Alias = Game_CharacterBase.prototype.update;
	Game_CharacterBase.prototype.update = function() {
		Sprite_Zoom_Character_Update_Alias.call(this);
		this.update_zoom();
	};	 
	 
	// Update zoom method
	Game_Character.prototype.update_zoom = function() {
		// Escape if not zooming
		if (this._is_zooming === false) {
			return;
		}
		var dx = this._target_zoom_duration;
		
		// Are we at the destination x zoom, if so end duration
		if (this._zoom_x === this._target_zoom){
			this._target_zoom_duration = 0;
		}
		// Are we at the destination x zoom time, if so end zoom
		else if (dx === 0){
			this._zoom_x = this._target_zoom;
		}
		
		// Continue Zoom [Look into alternative easing functions / options]
		else if (dx > 0){
			this._zoom_x = (this._zoom_x * (dx - 1) + this._target_zoom) / dx;
			this._target_zoom_duration -= 1;	
		}
		
		var dy = this._target_zoom_duration_y;
		if (this._zoom_y === this._target_zoom_y) {
			this._target_zoom_duration_y = 0;
		}
		else if (dy === 0) {
			this._zoom_y = this._target_zoom_y;
		}
		else if (dy > 0) {
			this._zoom_y = (this._zoom_y * (dy - 1) + this._target_zoom_y) / dy;
			this._target_zoom_duration_y -= 1;
		}
		
		// End Zoom
		if (dx == 0 && dy == 0) {
			this._is_zooming = false;	
		}
	};
	
	// Main function.
	$.zoom = function(event_id, zoom_x, duration, zoom_y, duration_y) {
		// Set defaults
		event_id = typeof event_id !== 'undefined' ? event_id : -1;
		zoom_x = typeof zoom_x !== 'undefined' ? zoom_x : 1.0;
		duration = typeof duration !== 'undefined' ? duration : 0;
		zoom_y = typeof zoom_y !== 'undefined' ? zoom_y : zoom_x;
		duration_y = typeof duration_y !== 'undefined' ? duration_y : duration;
				
		// Get character for start_zoom()
		var event = getChar(event_id);
		
		// If 'event' is assigned, the character will execute start_zoom
		if (event != null) {
			event.start_zoom(zoom_x, duration, zoom_y, duration_y);
		}
	};
	
	// Code based on Game_Interpreter.prototype.character; original adaptation developed by Nelderson
	function getChar(id){
		  if ($gameParty.inBattle()) {
			  return null;
		  } else if (id == 0) {
			  return $gamePlayer;
		  } else if (id < 0) {
			  return $gamePlayer._followers.follower((Math.abs(id)-1));
		  } else if (id > 0) {
			  return $gameMap.event(id > 0 ? id : this._eventId);
		  } else {
			  return null;
		  }
	};
})(SpriteZoom);
  