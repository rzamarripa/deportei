

Meteor.publish("participantes",function(params){
  	return Participantes.find(params);
});

Meteor.publish("participantesCred",function(params){
  	return Participantes.find(params, {fields: { _id:1
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



Meteor.publish("buscarNombre",function(options){

	if (options != undefined)
	{
			let selector = {
		  	nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
		  	evento_id: options.where.evento_id,
		  	deporte_id: options.where.deporte_id,
		  	categoria_id: options.where.categoria_id,
		  	rama_id: options.where.rama_id,
		  	municipio_id: options.where.municipio_id
			}

			return Participantes.find(selector, {fields:{ _id:1
												  																						,nombre:1
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
												  																						}},options.options);
	}											  																						
});


