Creep.prototype.getRole = function(){
  return this.memory.role;
}
Creep.prototype.setTarget = function setTarget(target){
	this.memory.target = target
  return this.memory.target;
}
Creep.prototype.getTarget = function getTarget(){
	return this.memory.target
}
Creep.prototype.deleteTarget = function deleteTarget(){
  delete this.memory.target;
}
Creep.prototype.onDeath = function onDeath(){
	//clear out creep from memory databank
	this.say("I'm Dead")
	this.memory = "dead"
}
Creep.prototype.needRecharge = function needRecharge(level, roomCtrl, ticks){
  if(!ticks)ticks = 100
  var target = roomCtrl.spawns[0];
  if(!target)return false;
  if(roomCtrl.totalStoredEnergy < 1000 )return false;
  if(!this.memory.level)return false;
  if(this.memory.level < level)return false
  if(level < 3)return false
  if(this.memory.world)return false
  if(!this.memory.room)return false
  if(this.ticksToLive < ticks || this.memory.recharging){
    this.memory.recharging = true;
    this.say("recharging")
    if(target.renewCreep(this) == ERR_NOT_IN_RANGE){

      this.moveTo(target);
    }
    if(this.ticksToLive > 1400){
        this.memory.recharging = false;
    }
  }
  return this.memory.recharging;
}
Creep.prototype.needRechargeOverride = function needRechargeOverride(level, roomCtrl, ticks){
  if(!ticks)ticks = 100
  var target = roomCtrl.spawns[0];
  if(!target)return false;

  if(this.ticksToLive < ticks || this.memory.recharging){
    this.memory.recharging = true;
    this.say("recharging")
    if(target.renewCreep(this) == ERR_NOT_IN_RANGE){

      this.moveTo(target);
    }
    if(this.ticksToLive > 1400){
        this.memory.recharging = false;
    }
  }
  return this.memory.recharging;
}
Creep.prototype.changeRoomCtrl = function changeRoomCtrl(roomName){
  this.memory.room = roomName;
}
Creep.prototype.moveToRoom = function moveToRoom(roomName, roomCtrl){

  if(this.room.name != roomName){

    for(var e in roomCtrl.exits){
      var exit = roomCtrl.exits[e];


      if(exit == roomName){

        var path = this.pos.findClosestByPath(parseInt(e))
        var move = this.moveTo(path)
        if(move == ERR_NOT_IN_RANGE){

          this.say(roomName)
          return true
        }else if(move == 0){
          this.say(roomName)
          return true
        }


      }
    }

  }
  return false;
}

Creep.prototype.lifeCycle = function lifeCyle(){
	//clear out creep from memory databank
	if(this.ticksToLive < 400)return true
	return false
}
Creep.prototype.energyIsFull = function cargoIsFull(){
	return this.energy < this.energyCapacity
}
Creep.prototype.energyCapacityFree = function energyCapacityFree(){
	return this.energyCapacity - this.energy
}
Creep.prototype.needHealing = function needHealing(){
	return this.hits < this.hitsMax
}
Creep.prototype.gotoNearestFlag = function gotoNearestFlag(){
  var flag = this.pos.findClosestByRange(FIND_FLAGS);
  this.moveTo(flag)
}
Creep.prototype.gotoFlag = function gotoFlag(name){
  this.moveTo(Game.flags[name])
  if(Game.flags[name])
    this.say(Game.flags[name].name +" flag")
  return Game.flags[name];
}
