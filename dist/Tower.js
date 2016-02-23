function Tower(tower, roomCtrl){
  this.tower = tower;
  this.roomCtrl = roomCtrl;
}


Tower.prototype.act = function(){


  var target= this.findTarget();
  var enemies = this.roomCtrl.hostileCreeps;
  var enemy;
  if(targets.length > 0)enemy = enemies[0]
  if(enemy){
    this.tower.attack(enemy);
  }
  else if(target && this.tower.energy > 500){
    this.tower.repair(target);
  }
}

Tower.prototype.findTarget = function(){


  targets = this.roomCtrl.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  });

  targets.sort((a,b) => a.hits - b.hits);

  if(targets.length > 0) {
    return targets[0]
  }
}
module.exports = Tower
