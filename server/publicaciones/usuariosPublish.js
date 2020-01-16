Meteor.publish("usuarios",function(params){
  	return Meteor.users.find(params);
});

//Meteor.publish("logistica", function(){
//	return Roles.getUsersInRole( ['Analista','Verificador']);
//});