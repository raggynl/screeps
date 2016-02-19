function CreepClaimer(creep, room,world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepClaimer.prototype.act = function(){
  if(this.roomCtrl.controller && this.roomCtrl.controller.level > 0){
    this.creep.gotoFlag("claim")
  }else if(this.roomCtrl.controller && !this.roomCtrl.controller.my){

    if(this.creep.room.controller) {
        var claim  = this.creep.claimController(this.creep.room.controller)
        if(claim == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
            this.creep.say("CLAIM")
        }else{
          this.creep.say("CLAIM:"+claim)
          this.creep.gotoFlag("claim")
        }
    }

  }
}

module.exports = CreepClaimer
