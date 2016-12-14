Meteor.publish("deportes",function(params){
  	return Deportes.find(params, {sort: { nombre: 1 }});
});