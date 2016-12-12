Participantes 						= new Mongo.Collection("participantes");
Participantes.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});