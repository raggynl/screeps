function CreepMedic(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepMedic.prototype.act = function(){
  var target = this.creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object){
  return object.needHealing()
}})

    if(target) {
      this.creep.say("healing")
        this.creep.moveTo(target);
          this.creep.heal(target);


    }
    else {
      this.creep.gotoNearestFlag()

   }
}

module.exports = CreepMedic
