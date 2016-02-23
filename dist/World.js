var RoomController = require('Room');

function WorldController(){
  this.rooms ={};
  this.creeps =[];//Creeps that are controlled to the World Controller instead of Room Controller
  //this.TotalCreepsCount;
  if(!Memory.world){
    Memory.world = {};
    Memory.world.scouted = [];
  }
  this.loadRooms();
}
WorldController.prototype.loadRooms = function(){
  for(var name in Game.rooms) {
    var r = Game.rooms[name];
    var room = new RoomController(r, this);
    this.rooms[name] = room

  }
}
WorldController.prototype.checkRoomScans = function(){
  for(var roomName in Memory.rooms){
    if(!this.rooms[roomName] && !Memory.rooms[roomName].requests)Memory.rooms[roomName].requests = {};
    var roomMemory = Memory.rooms[roomName];
    if(!this.rooms[roomName] && !Memory.rooms[roomName].requests["harvester"] && !roomMemory.plan[1] && Object.keys(roomMemory.sources).length > 0 && !roomMemory.hostile){
      for(var sourceId in roomMemory.sources){
        var sourceMemory = roomMemory.sources[sourceId];
        if(!sourceMemory){
          if(this.spawnCreep(roomName, "harvester")){
            console.log(roomName,"Special request harvester is awsered")
            break;
          }else{
            //console.log(roomName,"No free harvesters found for special request")
          }
        }
      }
    }

    if(!this.rooms[roomName] && roomMemory.hostile &&  !roomMemory.requests["guard"] && roomMemory.creepCount.guard == 0){
      if(this.spawnCreep(roomName, "guard")){
        console.log(roomName,"Special request guard is awsered")
      }else{
        //console.log(roomName,"No free guards found for special request")
      }
    }

  }

}
WorldController.prototype.addCreepToWorld = function(creep){
  this.creeps.push(creep);

}
WorldController.prototype.act = function(){
  for(var r in this.rooms){
    var room = this.rooms[r];
    room.colonize();
    room.act();
    room.requestMinimumBackup();
  }
  for(var c in this.creeps){
    var creep = this.creeps[c]
    creep.worldAct();
  }
  this.checkRoomScans()
}

WorldController.prototype.requestCreep = function(roomName, target, creepRole, changeRoomCtrl){
  var neighbour = Game.map.describeExits(roomName)
  for(var r in neighbour){
    var room = this.rooms[neighbour[r]];
    //need to check if this room as an direct exit to the requesting room
    if (room){
      var request = room.requestCreep(roomName, target, creepRole, changeRoomCtrl)
      if(request)
        return request;
    }
  }
  return false
}
WorldController.prototype.spawnCreep = function(roomName, creepRole){
  var neighbour = Game.map.describeExits(roomName)
  for(var r in neighbour){
    var room = this.rooms[neighbour[r]];
    //need to check if this room as an direct exit to the requesting room
    if (room){
      var request = room.spawnCreep(roomName,creepRole)
      if(request)
        return request;
    }
  }
  return false
}
module.exports = WorldController;
