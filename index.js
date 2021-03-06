var XRAudioPlayer = {
    type: 'xraudio',
    socket : null,
    hello : function(){
        console.log('testing testing 1 2 3');
    },
    buildCoreMarkup: function(trackNumber){
        var track = trackNumber;
        var result = `player.add('${track.cover}', '${track.audio}', {title: '${track.title}', author: '${track.author}', year: '${track.year}'});`;
        return result;
        
    },
    spawn : function(){
        var self = this;
        //self.socket = io.connect(location.host);
        var trackList = self.application.core.trackList;
        
        var core = '';
        for(var i=0; i<trackList.length; i++){
            core += self.buildCoreMarkup(trackList[i]);
        }
        
        var top = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>XRAudioPlayer | v. 0.14.1</title>
            <link rel=stylesheet type="text/css" href='../../css/XRMP.css' />
            <script src='../js/jquery-3.2.1.min.js'></script>
            <script src='../js/aframe.min.js'></script>
            <script src="https://rawgit.com/mayognaise/aframe-gif-shader/master/dist/aframe-gif-shader.min.js"></script>
            <script src='../js/coreUX.js'></script> <!-- handles movement, styling, and interactivity of core ui components in the dom -->
            <script src='../js/XRAudioPlayer.js'></script> <!-- contains the class function for creating xr audio player objects -->
            <script>

                document.addEventListener('DOMContentLoaded', function(){
                    var player = new XRAudioPlayer();   //create an xr audio player object
                    player.build();`;
        
        var base = `coreEventListeners.launch([player]);    //  tell the core page launcher to start 
                                                            //  playing audio once the app is launched by the user (on screen tap)

                });
            </script>
        </head>
        <body>
           <div id='launch-application-page' class='entry-layer overlay'>
                <div id='instructions'>
                    tap anywhere
                    <div id='logo'></div>
                    to launch
                </div>
            </div>
            <div id='main-app-container' class='viewer-layer'>
            </div>
        </body>
        </html>`;
        
        //console.log(core);
        
        var finalDraft = top+core+base;
        // Change the content of the file as you want
        // or either set fileContent to null to create an empty file
        //var fileContent = base;

        // The absolute path of the new file with its name
        var filepath = "./room/sample.html";

        var fs = require('fs');

        fs.writeFile(filepath, finalDraft, (err) => {
            if (err) throw err;

            console.log("The file was succesfully saved!");
        }); 
    },
    assetsContainer: null,
    build : function(){
        console.log('spawning');
        var self = this;
        self.application.core.tether = $('#main-app-container');
        self.application.core.dom = {
            html: $('html'),
            body: $('body')
        };
        self.application.core.build();
        self.assetsContainer = self.application.core.assetsContainer;
    },
    add : function(coverURL, audioURL, metadata){
        var self = this;
        var index;
        index = self.application.core.trackList.length;

        var track = {
            cover: coverURL,
            audio: audioURL,
            title: metadata.title,
            author: metadata.author,
            year: metadata.year,
            texture: `audio-cover-${index}`
        };

       // self.assetsContainer.append(`<img id='${track.texture}' src='${track.cover}' preload='true' />`);

        self.application.core.trackList.push(track);
        console.log('--------');
        console.log(track);
    },
    addFromList: function(collection){
        var self = this;
        var list = collection;

        for (var key in list) {
            // skip loop if the property is from prototype
            if (!list.hasOwnProperty(key)) continue;

            var obj = list[key];
            console.log('-------------');
            console.log(obj);
            self.add(obj.coverURL, obj.audioURL, obj.metadata);

            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;

                // your code
                //alert(prop + " = " + obj[prop]);
                console.log(prop);
            }
        }
    },
    showTrackList : function(){
        var self = this;
        self.application.core.trackList;
        for(var i=0; i<self.application.core.trackList.length; i++){
            console.log(self.application.core.trackList[i].title);
        }
    },
    playNextTrack : function(){
        var self = this;
        self.application.core.playNextTrack();
    },
    playPreviousTrack: function(){
        var self = this;
        self.application.core.playPreviousTrack();
    },
    stream: function(){     
        var self = this;
        self.player = document.getElementById('html5-audio-player');
        self.source = document.getElementById('static-selector');

        $("#html5-audio-player").bind('ended', function(){
                // done playing
                if(self.index+1==self.trackList.length){
                    self.index=0;
                }
                else{
                    self.index = self.index+1;
                }
                console.log(`playing ${self.trackList[self.index].audio}`);

                document.querySelector('#song-title-container').setAttribute('value', self.trackList[self.index].title);
                document.querySelector('#meta-data-container').setAttribute('value', `author: ${self.trackList[self.index].author} \n\n year: ${self.trackList[self.index].year}`);
                
                document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${self.trackList[self.index].texture}; side: double;`);
                
                console.log(self.trackList[self.index].cover);
                
                self.source.setAttribute('src', self.trackList[self.index].audio);
                self.player.setAttribute('src', self.trackList[self.index].audio);
                self.play();                
            });

        self.index=0;
        
        document.querySelector('#song-title-container').setAttribute('value', self.trackList[self.index].title);

        document.querySelector('#meta-data-container').setAttribute('value', `author: ${self.trackList[self.index].author} \n\n year: ${self.trackList[self.index].year}`);

        self.source.setAttribute('src', self.trackList[self.index].audio);
        self.player.setAttribute('src', self.trackList[self.index].audio);

        document.querySelector('#audio-cover-artwork').setAttribute('material', `src:#${self.trackList[self.index].texture}; side: double;`);

        self.play();
    },
    application : {
        focus: 0, // 0 = home; 1 = audio; 2 = visual; 3 = search
        renderer: [
            'AR',
            'VR',
        ],
        defaultAnimation: {
            addTrack: function(){
                $('#add-track-overlay').show().animate({
                    opacity: 1.0
                }, 1000);
            }
        },
        core: {
            assetsContainer: null,
            index: -1,
            trackList: [],
            spawn: function(){
                console.log('only available in npm package for security reasons');
            },
            player: null,
            play: function(){
                var self = this;

                if(self.player==null){
                    console.log('load a player first');
                }
                else{
                    self.player.play();
                }
            },
            pause: function(){
                var self = this;

                if(self.player==null){
                    console.log('nothing to pause. load a player first');
                }
                else{
                    self.player.pause();
                }
            },
            stop: function(){
                var self = this;

                if(self.player==null){
                    console.log('nothing to stop. load a player first');
                }
                else{
                    self.player.pause();
                }
            },
            source: null,
            stream: function(){
                var self = this;
              
                self.player = document.getElementById('html5-audio-player');
                self.source = document.getElementById('static-selector');
                
                $("#html5-audio-player").bind('ended', function(){
                // done playing
                    console.log(`playing ${self.trackList[self.index+1].audio}`);

                    document.querySelector('#song-title-container').setAttribute('value', self.trackList[self.index+1].title);
                    document.querySelector('#meta-data-container').setAttribute('value', `author: ${self.trackList[self.index+1].author} \n\n year: ${self.trackList[self.index+1].year}`);

                    self.source.setAttribute('src', self.trackList[self.index+1].audio);
                    self.player.setAttribute('src', self.trackList[self.index+1].audio);
                    self.play();
                    self.index++;
                });
                
                self.index=0;
                
                $('#play-next-track-button').click(function(){
                    console.log('play the next song in the track list');
                    self.playNextTrack();
                });

                $('#play-previous-track-button').click(function(){
                    console.log('play the previous song in the track list');
                    self.playPreviousTrack(); 
                });
                
                document.querySelector('#song-title-container').setAttribute('value', self.trackList[self.index].title);

                document.querySelector('#meta-data-container').setAttribute('value', `author: ${self.trackList[self.index].author} \n\n year: ${self.trackList[self.index].year}`);

                self.source.setAttribute('src', self.trackList[self.index].audio);
                self.player.setAttribute('src', self.trackList[self.index].audio);

                self.play();
            },
            tether: null,
            dom: null,
            makeTextureLoader: function(index){
                var target = index;
                $('#embedded-assets-container').append(`<img id='${target.texture}' src='${target.cover}' preload='true' />`);
            },
            build: function(){
                var self = this;
                
                self.dom.body.append(`<select id='videoSource'></select>
    <input id='select-option-button' class='option-button' type='button' value='o' />
    <input id='prev-option-button' class='option-button' type='button' value='<' />
    <input id='next-option-button' class='option-button' type='button' value='>' />
    
    <video id="video" autoplay></video>`);
                
                self.tether.append(`<a-scene embedded id='rfid-experience-container'>
                    <a-assets  timeout='20000' id="embedded-assets-container">
                        <img id='floor-texture' src='../media/texture/grid_pattern.png' preload='true' />
                        <img id='starter' src='../media/img/hov-md.png' preload='true' />
                        <a-asset-item id="crate-obj" src="../media/model/omega.obj"></a-asset-item>
                        <a-asset-item id="crate-mtl" src="../media/model/omega.mtl"></a-asset-item>
                    </a-assets>

                    <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 -180 180' material='side: double; color: red;' position='0  1 -1.5'>
                        <a-animation attribute="rotation"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="-110 -180 180">
                        </a-animation>
                        <a-animation attribute="position"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="0 0 -0.5">
                        </a-animation>
                        <a-text id='meta-data-container' rotation="0 0 0" position='0 0 0.5' align='center' value="this is where \n\n the song meta data will go \n\n against  a backdrop \n\n of the album cover" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                    </a-entity>

                    <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='180 90 0' material='side: double; color: yellow;' position='1 1 -2.5'>
                        <a-animation attribute="rotation"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="290 90 0">
                        </a-animation>
                        <a-animation attribute="position"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="2 0 -2.5">
                        </a-animation>
                        <a-text rotation="0 0 0" position='0 0 0.5' align='center' color='black' value="track list" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text>
                    </a-entity>

                    <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 90 180' material='side: double; color: blue;' position='-1 1 -2.5'>
                        <a-animation attribute="rotation"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="-110 90 180">
                        </a-animation>
                        <a-animation attribute="position"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="-2 0 -2.5">
                        </a-animation>
                        <a-text rotation="0 0 0" position='0 0 0.5' align='center' value="edit" font='https://cdn.aframe.io/fonts/mozillavr.fnt'></a-text></a-entity>

                    <a-entity geometry="primitive: plane; width: 2; height: 2;" rotation='0 0 0' material='side: double; color: aquamarine;' position='0 1 -2.5'>
                        <a-animation attribute="rotation"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="-110 0 0">
                        </a-animation>
                        <a-animation attribute="position"
                                     delay='3500'
                                     dur="2000"
                                     fill="forwards"
                                     to="0 0 -4.5">
                        </a-animation>
                    </a-entity>

                    <a-entity geometry='primitive: plane; width: 3; height: 0.75;' position='0 4 -2' material='side: double; color: white; opacity: 0' >
                        <a-animation attribute="material.opacity"
                                     delay="3500"
                                     dur='2500'
                                     easing="linear"
                                     fill="forwards"
                                     to="0.5">
                        </a-animation>
                        <a-text id='song-title-container' rotation="0 0 0" position='0 0.2 0' align='center' value="song title" font='https://cdn.aframe.io/fonts/mozillavr.fnt' material='opacity: 0;'>
                            <a-animation attribute="material.opacity"
                                     delay="3500"
                                     dur='2500'
                                     easing="linear"
                                     fill="forwards"
                                     to="0.5">
                            </a-animation>
                        </a-text>
                    </a-entity>

                    <a-entity geometry='primitive: plane; width: 6; height: 3;' position='0 2 -4.25' material='side: double; color: white; opacity: 0' >
                        <a-animation attribute="material.opacity"
                                     delay="3500"
                                     dur='2500'
                                     easing="linear"
                                     fill="forwards"
                                     to="0.5">
                        </a-animation>
                        <a-entity geometry='primitive: plane; width: 2; height: 2;' position='-1.5 0 0.1' material='side: double; color: black; opacity: 0'  text='align: center; value: House of Venus\n\n (c) 2018; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt'>
                            <a-animation attribute="material.opacity"
                                     delay="3500"
                                     dur='2500'
                                     easing="linear"
                                     fill="forwards"
                                     to="0.5">
                        </a-animation>
                        </a-entity>
                        <a-entity geometry='primitive: plane; width: 2; height: 2;' position='1.5 0 0.1' material='side: double; color: black; opacity: 0' text='align: center; value: XR Audio Player\n\nv. 0.12.3; color: white; width: 5; font: https://cdn.aframe.io/fonts/mozillavr.fnt'>
                            <a-animation attribute="material.opacity"
                                     delay="3500"
                                     dur='2500'
                                     easing="linear"
                                     fill="forwards"
                                     to="0.5">
                        </a-animation>
                        </a-entity>
                    </a-entity>

                    <a-entity id="audio-cover-artwork" rotation="0 0 0" scale='0.1 0.1 0.1' position='0 2 -2' geometry="primitive: plane; width: 1; height: 1;" material="side: double; src: #starter;">
                        <a-animation attribute="rotation"
                            dur="20000"
                            easing="linear"
                            fill="forwards"
                            to="0 360 0"
                            repeat="indefinite">
                        </a-animation>
                        <a-animation attribute="scale"
                                     delay='3500'
                                     dur="2500"
                                     easing="linear"
                                     fill="forwards"
                                     to="3 3 3">
                        </a-animation>
                    </a-entity>

                    <a-entity geometry="primitive: plane; width: 100; height: 100;" rotation='-90 0 0' material='src: #floor-texture; repeat: 100 100; opacity: 1.0;'>
                        <a-animation attribute='material.opacity'
                                     delay='3000',
                                     dur='2000'
                                     fill='forwards'
                                     to='0'></a-animation>
                    </a-entity>

                    <a-entity position="0 3 3">            
                        <a-entity camera="active: true" look-controls wasd-controls></a-entity>
                    </a-entity>
                    <a-sky material='transparent: true; opacity: 0; color: white;'>
                    </a-sky>
                </a-scene><input type='button' id='play-previous-track-button' class='skip-track-button' value ='<' />
    <input type='button' id='play-next-track-button' class='skip-track-button' value ='>' />
    <div style='position: absolute; width: 300px; height: 55px; border-radius: 25px; display: block; bottom: 5%; left: 50%; margin-left: -150px; z-index: 100; background-color: rgba(255, 255, 255, 0.7); cursor: pointer;'>
    <audio id='html5-audio-player' controls>
      <source id='static-selector' src="" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
</div>`);
                self.assetsContainer = $('#embedded-assets-container');
        }
        }
    },
    view : 'scroll', // scroll is the default, list is the secondary option, tertiary mode is the alternative AR or VR view        
    XRSetting : 'xr' // flat is default, ar is secondary, vr is tertiary
}

// expose log to other modules
module.exports = XRAudioPlayer;