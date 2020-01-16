Meteor.publish("eventos",function(params){
  	return Eventos.find(params);
});