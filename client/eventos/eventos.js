angular
  .module('insude')
  .controller('EventosCtrl', EventosCtrl);
 
function EventosCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	
	this.subscribe('eventos',()=>{
		return [{}]
	});
  
  this.helpers({
		eventos : () => {
		  return Eventos.find();
	  }
  });
  	  
  this.nuevo = true;	  
  this.nuevoEvento = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.evento = {};		
  };
	
  this.guardar = function(evento,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			
			evento.estatus = true;
			evento.con = 0;
			evento.usuarioInserto = Meteor.userId();
			Eventos.insert(evento);
			toastr.success('Guardado correctamente.');
			evento = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.eventos');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.evento = Eventos.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(evento,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = evento._id;
			delete evento._id;		
			evento.usuarioActualizo = Meteor.userId(); 
			Eventos.update({_id:idTemp},{$set:evento});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var evento = Eventos.findOne({_id:id});
			if(evento.estatus == true)
				evento.estatus = false;
			else
				evento.estatus = true;
			
			Eventos.update({_id:id}, {$set : {estatus : evento.estatus}});
	};	
};