/*:
-------------------------------------------------------------------------
@title State Countdown Popup
@author Hime --> HimeWorks (http://himeworks.com)
@date Nov 22, 2015
@filename HIME_StateCountdownPopup.js
@url http://himeworks.com/2015/11/state-countdown-popup/

If you have any questions or concerns, you can contact me at any of
the following sites:

Main Website: http://himeworks.com
Facebook: https://www.facebook.com/himeworkscom/
Twitter: https://twitter.com/HimeWorks
Youtube: https://www.youtube.com/c/HimeWorks
Tumblr: http://himeworks.tumblr.com/

-------------------------------------------------------------------------
@plugindesc Displays a little popup over your head for the state with
the highest priority that displays popups.
@help 
-------------------------------------------------------------------------
== Description ==

Video: https://www.youtube.com/watch?v=EVmrE60flbM

Do you want to visually display the number of turns that a state has
before it expires?

For example, perhaps you have a state that will automatically kill you
after 5 turns have passed, and you would like the player to see the
number as a visual indicator.

This plugin allows you to display a small number popup above a battler's
head that represents the number of turns left before a particular state
expires.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

Nov 22, 2015 - implemented rounding option
Nov 21, 2015 - initial release

== Usage ==

By default, states will not display the countdown popup.
You must indicate whether the state should show it using the note-tag

  <show countdown popup>
  
Once the countdown popup has been enabled, the game will automatically
display it whenever the state is added.

-- Multiple Countdown Popup States --

This plugin only supports one countdown popup at a time. This means that
if the battler has two or more states that have the countdown popup
enabled, only one of them will be picked.

The one that is picked is based on the "Priority" of the state. That is,
the higher the priority, the more important it is.

In the case where there is a tie, the first state that the game saw will
be picked.

-- Rounding the Counter Display --

Some plugins convert the state counter into a decimal number rather than
a whole number. By default, this plugin does not do any rounding.

If you would like to round your numbers, please use this note-tag:

<show countdown popup>
  rounding: NUM_PLACES
</show countdown popup>

If you want it to round to two decimal places, use 2.
If you want it to round to whole numbers, use 0.  For example:

<show countdown popup>
  rounding: 0
</show countdown popup>

-------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.StateCountdownPopup = 1;
TH.StateCountdownPopup = TH.StateCountdownPopup || {};

(function ($) {

  $.Regex = /<show[-_ ]countdown[-_ ]popup>/i  
  $.ExtRegex = /<show[-_ ]countdown[-_ ]popup>([\s\S]*?)<\/show[-_ ]countdown[-_ ]popup>/im  
  
  function Sprite_StateCounterOverlay () {
    this.initialize.apply(this, arguments);
  }
  
  Sprite_StateCounterOverlay.prototype = Object.create(Sprite_Base.prototype);
  Sprite_StateCounterOverlay.prototype.constructor = Sprite_StateCounterOverlay ;
  
  Sprite_StateCounterOverlay.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();    
  };
  
  Sprite_StateCounterOverlay.prototype.initMembers = function() {
    this._counter = 0;
    this._battler = null;    
    this.anchor.x = 0.5;
    this.anchor.y = 1.5;
    this._color = '#ffffff'    
    this._bitmap = new Bitmap(64, 64);
    this._bitmap.textColor = this._color;
  };
  
  Sprite_StateCounterOverlay.prototype.setup = function(battler) {
    this._battler = battler;
    this.setFrame(0, 0, 64, 64);
  };
  
  Sprite_StateCounterOverlay.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateColor();
  };
  
  Sprite_StateCounterOverlay.prototype.updateBitmap = function() {
    if (this._battler) {
      var state = this._battler.countdownPopupState();
      if (state) {
        var counter = this._battler.getStateCountdown(state.id);
        var roundPlaces = state.countdownPopupRounding;
        // Perform rounding
        if (roundPlaces !== null) {
          if (roundPlaces === 0) {
            counter = Math.ceil(counter);
          }  
          else {
            counter = counter.toFixed(roundPlaces);
          }
        }
        if (counter !== this._counter) {
          this._counter = counter;
          
          this._bitmap.clear()
          this._bitmap.drawText(counter, 0, 0, 64, 24, "center");
        }
      }
      else {
        this._bitmap.clear()
        this._counter = 0;
      }
    }
  };
  
  Sprite_StateCounterOverlay.prototype.updateColor = function() {
    // STUB
  };
  
  /***************************************************************************/
  
  var TH_SpriteBattler_initMembers = Sprite_Battler.prototype.initMembers;
  Sprite_Battler.prototype.initMembers = function() {
    this.createStateCounter(null);
    TH_SpriteBattler_initMembers.call(this);    
  };
  
  var TH_SpriteBattler_setBattler = Sprite_Battler.prototype.setBattler;
  Sprite_Battler.prototype.setBattler = function(battler) {
    TH_SpriteBattler_setBattler.call(this, battler);
    this._stateCounter.setup(battler);
  };
  
  Sprite_Battler.prototype.createStateCounter = function(battler) {  
    this._stateCounter = new Sprite_StateCounterOverlay(battler);
    this.addChild(this._stateCounter);
  }
  
  /***************************************************************************/
  
  $.canDisplayCountdownPopup = function(state) {
    if (state.canDisplayCountdownPopup === undefined) {
      state.canDisplayCountdownPopup = false;
      state.countdownPopupRounding = null;
      var res = $.Regex.exec(state.note);
      if (res) {
        state.canDisplayCountdownPopup = true;
      }
      
      var res = $.ExtRegex.exec(state.note);
      if (res) {
        var data = new Function( "return ({" + res[1] + "})")();
        state.countdownPopupRounding = data.rounding;
      }
    }
    return state.canDisplayCountdownPopup;
  }
  
  var TH_GameBattler_addState = Game_Battler.prototype.addState;
  Game_Battler.prototype.addState = function(stateId) {
    TH_GameBattler_addState.call(this, stateId);
    this.updateCountdownState();
  };
  
  var TH_GameBattler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    TH_GameBattler_removeState.call(this, stateId);
    this.updateCountdownState();
  };
    
  Game_Battler.prototype.updateCountdownState = function() {
    var states = this.states();
    var max = 0
    var maxState = null;
    for (var i = 0, len = states.length; i < len; i++) {
      var state = states[i];
      if ($.canDisplayCountdownPopup(state) && state.priority > max) {
        max = state.priority
        maxState = state;
      }
    }
    this._countdownState = maxState;
  }
  
  Game_Battler.prototype.countdownPopupState = function() {
    return this._countdownState;
  };
  
  Game_Battler.prototype.getStateCountdown = function(id) {
    return this._stateTurns[id];
  };
  
})(TH.StateCountdownPopup);