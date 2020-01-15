angular
  .module('insude')
  .controller('PruebasCtrl', PruebasCtrl);
 
function PruebasCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	
	this.action = true;
	this.buscar = {}; 
	
	if ($stateParams.id)
	{
			
			this.buscar.buscarEvento_id = $stateParams.evento_id;
			this.buscar.buscarDeporte_id = $stateParams.deporte_id;
			this.buscar.buscarCategoria_id = $stateParams.id;
			this.buscar.buscarRama_id = $stateParams.rama_id;

	}

	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		
		return [{estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('buscar.buscarEvento_id')? this.getReactively('buscar.buscarEvento_id'):"" 
						 ,deporte_id: this.getReactively('buscar.buscarDeporte_id')? this.getReactively('buscar.buscarDeporte_id'):""			
						 ,categoria_id: this.getReactively('buscar.buscarCategoria_id')? this.getReactively('buscar.buscarCategoria_id'):""
						 ,rama_id: this.getReactively('buscar.buscarRama_id')? this.getReactively('buscar.buscarRama_id'):""			
		}]
	});
	
  
  this.helpers({
	  eventos : () => {
		  return Eventos.find({}, {sort: {fechainicio:-1}});
	  },
	  deportesBuscar : () => {
		  return Deportes.find({evento_id: this.getReactively('buscar.buscarEvento_id')? this.getReactively('buscar.buscarEvento_id'):""},{sort: {nombre:1}});
	  },
	  deportes : () => {
		  return Deportes.find({evento_id: this.getReactively('prueba.evento_id')? this.getReactively('prueba.evento_id'):""},{sort: {nombre:1}});
	  },
	  categoriasBuscar : () => {
		  return Categorias.find({evento_id:  this.getReactively('buscar.buscarEvento_id')? this.getReactively('buscar.buscarEvento_id'):"" 
						 									,deporte_id: this.getReactively('buscar.buscarDeporte_id')? this.getReactively('buscar.buscarDeporte_id'):""
		  },{sort: {nombre:1}});
	  },
	  categorias : () => {
		  return Categorias.find({evento_id:  this.getReactively('prueba.evento_id')? this.getReactively('prueba.evento_id'):"" 
						 									,deporte_id: this.getReactively('prueba.deporte_id')? this.getReactively('prueba.deporte_id'):""
		  },{sort: {nombre:1}});
	  },
	  pruebas : () => {
		  return Pruebas.find({},{sort: {nombre:1}});
	  },
	  ramas : () => {
		  return Ramas.find({},{sort: {nombre:1}});
	  },
  });
  	  
  this.nuevo = true;	  
  this.nuevoPrueba = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.prueba = {};
  };
	
  this.guardar = function(prueba,form)
	{
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
			
			prueba.estatus = true;
			prueba.usuarioInserto = Meteor.userId();
			Pruebas.insert(prueba);
			toastr.success('Guardado correctamente.');
			prueba = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.pruebas');
			form.$setPristine();
	    form.$setUntouched();
	};
	
	this.editar = function(id)
	{
	    this.prueba = Pruebas.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.eliminar = function(id)
	{
	    if (confirm('¿Estas Seguro que deseas eliminar el registro?')) {
					// Save it!
					Pruebas.remove(id);
					toastr.success('Eliminado correctamente.');
			} 
	};
	
	this.actualizar = function(prueba,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
		 	var idTemp = prueba._id;
			delete prueba._id;		
			prueba.usuarioActualizo = Meteor.userId(); 
			Pruebas.update({_id:idTemp},{$set:prueba});
			toastr.success('Actualizado correctamente.');
			//console.log(ciclo);
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var prueba = Pruebas.findOne({_id:id});
			if(prueba.estatus == true)
				prueba.estatus = false;
			else
				prueba.estatus = true;
			
			Pruebas.update({_id:id}, {$set : {estatus : prueba.estatus}});
	};	

	this.getEvento = function(evento_id)
	{		
			var evento = Eventos.findOne({_id:evento_id});

			if (evento)
				 return evento.nombre;
				 
	};
	
	this.getDeporte = function(rama_id)
	{		
			var deporte = Deporte.findOne({_id:deporte_id});

			if (deporte)
				 return deporte.nombre;
				 
	};
	
	this.getCategoria= function(categoria_id)
	{		
			var categoria = ModalidadDeportivas.findOne({_id:categoria_id});

			if (categoria)
				 return categoria.nombre;
				 
	};
	
	
};