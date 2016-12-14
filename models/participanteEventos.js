ParticipanteEventos 						= new Mongo.Collection("participanteEventos");
ParticipanteEventos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});