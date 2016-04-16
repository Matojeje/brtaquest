/*:
-------------------------------------------------------------------------
@title Easy Audio Looping
@author Hime @ HimeWorks
@date Nov 13, 2015
@url http://himeworks.com/2015/11/easy-audio-looping/
-------------------------------------------------------------------------
@plugindesc Allows you to specify loop points through RPG Maker without
having to use an external audio editor.
@help 
-------------------------------------------------------------------------
== Description ==

Video: https://youtu.be/YbfIlovLxes

Ever downloaded a great sound track that you wanted to use in the game,
but then you found out it just plays from start to finish, and starts
playing again from the beginning?

However, if you listen to some of the BGM's that come with RPG Maker,
such as the battle themes, you'll notice that they have the intro part,
but then it will just keep playing forever.

This is accomplished through a concept called "looping".
Basically, let's say you had a 60 second song, and you wanted the part
between 15 and 45 seconds to keep playing. You would specify that
at the 15 second mark, you would like to start looping, and at the
45 second mark, you would end looping.

Now, your audio file starts playing from the beginning of the song.
Once it reaches the 15 second mark, it will notice that it's entered
a loop. It will continue to play until the 45 second mark, where it
notices that it's at the end of the loop. Now it goes back to the
beginning of the loop, and starts playing the song at 15 seconds again.

Normally, this information is set in the music files themselves.
However, with this plugin, you can use a simple spreadsheet to maintain
audio loops for all of your music files!

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

Nov 13, 2015 -  initial release

== Usage ==

-- Creating Audio Profiles --

This plugin uses something called "audio profiles", which is a set of
configuration options for a particular music file.

Open the template that you downloaded in a text editor like notepad
or a spreadsheet program like Excel, and you will see some sample
data that I've provided.

You will set up your audio looping in this file. Here is an explanation
of what the headers are

1: Profile - the name of this audio profile. Used in events.
2: Name - the name of the music file.
3: Folder - which folder the music file is in. Usually bgm
4: Unit - how time is calculated, either in "seconds" or in "samples".
5: Start Time - at what time the music should start playing.
6: Loop Start - at what time the music's loop starts
7: Loop End - at what time the music's loop ends
8: Loop Length - how long the loop lasts from the loop start

The "Profile" is just a name that you choose for this profile.
It can be anything you want, but preferably something easy to remember.

The "Name" is the name of the song that this profile applies to.
For example, if you want to work with "Battle1" bgm, you would just
write "Battle1" here.

The "Folder" just tells the game where it can find your sound file.

For the "Unit", both "seconds" and "samples" are supported. If you are
comfortable with samples, then you can use those since those are more
precise. Otherwise, you'll probably be working with seconds.

All music by default starts at 0 seconds. However, if you wanted it to
start at a different position, like maybe 20 seconds into the song, you
can just write 20. If you wanted to start in between a second, for
example, at 20.5 seconds, you can just write 20.5 if needed. You can
choose any number that you wish.

The Loop Start and Loop End are used to determine where the song will
loop. If you want the song to loop between 5 seconds and 10 seconds
forever, you would just write 5 for the Loop Start and 10 for the
Loop End.

Loop Duration is optional: some people prefer working with Loop Start
and Loop Duration, whereas others prefer to use Loop Start and Loop
End.

-- Converting your Audio Profiles --

The plugin doesn't support spreadsheet formats. Instead, it uses
something called JSON.

Converting your spreadsheet into JSON is easy.

1. Go to this website: http://www.csvjson.com/csv2json
2. Copy all of your data (including headers) into the left box
3. Press Convert
4. Open notepad
5. Copy everything in the right box into notepad
6. Save the file as "audioProfiles.json" and place it in Data folder.

And now you're done! You can edit the JSON file directly at this point
if you wanted to.

-- Using Your Audio Profiles --

Now you want to test your audio profiles in the game.
For example, if you wanted to test the Battle1_short audio profile that
I provided, which does some strange loop on Battle1 BGM, you would start
by creating a plugin command and write

  load_audio_profile Battle1_short
  
This will load the audio profile. The next time you play Battle1, the
audio profile settings will be applied, and you should hear it looping
strangely after a few seconds.

If you would like to remove an audio profile because you are done with
it, you would use the plugin command

  remove_audio_profile Battle1_short
  
This will delete the audio profile so that the next time you play
Battle1 BGM, it will be back to normal.

-------------------------------------------------------------------------
 */ 
var Imported = Imported || {} ;
var TH = TH || {};
Imported.EasyAudioLooping = 1;
TH.EasyAudioLooping = TH.EasyAudioLooping || {};

