global.createVehicle = (model, position, params) => {
    return new Promise((resolve, reject) => {
        resolve(mp.vehicles.new(model, position, params))
    });
}

global.destroyVehicle = (vehicle) => {
    return new Promise((resolve, reject) => {
        resolve(vehicle.destroy())
    });
}
