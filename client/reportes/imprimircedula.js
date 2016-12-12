angular
  .module('insude')
  .controller('imprimirCedulaCtrl', imprimirCedulaCtrl);
 
function imprimirCedulaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;

  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	this.evento_id = $stateParams.evento;
	
	let part = this.subscribe('participantesCred',()=>{
		return [{evento_id: $stateParams.evento 
					  ,municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""
					  ,deporte_id: $stateParams.deporte
						,categoria_id: $stateParams.categoria
					  ,rama_id: $stateParams.rama
					  ,funcionEspecifica: $stateParams.funcionEspecifica
						,estatus: true}]
	});
	
	/*
	this.subscribe('buscarNombre',()=>{
		return [{$and:[ {municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}
										,{evento_id: $stateParams.evento }]}]
	});
	*/
	
	this.subscribe('municipios',()=>{
		return [{_id: Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}]
	});
	
	this.subscribe('eventos',()=>{
		return [{_id: $stateParams.evento}]
	});
	
	this.subscribe('deportes',()=>{
		return [{_id: $stateParams.deporte}]
	});
	
	this.subscribe('categorias',()=>{
		return [{_id: $stateParams.categoria}]
	});
	
	this.subscribe('ramas',()=>{
		return [{_id: $stateParams.rama}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  $stateParams.evento 
		}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
	  },
		municipio : () => {
			return Municipios.findOne();
		},
		evento : () => {
			return Eventos.findOne();
		},
		deporte : () => {
			return Deportes.findOne();
		},
		categorias : () => {
			return Categorias.findOne();
		},
		ramas : () => {
			return Ramas.findOne();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				
				var Cantidad = rc.participantes.length;
				if (Cantidad % 7 != 0)
				{
						//Completar cuantos faltan para 15
						var modulo = Math.round(Cantidad % 7);
						var faltantes = 7 - modulo;				
						for (var i = 1; i <= faltantes; i++)
						{
								objFalatantes = {_id:"sa"+i,foto:"",nombre:"",apellidoPaterno:"", apellidoMaterno:"",fechaNacimiento:"",sexo:"",curp:"",funcionEspecifica:"",};
								rc.participantes.push(objFalatantes);
						}
				}		 
				
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
		  if(sexo === "Hombre")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Mujer"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
  	
};	
