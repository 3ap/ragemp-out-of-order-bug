Brief
=====

If I run ragemp-server on my OVH VPS (70ms+ ping), I can reliably
reproduce the out-of-order issue when I send ~40 events in a row, and
some of the events received by the client in the wrong order. I don't
think that I really need to send so many events in a row but it
greatly increases the chance of failure. In case of 500+ players
online the issue appears pretty often even if I send 5 consecutive
events.

That's how I found it. On [my server-side][server-code] I have a
remote "shell" via WebSockets to my server, and nothing else. It
allows me to run arbitrary code in real-time, without restarting the
server.

On the [client-side][client-code] I have only two events:
`_createDynamicMarkersByParams` and
`_removeDynamicMarkersByUniqName`. Their only purpose is to print
their names into client's log (clientdata/console.txt).

To reproduce the issue I run this small script via WebSocket shell:
```
for (i=0;i<20;i++)
{
    let player = mp.players[0];
    player.call("_removeDynamicMarkersByUniqName", ["CollectorATM"]);
    player.call("_createDynamicMarkersByParams", [{ uniqName: `CollectorATM`, color: [38, 81, 0, 255], position: new mp.Vector3(459.78, -142.90, 61.66), scale: 2 }]);
}
```

So, in theory I should always see such pattern in the F11 console:
```
remove...
create...
remove...
create...
```

But instead I get:
```
removeDynamicMarkersByUniqName CollectorATM
createDynamicMarkersByParams CollectorATM
createDynamicMarkersByParams CollectorATM
removeDynamicMarkersByUniqName CollectorATM
```

How to reproduce
----------------

  1. `git clone https://github.com/3ap/ragemp-out-of-order-bug`
  2. `cd ragemp-out-of-order-bug`
  3. `npm install`
  4. Copy server files (ragemp-server & bin) into this
     directory
  5. Run the ragemp-server
  6. Open the Terminal and run [wscat] or [websocat] to connect to 127.0.0.1:8001:

  ```
  .\websocat.x86_64-pc-windows-gnu.exe ws://127.0.0.1:8001
  # OR
  wscat --connect 127.0.0.1:8001
  ```

  7. Connect to the server via RageMP client and waits until you
     spawned

  8. Copy and run this code snippet via WebSocket several times (1-5,
     use Up button to speed this process up)

  ```
  for (i=0;i<20;i++) { let player = mp.players[0]; player.call("_removeDynamicMarkersByUniqName", ["CollectorATM"]); player.call("_createDynamicMarkersByParams", [{ uniqName: `CollectorATM`, color: [38, 81, 0, 255], position: new mp.Vector3(459.78, -142.90, 61.66), scale: 2 }]); }
  ```

  9. Open your ragemp client directory, and then clientdata/console.txt

  10. Try to find the case when two similar lines appeared or use
      this shell script to find it

  ```
  cat console.txt  | uniq -c | grep -a -v 1
  ```

  11. You should find something like that:

  ```
  ...
  removeDynamicMarkersByUniqName CollectorATM
  createDynamicMarkersByParams CollectorATM
  createDynamicMarkersByParams CollectorATM
  removeDynamicMarkersByUniqName CollectorATM
  ...
  ```

  In case of real server code such situation means that client will
  remove the marker AFTER creating it, and it's unacceptable and it
  ruins the code logic and game experience.


[server-code]: ./packages/zar/index.js
[client-code]: ./client_packages/index.js
