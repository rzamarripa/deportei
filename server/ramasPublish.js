Meteor.publish("ramas",function(params){
  	return Ramas.find(params);
});