# Cluster servers in Node.js
Examples and techniques of how to create a nodejs http server using the cluster module, creating fork process.

- **[Share ports]**
- **[Fork server]**
- **[PM2 & cluster]**

[Share ports]:https://github.com/damiancipolat/Cluster-servers/blob/master/README.md#share-ports
[Fork server]:https://github.com/damiancipolat/Cluster-servers/blob/master/README.md#forked-server
[PM2 & cluster]:https://github.com/damiancipolat/Cluster-servers/blob/master/README.md#pm2--cluster-server

## Share ports:
In this example I create a basic http server using the "http" module. We share the same por for all the workers, in order to share the socket to the workers.

![N|Solid](https://github.com/damiancipolat/Cluster-servers/blob/master/doc/sharing-ports.png?raw=true)

**To run:**

```js
$ node cluset-server/cluster-server.js
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

**To run:**

```sh
$ node fork-server/app.js
```

All workers answer each request and using ipc send to the parent process the response to send at the client. In the master process there are a list of process reference. The way to delegate the answer of each request is using a random way. You can take a look of the message broker created by me in other project.

## PM2 & cluster server:
In the last examples we learn how to create our custom load balancer process using the children forked process, but in a production environment, maybe is'nt the best way. I think could be a better option work with a robust process manager. One good option is PM2 http://pm2.keymetrics.io. PM2 offer us the way to work as a load process balance for us, take a look of this link http://pm2.keymetrics.io/docs/usage/cluster-mode/.

**Configuration, define to pm2 the number of children process to create:**

```json
{
  "apps" : [{
    "script"    : "api.js",
    "instances" : "4",
    "exec_mode" : "cluster" 
  }]
}
```

**To run:**

```sh
$ pm2 start process.json
```

**Monitoring:**

To see the list of process running:

```sh
$ pm2 list
┌──────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬─────────────┬──────────┐
│ App name │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user        │ watching │
├──────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼─────────────┼──────────┤
│ api      │ 0  │ N/A     │ cluster │ 26085 │ online │ 0       │ 2m     │ 0%  │ 37.3 MB   │ damianlinux │ disabled │
│ api      │ 1  │ N/A     │ cluster │ 26091 │ online │ 0       │ 2m     │ 0%  │ 37.1 MB   │ damianlinux │ disabled │
│ api      │ 2  │ N/A     │ cluster │ 26097 │ online │ 0       │ 2m     │ 0%  │ 36.8 MB   │ damianlinux │ disabled │
│ api      │ 3  │ N/A     │ cluster │ 26107 │ online │ 0       │ 2m     │ 0%  │ 37.2 MB   │ damianlinux │ disabled |

```

To see a console UI:

```sh
$ pm2 monit
```

To finish all the process:

```sh
$ pm2 kill
```

**Note:**

Be sure your application is stateless meaning that no local data is stored in the process, for example sessions/websocket connections, session-memory and related. Use Redis, Mongo or other databases to share states between processes.

Another resource on how to write efficient, production ready stateless application is The Twelve Factor Application manifesto.
