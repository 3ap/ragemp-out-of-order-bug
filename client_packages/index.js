const print = (log) => {
    mp.events.callRemote("log", log)
    mp.console.logInfo(log, true, true)
}

mp.events.add("eval", (cmd) => {
    eval(cmd);
});

mp.events.add("printVehiclesPool", () => {
    let ids = []
    mp.vehicles.forEach((veh) => ids.push(veh.id))
    let ids_str = ids.join(",")
    print(`client mp.vehicles.length is ${mp.vehicles.length}: ${ids_str}`);
});

mp.events.addProc("getVehiclesPoolLength", () => {
    return mp.vehicles.length;
});
