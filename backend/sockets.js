// FILE WITH CODE FOR SOCKETS

const spawn = require('child_process').spawn;
const { localGetCommand } = require('./processHuman');
const readline = require('readline');
const SpotifyWebApi = require('spotify-web-api-node');
var refresh = require('spotify-refresh');
/* ***** HOTWORD -- LOCAL CODE ***** */
// the following will change for different computers.
// const myFilePath = '/home/pi/Public/'; // PI
// const myFilePath = '/Users/JFH/horizons/'; // JENS
const myFilePath = '/Users/amandahansen/' // AMANDA

const fp1 = myFilePath +'Mirror/rpi-arm-raspbian-8.0-1.2.0/demo2.py';
const fp2 = myFilePath + 'Mirror/rpi-arm-raspbian-8.0-1.2.0';

/* ***** STT -- LOCAL CODE ***** */
function getCommand (widgetName, socket, io) {
  console.log('reached {A}', widgetName)
  return localGetCommand(widgetName)
    .then( respObj => {
      console.log('reached {B}', respObj, !respObj.category.toUpperCase().startsWith(widgetName))

    // BUG AMANDA TESTING WITH THIS COMMENTED OUT BUG
/*  if (!respObj.category.toUpperCase().startsWith(widgetName)) {
	  console.log('yash says not 1', respObj, widgetName);
      io.to('W_CONTAINER').emit('invalid_request');
      // io.to(widgetName).emit('stt_finished', respObj);
      // io.to('W_CONTAINER').emit('stt_finished', respObj);
      listenHotword(socket);
      return;
	}
	else */if (respObj.notFinished) {
		console.log('yash says not 2');
        console.log('reached {C}')
        // cycle incomplete, send new prompt to container
        io.to('W_CONTAINER').emit('stt_continuing', respObj );
        return getCommand(widgetName, socket, io);
      }
      else {
        console.log('reached {D}', widgetName);
        console.log('yash says not 3');
        io.to(widgetName).emit('stt_finished', respObj);
        io.to('W_CONTAINER').emit('stt_finished', respObj);
        listenHotword(socket);

        return respObj;
      }
    })
    .catch( err => {
      console.log('encountered error :(', err);
    });
}

/**** child process function ***/

let py;
let rl;

function listenHotword(socket) {

  console.log("python file is listening again");

  py = spawn('python', ['-u', fp1],{
    stdio: ['pipe', 'pipe', 'ignore'],
    cwd: fp2
  });

  rl = readline.createInterface({
    input: py.stdout,
    output: 'ignore'
  });

  rl.on('line', hotword => {
    console.log("hotword detected", hotword);
    if(hotword === 'wakeup'){
      console.log("wakeup");
      socket.emit('wakeup');
    }
    else if(hotword === 'sleep'){
      console.log("sleep");
      socket.emit('sleep');
    }
    else if(hotword === 'cancel'){
      console.log("cancel");
      socket.emit('cancel');
    }
    else if(hotword === 'click'){

		py1 = spawn('python', ['-u', '/home/pi/test_image.py'],{
			stdio: ['pipe', 'pipe', 'ignore'],
			wd: '/home/pi'
		});
	}
    else {
      socket.emit('widget', hotword);
    }
  });
}

/* ***** SOCKETS LISTENERS ***** */
module.exports = function (io) {

  io.on('connection', function(socket){

  	console.log("SOCKETS CODE compiled");

    listenHotword(socket);

    socket.on('join', widgetName => {
      console.log('SERVER in join', widgetName);
      if(socket.room)socket.leave(socket.room);
      socket.room = widgetName;
      socket.join(widgetName, () => {
        console.log('WIDGET joined ', widgetName);
      });
    });

    socket.on('stt', widgetName => {
      // we are killing children
      if(py) py.kill();
      console.log('SERVER in stt', widgetName);
      getCommand(widgetName, socket, io);
    });

    socket.on('invalid_request', () => {
      console.log('SERVER in invalid request');
      io.to('W_CONTAINER').emit('invalid_request');
    });

    socket.on('custom_msg', (msg) => {
      console.log('SERVER in custom message');
      io.to('W_CONTAINER').emit('custom_msg', msg);
    })


  });
}
