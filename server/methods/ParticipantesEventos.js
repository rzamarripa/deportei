Meteor.methods({
  insertParticipanteEventos: function (participanteEventos, evento) {
    	var e = Eventos.findOne({_id: evento});
    	var c = e.con + 1;
    	participanteEventos.con = c;
    	ParticipanteEventos.insert(participanteEventos);
    	Eventos.update({_id: evento}, {$set:{con:c}})
  },
  updateParticipanteEventos: function (participante, participanteEventos, evento) {
		
			var idTemp = participante._id;
			delete participante._id;		
			Participantes.update({_id:idTemp},{$set:participante});
		
			
			participanteEventos.participante_id = idTemp;
			
			participanteEventos.foto = participante.foto;
			participanteEventos.nombre = participante.nombre;
			participanteEventos.apellidoPaterno = participante.apellidoPaterno;
			participanteEventos.apellidoMaterno = participante.apellidoMaterno;
			participanteEventos.sexo = participante.sexo;
			participanteEventos.curp = participante.curp;
			participanteEventos.fechaNacimiento = participante.fechaNacimiento;
			participanteEventos.nombreCompleto = participante.nombreCompleto
			
			participanteEventos.municipio_id = Meteor.user().profile.municipio_id;
			participanteEventos.usuarioInserto = Meteor.userId();

			var e = Eventos.findOne({_id: evento});
    	var c = e.con + 1;
    	participanteEventos.con = Number(c);
    	ParticipanteEventos.insert(participanteEventos);
    	Eventos.update({_id: evento}, {$set:{con: Number(c)}})
    	
    	return true;
    	
  },
  removeParticipanteEventos: function (evento_id, participante_id) {
			ParticipanteEventos.remove({_id: participante_id, evento_id: evento_id});
			return true;
  },
});