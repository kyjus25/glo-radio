const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to login native browser global.
const BrowserWindow = electron.BrowserWindow;

var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const url = require('url');
var request = require('request');
const child_process = require('child_process');

global.webhookQueue = [];
let video = null;

var expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
expressApp.use(express.static('./'));

expressApp.set('webhook_queue', []);

expressApp.post('/', function (req, res) {
    // console.log(req.body.action);
    if (
        (req.body.action === 'added' || req.body.action === 'reordered' || req.body.action === 'deleted' || req.body.action === 'moved_column' )
        && (req.body.hasOwnProperty('card') && !req.body.hasOwnProperty('comment'))
    ) {
        global.webhookQueue.push(req.body);
    }

    res.send({});
});

expressApp.get('/queue', function (req, res) {
    // console.log('SENDING', global.webhookQueue);
    res.send(global.webhookQueue);
    global.webhookQueue = [];
});

expressApp.delete('/queue', function (req, res) {
    // for (let i = 0; i < queue.length; i++) {
    //    if (queue[i]['sequence'].toString() === req.query['sequence'].toString()) {
    //        console.log('REMOVING INDEX ', i);
    //        queue.splice(i, 1);
    //    }
    // }
    global.webhookQueue = [];
    // console.log('DELETED', global.webhookQueue);
    res.send([]);
});

expressApp.get('/play', function (req, res) {
    console.log('GOT PLAY');
    res.send([]);
    playVideo(req.query['videoID']);
});

expressApp.get('/stop', function (req, res) {
    res.send([]);
    video.kill();
});


var port = process.env.PORT || 1337;
expressApp.listen(port, () => console.log('Listening at http://localhost:1337'));





// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function playVideo(id) {
    if (video) {
        console.log(video.pid);
        video = child_process.exec('killall mpv', function(error, stdout, stderr){});
    }
    console.log('playing', id);
    video = child_process.exec('mpv http://www.youtube.com/watch?v=' + id + ' --no-video', function(error, stdout, stderr){}, error => {});
    video.addListener('close', handleExit);
    video.addListener('error', handleExit);
}

function handleExit() {
    // console.log('EXIT');
}

function createWindow () {
  // Create the browser global.
  mainWindow = new BrowserWindow(
    {
      width: 800,
      height: 400,
      center: true,
      frame: true,
      icon: path.join(__dirname, 'assets/pngs/icon.png')
    });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    process.exit();
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to login browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-login a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
