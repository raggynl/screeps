function CreepColonizer(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepColonizer.prototype.act = function(){
      // this.creep.moveToRoom(this.creep.memory.room, this.roomCtrl)//check if creep is in base room
      if(this.roomCtrl.controller &&  this.roomCtrl.controller.level > 0 && this.roomCtrl.flags[0].name != "claim1"){
        flag = this.creep.gotoFlag("claim1")
      }else if(this.roomCtrl.controller && !this.roomCtrl.controller.my && this.roomCtrl.flags.length== 0){
        flag = this.creep.gotoFlag("claim1")
      }
      else{
        var target = this.creep.getTarget();
        //console.log(target, this.creep.carry.energy, this.creep.carry.energy == this.creep.carryCapacity || !target)
        if(this.creep.carry.energy == this.creep.carryCapacity || (!target && this.creep.carry.energy > 0)){
          this.creep.deleteTarget();
          var target = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
          var didBuild = this.creep.build(target)
          if(didBuild == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(target);
            this.creep.say(target.structureType)
          }
        }
        else{
          target = this.creep.room.find(FIND_SOURCES)[0];
          if(target)
          this.creep.setTarget(target.id)
          if(this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
            this.creep.say("source")
            this.creep.moveTo(target);
          }
        }



    }

}




module.exports = CreepColonizer
