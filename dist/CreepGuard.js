function CreepGuard(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepGuard.prototype.act = function(){
    if(this.creep.moveToRoom(this.creep.memory.room, this.roomCtrl)){

      return

    }else{
    }//check if creep is in base room

    var target = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

    if(target) {

      if(  this.creep.attack(target) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
      }


    }else{
      this.creep.gotoNearestFlag()
    }
}
CreepGuard.prototype.available = function(room){

  return true
}
module.exports = CreepGuard
