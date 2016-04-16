/*:
 * @plugindesc Plays one or more videos prior to the title screen. They can be skipped by pressing a button.
 * <Iavra Splash Video>
 * @author Iavra
 *
 * @param Videos
 * @desc Comma-separated list of videos to be played. Should exist as both .webm or .mp4 versions.
 * @default
 *
 * @param Skip On Ok
 * @desc If set to true, videos can be skipped by an "ok" event (Enter, Spacebar, Z, Left Mouse Click, Touch).
 * @default true
 *
 * @param Skip On Cancel
 * @desc If set to true, videos can be skipped by a "cancel" event (Esc, X, Right Mouse Click, Double Touch).
 * @default true
 *
 * @param Skip All
 * @desc If set to true, skipping one video will automatically skip all videos.
 * @default false
 *
 * @help
 * To play one or more videos prior to your title screen, put their .webm and .mp4 version in the "movies" folder of
 * your game and add their names to the "Videos" plugin parameter.
 *
 * While a video is playing, it can be canceled by pressing either an "ok" button (if the parameter "Skip On Ok" is 
 * set to true) or a "cancel" button (if the parameter "Skip On Cancel" is set to true. If the parameter "Skip All" 
 * is set to true, this will skip all videos. Otherwise, the next one will start playing.
 *
 * The videos are playing, while game resources are being loaded, so this can also be used to cover up the rather
 * boring part of your game.
 */
var IAVRA = IAVRA || {};

(function($) {
    "use strict";

    /**
     * Load plugin parameters independent from file name.
     */
    var _params = $plugins.filter(function(p) { return p.description.contains('<Iavra Splash Video>'); })[0].parameters;
    var _param_videos = _params['Videos'].split(/\s*,\s*/).filter(function(v) { return !!v; });
    var _param_skipOnOk = _params['Skip On Ok'].toLowerCase() === 'true';
    var _param_skipOnCancel = _params['Skip On Cancel'].toLowerCase() === 'true';
    var _param_skipAll = _params['Skip All'].toLowerCase() === 'true';

    /**
     * If no videos are specified, we don't have any business here.
     */
    if(!_param_videos.length) { return; }

    /**
     * Contains all video to be played. We can't initialize this directly, because the game not yet knows, what video
     * file extension it should use.
     */
    var _videos = [];

    /**
     * The currently playing video. If this is null, the next video in the list will be loaded and set to autoplay. The
     * video will also be added to the DOM, so it's visible to the user.
     */
    var _video = null;

    /**
     * Once no videos are left to play, this gets set to true and Scene_Boot.prototype.isReady finally returns true.
     */
    var _finished = false;

    /**
     * Initializes all videos and preloads them. Once a video has finished playing, it will automatically remove itself
     * from the document and set _video = null, which will cause the next video in the list to be played.
     */
    var _initialize = function() {
        var videos = _param_videos, element, ext = Game_Interpreter.prototype.videoFileExt();
        _videos.length = 0;
        for(var i = 0, max = videos.length; i < max; ++i) {
            var element = document.createElement('video');
            element.id = 'splashVideo';
            element.width = Graphics.width;
            element.height = Graphics.height;
            element.style.zIndex = 100;
            Graphics._centerElement(element);
            element.src = 'movies/' + videos[i] + ext;
            element.onended = function() { _video = null; document.body.removeChild(this); };
            element.onerror = function() { throw new Error('There was an error loading the splash video.'); };
            element.load();
            _videos.push(element);
        }
    };

    /**
     * If there is currently a video playing, do nothing. Otherwise, load the next video, add it to the DOM and set it
     * to autoplay. Once all videos have been played, set _finished to true, which will cause Scene_Boot to proceed.
     */
    var _playVideo = function() {
        if(_finished || _video) { return; }
        var video = _videos.shift();
        if(video) {
            _video = video;
            document.body.appendChild(video);
            video.currentTime = 0;
            video.autoplay = true;
        } else { _finished = true; }
    };

    /**
     * Pressing the ok button or doing a touch input (including mouse click) will skip the splash videos.
     */
    var _handleSkip = function() {
        if(_param_skipOnCancel && (Input.isTriggered('cancel') || TouchInput.isCancelled())) { return _skip(); }
        if(_param_skipOnOk && (Input.isTriggered('ok') || TouchInput.isTriggered())) { return _skip(); }
    };

    /**
     * If there is currently a video playing, pause it, remove it from the DOM and set _video to null. Also, empty the
     * video list, which will cause _playVideo to set _finished to true.
     */
    var _skip = function() {
        if(_video) { _video.pause(); document.body.removeChild(_video); _video = null; }
        if(_param_skipAll) { _videos.length = 0; }
    };

    //=============================================================================
    // Scene_Boot
    //=============================================================================

    (function($) {

        /**
         * On scene create, initialize all videos, so they start preloading.
         */
        var alias_create = $.prototype.create;
        $.prototype.create = function() {
            alias_create.call(this);
            _initialize();
        };

        /**
         * While Scene_Boot is loading everything else, the splash videos will play, so we also wait until _finished is
         * set to true, before we continue to the next scene.
         */
        var alias_isReady = $.prototype.isReady;
        $.prototype.isReady = function() {
            _handleSkip();
            _playVideo();
            return _finished && alias_isReady.call(this);
        };

    })(Scene_Boot);

})(IAVRA);