



angular
  .module('insude')
  .controller('GafetesCtrl', GafetesCtrl);
 
function GafetesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
	//-----------

	//console.log(showHelp());
	
	//-----------
	
	
	this.participantes = [];
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
	
	this.evento_id = $stateParams.evento;
	this.municipio_id = $stateParams.municipio;

	let part = this.subscribe('participantesCred',()=>{
		return [{estatus: true
					  ,$and:[ {municipio_id : $stateParams.municipio}
										,{evento_id:  $stateParams.evento}]
			}]
	});
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{_id: $stateParams.evento, estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: $stateParams.evento}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true
						 ,evento_id:  $stateParams.evento
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  $stateParams.evento 
		}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
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
		ramas : () => {
			return Ramas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					var m = Municipios.findOne(participante.municipio_id);
					participante.municipio = m.nombre;
					var e = Eventos.findOne(participante.evento_id);
					participante.evento = e.nombre;
					var d = Deportes.findOne(participante.deporte_id);
					participante.deporte = d.nombre;
					var c = Categorias.findOne(participante.categoria_id);
					participante.categoria = 	c.nombre;
					var r = Ramas.findOne(participante.rama_id);
					participante.rama = 	r.nombre;
					
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
					})
				})
				
				Meteor.call('getGafetes',rc.participantes, function(error, response) {
				   if(error){
				    console.log('ERROR :', error);
				    return;
				   }else{
				    console.log('response:', response);
							
		    	 }
				});
				
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
	
