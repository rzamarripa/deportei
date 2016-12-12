angular
  .module('insude')
  .controller('ParticipantesVerCtrl', ParticipantesVerCtrl);
 
function ParticipantesVerCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);

	Window = rc;

  this.participante = {};
  			
	let part = this.subscribe('participantes',()=>{
		return [{_id: $stateParams.id}]
	});
	
	this.subscribe('eventos',()=>{
		return [{_id: $stateParams.evento}]
	});
	
	this.subscribe('municipios',()=>{
		return [{_id: $stateParams.municipio}]
	});
	
	this.subscribe('deportes',()=>{
		return [{_id: $stateParams.deporte}]
	});
	
	this.subscribe('categorias',()=>{
		return [{_id:  $stateParams.categoria}]
	});
	
	this.subscribe('ramas',()=>{
		return [{_id:  $stateParams.rama}]
	});
	
	
	this.helpers({
	  participante : () => {
		  return Participantes.findOne();
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
		categoria : () => {
			return Categorias.findOne();
		},
		rama : () => {
			return Ramas.findOne();
		}
	});
	
	this.tieneFoto = function(sexo, foto){
		console.log(sexo,foto);
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
