const ws = require('ws');
const util = require('util')
const { performance } = require('perf_hooks')
const wss = new ws.Server({ host: "127.0.0.1", port: 8002 });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', (data) => {
        const log = (...args) => ws.send(util.format.apply(null, args))
        try
        {
            const start = performance.now()
            eval(data.toString())
            const end = performance.now()
            ws.send(end-start)
        } catch (err) {
            console.log(err);
            ws.send(util.format(err));
        }
    });
});

const AMOUNT_OF_VEHICLES_TO_CREATE = 50
global.vehicles = []
global.printVehiclesPool = () =>
{
    let ids = [];
    mp.vehicles.forEach((veh) => ids.push(veh.id));
    let ids_str = ids.join(",");
    console.log(`server mp.vehicles.length is ${mp.vehicles.length}: ${ids_str}`);
}

require("./vehicles-queue")
global.createVehicles = async () => {
    console.log("createVehicles");
    for(let i=0;i<AMOUNT_OF_VEHICLES_TO_CREATE;i++)
        global.vehicles[i] = await global.createVehicle(mp.joaat("tursimo"), new mp.Vector3(-431.74-i*2, 1137.85, 326))
}

global.destroyVehicles = async () => {
    console.log("destroyVehicles");
    for(let i=0;i<AMOUNT_OF_VEHICLES_TO_CREATE;i++)
        await global.destroyVehicle(global.vehicles[i])
}

global.destroyCreateVehicles = async () => {
    if (!mp.players.exists(0))
        return

    global.destroyCreateVehiclesIterations++
    try {
        await global.destroyVehicles()
        await global.createVehicles()

        let serverVehiclesCount = mp.vehicles.length;
        let clientVehiclesCount = await mp.players[0].callProc("getVehiclesPoolLength", []);
        if (serverVehiclesCount != clientVehiclesCount)
        {
            console.log("desync?");
            await new Promise(r => setTimeout(r, 1000));

            serverVehiclesCount = mp.vehicles.length;
            clientVehiclesCount = await mp.players[0].callProc("getVehiclesPoolLength", []);

            if (serverVehiclesCount != clientVehiclesCount)
            {
                console.log(`desync! iterations: ${global.destroyCreateVehiclesIterations}`);
                global.printVehiclesPoolStatesInterval = setInterval(() => { mp.players[0].call("printVehiclesPool", []); global.printVehiclesPool() }, 1000)
                return
            }
        }
    } catch(error) {
        console.log(error)
    }

    setTimeout(global.destroyCreateVehicles, 100)
};

mp.events.add("playerReady", player => {
    player.position = new mp.Vector3(-438.74, 1117.85, 326)
    global.destroyCreateVehiclesIterations = 0
    setTimeout(global.destroyCreateVehicles, 100)
});

mp.events.add("playerQuit", (player) => {
    if (global.printVehiclesPoolStatesInterval)
    {
        clearInterval(global.printVehiclesPoolStatesInterval)
        global.printVehiclesPoolStatesInterval = undefined
    }
});

mp.events.add("log", (player, log) => {
    console.log(log);
});

global.createVehicles()