(function ($) {

  /* Data is ready when audio profiles have been loaded */
  $.isReady = function() {
    return $.audioProfilesLoaded;
  }
  
  $.loadFile = function(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', filename);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      $.loadAudioProfiles(JSON.parse(xhr.responseText));
    };
    xhr.onerror = function() {
      throw new Error("Error loading file '" + file + "'.");
    };
    xhr.send();
  }  
  
  $.loadAudioProfiles = function(res) { 
    $.audioProfiles = {};
    for (var i = 0; i < res.length; i++) {
      var data = res[i];
      var profile = data["Profile"];
      var name = data["Name"];
      var folder = data["Folder"].toLowerCase();
      var unit = data["Unit"].toLowerCase();
      var loopStart = parseFloat(data["Loop Start"]);
      var loopLength = parseFloat(data["Loop Length"]);
      var loopEnd = parseFloat(data["Loop End"]);
      
      if (loopEnd) {
        loopLength = loopEnd - loopStart
      }
      var offset = parseFloat(data["Start Offset"]);
      
      $.audioProfiles[profile] = {
        name: name,
        folder: folder,
        unit: unit,
        loopStart: loopStart,
        loopLength: loopLength,
        offset: offset
      };
    }      
    $.audioProfilesLoaded = true;
  }

  /********************************************************************************/
    
  var TH_EasyAudioLoops_DataManager_loadDatabase = DataManager.loadDatabase;
  DataManager.loadDatabase = function() {
    $.loadFile("data/audioProfiles.json");
    TH_EasyAudioLoops_DataManager_loadDatabase.call(this);
  };
  
  var TH_EasyAudioLoops_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    if (!$.isReady()) {
      return false;
    }
    return TH_EasyAudioLoops_DataManager_isDatabaseLoaded.call(this);
  };
  
  /********************************************************************************/

  var TH_EasyAudioLooping_GameSystem_Initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() { 
    TH_EasyAudioLooping_GameSystem_Initialize.call(this);
    this.initAudioLoopData();    
  };
  
  Game_System.prototype.initAudioLoopData = function() {
    this._bgmLoopData = {};
  }

  Game_System.prototype.loadAudioProfile = function(profile) {
    if (profile.folder === "bgm") {
      this._bgmLoopData[profile.name] = profile;
    }
  };
  
  Game_System.prototype.removeAudioProfile = function(profile) {
    if (profile.folder === "bgm") {
      delete this._bgmLoopData[profile.name]
    }
  }
  
  Game_System.prototype.bgmLoopData = function(name) {
    return this._bgmLoopData[name];
  }
  
  /********************************************************************************/
  
  WebAudio.prototype.setAudioProfile = function(profile) {
    this._audioProfile = profile;
  }  
  
  var TH_EasyAudioLooping_WebAudio_play = WebAudio.prototype.play;
  WebAudio.prototype.play = function(loop, offset) {
    if (this._audioProfile) {
      if (this._audioProfile.unit === "samples") {
        offset = this._audioProfile.offset / this._sampleRate;
      }
      else {
        offset = this._audioProfile.offset;
      }
    }
    TH_EasyAudioLooping_WebAudio_play.call(this, loop, offset);
  }
  
  var TH_EasyAudioLooping_WebAudio__createNodes = WebAudio.prototype._createNodes;
  WebAudio.prototype._createNodes = function() {
    TH_EasyAudioLooping_WebAudio__createNodes.call(this);
    if (this._audioProfile) {
      if (this._audioProfile.unit === "samples") {
        this._sourceNode.loopStart = this._audioProfile.loopStart / this._sampleRate;
        this._sourceNode.loopEnd = this._sourceNode.loopStart + this._audioProfile.loopLength / this._sampleRate;       
      }
      else {
        this._sourceNode.loopStart = this._audioProfile.loopStart;
        this._sourceNode.loopEnd = this._sourceNode.loopStart + this._audioProfile.loopLength;
      }
    }
  };
  
  // Html5Audio.play = function (loop, offset) {
  // }
  
  /********************************************************************************/
  
  var TH_EasyAudioLooping_AudioManager_updateBgmParameters = AudioManager.updateBgmParameters
  AudioManager.updateBgmParameters = function(bgm) {
    TH_EasyAudioLooping_AudioManager_updateBgmParameters.call(this, bgm);
    if (this._bgmBuffer && bgm) {
      this._bgmBuffer._audioProfile = $gameSystem.bgmLoopData(bgm.name);
    }
  };
  
  /********************************************************************************/
  
  var TH_EasyAudioLooping_GameInterpreter_PluginCommand = Game_Interpreter.prototype.pluginCommand
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command === "load_audio_profile") {
      var profile = $.audioProfiles[args.join(" ")];
      $gameSystem.loadAudioProfile(profile);
    }
    else if (command === "remove_audio_profile") {
      var profile = $.audioProfiles[args.join(" ")];
      $gameSystem.removeAudioProfile(profile);
    }
    else {
      TH_EasyAudioLooping_GameInterpreter_PluginCommand.call(this, command, args);
    }
  };
})(TH.EasyAudioLooping);