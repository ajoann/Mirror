// FILE WITH CODE FOR SOCKETS

const spawn = require('child_process').spawn;
const { localGetCommand } = require('./processHuman');

/* ***** HOTWORD -- LOCAL CODE ***** */
// the following will change for different computers.
const myFilePath = '/home/pi/Public/'; // PI
// const myFilePath = '/Users/JFH/horizons/'; // JENS
//const myFilePath = '/Users/amandahansen/' // AMANDA
const fp1 = myFilePath +'Mirror/rpi-arm-raspbian-8.0-1.2.0/demo2.py';
const fp2 = myFilePath + 'Mirror/rpi-arm-raspbian-8.0-1.2.0';

let py = spawn('python', ['-u', fp1],{
  stdio: ['pipe', 'pipe', 'ignore'],
  cwd: fp2
})
// the above will change for different computers.

const readline = require('readline');
let rl = readline.createInterface({
  input: py.stdout,
  output: 'ignore'
});

/* ***** STT -- LOCAL CODE ***** */
function getCommand (widgetName, socket, io) {
  console.log('reached {A}')
  return localGetCommand(widgetName)
    .then( respObj => {
      console.log('reached {B}', respObj)

      if (respObj.notFinished) {
        console.log('reached {C}')
        // cycle incomplete, send new prompt to container
        io.to('W_CONTAINER').emit('stt_continuing', respObj );

        return getCommand(widgetName, socket, io)
        // return setTimeout(() => {return getCommand(widgetName)}, 1000);
      } else {
        console.log('reached {D}');
        // completed cycle, send to container & widget
        // io.emit('stt_finished', respObj);
		io.to('W_CONTAINER').emit('stt_finished', respObj);
		io.to(widgetName.toUpperCase()).emit('stt_finished', respObj);
        
        py = spawn('python', ['-u', fp1],{
			stdio: ['pipe', 'pipe', 'ignore'],
			cwd: fp2
		})
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
      else {
        socket.emit('widget', hotword);
      }
    });
		console.log('reached after D with py', py);
        return respObj;
      }
    })
    .catch( err => {
      console.log('encountered error :(', err);
    });
}

/* ***** SOCKETS LISTENERS ***** */
module.exports = function (io) {
  io.on('connection', function(socket){

  	console.log("connected to sockets and listening");

    // socket listener for Hot Word
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
      else {
        socket.emit('widget', hotword);
      }
    });

    // socket listeners for STT
    socket.room = 'DEFAULT';

    socket.on('join', widgetName => {
      console.log('SERVER in join', widgetName);
      socket.room = widgetName;

      socket.join(socket.room, () => {
        console.log('SERVER joined ', socket.room);
      });
    });

    socket.on('stt', widgetName => {
      console.log('SERVER in stt', widgetName);
      // we are killing children
	  py.kill();
      getCommand(socket.room, socket, io);
    });

    socket.on('invalid_request', () => {
      console.log('SERVER in invalid request');
      io.to('W_CONTAINER').emit('invalid_request');
    })

  });
}
