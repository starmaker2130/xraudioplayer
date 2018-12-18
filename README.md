# XRAudioPlayer

an XR audio player for web experiences and distributed applications

The **_XRAudioPlayer_** is a subset of the experimental **_XRMediaPlayer_** object. The latter is going to be under heavy development as of the end of this week given the start of the winter term (expected release: February 2, 2019).

**_XRAudioPlayer_** as the name suggests generates an audio player that users can experience in VR, AR, or traditinoal flat modes. Experiences are generated using Three.js and AFrame to achieve a secure, cross-platform standard for immersive web experiences.

Users can view content using a wide range of devices and formats. Developers can be implement the module in a few lines of JavaScript code in both modular server-side and non-modular client-side applications.

## Usage:
⋅⋅* server-side
⋅⋅* client-side

### Server-Side
1. install using npm
npm install xraudioplayer

2. import xraudioplayer (using require is recommended since not all releases of Node have the newest ES6 features enabled by default)
(a) using add method

var XRMP = require('xraudioplayer');
var myPlayer = XRMP.XRAudioPlayer;

myPlayer.add('../media/img/OracularSpectacular.png', '../media/audio/TheYouth.mp3' , { title: 'The Youth', author: 'MGMT', year: 2007});

myPlayer.add('../media/img/ExtraFine.png', '../media/audio/ExtraFine.mp3', { title: 'Extra Fine', author: 'Starmaker', year: 2019});

myPlayer.spawn();

(b) using addFromList method
an object or array of objects in the following format can be processed by the module to generate same outcome as above

var XRMP = require('xraudioplayer');
var myPlayer = XRMP.XRAudioPlayer;

var collection = {
    'The Youth': {
        coverURL: '../media/audio/TheYouth.png',
        audioURL: '../media/audio/TheYouth.mp3',
        {
            title: 'The Youth',
            author: 'MGMT',
            year: 2007
        }
    },
    'Extra Fine': {
        coverURL: '../media/audio/ExtraFine.png',
        audioURL: '../media/audio/ExtraFine.mp3',
        {
            title: 'Extra Fine',
            author: 'Starmaker',
            year: 2019
        }
    }
};

myPlayer.addFromList(collection);
myPlayer.spawn();


### Client-Side

### Full API


| method        | description   | Cool  |
| ------------- |:-------------:| -----:|
| function 1    | method        | $1600 |
| function 2    | method        |   $12 |
| function 3    | method        |    $1 |