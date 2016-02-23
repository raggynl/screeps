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
    var path1 = [];
    if(this.roomCtrl.sources[1]){
      var pos1 = this.roomCtrl.spawns[0].pos;
      var pos2 = this.roomCtrl.sources[1].pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
      var path1 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    }

    pos1 = this.roomCtrl.spawns[0].pos;
    pos2 = this.roomCtrl.controller.pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;
    var path2 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    path1.push.apply(path1, path2)
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path1;
  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
      this.constructPlan()
  }
}

Plan.prototype.infrastructureLevel3 = function(){    //Plan level 2 infastructure
  if(!this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] && this.roomCtrl.towers[0]){
    var pos1 = this.roomCtrl.spawns[0].pos;
    var pos2 = this.roomCtrl.towers[0].tower.pos;//this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_SOURCES).pos;

    var path1 = this.roomCtrl.room.findPath(pos1, pos2, {ingoreCreep : true, heuristicWeighht: 1000})
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path1;
  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] &&
            this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
      this.constructPlan()
  }
}
Plan.prototype.infrastructureLevel4 = function(){    //Plan level 2 infastructure
  if(!this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level]){
    var targets = []
    targets.push(this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_EXIT_TOP))
    targets.push(this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_EXIT_RIGHT))
    targets.push(this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_EXIT_BOTTOM))
    targets.push(this.roomCtrl.spawns[0].pos.findClosestByRange(FIND_EXIT_LEFT))
    var pos1 = this.roomCtrl.spawns[0].pos;
    var path1 = [];

    for(var t in targets){
      var target = targets[t];
      if(target){
        var pos2 = target.pos;
        path1.push.apply(path1, this.roomCtrl.room.findPath(pos1, target, {ingoreCreep : true, heuristicWeighht: 1000}))
      }
    }
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = path1;
  }else if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] &&
            this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length){
              this.constructPlan()
  }
}
Plan.prototype.constructPlan = function(){
  var pos = this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level][0]
  this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].splice(0,1);
  this.roomCtrl.room.createConstructionSite(pos.x ,pos.y, STRUCTURE_ROAD)
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
      case 4:
        this.infrastructureLevel4();
        break;
    default:

  }
  if(this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] &&
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level].length == 0){
    this.roomCtrl.room.memory.plan[this.roomCtrl.controller.level] = true
  }
}


module.exports = Plan;
