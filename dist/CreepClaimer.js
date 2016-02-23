function CreepClaimer(creep, room,world){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepClaimer.prototype.act = function(){
  var flag;
  // this.creep.needRechargeOverride( this.creep.memory.level,this.roomCtrl, 1300);
  if(this.roomCtrl.controller && this.roomCtrl.controller.level > 0){
    flag = this.creep.gotoFlag("claim")
  }else if(this.roomCtrl.flags.length== 0){
    flag = this.creep.gotoFlag("claim")
  }else if(this.roomCtrl.controller && !this.roomCtrl.controller.my){

    if(this.creep.room.controller && this.roomCtrl.flags.length > 0) {
        var claim  = this.creep.claimController(this.creep.room.controller)
        if(claim == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller);
            this.creep.say("CLAIM")
        }else{
          this.creep.gotoFlag("claim")
        }
    }else{
      this.creep.gotoFlag("claim")
    }

  }
}

module.exports = CreepClaimer
