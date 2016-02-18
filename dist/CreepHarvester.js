function CreepHarvester(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepHarvester.prototype.act = function(){

      var target = Game.getObjectById(this.creep.getTarget())
      if(!target){
        this.creep.say("source?")
        this.roomCtrl.resources.claimSource(this.creep)
      }
  		if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
        this.creep.say("source")
  			this.creep.moveTo(target);
  		}

      this.creep.drop(RESOURCE_ENERGY)
}




module.exports = CreepHarvester
