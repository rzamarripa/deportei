Meteor.publish("pruebas",function(params){
  	return Pruebas.find(params);
});