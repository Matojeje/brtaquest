/*:
-------------------------------------------------------------------------
@title HMS: Message Pause Cursor
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.2
@date Dec 21, 2015
@filename HIME_HMSMessagePauseCursor.js
@url http://himeworks.com/2015/12/message-pause-cursor/

If you enjoy my work, consider supporting me on Patreon!

* https://www.patreon.com/himeworks

If you have any questions or concerns, you can contact me at any of
the following sites:

* Main Website: http://himeworks.com
* Facebook: https://www.facebook.com/himeworkscom/
* Twitter: https://twitter.com/HimeWorks
* Youtube: https://www.youtube.com/c/HimeWorks
* Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------------
@plugindesc v1.2 - Allows you to customize your message pause cursor.
@help 
-------------------------------------------------------------------------------
== Description ==

By default, when a message has finished displaying all of the words and is
waiting for player input, a little animated cursor is shown to indicate that
the player should press the confirm button to proceed.

However, this cursor is stored inside the windowskin, which gives you enough
freedom to have one 24x24 cursor with 4 frames of animation. You also cannot
choose where the cursor should appear, or how fast it should animate.

With this plugin, you are given more control over that pause cursor.

You can change how it looks!
You can change where it's positioned!
You can change how fast it animates!

What kind of cursor will you create?

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

1.2 - Dec 21, 2015
 * renamed to HMSMessagePauseCursor
 * added support for 'end' text align
1.1 - Dec 15, 2015
 * use "Default Align" plugin parameter
1.0 - Dec 14, 2015
 * initial release

== Usage ==

Create an image called "MessagePauseCursor" and save it in the img/system
folder of your project.

This image is broken down into a grid.

Each row represents a single cursor.
Each column represents an animation frame for that cursor.

Each frame can be of any width or height, but all frames must have the
same width and height.

You can have any number of frames per cursor, but all cursors must have
the same number of frames.

Once you have set up your pause cursor image, go to the plugin manager
and for this plugin "Hime_MessagePauseCursor", specify how many rows
there are and how many frames there are in each row.

-- Changing Cursors --

To change which cursor is shown, you can use the script call

  $gameMessage.setCursorId(NUMBER)
  
Where the NUMBER is the ID of the cursor. The first cursor at the top
is number 1. The second is number 2. So if you wanted to change to cursor 2,
you would make the script call

  $gameMessage.setCursorId(2)
  
-- Changing Alignment --

Alignment determines where the cursor is positioned in the window.
To change the alignment, use the script call

  $gameMessage.setCursorAlign( ALIGNMENT )
  
You have three options for the ALIGNMENT

  'center'  - center of window, at the bottom
  'left'    - lower-left corner of the window
  'right'   - lower right corner of the window
  'end'     - right after the last character
  
-- Changing Animation Speed --

To change the animation speed, use the script call

  $gameMessage.setCursorSpeed( SPEED )
  
Where the SPEED is a number between 1 and probably 24.
The higher the number, the faster it is. You can experiment with each
number to see how fast they are.

-------------------------------------------------------------------------------
@param Filename
@desc Name of the file to use in the img/system folder (no extension)
Change this if needed.
@default MessagePauseCursor

@param Default Cursor ID
@desc default cursor ID you want to start with as a number.
First cursor at the top is 1, second is 2, and so on.
@default 1

@param Number of Rows
@desc Number of rows in the image. One cursor per row.
@default 3

@param Number of Frames
@desc Number of frames per animation.
@default 4

@param Default Align
@desc The alignment of the pause cursor in the message window.
Can be 'left', 'center', 'right', or 'end' without quotes
@default center
-------------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.TH_MessagePauseCursor = 1;
TH.MessagePauseCursor = TH.MessagePauseCursor || {};

(function ($) {

  $.params = PluginManager.parameters("HIME_HMSMessagePauseCursor");
  
  $.filename = $.params["Filename"];
  $.defaultId = Math.floor($.params["Default Cursor ID"])
  $.numRows = Math.floor($.params["Number of Rows"])
  $.numFrames = Math.floor($.params["Number of Frames"])
  $.align = $.params["Default Align"].toLowerCase();  
  
  var TH_SceneBoot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
  Scene_Boot.prototype.loadSystemImages = function() {
    TH_SceneBoot_loadSystemImages.call(this);
    ImageManager.loadSystem($.filename);
  };
  
  var TH_GameMessage_initialize = Game_Message.prototype.initialize;
  Game_Message.prototype.initialize = function() {
    TH_GameMessage_initialize.call(this);
    this._pauseCursorId = $.defaultId;
    this._pauseCursorAlign = $.align
    this._pauseCursorSpeed = 4
    this._pauseCursorNeedsRefresh = false;
  };
  
  Game_Message.prototype.setCursorId = function(id) {
    this._pauseCursorId = id;
    this.refreshPauseCursor();
  };
  
  Game_Message.prototype.setCursorAlign = function(align) {
    this._pauseCursorAlign = align.toLowerCase();
    this.refreshPauseCursor();
  };
  
  Game_Message.prototype.setCursorSpeed = function(speed) {
    this._pauseCursorSpeed = speed;
    this.refreshPauseCursor();
  };
  
  Game_Message.prototype.refreshPauseCursor = function() {
    this._pauseCursorNeedsRefresh = true;
  }
  
  /***************************************************************************/
  
  var TH_WindowMessage_initialize = Window_Message.prototype.initialize;
  Window_Message.prototype.initialize = function() {
    TH_WindowMessage_initialize.call(this);
    this._pauseCursorId = $.defaultId - 1
    this._pauseCursorFrames = $.numFrames;
    this._pauseCursorRows = $.numRows;
    this._pauseCursorAlign = $.align
    this._pauseCursorSpeed = 64 / (this._pauseCursorFrames * 4)
    
    bmp = ImageManager.loadSystem($.filename);
    this._pauseCursorWidth = bmp.width / this._pauseCursorFrames;
    this._pauseCursorHeight = bmp.height / this._pauseCursorRows;
  };
  
  var TH_WindowMessage_startMessage = Window_Message.prototype.startMessage
  Window_Message.prototype.startMessage = function() {
    TH_WindowMessage_startMessage.call(this);
    if ($gameMessage._pauseCursorNeedsRefresh) {
      this._refreshPauseSign();
      $gameMessage._pauseCursorNeedsRefresh = false;
    }
  };

  var TH_WindowMessage__refreshPauseSign = Window.prototype._refreshPauseSign;
  Window_Message.prototype._refreshPauseSign = function() {
    this._pauseCursorId = $gameMessage._pauseCursorId - 1;
    this._pauseCursorAlign = $gameMessage._pauseCursorAlign;
    this._pauseCursorSpeed = 64 / (this._pauseCursorFrames * $gameMessage._pauseCursorSpeed)
    var sx = 0;
    var sy = this._pauseCursorId * this._pauseCursorHeight;
    this._windowPauseSignSprite.bitmap = ImageManager.loadSystem($.filename);
    this._windowPauseSignSprite.anchor.x = 0.5;
    this._windowPauseSignSprite.anchor.y = 1;
    this._refreshPauseSignPosition();
    this._windowPauseSignSprite.setFrame(sx, sy, this._pauseCursorWidth, this._pauseCursorHeight);
    this._windowPauseSignSprite.alpha = 0;
  }; 
  
  Window.prototype._refreshPauseSignPosition = function() {  
    if (this._pauseCursorAlign == 'center') {
      this._windowPauseSignSprite.move(this._width / 2, this._height);
    }
    else if (this._pauseCursorAlign == 'right') {
      this._windowPauseSignSprite.move(this._width - this._pauseCursorWidth, this._height);
    }
    else if (this._pauseCursorAlign == 'left') {
      this._windowPauseSignSprite.move(this._pauseCursorWidth, this._height);
    }
    else if (this._pauseCursorAlign == 'end') {
      if (this._textState) {
        this._windowPauseSignSprite.move(this._textState.x + this._pauseCursorWidth, this._textState.y + this._textState.height + this._pauseCursorHeight / 2);
      }
    };
  }
  
  var TH_WindowMessage_onEndOfText = Window_Message.prototype.onEndOfText;
  Window_Message.prototype.onEndOfText = function() {
    this._refreshPauseSignPosition();
    TH_WindowMessage_onEndOfText.call(this);    
  };
  
  Window_Message.prototype._updatePauseSign = function() {
    var sprite = this._windowPauseSignSprite;
    var x = Math.floor(this._animationCount / this._pauseCursorSpeed) % $.numFrames;
    var y = this._pauseCursorId;;
    var sx = 0;
    var sy = 0;
    var pw = this._pauseCursorWidth;
    var ph = this._pauseCursorHeight
    if (!this.pause) {
        sprite.alpha = 0;
    } else if (sprite.alpha < 1) {
        sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
    }
    sprite.setFrame(sx+x*pw, sy+y*pw, pw, ph);
    sprite.visible = this.isOpen();
  };
})(TH.MessagePauseCursor);