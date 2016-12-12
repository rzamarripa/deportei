angular
  .module('insude')
  .controller('ListarParticipantesCtrl', ListarParticipantesCtrl);
 
function ListarParticipantesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	/*
	this.subscribe('participantes',()=>{
		return [{municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""}]
	});
	*/
	
	this.subscribe('buscarNombre', () => {
		

		if (this.getReactively('buscar.evento_id') != undefined && this.getReactively('buscar.deporte_id') != undefined && this.getReactively('buscar.categoria_id') != undefined && this.getReactively('buscar.rama_id') != undefined && this.getReactively('buscar.nombre') != undefined )
		{			
	    return [{
		    options : { limit: 20 },
		    where : { 
			    nombreCompleto : this.getReactively('buscar.nombre'),
			    evento_id : this.getReactively('buscar.evento_id'), 
			    deporte_id: this.getReactively('buscar.deporte_id'),
			    categoria_id: this.getReactively('buscar.categoria_id'),
			    rama_id: this.getReactively('buscar.rama_id'),
			    municipio_id : Meteor.user() != undefined ? Meteor.user().profile.municipio_id : ""	  
			  }  
	    }];
    }
  });
  
  this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('buscar.evento_id'),
						 estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{deporte_id: this.getReactively('buscar.deporte_id'),
						 estatus: true}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	  participantes : () => {
		  return Participantes.find();
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
		ramas : () => {
			return Ramas.find();
		},
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
