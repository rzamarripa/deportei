Meteor.methods({

    getDeportesEvento: function (evento_id) {
        return Deportes.find({ evento_id: evento_id }, {sort: {nombre: 1}}).fetch();
    },
    getCategoriasEvento: function (evento_id, deporte_id) {
        return Categorias.find({ evento_id: evento_id, deporte_id: deporte_id }, {sort: {nombre: 1}}).fetch();
	},

});