Deportes 						= new Mongo.Collection("deportes");
Deportes.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});