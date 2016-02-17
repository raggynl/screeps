function Stats(){
  this.loopTime = 0+"ms";
}
Stats.prototype.debug = function(){
  console.log("total", this.loopTime)
}
module.exports = Stats;
