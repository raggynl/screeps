function CreepGuard(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepGuard.prototype.act = function(){
    var target = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

    if(target && target.owner.username != "Source Keeper") {

      if(  this.creep.attack(target) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
      }


    }else{
      this.creep.gotoNearestFlag()
    }
}

module.exports = CreepGuard
