function CreepHarvester(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepHarvester.prototype.act = function(){
      var target = Game.getObjectById(this.creep.getTarget())
      if(!target)
        this.creep.moveToRoom(this.creep.memory.room, this.roomCtrl)//check if creep is in base room


      if(!target){
        if(!this.roomCtrl.resources.claimSource(this.creep) && this.roomCtrl.sources.length> 0){
          //Failed to claim it's own source. Fall back to default source[0] target untill world requestCreep
          this.creep.needRechargeOverride( this.creep.memory.level,this.roomCtrl, 1300);
        }else{
          this.creep.say("source?")
        }
      }
      this.creep.moveTo(target);
  		if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
        this.creep.say("source")

  		}

      this.creep.drop(RESOURCE_ENERGY)
}
CreepHarvester.prototype.available = function(room){
  return !this.creep.getTarget() && (!this.creep.memory.roomRequest || this.creep.memory.roomRequest == room)
}



module.exports = CreepHarvester
