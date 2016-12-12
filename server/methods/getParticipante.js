Meteor.methods({
  getParticipante: function (id) {
    var p = Participantes.findOne({_id:id});	
    return p;
  },
});