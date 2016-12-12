ModalidadDeportivas 						= new Mongo.Collection("modalidaddeportivas");
ModalidadDeportivas.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});