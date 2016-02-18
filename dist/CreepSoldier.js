function CreepSoldier(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepSoldier.prototype.act = function(){
    var target = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)

    if(target && target.owner.username != "Source Keeper") {

        if(this.creep.pos.inRangeTo(target, 3)) {
          this.creep.say("FIRE")
          this.creep.rangedAttack(target);
        }else{
          this.creep.say("ATTACK")
          this.creep.moveTo(target);
        }


    }else{
      this.creep.gotoNearestFlag()
    }
}

module.exports = CreepSoldier
