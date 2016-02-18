function CreepUpgrader(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepUpgrader.prototype.act = function(){
  var spawn = this.roomCtrl.spawns[0];
  var storage = this.roomCtrl.storages[0];
  if(storage && this.creep.carry.energy == 0 && storage.store.energy > 2000 &&storage.store.energy > this.creep.carryCapacity){
    //get energy from storage
    if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(storage);
    }
  }
  else if(spawn && !storage && this.creep.carry.energy == 0 && spawn.energy > this.creep.carryCapacity && !this.roomCtrl.hasOrder) {
    //get energy from spawn
    if(spawn.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);
    }
  }else if(this.creep.carry.energy > 0 ){
    //upgrade controller
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
