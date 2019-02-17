const child = require('child_process');
const http  = require('http');

//Create a process list.
const procList = [];

//Process counter.
const counter  = 0;

//Set base port.
const portNum = 8000;

//Load process list.
const createProcess = (num)=>{

  //Create the clusters.
  for (let i = 0; i < num; i++){

    //Create fork using a file.
    const worker = child.fork('./child.js');
    const pid    = worker.pid;

    //Set end process event.
    worker.on('exit', (worker, code, signal)=>{
      console.log('worker ' + pid + ' died');
    });

    worker.on('death', function(worker) {
      console.log('worker ' + pid + ' died');
    });

    //Send to each worker a test msg.
    worker.send({
      type : 'hello',
      payload : 'starting from '+process.pid
    });

    //Register the worker in the list.
    procList.push({
      id: 'serv-'+counter,
      proc : worker
    });
  }

}

//Get random process.
const getRandomWorker = ()=>{

  //Get a random process.
  const pos = Math.floor(Math.random()*procList.length);
  console.log(pos);
  return (pos<=procList.length)?procList[pos]:null;

}

//When a request is received-
const onRequest = (req, res)=>{
    
  const worker = getRandomWorker();

  if (worker){

   //Send to the children the messange and the response reference.
   worker.proc.send({
      type : 'request',
      response : res,
      payload : 'test calculation'
    });

  }

}

//Star the server.
const master = ()=>{

  //Echo start.
  console.log('Master server created!!');
  console.log('PID:',process.pid,' running in PORT:',portNum);

  //Create the workers.
  createProcess(4);

  //Start the server.
  http.createServer(onRequest).listen(portNum);

}

//Start master process.
master();

