function CreepCollector(creep, room){
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
      this.roomCtrl.Resources.UnloadStation(this.creep, target)
      // actionCode = this.creep.transfer(target, RESOURCE_ENERGY)
      // if(actionCode == ERR_NOT_IN_RANGE) {
      //   if(this.creep.moveTo(target) == 0){
      //     this.creep.say(target.structureType)
      //   }
      // }
    }
    if(actionCode && actionCode != ERR_NOT_IN_RANGE){
      this.creep.deleteTarget();
    }
  }

  else{
    this.creep.say( "work?")
    //No target could be found. Creep is jobless.
    //See if creep is elsewhere needed in the world?
  }

}
CreepCollector.prototype.findTarget = function(){
  var target = Game.getObjectById(this.creep.getTarget());
  if(!target && this.creep.carry.energy > 0){
    target = Game.getObjectById(
                  this.creep.setTarget(
                      this.roomCtrl.Resources.findUnloadStation(this.creep)
                    ));
  }
  if(!target && this.creep.carry.energy != this.creep.carryCapacity){
    target = Game.getObjectById(
                  this.creep.setTarget(
                      this.roomCtrl.Resources.findResource()
                    ));
  }
  return target;
}



module.exports = CreepCollector
