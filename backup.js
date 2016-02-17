for(var name in Game.creeps) {
  var creep = Game.creeps[name];

  if(creep.memory.role == 'harvester') {
    harvester(creep);
  }

  if(creep.memory.role == 'builder') {


    if(creep.carry.energy == 0) {
      if(Game.spawns.Spawn2.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns.Spawn2);

      }
    }
    else {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  }
  if(creep.memory.role == 'guard') {
    var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if(targets.length) {
      if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
  }
}
