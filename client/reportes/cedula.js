angular
  .module('insude')
  .controller('CedulaCtrl', CedulaCtrl);
 
function CedulaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	
	let rc = $reactive(this).attach($scope);
	
	Window.rc = rc;
	
  this.action = true;
  this.participante = {};
  this.participante.profile = {};
  this.buscar = {};
  this.evento = {};
  this.buscar.nombre = '';
	this.validation = false;
	this.deporteNombre = "";
	this.categoriaNombre = "";
	
	
	let part = this.subscribe('participanteEventos',()=>{
		
		if (this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') != undefined && this.getReactively('evento.categoria_id') != undefined && this.getReactively('evento.rama_id') != undefined)
		{	
			
				if ((Meteor.user().roles[0] == 'admin') && (this.getReactively('evento.municipio_id') == undefined))
						return;
						
		
		return [{evento_id: this.getReactively('evento.evento_id')!= undefined ? this.getReactively('evento.evento_id'): "" 
					  ,municipio_id : ((Meteor.user().roles[0] == 'admin') && (this.getReactively('evento.municipio_id') != undefined)) 
					  									? this.getReactively('evento.municipio_id')  
					  									: Meteor.user().profile.municipio_id
					  ,deporte_id: this.getReactively('evento.deporte_id')!= undefined ? this.getReactively('evento.deporte_id'): ""
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): ""
					  ,rama_id: this.getReactively('evento.rama_id')!= undefined ? this.getReactively('evento.rama_id'): ""
					  ,funcionEspecifica: this.getReactively('evento.funcionEspecifica')!= undefined ? this.getReactively('evento.funcionEspecifica'): ""}]
					  
		}			  
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
						,deporte_id: this.getReactively('evento.deporte_id')? this.getReactively('evento.deporte_id'):""
						,estatus: true
		}]
	});
	
	this.subscribe('pruebas',()=>{
		return [{evento_id:  this.getReactively('evento.evento_id')? this.getReactively('evento.evento_id'):"" 
						,deporte_id: this.getReactively('evento.deporte_id')? this.getReactively('evento.deporte_id'):""
						,categoria_id: this.getReactively('evento.categoria_id')!= undefined ? this.getReactively('evento.categoria_id'): ""
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
			return Eventos.find();
		},
		deportes : () => {
			return Deportes.find();
		},
		categorias : () => {
			return Categorias.find();
		},
		ramas : () => {
			return Ramas.find();
		},
		pruebas : () => {
			return Pruebas.find();
		},
		todosParticipantes : () => {
			if(part.ready()){
				_.each(rc.participantes, function(participante){
					var m = Municipios.findOne(participante.municipio_id);
					participante.municipio = m.nombre;
					var e = Eventos.findOne(participante.evento_id);
					participante.evento = e.nombre;
					var d = Deportes.findOne(participante.deporte_id);
					participante.deporte = d.nombre;
					this.deporteNombre = d.nombre;
					var c = Categorias.findOne(participante.categoria_id);
					participante.categoria = 	c.nombre;
					this.categoriaNombre = c.nombre;
					var r = Ramas.findOne(participante.rama_id);
					participante.rama = 	r.nombre;	
															
					participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							//participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
							var p = Pruebas.findOne(prueba,{ fields : { nombre : 1}});
							participante.pruebasNombre.push({"nombre": p.nombre});
					})
					
				})
				
			}
		}
		
	});
	
	this.download = function(participantes, op) 
  {
	  
		if (participantes.length == 0)
 		{
	 			toastr.error("No hay participantes para generar cédula");
				return;
		}
		
		if (op == 1)
		{
				Meteor.call('getCedula', participantes, function(error, response) {
				   if(error){
				    console.log('ERROR :', error);
				    return;
				   }else{
		
					  var pdf = 'data:application/docx;base64,';
				    var dlnk = document.getElementById('dwnldLnk');
				    dlnk.download = this.deporteNombre+'-'+this.categoriaNombre+'.docx'; 
						dlnk.href = pdf+response;
						dlnk.click();
				    		    
				   }
				});
		}
		else
		{
			
			var participantesArray = [];
					participantesArray.push(["MUNICIPIO", "CURP", "NOMBRE", "DEPORTE", "CATEGORÍA"]);
			 _.each(rc.participantes, function(participante){
				 	participantesArray.push([participante.municipio, participante.curp, participante.nombreCompleto, participante.deporte, participante.categoria]);
			})	 
											
			Meteor.call('getExcel', participantesArray, function(error, response) {
				   if(error){
				    console.log('ERROR :', error);
				    return;
				   }else{
					 	
					  var pdf = 'data:application/xlsx;base64,';
				    var dlnk = document.getElementById('dwnldLnk');
				    dlnk.download = this.deporteNombre+'-'+this.categoriaNombre+'.xlsx'; 
						dlnk.href = pdf+response;
						dlnk.click();
				   }
			});	

		}
		
	};
	

	
	this.tieneFoto = function(sexo, foto){
	  if(foto === undefined){
		  if(sexo === "Hombre")
			  return "img/badmenprofile.jpeg";
			else if(sexo === "Mujer"){
				return "img/badgirlprofile.jpeg";
			}else{
				return "img/badprofile.jpeg";
			}
			  
	  }else{
		  return foto;
	  }
  }  
	
};	
