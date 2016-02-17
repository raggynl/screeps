var CreepFactory = require('CreepFactory');
var Blueprints = require('Blueprints');
var Plan = require('Plan');
var Tower = require('Tower');
var Resources = require('Resources');



function RoomController(room){
  this.room = room;
  this.controller = room.controller;

  this.creepTypeCount = {
    "harvester" : 0,
    "collector" : 0,
    "builder" : 0,
    "upgrader" : 0,
    "guard" : 0,
    "soldier" : 0,
    "medic" : 0,
    "claimer" : 0
  };
  this.creeps = [];
  this.towers = [];
  this.storages = [];
  this.hostileCreeps = [];
  this.structures = [];
  this.spawns = [];
  this.extensions = [];
  this.sources = [];
  this.droppedResources = [];

  this.hasOrder = false;
  this.nextUnloadTarget;
  this.nextDroppedResourceTarget;

  if(this.room.memory){
    if(!this.room.memory.sources){
      this.room.memory.sources = {}
    }
    if(!this.room.memory.plan){
      this.room.memory.plan = {}
    }
    if(!this.room.memory.extensions){
      this.room.memory.extensions = {}
    }
  }

  this.level = this.controller.level;
  var needExt = ((this.level-1)*5)
  if(this.extensions.length < needExt || !this.room.memory.plan[this.level]){
    this.level = this.controller.level - 1
  }

  this.loadCreeps();
  this.loadStructures();
  this.loadSources();
  this.loadEnemyCreeps();
  this.loadDroppedResourses();


  // console.log(this.nextUnloadTarget);
  this.Plan = new Plan(this);
  this.Resources = new Resources(this);
}

