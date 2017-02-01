Meteor.methods({
  insertParticipanteEventos: function (participanteEventos, evento) {
	  	var c = ParticipanteEventos.find({evento_id: evento}).count();
	  	c++;
	  	participanteEventos.con = c;
    	ParticipanteEventos.insert(participanteEventos);
  },
});