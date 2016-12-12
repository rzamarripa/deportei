angular
  .module('insude')
  .controller('EventosMostarCtrl', EventosMostarCtrl);
 
function EventosMostarCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	
	this.subscribe('eventos',()=>{
		return [{estatus:true}]
	});
  
  this.helpers({
		eventos : () => {
		  return Eventos.find();
	  }
  });
  	    
};