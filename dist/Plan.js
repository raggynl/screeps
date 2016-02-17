function Plan(roomCtrl){

  this.roomCtrl = roomCtrl;
  this.infrastructure();
}

Plan.prototype.infrastructureLevel1 = function(){    //Plan level 1 infastructure
  if(!this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level]){
    var pos1 = this.roomCtrl.spawns[0].pos;
    var pos2 = this.roomCtrl.sources[0].pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
    var path = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path;

  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
    var pos = this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level][0]
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].splice(0,1);
    this.roomCtrl.room.createConstructionSite(pos.x ,pos.y, STRUCTURE_ROAD)
  }
}
Plan.prototype.infrastructureLevel2 = function(){    //Plan level 2 infastructure
  if(!this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level]){
    if(!this.roomCtrl.sources[1]){
      this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = true;
      return
    }
    var pos1 = this.roomCtrl.spawns[0].pos;
    var pos2 = this.roomCtrl.sources[1].pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
    var path1 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    pos1 = this.roomCtrl.spawns[0].pos;
    pos2 = this.roomCtrl.controller.pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
    var path2 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    path1.push.apply(path1, path2)
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path1;
  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
    var pos = this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level][0]
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].splice(0,1);
    this.roomCtrl.room.createConstructionSite(pos.x ,pos.y, STRUCTURE_ROAD)
  }
}

Plan.prototype.infrastructureLevel3 = function(){    //Plan level 2 infastructure
  if(!this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] && this.roomCtrl.towers[0]){
    var pos1 = this.roomCtrl.spawns[0].pos;
    var pos2 = this.roomCtrl.towers[0].tower.pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
    console.log(this.roomCtrl.room, pos1, pos2)
    var path1 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path1;
  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] &&
            this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
    var pos = this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level][0]
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].splice(0,1);
    this.roomCtrl.room.createConstructionSite(pos.x ,pos.y, STRUCTURE_ROAD)
  }
}

Plan.prototype.infrastructure = function(){
  if(!this.roomCtrl.controller)return
  switch (this.roomCtrl.controller.level) {
    case 1:
      this.infrastructureLevel1();
      break;
    case 2:
      this.infrastructureLevel2();
      break;
    case 3:
      this.infrastructureLevel3();
      break;
    default:

  }
  if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] &&
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length == 0){
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = true
  }
}


module.exports = Plan;
