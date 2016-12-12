Meteor.publish("deportes",function(params){
  	return Deportes.find(params);
});