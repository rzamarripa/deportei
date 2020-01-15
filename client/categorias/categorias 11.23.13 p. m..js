angular
  .module('insude')
  .controller('CategoriasCtrl', CategoriasCtrl);
 
function CategoriasCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	
	this.action = true;
	this.buscar = {};
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('buscar.buscarEvento_id')? this.getReactively('buscar.buscarEvento_id'):"" 
						 ,deporte_id: this.getReactively('buscar.buscarDeporte_id')? this.getReactively('buscar.buscarDeporte_id'):""
					}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	this.subscribe('deportes',()=>{
		return [{estatus: true}]
	});
	  
  this.helpers({
		categorias : () => {
		  return Categorias.find({}, {sort: {nombre:1}});
	  },
	  eventos : () => {
		  return Eventos.find({}, {sort: {fechainicio:-1}});
	  },
	  deportesBuscar : () => {
		  return Deportes.find({evento_id: this.getReactively('buscar.buscarEvento_id')? this.getReactively('buscar.buscarEvento_id'):""},{sort: {nombre:1}});
	  },
	  deportes : () => {
		  return Deportes.find({evento_id: this.getReactively('categoria.evento_id')? this.getReactively('categoria.evento_id'):""},{sort: {nombre:1}});
	  },
  });
  	  
  this.nuevo = true;	  
  this.nuevoCategoria = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.categoria = {};
  };
	
  this.guardar = function(categoria,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
	    
	    if (categoria.anioinicio < categoria.aniofin)
	    {
		    	toastr.error('Año Inicio debe ser mayor o igual al Año Fin.');
					return;
	    }
			
			categoria.estatus = true;
			categoria.usuarioInserto = Meteor.userId();
			Categorias.insert(categoria);
			toastr.success('Guardado correctamente.');
			categoria = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.categorias');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.categoria = Categorias.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.eliminar = function(id)
	{
			console.log(id);
	    if (confirm('¿Estas Seguro que deseas eliminar el registro?')) {
					// Save it!
					console.log(id);
					Categorias.remove({_id:id},
									function(error,result){
										if (error) toastr.error('Error al eliminar.');
										if (result) toastr.success('Eliminado correctamente.');
					});
					
			} 
	};
	
	this.actualizar = function(categoria,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
	    if (categoria.anioinicio < categoria.aniofin)
	    {
		    	toastr.error('Año Inicio debe ser mayor o igual al Año Fin.');
					return;
	    }
		 	var idTemp = categoria._id;
			delete categoria._id;		
			categoria.usuarioActualizo = Meteor.userId(); 
			Categorias.update({_id:idTemp},{$set:categoria});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var categoria = Categorias.findOne({_id:id});
			if(categoria.estatus == true)
				categoria.estatus = false;
			else
				categoria.estatus = true;
			
			Categorias.update({_id:id}, {$set : {estatus : categoria.estatus}});
	};	
	/*
	this.getEvento = function(evento_id)
	{		
			var evento = Eventos.findOne({_id:evento_id});

			if (evento)
				 return evento.nombre;
				 
	};
	
	this.getRama = function(rama_id)
	{		
			var rama = Ramas.findOne({_id:rama_id});

			if (rama)
				 return rama.nombre;
				 
	};
	
	this.getModalidadDeportiva = function(modalidaddeportiva_id)
	{		
			var modalidaddeportiva = ModalidadDeportivas.findOne({_id:modalidaddeportiva_id});

			if (modalidaddeportiva)
				 return modalidaddeportiva.nombre;
				 
	};
	*/
	
};