global.vehiclesTaskQueue = [];
global.vehiclesTaskQueueDelay = 5/*ms*/;

global.createVehicle = (model, position, params) => {
    return new Promise((resolve, reject) => {
        vehiclesTaskQueue.push({ task: { action: "create", model, position, params }, resolve });
    });
}

global.destroyVehicle = (vehicle) => {
    return new Promise((resolve, reject) => {
        vehiclesTaskQueue.push({ task: { action: "destroy", vehicleid: vehicle.id }, resolve });
    });
}

global.vehiclesTaskQueueProcess = async () => {
    if (vehiclesTaskQueue.length > 0)
    {
        const { resolve, task } = vehiclesTaskQueue.shift();
        switch(task.action)
        {
            case "create":
                let vehicle = mp.vehicles.new(task.model, task.position, task.params);
                console.log(`create vehicle ID=${vehicle.id}`);
                resolve(vehicle);
                break;

            case "destroy":
                let result
                if (mp.vehicles.exists(task.vehicleid))
                {
                    mp.vehicles.at(task.vehicleid).destroy();
                    result = true;
                }
                else
                {
                    result = false;
                }
                console.log(`destroy vehicle ID=${task.vehicleid}, ${result}`);
                resolve(result);
                break;
        }
    }

    setTimeout(global.vehiclesTaskQueueProcess, global.vehiclesTaskQueueDelay);
}
global.vehiclesTaskQueueProcess()
