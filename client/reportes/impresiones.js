angular
  .module('insude')
  .controller('ImpresionesCtrl', ImpresionesCtrl);
 
function ImpresionesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	
		
	let part = this.subscribe('participanteEventos',()=>{
		return [{municipio_id: this.getReactively('evento.municipio_id')!= undefined ? this.getReactively('evento.municipio_id'): ""
						,evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): "" 
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): "" 
						,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): "" 
						,funcionEspecifica: this.getReactively('evento.funcionEspecifica')!= undefined ? this.getReactively('evento.funcionEspecifica'): ""			
			}]
	});
		
	
	this.subscribe('municipios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('eventos',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('deportes',()=>{
		return [{evento_id: this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('categorias',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):""
						,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
		}]
	});
	
	this.subscribe('ramas',()=>{
		return [{estatus: true}]
	});

	
	this.helpers({
	  participantes : () => {
		  return ParticipanteEventos.find();
	  },
		municipios : () => {
			return Municipios.find();
		},
		eventos : () => {
			return Eventos.find({},{sort: {fechainicio:-1}});
		},
		deportes : () => {
			return Deportes.find({},{sort: {nombre:1}});
		},
		categorias : () => {
			return Categorias.find({},{sort: {nombre:1}});
		},
		pruebas : () => {
			return Pruebas.find({},{sort: {nombre:1}});
		},
		ramas : () => {
			return Ramas.find({},{sort: {nombre:1}});
		},
		
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){					
					participante.imprimir = true;
				})
			}
		}
		
	});

	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Masculino")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Femenino"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
  
  this.download = function(participantes, op) 
  {
	  	
		var p = rc.participantes.filter(function(ele){
																						return ele.imprimir === true;
		});

	  
		if (p.length == 0)
 		{
	 			toastr.error("No hay participantes seleccionados para imprmir");
				return;
		}
		
		
		
		if (op == 1)
		{
				
				$( "#credencial" ).prop( "disabled", true );
				Meteor.call('getCredenciales', p, rc.evento.municipio_id, 
																					rc.evento.evento_id, 
																					rc.evento.funcionEspecifica, 
																					rc.evento.deporte_id, 
																					rc.evento.categoria_id, 
																					rc.evento.rama_id, function(error, response) {
				   if(error)
				   {
				    console.log('ERROR :', error);
				    $( "#credencial" ).prop( "disabled", false );
				    return;
				   }
				   else
				   {
					   
					 				function b64toBlob(b64Data, contentType, sliceSize) {
										  contentType = contentType || '';
										  sliceSize = sliceSize || 512;
										
										  var byteCharacters = atob(b64Data);
										  var byteArrays = [];
										
										  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
										    var slice = byteCharacters.slice(offset, offset + sliceSize);
										
										    var byteNumbers = new Array(slice.length);
										    for (var i = 0; i < slice.length; i++) {
										      byteNumbers[i] = slice.charCodeAt(i);
										    }
										
										    var byteArray = new Uint8Array(byteNumbers);
										
										    byteArrays.push(byteArray);
										  }
										    
										  var blob = new Blob(byteArrays, {type: contentType});
										  return blob;
									}
									
									var blob = b64toBlob(response, "application/docx");
								  var url = window.URL.createObjectURL(blob);
								  
								  //console.log(url);
								  var dlnk = document.getElementById('dwnldLnkG');
							    dlnk.download = "Credenciales.docx"; 
									dlnk.href = url;
									dlnk.click();		    
								  window.URL.revokeObjectURL(url);
								  $( "#credencial" ).prop( "disabled", false );
		  
				   }
				});
		}
		else if (op==2)
		{
			
				$( "#gafete" ).prop( "disabled", true );
				Meteor.call('getGafetes', p,  rc.evento.municipio_id, 
																			rc.evento.evento_id, 
																			rc.evento.funcionEspecifica, 
																			rc.evento.deporte_id, 
																			rc.evento.categoria_id, 
																			rc.evento.rama_id, function(error, response) {
				   if(error)
				   {
				    console.log('ERROR :', error);
				    $( "#gafete" ).prop( "disabled", false );
				    return;
				   }
				   else
				   {
					   
					 				function b64toBlob(b64Data, contentType, sliceSize) {
										  contentType = contentType || '';
										  sliceSize = sliceSize || 512;
										
										  var byteCharacters = atob(b64Data);
										  var byteArrays = [];
										
										  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
										    var slice = byteCharacters.slice(offset, offset + sliceSize);
										
										    var byteNumbers = new Array(slice.length);
										    for (var i = 0; i < slice.length; i++) {
										      byteNumbers[i] = slice.charCodeAt(i);
										    }
										
										    var byteArray = new Uint8Array(byteNumbers);
										
										    byteArrays.push(byteArray);
										  }
										    
										  var blob = new Blob(byteArrays, {type: contentType});
										  return blob;
									}
									
									var blob = b64toBlob(response, "application/docx");
								  var url = window.URL.createObjectURL(blob);
								  
								  //console.log(url);
								  var dlnk = document.getElementById('dwnldLnkG');
							    dlnk.download = "Gafetes.docx"; 
									dlnk.href = url;
									dlnk.click();		    
								  window.URL.revokeObjectURL(url);
								  $( "#gafete" ).prop( "disabled", false );
		  
				   }
				});
		}

	};
	
	this.cambiar = function() 
  {
				var chkImprimir = document.getElementById('todos');
				console.log(chkImprimir.checked);
				
				if(part.ready()){
				_.each(rc.participantes, function(participante){
					participante.imprimir = chkImprimir.checked;
				})
			}
		 			
	};
	
};	
