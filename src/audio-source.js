
var AudioSource = (function () {

    /**
     * The audio source component.
     * @class AudioSource
     * @extends Component
     * @constructor
     */
    var AudioSource = Fire.extend("Fire.AudioSource", Fire.Component, function () {
        this._playing = false; //-- 声源暂停或者停止时候为false
        this._paused = false;//-- 来区分声源是暂停还是停止

        this._startTime = 0;
        this._lastPlay = 0;

        this._buffSource = null;
        this._volumeGain = null;

        /**
         * The callback function which will be invoked when the audio stops
         * @property onEnd
         * @type {function}
         * @default null
         */
        this.onEnd = null;
    });

    //
    Fire.addComponentMenu(AudioSource, 'AudioSource');

    /**
     * Is the audio source playing (Read Only)？
     * @property isPlaying
     * @type {bool}
     * @readOnly
     * @default false
     */
    Object.defineProperty(AudioSource.prototype, "isPlaying", {
        get: function () {
            return this._playing && !this._paused;
        }
    });

    /**
     * Is the audio source paused (Read Only)?
     * @property isPaused
     * @type {bool}
     * @readOnly
     * @default false
     */
    Object.defineProperty(AudioSource.prototype, "isPaused", {
        get: function () {
            return this._paused;
        }
    });

    /**
     * Playback position in seconds.
     * @property time
     * @type {number}
     * @default 0
     */
    Object.defineProperty(AudioSource.prototype, 'time', {
        get: function () {
            return Fire.AudioContext.getCurrentTime(this);
        },
        set: function (value) {
            Fire.AudioContext.updateTime(this, value);
        }
    });

    //
    AudioSource.prop('_clip', null, Fire.HideInInspector);
    /**
     * The audio clip to play.
     * @property clip
     * @type {AudioClip}
     * @default null
     */
    AudioSource.getset('clip',
        function () {
            return this._clip;
        },
        function (value) {
            if (this._clip !== value) {
                this._clip = value;
                Fire.AudioContext.updateAudioClip(this);
            }
        },
        Fire.ObjectType(Fire.AudioClip)
    );

    //
    AudioSource.prop('_playbackRate', 1.0, Fire.HideInInspector);
    /**
     * The playback rate of the audio source.
     * @property playbackRate
     * @type {number}
     * @default 1
     */
    AudioSource.getset('playbackRate',
        function () {
            return this._playbackRate;
        },
        function (value) {
            if (this._playbackRate !== value) {
                this._playbackRate = value;
                if(this._playing) {
                    Fire.AudioContext.updatePlaybackRate(this);
                }
            }
        }
    );

    //
    AudioSource.prop('_loop', false, Fire.HideInInspector);
    /**
     * Is the audio source looping?
     * @property loop
     * @type {bool}
     * @default false
     */
    AudioSource.getset('loop',
       function () {
           return this._loop;
       },
       function (value) {
           if (this._loop !== value) {
               this._loop = value;
               Fire.AudioContext.updateLoop(this);
           }
       }
    );

    //
    AudioSource.prop('_mute', false, Fire.HideInInspector);
    /**
     * Is the audio source mute?
     * @property mute
     * @type {bool}
     * @default false
     */
    AudioSource.getset('mute',
       function () {
           return this._mute;
       },
       function (value) {
           if (this._mute !== value) {
               this._mute = value;
               Fire.AudioContext.updateMute(this);
           }
       }
    );

    //
    AudioSource.prop('_volume', 1, Fire.HideInInspector);
    /**
     * The volume of the audio source.
     * @property volume
     * @type {number}
     * @default 1
     */
    AudioSource.getset('volume',
       function () {
           return this._volume;
       },
       function (value) {
           if (this._volume !== value) {
               this._volume = Math.clamp01(value);
               Fire.AudioContext.updateVolume(this);
           }
       },
       Fire.Range(0,1)
    );

    /**
     * If set to true, the audio source will automatically start playing on onLoad.
     * @property playOnLoad
     * @type {bool}
     * @default true
     */
    AudioSource.prop('playOnLoad', true);

    AudioSource.prototype._onPlayEnd = function () {
        if ( this.onEnd ) {
            this.onEnd();
        }

        this._playing = false;
        this._paused = false;
    };

    /**
     * Pauses the clip.
     * @method pause
     */
    AudioSource.prototype.pause = function () {
        if ( this._paused )
            return;

        Fire.AudioContext.pause(this);
        this._paused = true;
    };

    /**
     * Plays the clip.
     * @method play
     */
    AudioSource.prototype.play = function () {
        if ( this._playing && !this._paused )
            return;

        if ( this._paused )
            Fire.AudioContext.play(this, this._startTime);
        else
            Fire.AudioContext.play(this, 0);

        this._playing = true;
        this._paused = false;
    };

    /**
     * Stops the clip
     * @method stop
     */
    AudioSource.prototype.stop = function () {
        if ( !this._playing ) {
            return;
        }

        Fire.AudioContext.stop(this);
        this._playing = false;
        this._paused = false;
    };

    AudioSource.prototype.onLoad = function () {
        if (this._playing ) {
            this.stop();
        }
    };

    AudioSource.prototype.onStart = function () {
        //if (this.playOnLoad) {
        //    console.log("onStart");
        //    this.play();
        //}
    };

    AudioSource.prototype.onEnable = function () {
        if (this.playOnLoad) {
            this.play();
        }
    };

    AudioSource.prototype.onDisable = function () {
        this.stop();
    };

    return AudioSource;
})();

Fire.AudioSource = AudioSource;
