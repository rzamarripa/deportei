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
	
	//this.participante.evento_id = $stateParams.id;
	//this.participanteEventos.evento_id = $stateParams.id;

	/*
	this.subscribe('participantes',()=>{
		return [{_id : $stateParams.id}]
	});
	
	let pe = this.subscribe('participanteEventos',()=>{
		return [{participante_id : $stateParams.id}]
	});
*/
	
	loading(true);
	let pe = this.subscribe('participanteEventos',()=>{
		return [{_id : $stateParams.id}]
		},
		{
			onReady: function () {
				
				var pe = ParticipanteEventos.findOne({_id: $stateParams.id});
				
				if (pe != undefined)
				{
						
						//console.log("PE:" ,pe._id);
						//console.log("PE:" ,pe.funcionEspecifica);					
						
						this.participanteEventos = pe; 
						
						this.subscribe('participantes',()=>{
								return [{_id : pe.participante_id}]
							},
							{
								onReady: function () {
									
									var par = Participantes.findOne();
									
									if (par != undefined)
									{
										//console.log("Par:" ,par);		
										
										this.participante = par;
										
										var img = new Image();
												
										img.id = "fotoCargada";
										img.src = pe.foto;
										img.width =200;
										img.height=200;
																	
										fileDisplayArea1.appendChild(img);
													
										this.participante = par;
										loading(false);
									}
										
								
								}
							});
						
						
												
				}
				
				
				
/*
				this.subscribe('participantes',()=>{
					return [{_id : pe.participante_id}]
				});	
*/
				
				
		}
	});
	
	
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('municipios',()=>{
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
	  /*
participante : () => {	
		  
		  var p = Participantes.findOne(); 
		  
		  if (p)
		  {
			  var img = new Image();
												
				img.id = "fotoCargada";
				img.src = p.foto;
				img.width =200;
				img.height=200;
											
				fileDisplayArea1.appendChild(img);
		  
		  }
		  
		  return p;
	  },
	  participanteEventos : () => {	
		  return ParticipanteEventos.findOne();
	  },
*/
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
	  municipios : () => {
		  return Municipios.find();
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
			            
	    	    
			if (participante.identificacion == undefined)
			{
				toastr.error('Error no se ha cargado el comprobante de la Identificación Oficial del participante.');
			  return;
			}
	    
	    
	    // Enable #x
			$( "#registrar" ).prop( "disabled", true );
			
			
			if (participanteEventos.categoria_id != "s/a")
	    {
			
					//Obtener las Edades de la Categoria			
					var cat = Categorias.findOne({ _id: participanteEventos.categoria_id});
					
					var d = new Date();
					var anioActual = d.getFullYear();
					
					var anioInicio = cat.anioinicio;
					var anioFin = cat.aniofin;
					
					//Obtener la Edad del participante
					
			    var today_year = d.getFullYear();
			    var today_month = d.getMonth();
			    var today_day = d.getDate();
			    //var edad = today_year - participante.fechaNacimiento.getFullYear();
					
					var anioNacimiento = participante.fechaNacimiento.getFullYear();
										
					//Estos son los participantes que no son deportistas
					if (participanteEventos.funcionEspecifica != 'DEPORTISTA')
					{
							loading(true);
							Meteor.call('updateParticipante', participante, participanteEventos, function(error, response) {
								    if(error){
									    console.log('ERROR :', error);
									    $( "#registar" ).prop( "disabled", false );
									    loading(false);
									    return;
								    }
								    
								    if (response)
								    {
									    		toastr.success('Actualizado correctamente.');
									    		
									    		loading(false);
									    		
													participante = {};
													participanteEvento = {};
													$('.collapse').collapse('hide');
													this.nuevo = true;
													$state.go('root.listarparticipantes');
								    }
							});			    

					}//Estos son los deportistas
					else if (anioNacimiento <= anioInicio && anioNacimiento >= anioFin)
					{
							loading(true);
							Meteor.call('updateParticipante', participante, participanteEventos, function(error, response) {
								    if(error){
									    console.log('ERROR :', error);
									    $( "#registar" ).prop( "disabled", false );
									    loading(false);
									    return;
								    }
								    
								    if (response)
								    {
									    		loading(false);
									    		
									    		toastr.success('Actualizado correctamente.');
													participante = {};
													participanteEvento = {};
													$('.collapse').collapse('hide');
													this.nuevo = true;
													$state.go('root.listarparticipantes');
									    
									    
								    }
							});	
					}	 
					else
					{
							 toastr.error('La edad no corresponde a la categoria verificar por favor.');
							 $( "#registrar" ).prop( "disabled", false );
							 return;
							 
					}

			}else
			{
					loading(true);
					Meteor.call('updateParticipante', participante, participanteEventos, function(error, response) {
						    if(error){
							    console.log('ERROR :', error);
							    $( "#registar" ).prop( "disabled", false );
							    loading(false);
							    return;
						    }
						    
						    if (response)
						    {
							    		toastr.success('Actualizado correctamente.');
							    		
							    		loading(false);
							    		
											participante = {};
											participanteEvento = {};
											$('.collapse').collapse('hide');
											this.nuevo = true;
											$state.go('root.listarparticipantes');
							    
						    }
					});
				
			}
			
			
			

	};
		
	this.ValidaCurpParticipante = function(curp)
	{
				
				Meteor.call('getParticipanteCurp', curp, function(error, response) {
							if(error){
									console.log('ERROR :', error);
							    return;
							}else{
							    if (response)
							    {
									    toastr.info('El Participante ya se encuentra en la base de datos se cargara sus datos de Curp, Acta de Nacimiento e Identificación');
									    rc.participante = response;
									    
									    fileDisplayArea1.innerHTML = "";
		
											var img = new Image();
											
											img.id = "fotoCargada";
											img.src = rc.participante.foto;
											img.width =200;
											img.height=200;
											
											fileDisplayArea1.appendChild(img);

							    }
						  }
				});
	}

	
	this.funcionEspecifica = function(participante,participanteEvento)
	{		
			
			//console.log(participante);
			if (participanteEvento != "DEPORTISTA" || participanteEvento != "ENTRENADOR" || participanteEvento != "DELEGADO GENERAL" || participanteEvento != "DELEGADO AUXILIAR")
			{
					if (this.participante.sexo == undefined)
						  this.participante.sexo = "Hombre";

					if (this.participante.estado == undefined)
							this.participante.estado = "SINALOA";
					//this.participante.curpImagen = "s/a";
					
					if (this.participanteEventos.deporte_id == undefined)
							this.participanteEventos.deporte_id = "s/a";
					
					//this.participante.fechaNacimiento = new Date();
					
					if (this.participante.actaNacimiento == undefined)
	 					  this.participante.actaNacimiento = "s/a";
	 				
	 				if (this.participante.identificacion == undefined)	 
							this.participante.identificacion = "s/a";
					
					if (this.participante.categoria_id == undefined)
							this.participanteEventos.categoria_id = "s/a";
							
					if (this.participante.rama_id == undefined)		
	 					  this.participanteEventos.rama_id = "s/a";
				
			}
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
							
							img.id = "fotoCargada";
							img.src = reader.result;
							img.width =200;
							img.height=200;
							
							rc.AlmacenaImagen(reader.result, 1);
							
							fileDisplayArea1.appendChild(img);
							
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
					
					if (file.size <= 1000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
						rc.AlmacenaImagen(reader.result, 2);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera 1 MB");
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
					
					if (file.size <= 1000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 3);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera 1 MB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
								
			});
			
			//JavaScript para agregar el Identificacion Oficial
			fileInputIdentificacion.addEventListener('change', function(e) {
				var file = fileInputIdentificacion.files[0];
				
				var imageType;
				
				if (file.type == "application/pdf")
						imageType = /application.*/;
				else
						imageType = /image.*/;		
				
				if (file.type.match(imageType)) {
					
					if (file.size <= 1000000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
		
							rc.AlmacenaImagen(reader.result, 4);

						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error el archivo supera 1 MB");
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
		  
		  this.ValidaCurpParticipante(curp);
		
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
	
	this.download = function(archivo, op) 
  {
				//console.log(archivo.indexOf("application"));
				//console.log(archivo.indexOf("image"));
		    if (archivo.indexOf("application") > 0)
		    {

			    	var pdf = 'data:application/octet-stream;base64,';
			  		var d = archivo.replace('data:application/pdf;base64,','');  
						var dlnk = document.getElementById('dwnldLnk');
						if (op==1)
							 dlnk.download= "curp.pdf";
						else if (op==2)
							 dlnk.download= "AN.pdf";
						else if (op==3)
							 dlnk.download= "Ide.pdf";
				    dlnk.href = pdf+d;
				    dlnk.click();
		    }else if(archivo.indexOf("image") > 0)
		    {

			    	var jpeg = 'data:image/jpeg;base64,';
			  		var d = archivo.replace('data:image/jpeg;base64,','');  
						var dlnk = document.getElementById('dwnldLnk');
				    if (op==1)
							 dlnk.download= "curp.jpeg";
						else if (op==2)
							 dlnk.download= "AN.jpeg";
						else if (op==3)
							 dlnk.download= "Ide.jpeg";				    
						dlnk.href = jpeg+d;
				    dlnk.click();
		    }
		    else
		    {
			    console.log("no entro")
		    }
	};
  
  this.modalDoc= function(img)
	{
		var imagen = '<img class="img-responsive" src="'+img+'" style="margin:auto;">';
		$('#imagenDiv').empty().append(imagen);
		$("#modaldoc").modal('show');
	};
	
	
};