Eventos 						= new Mongo.Collection("eventos");
Eventos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});