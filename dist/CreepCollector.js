function CreepCollector(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepCollector.prototype.act = function(){
  var target = this.findTarget();
  if(target){
    var actionCode;
    if(target.resourceType){
      var actionCode = this.creep.pickup(target);
      if(actionCode == ERR_NOT_IN_RANGE) {
        if(this.creep.moveTo(target) == 0){
          this.creep.say(target.resourceType)
        }
      }
    }else if(target.structureType){
      actionCode = this.roomCtrl.resources.UnloadStation(this.creep, target)
    }
    if(actionCode && actionCode != ERR_NOT_IN_RANGE){
      this.creep.deleteTarget();
    }
  }

  else {
    this.creep.say( "work?")
    //No target could be found. Creep is jobless.
    //See if creep can refill extensions with stored energy
    var transfer = this.roomCtrl.resources.findUnclaimedExtension()
    if(transfer){
      var storage = this.roomCtrl.storages[0];
      if(storage && this.creep.carry.energy == 0 && storage.store.energy > this.creep.carryCapacity){
        if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(storage);
        }
      }else{
        this.roomCtrl.resources.claimExtension(this.creep, transfer)
      }
    }
  }

}
CreepCollector.prototype.findTarget = function(){
  var target = Game.getObjectById(this.creep.getTarget());
  if(!target && this.creep.carry.energy > 0){
    target = Game.getObjectById(
                  this.creep.setTarget(
                      this.roomCtrl.resources.findUnloadStation(this.creep)
                    ));
  }
  if(!target && this.creep.carry.energy != this.creep.carryCapacity){
    target = Game.getObjectById(
                  this.creep.setTarget(
                      this.roomCtrl.resources.findResource()
                    ));
  }
  return target;
}



module.exports = CreepCollector
