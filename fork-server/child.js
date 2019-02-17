//When a message is received from the master process.
process.on('message', (msg)=>{

  console.log('> Received ', msg);

  if ((msg.type)&&(msg.payload)){

    switch(msg.type) {
      case 'hello':
        console.log('Received from parent process',msg.payload);
        break;
      case 'request':{

        //Response in the socket.
        msg.response.writeHead(200);
        msg.res.end("hi! request\n");

        break;
      }
    }

  }

});

console.log('Worker created PID:',process.pid);