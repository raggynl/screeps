function CreepUpgrader(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
  this.worldCtrl = world;
    this.baseRoom = this.creep.memory.room;
}
CreepUpgrader.prototype.act = function(){
  var link = this.roomCtrl.links[1];
  if(this.creep.carry.energy > 0 ){
    //upgrade controller
    this.creep.memory.state = "upgrade";
    var controller = this.roomCtrl.controller;
    if(this.creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {

			this.creep.moveTo(controller);
    }
  }else if(link){
    link.transferEnergy(this.creep);
    if(  link.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {

			this.creep.moveTo(link);
    }
  }
  // else{
  //     this.creep.memory.state = "bored";
  //     this.creep.moveTo(25, 25)
  //   //this.creep.gotoFlag('build')
  // }
  //this.creep.say(this.creep.memory.state)
}
CreepUpgrader.prototype.gatherEnergy = function(room){
  if(this.creep.carry.energy > 0) return false;
  var spawn = room.spawns[0];
  var storage = room.storages[0];
  var tower = room.towers[0]
  var energy =  room.resources.findResource()
  if(storage && this.creep.carry.energy == 0  && storage.store.energy > 10000 && storage.store.energy > this.creep.carryCapacity){
    if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(storage);
    }
    return true
  }
  else if(spawn && !storage && this.creep.carry.energy == 0 && spawn.energy > this.creep.carryCapacity && !this.roomCtrl.hasOrder) {
    if(spawn.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);

    }
    return true
  }else if(this.creep.carry.energy == 0 && energy){//
    var actionCode = this.creep.pickup(energy);
    if(actionCode == ERR_NOT_IN_RANGE) {
      if(this.creep.moveTo(energy) == 0){
        this.creep.say(energy.resourceType)
      }
    }return true
  }
  return false;
}
module.exports = CreepUpgrader
