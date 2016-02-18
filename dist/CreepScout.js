function CreepScout(creep, room, world){
  this.creep = creep;
  this.roomCtrl = room;
  this.worldCtrl = world;
  if(!this.creep.memory.scout){
    this.creep.memory.scout = {}
  }
  this.exits = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT]


}

CreepScout.prototype.act = function(){

  var target = this.getTarget()
  console.log("scout",JSON.stringify(target))
  if(target){
    this.creep.say("scout")
    console.log("scout move", this.creep.moveTo(target.x, target.y));
  }

}
CreepScout.prototype.getTarget = function(){
    var target = this.creep.memory.scout.target

    if(!target && this.roomCtrl.controller && this.roomCtrl.controller.my){
      console.log("new target")
      var scout = this.roomCtrl.findNextExit(this.creep)
      if(scout && scout.target == null){
        var roomMem = this.creep.memory.room
        Game.rooms[roomMem].memory.scoutedExits.push(this.creep.memory.scout.exit);
        delete this.creep.memory.scout
      }else if(scout){
        this.creep.memory.scout = scout;
        target = this.creep.memory.scout.target;
      }

    }
    else if(target && this.roomCtrl.room.name != this.creep.memory.room && this.creep.memory.scout.exit){
      var roomMem = this.creep.memory.room
      console.log("room scouted",roomMem)
      Game.rooms[roomMem].memory.scoutedExits.push(this.creep.memory.scout.exit);
      delete this.creep.memory.scout
      target = null;

    }else{
      console.log("sdf")
      this.creep.suicide()
    }
    return target
}
CreepScout.prototype.worldAct = function(){
  // this.creep.say("worldy")
  // var nextExit = this.exits[Math.floor((Math.random() * 4))] //exit to the next room
  // var exit = this.creep.pos.findClosestByRange(nextExit)
  // this.creep.moveTo(exit)
}


module.exports = CreepScout
