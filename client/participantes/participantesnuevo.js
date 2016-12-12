angular
  .module('insude')
  .controller('ParticipantesNuevoCtrl', ParticipantesNuevoCtrl);
 
function ParticipantesNuevoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window = rc;
	
	this.action = true;
	this.participante = {}; 
	
	this.participante.evento_id = $stateParams.id;
	
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
		
		return [{evento_id: this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):""
						,estatus: true}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):"" 
						,deporte_id: this.getReactively('participante.deporte_id')? this.getReactively('participante.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('participante.evento_id')? this.getReactively('participante.evento_id'):"" 
						,deporte_id: this.getReactively('participante.deporte_id')? this.getReactively('participante.deporte_id'):""			
						,categoria_id: this.getReactively('participante.categoria_id')? this.getReactively('participante.categoria_id'):""
						,rama_id: this.getReactively('participante.rama_id')? this.getReactively('participante.rama_id'):""			
		}]
	});
	
  
  this.helpers({
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
  	  
  this.nuevo = true;	  
  this.nuevoParticipante = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.participante.nombre = "";
  };
	
  this.guardar = function(participante,form)
	{
			
			if(form.$invalid){
	      toastr.error('Error al guardar los datos.');
	      return;
	    }
	    
	    if (participante.foto == undefined)
	    {
		    toastr.error('Error no se ha cargado la foto del participante.');
	      return;
	    }

	    if (participante.curpImagen == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del CURP del participante.');
	      return;
	    }
	    if (participante.actaNacimiento == undefined)
	    {
		    toastr.error('Error no se ha cargado el comprobante del Acta de Nacimiento del participante.');
	      return;
	    }
			var mun = String(Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "");
			//console.log(mun);
			            
	    if (mun != '8mqR9HsyDwG3X7jmp')
	    {	    
			    if (participante.identificacion == undefined)
			    {
				    toastr.error('Error no se ha cargado el comprobante de la Identificación Oficial del particpante.');
			      return;
			    }
	    }
	    
	    // Enable #x
			$( "#registrar" ).prop( "disabled", true );
	    if (participante.categoria_id != "s/a")
	    {
			
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
			    
			    //console.log("Final:",edad);
					//console.log("Maxima:", EdadMaxima);
					//console.log("Minima:", EdadMinima);
					
					
					//Validar la edad del particpante en relación a la categoria
					if (participante.funcionEspecifica != 'DEPORTISTA')
					{
						  participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
							//console.log(participante);
							
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							participante.estatus = true;
							participante.usuarioInserto = Meteor.userId();
							
							Participantes.insert(participante, 
																			function(error,result){
																				if (error){
																						$( "#registar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																					  if (error.error == 409) toastr.error('Error registro duplicado.');
																					  		return;		
																				}	  
																				console.log("Insert No deportista:",result);
																				if (result)
																				{
																						toastr.success('Guardado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);

					}
					else if (edad >= EdadMinima && edad <= EdadMaxima)
					{
							
							participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
							//console.log(participante);
							
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							participante.estatus = true;
							participante.usuarioInserto = Meteor.userId();
							Participantes.insert(participante, 
																			function(error,result){
																				if (error){
																						$( "#registar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																					  if (error.error == 409) toastr.error('Error registro duplicado.');
																					  		return;		
																				}	  
																				console.log("Insert deportista:",result);
																				if (result)
																				{
																						toastr.success('Guardado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);
					}	 
					else
					{
							 toastr.error('La edad no corresponde a la categoria verificar por favor.');
							 
					}
			}else
			{
							participante.municipio_id = Meteor.user() != undefined ? Meteor.user().profile.municipio_id : "";
					
							participante.nombreCompleto = participante.nombre + " " + participante.apellidoPaterno + " " + participante.apellidoMaterno;
							participante.estatus = true;
							participante.usuarioInserto = Meteor.userId();
							Participantes.insert(participante, 
																			function(error,result){
																				if (error){
																					  $( "#registar" ).prop( "disabled", false );
																					  console.log("Error:",error);
																					  if (error.error == 409) toastr.error('Error registro duplicado.');
																					  		return;		
																				}	  
																				console.log("Insert otro:",result);
																				if (result)
																				{
																						toastr.success('Guardado correctamente.');
																						participante = {};
																						$('.collapse').collapse('hide');
																						this.nuevo = true;
																						$state.go('root.listarparticipantes');
																						
																						form.$setPristine();
																				    form.$setUntouched();	
																				}	 
																			}
																	);
				
			}		
			
	};
	
	this.editar = function(id)
	{
	    this.participante = Participantes.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(participante,form)
	{
	    if(form.$invalid){
	        toastr.error('Error al actualizar los datos.');
	        return;
	    }
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
	};
	/*	
	this.cambiarEstatus = function(id)
	{
			var participante = Participantes.findOne({_id:id});
			if(participante.estatus == true)
				participante.estatus = false;
			else
				participante.estatus = true;
			
			Participantes.update({_id:id}, {$set : {estatus : participante.estatus}});
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
	*/
	
	this.funcionEspecifica = function(participante)
	{
			
			//console.log(participante.funcionEspecifica);
			switch (participante.funcionEspecifica)
			{
					case "ASOCIACIÓN":
					case "JUEZ/ARBITRO":
					case "JEFE DE MISIÓN":
					case "OFICIAL":
					case "MÉDICO":
					case "PRENSA":
					case "INVITADO ESPECIAL":
							//console.log("entro");
							
							participante.fechaNacimiento= new Date();
							participante.estado = "BAJA CALIFORNIA SUR";
							participante.curpImagen = "s/a";
							participante.actaNacimiento = "s/a";
							participante.identificacion = "s/a";
							participante.categoria_id = "s/a";
							participante.rama_id = "s/a";
							break;
			}
			//console.log(participante);
			
						
	}
	
	this.AlmacenaImagen = function(imagen, tipo)
	{
			if (tipo == 1)
					this.participante.foto = imagen;
			else if (tipo == 2)		
					this.participante.curpImagen = imagen;
			else if (tipo == 3)
					this.participante.actaNacimiento = imagen;		
			else
					this.participante.identificacion = imagen;		
						
	}
	
	
	$(document).ready( function() {
		

			$(".Mselect2").select2();
					
			var fileInput1 = document.getElementById('fileInput1');
			var fileInputCurp = document.getElementById('fileInputCurp');
			var fileInputActa = document.getElementById('fileInputActa');
			var fileInputIdentificacion = document.getElementById('fileInputIdentificacion');
			
			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
			
			
			//JavaScript para agregar la Foto
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
		
							rc.AlmacenaImagen(reader.result, 1);
							//this.folio.imagen1 = reader.result;
							
							fileDisplayArea1.appendChild(img);
							//console.log(fileDisplayArea1);
						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error la Imagen supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
			});
			
			//JavaScript para agregar el Curp Imagen
			fileInputCurp.addEventListener('change', function(e) {
				var file = fileInputCurp.files[0];
				
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
		
				//console.log(imageType);
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 2000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
						rc.AlmacenaImagen(reader.result, 2);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 2 MB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			//JavaScript para agregar el Acta Nacimiento
			fileInputActa.addEventListener('change', function(e) {
				var file = fileInputActa.files[0];
				
				//console.log(file.type);
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 5000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 3);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 5 MB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			//JavaScript para agregar el Identificacion Oficial
			fileInputIdentificacion.addEventListener('change', function(e) {
				var file = fileInputCurp.files[0];
				
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 2000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 4);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera los 2 MB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			

	});
	
	this.GeneraCurp = function(participante)
	{
			if (participante.nombre == undefined)
			{
					toastr.error('Falta proporcionar el nombre.');
					return;
			}
			
			if (participante.apellidoPaterno == undefined)
			{
					toastr.error('Falta proporcionar el apellido paterno.');
					return;
				
			}
			
			if (participante.fechaNacimiento == undefined)
			{
					toastr.error('Falta proporcionar la fecha de nacimiento.');
					return;
				
			}
			
			if (participante.sexo == undefined)
			{
					toastr.error('Falta proporcionar el sexo.');
					return;
				
			}
			
			if (participante.estado == undefined)
			{
					toastr.error('Falta seleccionar el estado.');
					return;
				
			}
			
			var curp = generaCurp({
			  nombre            : participante.nombre,
			  apellido_paterno  : participante.apellidoPaterno,
			  apellido_materno  : participante.apellidoMaterno,
			  sexo              : participante.sexo == 'Hombre'?'H':'M',
			  estado            : Estado(participante.estado),
			  fecha_nacimiento  : [participante.fechaNacimiento.getUTCDate(), participante.fechaNacimiento.getUTCMonth()+1, participante.fechaNacimiento.getUTCFullYear()]
			});
			
		  participante.curp = curp;
		
	};
	
	function Estado(estado)
	{	
			var e = '';
			switch(estado)
			{
					case 'AGUASCALIENTES': e = 'AS'; break;
					case 'BAJA CALIFORNIA NTE.': e = 'BC'; break;
					case 'BAJA CALIFORNIA SUR': e = 'BS'; break;
					case 'CAMPECHE': e = 'CC'; break;
					case 'COAHUILA': e = 'CL'; break;
					case 'COLIMA': e = 'CM'; break;
					case 'CHIAPAS': e = 'CS'; break;
					case 'CHIHUAHUA': e = 'CH'; break;
					case 'DISTRITO FEDERAL': e = 'DF'; break;
					case 'DURANGO': e = 'DG'; break;
					case 'GUANAJUATO': e = 'GT'; break;
					case 'GUERRERO': e = 'GR'; break;
					case 'HIDALGO': e = 'HG'; break;
					case 'JALISCO': e = 'JC'; break;
					case 'MEXICO': e = 'MC'; break;
					case 'MICHOACAN': e = 'MN'; break;
					case 'NAYARIT': e = 'NT'; break;
					case 'NUEVO LEON': e = 'NL'; break;
					case 'PUEBLA': e = 'PL'; break;
					case 'QUERETARO': e = 'QT'; break;
					case 'QUINTANA ROO': e = 'QR'; break;
					case 'SAN LUIS POTOSI': e = 'SP'; break;
					case 'SINALOA': e = 'SL'; break;
					case 'SONORA': e = 'SR'; break;
					case 'TABASCO': e = 'TC'; break;
					case 'TAMAULIPAS': e = 'TS'; break;
					case 'TLAXCALA': e = 'TL'; break;
					case 'VERACRUZ': e = 'VZ'; break;
					case 'YUCATAN': e = 'YN'; break;
					case 'ZACATECAS': e = 'ZS'; break;
					case 'SERV. EXTERIOR MEXICANO': e = 'SM'; break;
					case 'NACIDO EN EL EXTRANJERO': e = 'NE'; break;
			}	
			
			return e;		
	}	
	
};