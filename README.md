# Cluster-servers
Examples and techniques of how to create a nodejs http server using the cluster module, creating fork process.

## Cluster server I:
In this example I create a basic http server using the net module. We share the same por for all the workers, in order to share the socker to the workers.

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

Running a ps-la:

```sh
F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000 13232  5806  0  80   0 - 219231 ep_pol pts/21  00:00:00 node
0 S  1000 13238 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13243 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13244 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
0 S  1000 13250 13232  0  80   0 - 218460 ep_pol pts/21  00:00:00 node
4 R  1000 13317 13265  0  80   0 -  7872 -      pts/35   00:00:00 ps
```
