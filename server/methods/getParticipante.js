Meteor.methods({
  getParticipante: function (id) {
    var p = Participantes.findOne({_id:id});	
    return p;
  },
  getParticipanteCurp: function (curp) {
    var p = Participantes.findOne({curp:curp});	
    return p;
  },
});