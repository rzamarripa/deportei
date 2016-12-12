Meteor.publish("modalidaddeportivas",function(params){
  	return ModalidadDeportivas.find(params);
});