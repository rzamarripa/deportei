Pruebas 						= new Mongo.Collection("pruebas");
Pruebas.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});