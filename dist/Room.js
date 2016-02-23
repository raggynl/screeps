var Blueprints = require('Blueprints');
var CreepFactory = require('CreepFactory');
var Resources = require('Resources');
var Plan = require('Plan');
var Tower = require('Tower');

var maxExtensions = [0, 0, 5, 10, 20, 30, 40, 50, 60];


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
    if(!this.room.memory.requests){
      this.room.memory.requests = {};
    }
    if(!this.room.memory.request){
      this.room.memory.requests = 0;
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
    "colonizer": 0,
    "reserver" : 0,
    "scout" : 0
  };
  this.creeps = [];//Creeps that are controlled by the RoomController.
  this.towers = [];
  this.storages = [];
  this.hostileCreeps = this.room.find(FIND_HOSTILE_CREEPS);
  this.constructions = [];
  this.flags = this.room.find(FIND_FLAGS);
  this.structures = [];
  this.spawns = [];
  this.extensions = [];
  this.links = [];
  this.sources = [];
  this.exits = Game.map.describeExits(this.room.name);
  this.droppedResources = [];
  this.hasOrder = false;
  this.totalStoredEnergy = 0;
  this.loadCreeps();
  this.loadStructures();
  this.loadConstructions();
  this.loadSources();
  this.loadDroppedResourses();
  this.room.memory.hostile = this.hostileCreeps.length > 0
  if(this.controller && this.spawns.length > 0){
    this.level = this.controller.level;
    var needExt = maxExtensions[this.level];
    if(this.extensions.length < needExt || !this.room.memory.plan[this.level]){
      this.level = this.controller.level - 1;
    }
    this.plan = new Plan(this);


  }


  this.resources = new Resources(this);
}

