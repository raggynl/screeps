function CreepUpgrader(creep, room){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepUpgrader.prototype.act = function(){
  var spawn = Game.spawns.Spawn1;
  var storage = this.roomCtrl.storages[0];
  if(storage && this.creep.carry.energy == 0 && storage.store.energy > this.creep.carryCapacity){
    if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(storage);

    }
  }
  else if(!storage && this.creep.carry.energy == 0 && spawn.energy > this.creep.carryCapacity && !this.roomCtrl.hasOrder) {
    if(spawn.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);

    }
  }else if(this.creep.carry.energy > 0 ){
    var controller = this.roomCtrl.controller;
    if(this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
      this.creep.say(controller.structureType)
			this.creep.moveTo(controller);


    }
  }else{
    this.creep.gotoFlag('build')
  }
}

module.exports = CreepUpgrader
