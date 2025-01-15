global.vehiclesReusePool = []
global.waitBeforePutToReusePool = 10/*s*/ * 1000

global.createVehicleReuse = (source, model, position, add) => {
  let vehicle

  if (global.vehiclesReusePool.length == 0)
  {
    vehicle = mp.vehicles.new(model, position, add);
    console.log(`zar veh reuse EXEC create vehicle ID=${vehicle.id} SOURCE=${source}`)
    return vehicle
  }

  if (!add) {
    add = {};
    add.heading = 0.0;
    add.numberPlate = "";
    add.alpha = 255;
    add.locked = false;
    add.engine = false;
    add.color = [0, 0];
    add.dimension = 0;
  } else {
    if (add.heading == null)
      add.heading = 0.0;
    if (add.numberPlate == null)
      add.numberPlate = "";
    if (add.alpha == null)
      add.alpha = 255;
    if (add.locked == null)
      add.locked = false;
    if (add.engine == null)
      add.engine = false;
    if (add.color == null || add.color.length != 2)
      add.color = [0, 0];
    if (add.dimension == null)
      add.dimension = 0;
  }

  vehicle = global.vehiclesReusePool.shift();
  console.log(`zar veh reuse EXEC reuse vehicle ID=${vehicle.id}`)
  vehicle.dimension = add.dimension;
  vehicle.model = model;
  vehicle.numberPlate = add.numberPlate;
  vehicle.alpha = add.alpha;
  vehicle.locked = add.locked;
  vehicle.engine = add.engine;
  vehicle.setColor(add.color[0], add.color[1]);
  vehicle.spawn(position, add.heading);

  return vehicle;
}

global.destroyVehicleReuse = (source, vehicle) => {
  vehicle.sqlId = undefined
  vehicle.owner = undefined
  vehicle.faction = undefined
  vehicle.parked = undefined
  vehicle.isAdmin = undefined
  vehicle.rentedByPlayer = undefined
  vehicle.stayingOnCarMarket = undefined
  vehicle.inventory = undefined
  vehicle.job = undefined
  vehicle.dimension = 9999
  vehicle.model = mp.joaat("yosemite")
  console.log(`zar veh reuse REQUEST send vehicle to reuse pool ID=${vehicle.id} SOURCE=${source}`)
  setTimeout(() => { console.log(`zar veh reuse EXEC send vehicle to reuse pool ID=${vehicle.id} SOURCE=${source}`); global.vehiclesReusePool.push(vehicle) }, global.waitBeforePutToReusePool)
}

global.createVehicle = global.createVehicleReuse
global.destroyVehicle = global.destroyVehicleReuse

setInterval(() => console.log("zar veh vehiclesReusePool.length", global.vehiclesReusePool.length), 1000)
setInterval(() => console.log("zar veh mp.vehicles.length", mp.vehicles.length), 1000)
