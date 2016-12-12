angular
  .module('insude')
  .controller('CredencialesCtrl', CredencialesCtrl);
 
function CredencialesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
		
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	this.evento_id = $stateParams.evento;
	this.municipio_id = $stateParams.municipio;
	this.deporte_id = $stateParams.deporte;
	this.categoria_id = $stateParams.categoria;
	
	
	let part = this.subscribe('participantesCred',()=>{
		return [{$and:[ {evento_id:  $stateParams.evento}
									 ,{municipio_id : $stateParams.municipio}
									 ,{deporte_id:  $stateParams.deporte}
									 ,{categoria_id:  $stateParams.categoria}
									 ,{rama_id:  $stateParams.rama}]
						,estatus: true				
			}]
	});

	
	this.subscribe('municipiosIdNombre',()=>{
		return [{_id: $stateParams.municipio}]
	});
	
	this.subscribe('eventos',()=>{
		return [{_id: $stateParams.evento}]
	});
	
	this.subscribe('deportes',()=>{
		return [{_id: $stateParams.deporte}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id:  this.getReactively('evento.deporte_id')? this.getReactively('evento.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
		}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
	  },
		municipios : () => {
			return Municipios.find();
		},
		eventos : () => {
			return Eventos.find();
		},
		deportes : () => {
			return Deportes.find();
		},
		categorias : () => {
			return Categorias.find();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					participante.municipio = Municipios.findOne(participante.municipio_id);
					participante.evento = Eventos.findOne(participante.evento_id);
					participante.deporte = Deportes.findOne(participante.deporte_id);
					participante.categoria = Categorias.findOne(participante.categoria_id);	
					
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
					})
					
				})
			}
		}
	});
	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
