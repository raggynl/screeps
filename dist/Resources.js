function Resources(roomCtrl){
  this.roomCtrl = roomCtrl;
  this.hasNoEmptyExtensionsLeft = false;

}


Resources.prototype.findResource = function(){
  if(!this.roomCtrl.nextDroppedResourceTarget){
    var droppedResource;
    var droppedObject;

    for(var name in this.roomCtrl.droppedResources){

      if(!droppedObject){
        droppedObject = this.roomCtrl.droppedResources[name];
      }else if(droppedObject.amount < this.roomCtrl.droppedResources[name].amount){
        droppedObject = this.roomCtrl.droppedResources[name];
      }
    }

    if(droppedObject)
      droppedResource = droppedObject.id
    this.roomCtrl.nextDroppedResourceTarget = droppedResource

  }
  return this.roomCtrl.nextDroppedResourceTarget;
}
Resources.prototype.findUnclaimedExtension = function(){
  if(this.hasNoEmptyExtensionsLeft)return;
  for(var e in this.roomCtrl.extensions){
    var extension = this.roomCtrl.extensions[e];
    if(!this.roomCtrl.room.memory.extensions[extension.id] && extension.energy < extension.energyCapacity){
      return extension
    }
  }
  this.hasNoEmptyExtensionsLeft = true;
}
Resources.prototype.findUnloadStation = function(creep){
  var structure = this.findUnclaimedExtension();
  if(structure){
    this.claimExtension(creep, structure);
    return structure.id
  }

  var spawns = this.roomCtrl.spawns;
  var storages = this.roomCtrl.storages;
  var towers = this.roomCtrl.towers;
  var structure;
  var energy = 0;

  for(var s in spawns){
    var spawn = spawns[s];
    if(!structure && spawn.energy < spawn.energyCapacity){
      structure = spawn;
      energy = spawn.energy;
    }else if(spawn.energy < energy && spawn.energy < spawn.energyCapacity){
      structure = spawn;
      energy = spawn.energy;
    }
  }
  for(var s in storages){
    var storage = storages[s]
    //console.log(storage.store.energy , energy , storage.store.energy , storage.storeCapacity, structure, !structure && storage.store.energy < storage.storeCapacity)
    if(!structure && storage.store.energy < storage.storeCapacity){
      structure = storage;
      energy = storage.store.energy;
    }else if(storage.store.energy < energy && storage.store.energy < storage.storeCapacity){
      structure = storage;
      energy = storage.store.energy;
    }
  }
  for(var t in towers){
    var tower = towers[t];
    if(!structure && tower.energy < tower.energyCapacity){
      structure = tower;
      energy = tower.energy;
    }else if(tower.energy < energy && tower.energy < tower.energyCapacity){
      structure = tower;
      energy = tower.energy;
    }
  }
  if(structure)
    return structure.id;
}
Resources.prototype.UnloadStation = function(creep, target){
  actionCode = creep.transfer(target, RESOURCE_ENERGY)
  if(actionCode == ERR_NOT_IN_RANGE) {
    if(creep.moveTo(target) == 0){
      creep.say(target.structureType)
    }
  }else{
    this.unClaimExtension(creep, target)
  }
}
Resources.prototype.claimExtension = function(creep, resource){
  creep.memory.target = resource.id;
  this.roomCtrl.room.memory.extensions[resource.id] = creep.id
}

Resources.prototype.unClaimExtension = function(creep, resource){
  creep.memory.target = false
  this.roomCtrl.room.memory.extensions[resource.id] = false
}

module.exports = Resources;