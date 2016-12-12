angular
  .module('insude')
  .controller('ModalidadDeportivaCtrl', ModalidadDeportivaCtrl);
 
function ModalidadDeportivaCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	
	this.subscribe('modalidaddeportivas',()=>{
		return [{}]
	});
  
  this.helpers({
		modalidaddeportivas : () => {
		  return ModalidadDeportivas.find();
	  }
  });
  	  
  this.nuevo = true;	  
  this.nuevoModalidadDeportiva = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.modalidaddeportiva = {};		
  };
	
  this.guardar = function(modalidaddeportiva,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			modalidaddeportiva.estatus = true;
			modalidaddeportiva.usuarioInserto = Meteor.userId();
			ModalidadDeportivas.insert(modalidaddeportiva);
			toastr.success('Guardado correctamente.');
			modalidaddeportiva = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.modalidaddeportivas');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.modalidaddeportiva = ModalidadDeportivas.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(modalidaddeportiva,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = modalidaddeportiva._id;
			delete modalidaddeportiva._id;		
			modalidaddeportiva.usuarioActualizo = Meteor.userId(); 
			ModalidadDeportivas.update({_id:idTemp},{$set:modalidaddeportiva});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var modalidaddeportiva = ModalidadDeportivas.findOne({_id:id});
			if(modalidaddeportiva.estatus == true)
				modalidaddeportiva.estatus = false;
			else
				modalidaddeportiva.estatus = true;
			
			ModalidadDeportivas.update({_id:id}, {$set : {estatus : modalidaddeportiva.estatus}});
	};	
};