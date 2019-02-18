const cluster = require('cluster');
const http    = require('http');

//Set number of children process.
const nWorkers = 4;

//Set base port.
const port = 8000;

//Base master process.
const master = ()=>{

	console.log('Master server created!!');
	console.log('PID:',process.pid,' running in PORT:',port);

	//Set end process event.
  cluster.on('exit', (worker, code, signal)=>{
    console.log('worker ' + worker.process.pid + ' died');
  });

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });

  //Create the clusters.
  for (let i = 0; i < nWorkers; i++)
    cluster.fork();

}

//Children process.
const worker = (portNum)=>{

  console.log('Worker created, PID:',process.pid,' PORT:',portNum);

  //Create the server.
  http.createServer((req, res)=>{
    res.writeHead(200);
    res.end('Hello from worker PID:'+process.pid+'\n');
    console.log('Request received!');
  }).listen(portNum);

}

//Handle process exit.
process.on('SIGINT', ()=>{
  process.exit(err ? 1 : 0);   
});

//We will create N workers process that will share the port 8000
//to handle messages over tcp request.
if (cluster.isMaster)
	master();
else
	worker(port);