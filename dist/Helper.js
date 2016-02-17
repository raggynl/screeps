function Helper(){
}
Helper.prototype.garbageCollector = function(){
  var counter = 0;
	for(var n in Memory.creeps) {
		var c = Game.creeps[n];
		if(!c) {
			delete Memory.creeps[n];
			counter++;
		}
	}
  for(var r in Memory.rooms) {
    for(var s in Memory.rooms[r].sources){
      if(Memory.rooms[r].sources[s]){
        var c = Game.getObjectById(Memory.rooms[r].sources[s]);
        if(!c) {

          Memory.rooms[r].sources[s]= false;
          counter++;
        }
      }
    }
	}
  if(counter > 0)
    console.log("*****removed "+ counter + " from memory*****")
}
module.exports = Helper;
