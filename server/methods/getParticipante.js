Meteor.methods({
  getParticipante: function (id) {
    var p = Participantes.findOne({_id:id});	
    return p;
  },
  getParticipanteCurp: function (curp) {
    var p = Participantes.findOne({curp:curp});	
    return p;
  },
  updateParticipante: function (participante, participanteEventos) {
			
			var idTemp = participante._id;
			delete participante._id;		
					
			participante.nombreCompleto = participante.nombre + " " + 
																		participante.apellidoPaterno + 
																		(participante.apellidoMaterno == "" ? "": " " + participante.apellidoMaterno);
			
			Participantes.update({_id:idTemp},{$set:participante}); 
													
			participanteEventos.participante_id = idTemp;
			

			participanteEventos.foto 							= participante.foto;
			participanteEventos.nombre 						= participante.nombre;
			participanteEventos.apellidoPaterno 	= participante.apellidoPaterno;
			participanteEventos.apellidoMaterno 	= participante.apellidoMaterno;
			participanteEventos.sexo 							= participante.sexo;
			participanteEventos.curp 							= participante.curp;
			participanteEventos.fechaNacimiento 	= participante.fechaNacimiento;
			participanteEventos.nombreCompleto 		= participante.nombreCompleto
																						
			///participanteEventos.municipio_id 			= participante.municipio_id;
			participanteEventos.usuarioActualizo 	= Meteor.userId();
			
			var idTempPE = participanteEventos._id;
			delete participanteEventos._id;
																		
			ParticipanteEventos.update({_id:idTempPE},{$set:participanteEventos});
			
			return true;
		
  },
});