global.createVehicle = (source, model, position, params) => {
    return new Promise((resolve, reject) => {
        resolve(mp.vehicles.new(model, position, params))
    });
}

global.destroyVehicle = (source, vehicle) => {
    return new Promise((resolve, reject) => {
        resolve(vehicle.destroy())
    });
}
