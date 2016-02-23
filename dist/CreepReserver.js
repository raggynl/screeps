function CreepReserver(creep, room,world){
  this.creep = creep;
  this.roomCtrl = room;
  this.worldCtrl = world;
  this.baseRoom = this.creep.memory.room;
}
CreepReserver.prototype.act = function(){
  var room = this.worldCtrl.rooms[this.baseRoom];
  if(!room)room = this.roomCtrl;
  if(this.creep.room != this.creep.memory.room){
    if(this.creep.moveToRoom(this.creep.memory.room, this.roomCtrl)){
      return
    }
  }
  if(this.creep.reserveController(this.roomCtrl.controller) == ERR_NOT_IN_RANGE){
    this.creep.moveTo(this.roomCtrl.controller);
  }



}

module.exports = CreepReserver