RoomController.prototype.findNextExit= function(creep){
  if(this.room.memory.scoutedExits.length < 4){
    var i = 0
    for(var e in this.exits){
      var scout = this.exits[e]
      if(i > this.room.memory.scoutedExits.length ){
        console.log(scout)
        return {exit : scout, target : creep.pos.findClosestByPath(e)}
      }
    }
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
  }else if(this.creepTypeCount.collector < 1){
    order ="collector";

  }else if(this.creeps.length < 20){
    level = this.level;
    if(this.creepTypeCount.guard < 1){
      order ="guard";
    }
    else if(this.creepTypeCount.collector < 2){
      order ="collector";

    }else if(this.creepTypeCount.harvester < 2){
      order ="harvester";
    }else if(this.creepTypeCount.builder < 1){
      order ="builder";
    }else if(this.creepTypeCount.upgrader < 1){
      order ="upgrader";
    }
    if(!order && level >= 2){
      if(this.creepTypeCount.collector < 3){
        order ="collector";
      }
    }
    if(!order && level >= 3){

    }
    if(!order && level >= 3){
      if(this.creepTypeCount.collector < 4){
        order ="collector";

      }
      else if(this.creepTypeCount.scout < 1 && this.room.memory.scoutedExits.length == 0){
        order ="scout";
      }else if(this.creepTypeCount.claimer < 1 && this.room.memory.scoutedExits.length == this.exits.length && Game.gcl.level == this.worldCtrl.rooms.length+1){//&& this.room.memory.scoutedExits.length == this.exits.length && Game.gcl.level == this.worldCtrl.rooms.length+1
        order ="claimer";
      }else if(this.creepTypeCount.colonizer < 1 && this.room.memory.scoutedExits.length == this.exits.length && Game.gcl.level == this.worldCtrl.rooms.length+1 ){// && this.room.memory.scoutedExits.length == this.exits.length && Game.gcl.level == this.worldCtrl.rooms.length+1
        order ="colonizer";
      }
    }
    if(!order && level >= 4){

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
  if(!!order && level){
    this.hasOrder = true

//console.log(this.room.name, "order:",order, level, "coloney:", this.creeps.length, JSON.stringify(this.creepTypeCount))
    for(var name in this.spawns){

      var isBuilding = Blueprints(this.spawns[name], order, level, options);
      if(isBuilding){
        console.log(this.room.name, "order:",order, level, "coloney:", this.creeps.length, JSON.stringify(this.creepTypeCount))
        return;
      }
    }
  }



  //build a new coleny
  if(this.controller.my){
    // if(this.spawns.length == 0 && this.flags.length > 0){
    //   console.log("Construction of new room spawn initiated")
    //   if(this.flags[0].name == "claim"){
    //     this.room.createConstructionSite(this.flags[0].pos.x, this.flags[0].pos.y, STRUCTURE_SPAWN)
    //     this.flags[0].remove()
    //   }
    // }
    // else if(this.spawns.length == 0 && this.constructions.length > 0 && this.creepTypeCount.builder == 0){
    //   console.log("Requesting builder to start building here")
    //   this.worldCtrl.requestCreep(this.room.name, this.constructions[0].id, "builder")
    // }
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
  this.structures = structures;
  for(var name in structures){
    var structure = structures[name];
    if(structure.structureType == "spawn"){
      this.spawns.push(structure)
      this.totalStoredEnergy += structure.energy
    }
    else if(structure.structureType == "storage"){
      this.storages.push(structure)
      this.totalStoredEnergy += structure.store.energy
    }
    else if(structure.structureType == "extension"){
      this.extensions.push(structure)
      this.totalStoredEnergy += structure.energy
    }
    else if(structure.structureType == "link"){
      this.links.push(structure)
      this.totalStoredEnergy += structure.energy
    }
    else if(structure.structureType == "tower"){
      this.towers.push(new Tower(structure, this))
    }
    else if(structure.structureType == "controller"){
      this.controller = structure
    }
  }
}
RoomController.prototype.loadDroppedResourses = function(){
  this.droppedResources = this.room.find(FIND_DROPPED_RESOURCES);
}
RoomController.prototype.loadConstructions = function(){
  this.constructions= this.room.find(FIND_CONSTRUCTION_SITES);
}
RoomController.prototype.loadSources = function(){
  if(!this.room.memory)return
  this.sources = this.room.find(FIND_SOURCES);
  var count = 0;
  for(var name in this.sources){
    var sourceId = this.sources[name].id;
    if(!this.room.memory.sources[sourceId])
      this.room.memory.sources[sourceId] = false;
  }
}
RoomController.prototype.requestCreep = function(room, target,  creepRole, changeRoomCtrl){
  if(this.creepTypeCount[creepRole] < 4)return false
  for(var c in this.creeps){
    var creep = this.creeps[c];
    //console.log(creep.creep.memory.role , creepRole , creep.available())
    if(creep.creep.memory.role == creepRole){
      if(creep.available(room)){
        //console.log("summoned by",room,creep.creep.name)
        creep.creep.memory.target = target
        creep.creep.memory.roomRequest = room
        if(changeRoomCtrl){
          creep.creep.memory.room = room;
        }
        return creep.creep.name;
      }
    }
  }
  return false
}
RoomController.prototype.spawnCreep = function(room, creepRole){

    var level = this.level;
    var order = creepRole
    var options = {};
    options.room = room;
    if( this.level < 4){
      return false
    }


  if(!!order && level && !this.hasOrder){


//console.log(this.room.name, "order:",order, level, "coloney:", this.creeps.length, JSON.stringify(this.creepTypeCount))
    for(var name in this.spawns){

      var isBuilding = Blueprints(this.spawns[name], order, level, options);
      if(isBuilding){
        this.hasOrder = true
        console.log(this.room.name, "for", room, "order:",order, level)
        return isBuilding;
      }
    }
  }
  return false;

}
RoomController.prototype.requestMinimumBackup = function(){



  if(!this.room.memory.requests["harvester"] && this.creepTypeCount.harvester == 0 && !this.hostile && this.sources.length > 0 && this.room.memory.request <= 0){
      var creepid = this.worldCtrl.spawnCreep(this.room.name, "harvester")
      if(creepid){
        //console.log(this.room.name,"Request harvester is awsered")
        this.room.memory.requests["harvester"] = creepid
        this.room.memory.request = 150;
        this.room.memory.requestCoolDown = false;
      }
  }
  else if(!this.room.memory.requests["builder"] && this.creepTypeCount.harvester == 1 && !this.hostile && this.creepTypeCount.builder == 0 && !this.room.memory.request <= 0){
    var creepid = this.worldCtrl.spawnCreep(this.room.name, "builder")
    if(creepid){
      //console.log(this.room.name,"Request builder is awsered")
      this.room.memory.requests["builder"] = creepid
      this.room.memory.request = 150;
      this.room.memory.requestCoolDown = false;
    }
  }
  else if(!this.room.memory.requests["guard"] && this.creepTypeCount.guard == 0 && !this.room.memory.request <= 0  && this.hostile ){
      var creepid = this.worldCtrl.spawnCreep(this.room.name, "guard")
      if(creepid){
        //console.log(this.room.name,"Request guard is awsered")
        this.room.memory.requests["guard"] = creepid
        this.room.memory.request = 150;
        this.room.memory.requestCoolDown = false;
      }
  }
  else if(!this.room.memory.requests["reserver"] && this.creepTypeCount.reserver == 0 && this.creepTypeCount.harvester > 0 &&!this.hostile && !this.room.memory.request <= 0 && this.controller && (!this.controller.reservation || (this.controller.reservation && this.controller.reservation.ticksToEnd < 4000)) ){
      var creepid = this.worldCtrl.spawnCreep(this.room.name, "reserver")
      if(creepid){
        //console.log(this.room.name,"Request guard is awsered")
        this.room.memory.requests["reserver"] = creepid
        this.room.memory.request = 150;
        this.room.memory.requestCoolDown = false;
      }
  }
  if(!this.room.memory.requests["collector"] && !this.hostile  && this.creepTypeCount.collector == 0 && this.droppedResources.length > 0){
    var creepid = this.worldCtrl.requestCreep(this.room.name, this.resources.findResource().id, "collector")
    if(creepid){
      console.log(this.room.name,"Request collector is awsered")
      this.room.memory.requests["collector"] = creepid
      this.room.memory.request = 150;
      this.room.memory.requestCoolDown = false;

    }
  }


  for(var r in this.room.memory.requests){
    var request = this.room.memory.requests[r];
    //console.log(request  ,this.creepTypeCount[r] > 0 , !Game.getObjectById(request), r)
    var creep = Game.creeps[request]
    if(request  && this.creepTypeCount[r] > 0 && creep && this.room.name == creep.room.name){
      console.log(this.room.name,"request", r ,"arrived in",(150-this.room.memory.request),"ticks")
      delete this.room.memory.requests[r]
    }
    // else
    // if(request  && !creep){
    //   console.log(this.room.name,"request", r ,"not found and deleted in",(100-this.room.memory.request),"ticks")
    //   delete this.room.memory.requests[r]
    // }
  }
  if(this.room.memory.request > 0){
    this.room.memory.request--;
    //console.log(this.room.name,"request timer",this.room.memory.request);
  }
  else if(Object.keys(this.room.memory.requests).length == 0 && this.room.memory.request > 0 && !this.room.memory.requestCoolDown){
    //console.log(this.room.name,"no request left reset respone time",this.room.memory.request)
    this.room.memory.requestCoolDown = true;
    this.room.memory.request = 20
  }
  else if(this.room.memory.request == 0){
    console.log(this.room.name,"request exeeded respone time",JSON.stringify(this.room.memory.requests))
    this.room.memory.request = -1
    this.room.memory.requests ={};
    this.room.memory.requestCoolDown = false;
  }

}

RoomController.prototype.act = function(){
  for(var c in this.creeps){
    var creep = this.creeps[c];
    if(!creep.creep.needRecharge(this.level, this)){
      creep.act();
    }
  }
  for(var t in this.towers){
    var tower = this.towers[t];
    tower.act();
  }
  if(this.links.length > 1){
    var link1 = this.links[0];
    if(link1.energy > 0){
      var link2 = this.links[1];
      link1.transferEnergy(link2);
    }
  }
}



module.exports = RoomController
