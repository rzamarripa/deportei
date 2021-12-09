Meteor.methods({

    getDeportesEvento: function (evento_id) {
        return Deportes.find({ evento_id: evento_id }, { sort: { nombre: 1 } }).fetch();
    },
    getCategoriasEvento: function (evento_id, deporte_id) {
        return Categorias.find({ evento_id: evento_id, deporte_id: deporte_id }, { sort: { nombre: 1 } }).fetch();
    },
    // getDeportes: function (evento_id) {

    // },
    // getParticipantes: function (municipio_id, evento_id) {
    //     var eventos = ParticipanteEventos.find({ municipio_id: municipio_id, evento_id: evento_id }).fetch();

    //     _.each(eventos, function (pe) {
    //         //var evento = Eventos.findOne(pe.evento_id);
    //         //pe.evento = evento.nombre;

    //         if (pe.deporte_id != undefined) {
    //             var deporte = Deportes.findOne(pe.deporte_id);
    //             pe.deporte = deporte.nombre;
    //         }

    //         if (pe.categoria_id != undefined && pe.categoria_id != "" && pe.categoria_id != "s/a") {
    //             var categoria = Categorias.findOne(pe.categoria_id);
    //             console.log(pe._id);
    //             console.log(pe.nombreCompleto + " " + categoria.nombre);
    //             pe.categoria = categoria.nombre == undefined ? "" : categoria.nombre;
    //         }

    //         if (pe.rama_id != undefined) {
    //             var rama = Ramas.findOne(pe.rama_id);
    //             pe.rama = rama.nombre;
    //         }
    //         pe.pruebasArreglo = "";
    //         _.each(pe.pruebas, function (prueba_id) {
    //             var p = Pruebas.findOne(prueba_id);
    //             pe.pruebasArreglo += p.nombre + ", ";
    //         })

    //     })

    //     return eventos;

    // },

});