RoomController.prototype.colonize = function(){
  var order;
  if(!this.controller)return
  var level = 1;
  if(this.creepTypeCount.harvester < 1 && this.creeps.length < 2){
    order ="harvester";

  }else if(this.creepTypeCount.collector < 1 && this.creeps.length < 2){
    order ="collector";

  }else if(this.creeps.length < 20){
    level = this.level;

    if(this.creepTypeCount.harvester < 2){
      order ="harvester";

    }else if(this.creepTypeCount.collector < 2){
      order ="collector";

    }else if(this.creepTypeCount.builder < 2){
      order ="builder";
    }else if(this.creepTypeCount.upgrader < 3){
      order ="upgrader";
    }
    if(!order && level >= 2){
      if(this.creepTypeCount.collector < 3){
        order ="collector";
      }

    }

    // else if(this.creepTypeCount.claimer < 1){
    //   order ="claimer";
    // }
    // else if(this.creepTypeCount.guard > 1 && this.creepTypeCount.medic < 1){
    //   order ="medic";
    //
    // }else if(this.creepTypeCount.guard > 2 && this.creepTypeCount.soldier < 2){
    //   order ="soldier";
    // }else{
    //   order ="guard";
    // }
  }
  if(!!order){
    this.hasOrder = true
    console.log("order",order, level)

    console.log(this.room.name, this.creeps.length, JSON.stringify(this.creepTypeCount));
    for(var name in Game.spawns){
      var isBuilding = Blueprints(this.spawns[0], order, level);
      if(isBuilding)return;
    }
  }

}
RoomController.prototype.handleCreeps = function(){

  for(var c in this.creeps){
    var creep = this.creeps[c];

    if(!creep.creep.needRecharge(this.level)){
      creep.act();
    }


  }
}
RoomController.prototype.handleTowers = function(){
  for(var t in this.towers){
    var tower = this.towers[t];
    tower.act();
  }
}
RoomController.prototype.loadCreeps = function(){
  var creeps = this.room.find(FIND_MY_CREEPS);
  for(var name in creeps){
    var creep = CreepFactory(creeps[name], this);
    if(creep){
      this.creeps.push(creep);
      this.creepTypeCount[creep.creep.getRole()]++;
    }

  }
}
RoomController.prototype.loadStructures = function(){
  var structures = this.room.find(FIND_MY_STRUCTURES);
  for(var name in structures){
    var structure = structures[name];
    if(structure.structureType == "spawn"){
      if(!this.nextUnloadTarget){
        this.nextUnloadTarget = structure
      }
      else if(structure.energy < structure.energyCapacity &&
      ((structure.structureType  == "storage" && structure.energy < this.nextUnloadTarget.storage.energy) ||
      (structure.structureType  != "storage" && structure.energy < this.nextUnloadTarget.energy))){
        this.nextUnloadTarget = structure
      }
      this.spawns.push(structure)
    }
    else if(structure.structureType == "storage"){
      //console.log(structure.store.energy , structure.storeCapacity , structure.store.energy , this.nextUnloadTarget.energy)
      if(!this.nextUnloadTarget){
        this.nextUnloadTarget = structure
        //console.log("store")
      }else if(structure.store.energy < structure.storeCapacity && structure.store.energy < this.nextUnloadTarget.energy){
        this.nextUnloadTarget = structure
      }
      this.storages.push(structure)
    }
    else if(structure.structureType == "extension"){

      if(!this.nextUnloadTarget){
        this.nextUnloadTarget = structure
       }else if(structure.energy < structure.energyCapacity &&
       ((structure.structureType  == "storage" && structure.energy <= this.nextUnloadTarget.storage.energy) ||
       (structure.structureType  != "storage" && structure.energy <= this.nextUnloadTarget.energy))){
         this.nextUnloadTarget = structure
       }
      this.extensions.push(structure)
    }
    else if(structure.structureType == "tower"){

      if(!this.nextUnloadTarget){
        this.nextUnloadTarget = structure
      }else if(structure.energy < structure.energyCapacity &&
      ((structure.structureType  == "storage" && structure.energy <= this.nextUnloadTarget.storage.energy) ||
      (structure.structureType  != "storage" && structure.energy <= this.nextUnloadTarget.energy))){
        this.nextUnloadTarget = structure
      }
      this.towers.push(new Tower(structure, this))
    }
    else if(structure.structureType == "controller"){
      this.controller = structure
    }else{
      this.structures.push(structure)
    }


  }
  //if(this.nextUnloadTarget)
  // console.log("next unload",this.nextUnloadTarget.structureType);
  // console.log("next unload on", this.nextUnloadTarget)
}
RoomController.prototype.loadDroppedResourses = function(){
  this.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);

}
RoomController.prototype.loadSources = function(){
  if(!this.room.memory)return
  this.sources = this.room.find(FIND_SOURCES);
  for(var name in this.sources){
    var sourceId = this.sources[name].id;
    if(!this.room.memory.sources[sourceId])
      this.room.memory.sources[sourceId] = false;
  }
}
RoomController.prototype.loadEnemyCreeps = function(){
  var creeps = this.room.find(FIND_HOSTILE_CREEPS);
}
RoomController.prototype.assignSource = function(creep){
  for(var name in this.sources){
    var sourceId = this.sources[name].id;
    if(!this.room.memory.sources[sourceId]){
      this.room.memory.sources[sourceId] = creep.id
      creep.setTarget(sourceId);
      return;
    }
    // else{
    //   var creep = Game.getObjectById(this.room.memory.sources[sourceId])
    //   if(creep){
    //     this.room.memory.sources[sourceId] = false;
    //   }else{
    //     this.room.memory.sources[sourceId] = false;
    //   }
    // }
  }
}
RoomController.prototype.assignDroppedResources = function(){
  if(!this.nextDroppedResourceTarget){
    var droppedResource;
    var droppedObject;

    for(var name in this.droppedResources){

      if(!droppedObject){
        droppedObject = this.droppedResources[name];
      }else if(droppedObject.amount < this.droppedResources[name].amount){
        droppedObject = this.droppedResources[name];
      }
    }

    if(droppedObject)
      droppedResource = droppedObject.id
    this.nextDroppedResourceTarget = droppedResource

  }
  return this.nextDroppedResourceTarget;
}
RoomController.prototype.assignUnloadResources = function(){
  return this.nextUnloadTarget.id
}


module.exports = RoomController
