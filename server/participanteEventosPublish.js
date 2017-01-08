

Meteor.publish("participanteEventos",function(params){
  	return ParticipanteEventos.find(params);
});
/*
Meteor.publish("participanteEventos",function(params){
  	return ParticipanteEventos.find(params, {fields: { _id:1
	  																						, nombre:1
	  																						,apellidoPaterno:1
	  																						,apellidoMaterno:1
	  																						,curp:1
	  																						,foto:1
	  																						,evento_id:1
	  																						,municipio_id:1
	  																						,deporte_id:1
	  																						,categoria_id:1
	  																						,rama_id:1
	  																						,funcionEspecifica:1
	  																						,fechaNacimiento:1
	  																						,sexo:1
	  																						,pruebas:1
	  																						}});
});
*/


Meteor.publish("buscarNombreEventos",function(options){

	if (options != undefined)
	{
			let selector = {
		  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
		  	evento_id: options.where.evento_id,
		  	municipio_id: options.where.municipio_id
			}

			return ParticipanteEventos.find(selector,options.options);
	}											  																						
});


