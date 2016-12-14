angular
  .module('insude')
  .controller('ParticipantesEditarCtrl', ParticipantesEditarCtrl);
 
function ParticipantesEditarCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	this.action = true;
	this.participante = {};
	this.participanteEventos = {}; 
	
	this.participante.evento_id = $stateParams.id;
	this.participanteEventos.evento_id = $stateParams.id;
	
	
	this.subscribe('participantes',()=>{
		return [{_id : $stateParams.id}]
	});
	
	let pe = this.subscribe('participanteEventos',()=>{
		return [{participante_id : $stateParams.id}]
	});
	
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('modalidaddeportivas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		
		return [{evento_id: this.getReactively('participanteEventos.evento_id')? this.getReactively('participanteEventos.evento_id'):""
						,estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('participanteEventos.evento_id')? this.getReactively('participanteEventos.evento_id'):"" 
						,deporte_id: this.getReactively('participanteEventos.deporte_id')? this.getReactively('participanteEventos.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('participanteEventos.evento_id')? this.getReactively('participanteEventos.evento_id'):"" 
						,deporte_id: this.getReactively('participanteEventos.deporte_id')? this.getReactively('participanteEventos.deporte_id'):""			
						,categoria_id: this.getReactively('participanteEventos.categoria_id')? this.getReactively('participanteEventos.categoria_id'):""
						,rama_id: this.getReactively('participanteEventos.rama_id')? this.getReactively('participanteEventos.rama_id'):""			
		}]
	});
	
  
  this.helpers({
	  participante : () => {	
		  return Participantes.findOne();
	  },
	  participanteEventos : () => {	
		  return ParticipanteEventos.findOne();
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
	  modalidaddeportivas : () => {
		  return ModalidadDeportivas.find();
	  },
  });
  	  
  	
	this.actualizar = function(participante, participanteEventos,form)
	{
	    if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
	    
	    if (participante.foto == undefined)
	    {
		    toastr.error('Error no se ha cargado la foto del particpante.');
	      return;
	    }
			
			//Obtener las Edades de la Categoria			
			var cat = Categorias.findOne({ _id: participante.categoria_id});
			
			var d = new Date();
			var anioActual = d.getFullYear();
			
			var anioInicio = cat.anioinicio;
			var anioFin = cat.aniofin;

			var EdadMinima = anioActual - anioInicio;	//22
			var EdadMaxima = anioActual - anioFin;    //23
			
			//Obtener la Edad del participante
			
	    var today_year = d.getFullYear();
	    var today_month = d.getMonth();
	    var today_day = d.getDate();
	    var edad = today_year - participante.fechaNacimiento.getFullYear();
			
	    if ( today_month < (participante.fechaNacimiento.getMonth() - 1))
	    {
	        edad--;
	    }
	    if (((participante.fechaNacimiento.getMonth() - 1) == today_month) && (today_day < participante.fechaNacimiento.getDay()))
	    {
	        edad--;
	    }
	   			
			
			//Validar la edad del particpante en relación a la categoria
			if (edad >= EdadMinima && edad <= EdadMaxima)
			{
					
						var idTemp = participante._id;
						delete participante._id;		
						participante.usuarioActualizo = Meteor.userId(); 
						Participantes.update({_id:idTemp},{$set:participante});
						toastr.success('Actualizado correctamente.');
						//console.log(ciclo);
						$('.collapse').collapse('hide');
						this.nuevo = true;
						form.$setPristine();
				    form.$setUntouched();
				    $state.go('root.listarparticipantes');

			}	 
			else
			{
					 toastr.error('La edad no corresponde a la categoria verificar por favor.');
					 
			}
	    

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
	
	this.AlmacenaImagen = function(imagen)
	{
			this.participante.foto = imagen;
	}
	
	
	$(document).ready( function() {
		
			
			
			$(".Mselect2").select2();
					
			var fileInput1 = document.getElementById('fileInput1');
			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
			
			
			console.log("Participantes:",rc.participanteEventos);
			console.log("Participantes this:",this.participanteEventos);
			
			/*		
			if (rc.participanteEventos.pruebas != undefined)
			{
					var x = document.getElementById("prueba"); 
					var optionVal = new Array();
					for (i = 0; i <  rc.participanteEventos.pruebas.length; i++) { 
							optionVal.push(rc.participanteEventos.pruebas[i]);
					}
			}
			*/
			
				//JavaScript para agregar la imagen 1
			fileInput1.addEventListener('change', function(e) {
				var file = fileInput1.files[0];
				var imageType = /image.*/;
	
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
							fileDisplayArea1.innerHTML = "";
		
							var img = new Image();
							
							
							img.src = reader.result;
							img.width =200;
							img.height=200;
		
							rc.AlmacenaImagen(reader.result);
							//this.folio.imagen1 = reader.result;
							
							fileDisplayArea1.appendChild(img);
							//console.log(fileDisplayArea1);
						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error Imagin supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
			});

	});
	
	
	
};