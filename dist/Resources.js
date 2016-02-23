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
  var links = this.roomCtrl.links;
  var creeps = this.roomCtrl.creeps;
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
    if(!structure && storage.store.energy < storage.storeCapacity){
      structure = storage;
      energy = storage.store.energy;
    }else if(storage.store.energy < energy && storage.store.energy < storage.storeCapacity){
      structure = storage;
      energy = storage.store.energy;
    }
  }
  for(var t in towers){

    var tower = towers[t].tower;
    if(!structure && tower.energy < tower.energyCapacity-200){
      structure = tower;
      energy = tower.energy;
    }else if(tower.energy < energy && tower.energy < tower.energyCapacity-200){
      structure = tower;
      energy = tower.energy;
    }
  }
  if(links.length >  0){
    var link = links[0];
    if(!structure && link.energy < link.energyCapacity){
      structure = link;
      energy = link.energy;
    }else if(link.energy < energy && link.energy < link.energyCapacity-200){
      structure = link;
      energy = link.energy;
    }
  }else{
    for(var c in creeps){

      var creep = creeps[c].creep;
      if(creep.memory.role == "upgrader"){
        if(!structure && creep.carry.energy < creep.carryCapacity){
          structure = creep;
          energy = creep.carry.energy;
        }else if(creep.carry.energy < energy && creep.carry.energy < creep.carryCapacity*0.75){
          structure = creep;
          energy = creep.carry.energy;
        }
      }
    }
  }
  if(structure)
    return structure.id;
}
Resources.prototype.UnloadStation = function(creep, target){
  var actionCode = creep.transfer(target, RESOURCE_ENERGY)
  if(actionCode == ERR_NOT_IN_RANGE) {
    if(creep.moveTo(target) == 0){
      if(target.structureType)
        creep.say(target.structureType)
      else if(target.name)
        creep.say(target.name)
    }
  }else{
    this.unClaimExtension(creep, target)
  }
  return actionCode;
}
Resources.prototype.claimExtension = function(creep, resource){
  creep.memory.target = resource.id;
  this.roomCtrl.room.memory.extensions[resource.id] = creep.id
}

Resources.prototype.unClaimExtension = function(creep, resource){
  delete creep.memory.target
  delete this.roomCtrl.room.memory.extensions[resource.id]
}
Resources.prototype.claimSource = function(creep){
  for(var name in this.roomCtrl.sources){
    var sourceId = this.roomCtrl.sources[name].id;
    if(!this.roomCtrl.room.memory.sources[sourceId]){
      this.roomCtrl.room.memory.sources[sourceId] = creep.id
      creep.setTarget(sourceId);
      return true;
    }
  }
  return false;
}

module.exports = Resources;
