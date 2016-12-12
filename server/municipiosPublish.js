Meteor.publish("municipios",function(params){
  	return Municipios.find(params);
});

Meteor.publish("municipiosIdNombre",function(params){
  	return Municipios.find(params,{fields: {_id:1, nombre:1}});
});
