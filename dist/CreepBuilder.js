function CreepBuilder(creep, room){
  this.creep = creep;
  this.roomCtrl = room;
}
CreepBuilder.prototype.act = function(){
  var spawn = Game.spawns.Spawn1;
  var storage = this.roomCtrl.storages[0];
  if(storage && this.creep.carry.energy == 0 && storage.store.energy > this.creep.carryCapacity){
    if(storage.transfer(this.creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(storage);

    }
  }
  else if(!storage && this.creep.carry.energy == 0 && spawn.energy > this.creep.carryCapacity && !this.roomCtrl.hasOrder) {
    if(spawn.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);

    }
  }else if(this.creep.carry.energy == 0 && this.roomCtrl.towers.length){
    if(this.roomCtrl.towers[0].tower.transferEnergy(this.creep) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);

    }
  }
  else {
    var target = Game.getObjectById(this.creep.getTarget());
    if(!target){
      var target = this.roomCtrl.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
    }

    if(target) {
      this.creep.setTarget(target.id);
      var didBuild = this.creep.build(target)
      if(didBuild == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target);
        this.creep.say(target.structureType)
      }else{
        if(!target || didBuild == 0){
          this.creep.deleteTarget();
        }else if(didBuild == 6){
            this.creep.gotoFlag("build")
        }else{
          this.creep.gotoFlag("build")
        }
      }
    }else if(this.roomCtrl.towers.length == 0 ){
      var targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      });

      targets.sort((a,b) => a.hits - b.hits);

      if(targets.length > 0) {
        if(this.creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(targets[0]);
        }
      }else{
        this.creep.gotoFlag("build");
      }
    }
  }
}
CreepBuilder.prototype.findTarget = function(){

}

module.exports = CreepBuilder
