function CreepBuilder(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
  this.worldCtrl = world
  this.baseRoom = this.creep.memory.room;
}
CreepBuilder.prototype.act = function(){
  var room = this.worldCtrl.rooms[this.baseRoom];
  if(!room)room = this.roomCtrl;
  if(this.creep.room != this.creep.memory.room){
    if(this.creep.moveToRoom(this.creep.memory.room, this.roomCtrl)){
      return
    }
  }
  if(this.creep.carry.energy < 10){
    this.gatherEnergy(room)
    this.creep.deleteTarget();
  }else{
    var target = this.findTarget(room);

    if(target) {
      var actionCode;
      if(this.creep.memory.state == "build"){
          actionCode = this.creep.build(target);
      }else if(this.creep.memory.state == "unload"){
          actionCode = this.creep.transfer(target, RESOURCE_ENERGY)
      }else if(this.creep.memory.state == "repair"){
        actionCode = this.creep.repair(target);
      }
      if(actionCode && actionCode == ERR_NOT_IN_RANGE){
        this.creep.moveTo(target)
      }
      else{
        this.creep.deleteTarget();
      }

    }else{
      delete this.creep.memory.state
    }
  }
  this.creep.say(this.creep.memory.state)
  if(!this.creep.memory.state){
      this.creep.moveTo(25, 25)
  }
}
CreepBuilder.prototype.findTarget = function(room){
  var target = Game.getObjectById(this.creep.getTarget());

  if(!target){
    target = room.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
    this.creep.memory.state = "build"
  }
  if(!target && room.spawns[0] && room.spawns[0].energy < room.energyCapacity){//instead of spawn maybe refill extensions instead?
    target = room.spawns[0]
    this.creep.memory.state = "unload"
  }
  if(!target && (this.roomCtrl.level < 3 || !this.controller)){

    var targets = room.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax
    });
    targets.sort((a,b) => a.hits - b.hits);
    target = targets[0]
    this.creep.memory.state = "repair"
  }
  if(target)
    this.creep.setTarget(target.id)

  return target;

}
CreepBuilder.prototype.gatherEnergy = function(room){
  if(this.creep.carry.energy > 10) return false;
  var spawn = room.spawns[0];
  var storage = room.storages[0];
  var tower = room.towers[0]
  var energy =  Game.getObjectById(room.resources.findResource())
  if(storage && this.creep.carry.energy == 0  && storage.store.energy > 2000 && storage.store.energy > this.creep.carryCapacity){
      this.creep.memory.state = "get storage";
    if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(storage);
    }
    return true
  }
  else if(spawn && !storage && this.creep.carry.energy == 0 && spawn.energy > this.creep.carryCapacity && !this.roomCtrl.hasOrder) {
      this.creep.memory.state = "get spawn";
    if(spawn.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);

    }
    return true
  }else if(this.creep.carry.energy < 10 && energy && this.roomCtrl.storages.length == 0){//
    this.creep.memory.state = "get energy";
    var actionCode = this.creep.pickup(energy);
    if(actionCode == ERR_NOT_IN_RANGE) {
      if(this.creep.moveTo(energy) == 0){
        this.creep.say(energy.resourceType)
      }
    }
    return true
  }
  return false;
}
CreepBuilder.prototype.available = function(room){
  return this.creep.carry.energy > 0 && (!this.creep.memory.roomRequest || this.creep.memory.roomRequest == room)
}

module.exports = CreepBuilder
