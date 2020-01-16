Meteor.publish("categorias",function(params){
  	return Categorias.find(params);
});