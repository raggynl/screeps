function CreepHarvester(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepHarvester.prototype.act = function(){

      var target = Game.getObjectById(this.creep.getTarget())
      if(!target){
        this.creep.say("source?")
        if(!this.roomCtrl.resources.claimSource(this.creep) && this.roomCtrl.sources.length> 0){
          //Failed to claim it's own source. Fall back to default source[0] target untill world requestCreep
          target = this.roomCtrl.sources[0]
        }
      }
  		if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
        this.creep.say("source")
  			this.creep.moveTo(target);
  		}

      this.creep.drop(RESOURCE_ENERGY)
}




module.exports = CreepHarvester
