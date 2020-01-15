angular
  .module('insude')
  .controller('MunicipiosCtrl', MunicipiosCtrl);
 
function MunicipiosCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;
	
	this.subscribe('municipios',()=>{
		return [{}]
	});
  
  this.helpers({
		municipios : () => {
		  return Municipios.find({}, {sort: {nombre:1}});
	  }
  });
  	  
  this.nuevo = true;	  
  this.nuevoMunicipio = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.municipio = {};		
  };
	
  this.guardar = function(municipio,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			municipio.estatus = true;
			municipio.usuarioInserto = Meteor.userId();
			Municipios.insert(municipio);
			toastr.success('Guardado correctamente.');
			municipio = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.municipios');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.municipio = Municipios.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(municipio,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = municipio._id;
			delete municipio._id;		
			municipio.usuarioActualizo = Meteor.userId(); 
			Municipios.update({_id:idTemp},{$set:municipio});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var municipio = Municipios.findOne({_id:id});
			if(municipio.estatus == true)
				municipio.estatus = false;
			else
				municipio.estatus = true;
			
			Municipios.update({_id:id}, {$set : {estatus : municipio.estatus}});
	};	
};