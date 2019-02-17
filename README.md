# Cluster servers in Node.js
Examples and techniques of how to create a nodejs http server using the cluster module, creating fork process.

## Sharing ports:
In this example I create a basic http server using the net module. We share the same por for all the workers, in order to share the socket to the workers.

![N|Solid](https://github.com/damiancipolat/Cluster-servers/blob/master/doc/sharing-ports.png?raw=true)

**To run:**

```js
$ node cluster-server.js
```

And when we run the process the console output will be:

```sh
Master server created!!
PID: 13232  running in PORT: 8000
Worker created, PID: 13238  PORT: 8000
Worker created, PID: 13243  PORT: 8000
Worker created, PID: 13244  PORT: 8000
Worker created, PID: 13250  PORT: 8000
```

Running a ps-la, nodejs have created a different process:

```sh
F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000 13232  5806  0  80   0 - 219231 ep_pol pts/21  00:00:00 node
0 S  1000 13238 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13243 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13244 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13250 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
4 R  1000 13317 13265  0  80   0 -  7872 -      pts/35   00:00:00 ps
```

Running lsof -i :8000, the master process PID 13232 is the only who use the port "8000":

```sh
COMMAND   PID        USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    13232 damianlinux   16u  IPv6  93000      0t0  TCP *:8000 (LISTEN)
```

## Forked server:
In this code I will create a server that use fork process to create workers and communicate between them using a simple IPC.

![N|Solid](https://github.com/damiancipolat/Cluster-servers/blob/master/doc/message.png?raw=true)

```js
$ node fork-server/app.js
```

All workers answer each request and using ipc send to the parent process the response to send at the client. In the master process there are a list of process reference. The way to delegate the answer of each request is using a random way. You can take a look of the message broker created by me in other project.
