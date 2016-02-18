var Blueprints = require('Blueprints');
var CreepFactory = require('CreepFactory');
var Resources = require('Resources');
var Plan = require('Plan');
var Tower = require('Tower');

var maxExtensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];
var exits = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];


function RoomController(room, worldCtrl){
  this.worldCtrl = worldCtrl;
  this.room = room;
  this.controller = room.controller;

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
    if(!this.room.memory.scoutedExits){
      this.room.memory.scoutedExits = []
    }
  }
  this.creepTypeCount = {
    "harvester" : 0,
    "collector" : 0,
    "builder" : 0,
    "upgrader" : 0,
    "guard" : 0,
    "soldier" : 0,
    "medic" : 0,
    "claimer" : 0,
    "scout" : 0
  };
  this.creeps = [];//Creeps that are controlled by the RoomController.
  this.towers = [];
  this.storages = [];
  this.hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
  this.constructions = this.room.find(FIND_CONSTRUCTION_SITES);
  this.flags = this.room.find(FIND_FLAGS);
  this.structures = [];
  this.spawns = [];
  this.extensions = [];
  this.sources = [];
  this.droppedResources = [];
  this.hasOrder = false;
  this.loadCreeps();
  this.loadStructures();

  this.loadSources();
  this.loadDroppedResourses();
  if(this.controller){
    this.level = this.controller.level;
    var needExt = maxExtensions[this.level];
    if(this.extensions.length < needExt || !this.room.memory.plan[this.level]){
      this.level = this.controller.level - 1;
    }

    this.plan = new Plan(this);


  }


  this.resources = new Resources(this);
}
RoomController.prototype.requestCreep = function(target, creepRole){
  for(var c in this.creeps){
    var creep = this.creeps[c];
    if(creep.creep.memory.role == creepRole && creep.creep.carry.energy == creep.creep.carryCapacity)
      creep.creep.memory.target.id
      return true;
  }
  return false
}
RoomController.prototype.findNextExit= function(creep){
  if(this.room.memory.scoutedExits.length < 4){
    console.log("find next path", this.room.memory.scoutedExits.length, exits);
    var scout = exits[this.room.memory.scoutedExits.length]
    console.log("find next path", scout);
    return {exit : scout, target : creep.pos.findClosestByPath(scout)}
  }
}
RoomController.prototype.colonize = function(){
  if(!this.controller)return
  var order;
  var level = 1;
  var options = {};
  options.room = this.room.name;
  if(this.creepTypeCount.harvester < 1 && this.creeps.length < 2){
    order ="harvester";
  }else if(this.creepTypeCount.collector < 1 && this.creeps.length < 2){
    order ="collector";

  }else if(this.creeps.length < 20){
    level = this.level;

    if(this.creepTypeCount.harvester < this.sources.length){
      order ="harvester";
    }else if(this.creepTypeCount.collector < this.sources.length){
      order ="collector";

    }else if(this.creepTypeCount.builder < 2){
      order ="builder";
    }else if(this.creepTypeCount.upgrader < 3){
      order ="upgrader";
    }
    if(!order && level >= 2){
      if(this.creepTypeCount.collector < this.sources.length+1){
        order ="collector";
      }
    }
    if(!order && level >= 3){
      if(this.creepTypeCount.scout < 1 && this.room.memory.scoutedExits.length == 0){
        order ="scout";
      }else if(this.creepTypeCount.claimer < 1 && this.room.memory.scoutedExits.length == exits.length && Game.gcl.level == this.worldCtrl.rooms.length+1){
        order ="claimer";
      }else if(this.creepTypeCount.upgrader < 5 && this.storages[0].store > 5000){
        order ="upgrader";
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
    for(var name in this.spawns){
      var isBuilding = Blueprints(this.spawns[name], order, level, options);
      if(isBuilding)return;
    }
  }



  //build a new coleny
  if(this.controller.my){
    if(this.spawns.length == 0 && this.flags.length > 0){
      console.log("Construction of new room spawn initiated")
      if(this.flags[0].name == "claim"){
        this.room.createConstructionSite(this.flags[0].pos.x, this.flags[0].pos.y, STRUCTURE_SPAWN)
        this.flags[0].destroy();
      }
    }
    else if(this.spawns.length == 0 && this.constructions > 0 && this.creepTypeCount.builder == 0){
      console.log("Requesting builder to start building here")
      this.world.requestCreep(this.constructions[0], "builder")
    }
  }

}

RoomController.prototype.loadCreeps = function(){
  var creeps = this.room.find(FIND_MY_CREEPS);
  for(var name in creeps){
    var creep = CreepFactory(creeps[name], this);
    if(creep){
      if(creep.creep.memory.world){
        this.worldCtrl.addCreepToWorld(creep)
      }else{
        this.creeps.push(creep);
        this.creepTypeCount[creep.creep.getRole()]++;
      }
    }

  }
  this.room.memory.creepCount = this.creepTypeCount;
}
RoomController.prototype.loadStructures = function(){
  var structures = this.room.find(FIND_MY_STRUCTURES);
  for(var name in structures){
    var structure = structures[name];
    if(structure.structureType == "spawn"){
      this.spawns.push(structure)
    }
    else if(structure.structureType == "storage"){
      this.storages.push(structure)
    }
    else if(structure.structureType == "extension"){
      this.extensions.push(structure)
    }
    else if(structure.structureType == "tower"){
      this.towers.push(new Tower(structure, this))
    }
    else if(structure.structureType == "controller"){
      this.controller = structure
    }else{
      this.structures.push(structure)
    }
  }
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

RoomController.prototype.creepsAct = function(){
  for(var c in this.creeps){
    var creep = this.creeps[c];
    if(!creep.creep.needRecharge(this.level, this)){
      creep.act();
    }
  }
}
RoomController.prototype.towersAct = function(){
  for(var t in this.towers){
    var tower = this.towers[t];
    tower.act();
  }
}


module.exports = RoomController
