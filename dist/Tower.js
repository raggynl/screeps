function Tower(tower, roomCtrl){
  this.tower = tower;
  this.roomCtrl = roomCtrl;
}


Tower.prototype.act = function(){
  var target= this.findTarget();
  if(target){

      this.tower.repair(target);
    

  }
}

Tower.prototype.findTarget = function(){
  var targets = this.roomCtrl.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  });

  targets.sort((a,b) => a.hits - b.hits);

  if(targets.length > 0) {
    return targets[0]
  }
}
module.exports = Tower
