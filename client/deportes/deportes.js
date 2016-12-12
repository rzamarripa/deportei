angular
  .module('insude')
  .controller('DeportesCtrl', DeportesCtrl);
 
function DeportesCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('deporte.buscarEvento_id')? this.getReactively('deporte.buscarEvento_id'):""}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
  
  this.helpers({
		deportes : () => {
		  return Deportes.find();
	  },
	  eventos : () => {
		  return Eventos.find();
	  },
  });
  	  
  this.nuevo = true;	  
  this.nuevoDeporte = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.deporte.nombre = "";
    		
  };
	
  this.guardar = function(deporte,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			deporte.estatus = true;
			deporte.usuarioInserto = Meteor.userId();
			Deportes.insert(deporte);
			toastr.success('Guardado correctamente.');
			deporte = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.deportes');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.deporte = Deportes.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(deporte,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = deporte._id;
			delete deporte._id;		
			deporte.usuarioActualizo = Meteor.userId(); 
			Deportes.update({_id:idTemp},{$set:deporte});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var deporte = Deportes.findOne({_id:id});
			if(deporte.estatus == true)
				deporte.estatus = false;
			else
				deporte.estatus = true;
			
			Deportes.update({_id:id}, {$set : {estatus : deporte.estatus}});
	};	
	
	this.getEvento = function(evento_id)
	{		
			var evento = Eventos.findOne({_id:evento_id});

			if (evento)
				 return evento.nombre;
				 
	};

	
};