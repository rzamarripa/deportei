Meteor.methods({

    getMunicipios: function () {
        return Municipios.find({}, { sort: { nombre: 1 } }).fetch();
    },

    getDeportesEvento: function (evento_id) {
        return Deportes.find({ evento_id: evento_id }, { sort: { nombre: 1 } }).fetch();
    },

    getCategoriasEvento: function (evento_id, deporte_id) {
        return Categorias.find({ evento_id: evento_id, deporte_id: deporte_id }, { sort: { nombre: 1 } }).fetch();
    },

    getBuscarParticipantes: function (options) {
        const rol = Meteor.user().roles[0];
        const resultado = {};
        resultado.arreglo = [];
        let selector = {};

        selector = {
            "municipio_id": options.where.municipio_id,
            "nombreCompleto": RegExp('^' + options.where.nombreCompleto)
        }

        resultado.arreglo = Participantes.find(selector, {
            sort: { "nombreCompleto": 1 },
            skip: options.skip,
            limit: options.limit,
            fields: {
                "foto": 1,
                "nombreCompleto": 1,
                "curp": 1,
                "sexo": 1,
                "fechaNacimiento": 1,
            }
        }).fetch();
        return resultado;

    },

    getParticipantePerfil: function (id) {
		const data = {};
		data.objeto = {};
		data.objeto = Participantes.findOne({ _id: id }, {
			fileds: {
				"foto": 1,
				"nombre": 1,
				"apellidoPaterno": 1,
				"apellidoMaterno": 1,
				"formacionacademica": 1,
				"curp": 1,
				"fechaNacimiento": 1
			}
		});

		data.arreglo = [];

		ParticipanteEventos.find({ participante_id: id }).forEach(p => {
			const objeto = {};
			objeto._id = p._id;
			objeto.funcionEspecifica = p.funcionEspecifica;
			const evento = Eventos.findOne(p.evento_id);
			objeto.evento_id = evento._id;
			objeto.evento = evento.nombre;
			objeto.puedeInscribir = evento.puedeInscribir != undefined ? evento.puedeInscribir : false;
			objeto.fecha = evento.fechainicio;
			const deporte = Deportes.findOne({ _id: p.deporte_id, evento_id: p.evento_id });
			objeto.deporte_id = deporte._id;
			objeto.deporte = deporte.nombre;
			const categoria = Categorias.findOne({ _id: p.categoria_id, deporte_id: p.deporte_id, evento_id: p.evento_id });
			objeto.categoria_id = categoria._id;
			objeto.categoria = categoria.nombre;
			
			if (p.pruebas != undefined && p.pruebas.length > 0) {
				objeto.pruebas = [...p.pruebas];
				objeto.pruebasNombres = [];
				p.pruebas.forEach(t => {
					const prueba = {};
					prueba.nombre = Pruebas.findOne(t).nombre;
					objeto.pruebasNombres.push(prueba.nombre);
				})
			}
			const rama = Ramas.findOne({ _id: p.rama_id });
			objeto.rama_id = rama._id;
			objeto.rama = rama.nombre;
			const municipio = Municipios.findOne(p.municipio_id);
			objeto.municipio_id = municipio._id;
			objeto.municipio = municipio.nombre;
			data.arreglo.push(objeto);

		})

        try {
            data.arreglo.sort(function (a, b) {
                if (a.fecha.getTime() > b.fecha.getTime()) {
                    return -1;
                }
                if (a.fecha.getTime() < b.fecha.getTime()) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
            
        } catch (error) {
            
        }

		return data;

	},

    getValidarParticipante: function (curp) {
        const data = {};
        console.log(curp)
        const p = Participantes.findOne({ curp: curp });
        if (p != undefined) {
            data.resultado = true;
            data.nombreCompleto = p.nombreCompleto;
            data.municipio = Municipios.findOne(p.municipio_id).nombre;
        }
        else {
            data.resultado = false;
        }

        return data;

    },

    getRamas: function () {
        return Ramas.find({ estatus: true }, { sort: { nombre: 1 } }).fetch();
    },

    getEventosActivos: function () {
        return Eventos.find({ estatus: true }, { sort: { nombre: 1 } }).fetch();
    },

    getEventosActivosInscribir: function () {
        return Eventos.find({ puedeInscribir: true }, { sort: { nombre: 1 } }).fetch();
    },

    getDeportes: function (id) {
        return Deportes.find({ evento_id: id, estatus: true }, { sort: { nombre: 1 } }).fetch();
    },

    getCategorias: function (param) {
        return Categorias.find({ evento_id: param.evento_id, deporte_id: param.deporte_id, estatus: true }, { sort: { nombre: 1 } }).fetch();
    },

    getCategoria: function (id) {
        return Categorias.findOne(id);
    },

    getPruebas: function (param) {
        return Pruebas.find({ evento_id: param.evento_id, deporte_id: param.deporte_id, categoria_id: param.categoria_id, rama_id: param.rama_id, estatus: true }, { sort: { nombre: 1 } }).fetch();
    },
    
    getParticipantesEventosCedula: function (param) {
        const data = {};
        data.arreglo = [];
        data.arreglo = ParticipanteEventos.find({
            evento_id: param.evento_id,
            deporte_id: param.deporte_id,
            categoria_id: param.categoria_id,
            rama_id: param.rama_id,
            municipio_id: param.municipio_id,
            funcionEspecifica: param.funcionEspecifica
        }).map(p => {
            p.pruebasNombre = [];
            const partcipante = Participantes.findOne(p.participante_id);
            p.nombre = partcipante.nombre;
            p.apellidoPaterno = partcipante.apellidoPaterno;
            p.apellidoMaterno = partcipante.apellidoMaterno;
            p.fechaNacimiento = partcipante.fechaNacimiento;
            p.sexo = partcipante.sexo;
            p.curp = partcipante.curp;
            p.foto = partcipante.foto;

            if (p.pruebas != undefined && p.pruebas.length > 0) {
                p.pruebas.forEach(t => {
                    const prueba = Pruebas.findOne(t);
                    p.pruebasNombre.push({ nombre: prueba.nombre })
                })
            }
            return p;
        });
        return data;
    },

    getParticipantesEventosListado: function (param) {
        const data = {};
        data.arreglo = [];

        let selector = {};
        if (param.deporte_id == "") {
            selector = {
                municipio_id: param.municipio_id,
                evento_id: param.evento_id,
            }
        } else {
            selector = {
                municipio_id: param.municipio_id,
                evento_id: param.evento_id,
                deporte_id: param.deporte_id,
            }
        }

        data.arreglo = ParticipanteEventos.find(selector).map(p => {
            p.pruebasNombre = [];
            const partcipante = Participantes.findOne(p.participante_id);
            if (partcipante != undefined){
                p.nombre = partcipante.nombre;
                p.apellidoPaterno = partcipante.apellidoPaterno;
                p.apellidoMaterno = partcipante.apellidoMaterno;
                p.fechaNacimiento = partcipante.fechaNacimiento;
                p.sexo = partcipante.sexo;
                p.curp = partcipante.curp;
                p.municipio = Municipios.findOne(p.municipio_id).nombre;
                p.deporte = Deportes.findOne(p.deporte_id).nombre;
                p.categoria = p.categoria_id == "s/a" ? "Sin Categoria" : Categorias.findOne(p.categoria_id).nombre;
                p.rama = p.rama_id == "s/a" ? "Sin Rama" : Ramas.findOne(p.rama_id).nombre;
                if (p.pruebas != undefined && p.pruebas.length > 0) {
                    p.pruebas.forEach(t => {
                        const prueba = Pruebas.findOne(t);
                        p.pruebasNombre.push({ nombre: prueba.nombre })
                    })
                }
            }
            return p;
        });
        return data;
    },

    getParticipantesEventosDocumentos: function (param) {
        const data = {};
        data.arreglo = [];
        data.arreglo = ParticipanteEventos.find({
            municipio_id: param.municipio_id,
            evento_id: param.evento_id,
            deporte_id: param.deporte_id,
            categoria_id: param.categoria_id,
            rama_id: param.rama_id,
        }).map(p => {
            p.pruebasNombre = [];
            const partcipante = Participantes.findOne(p.participante_id);
            p.nombre = partcipante.nombre;
            p.apellidoPaterno = partcipante.apellidoPaterno;
            p.apellidoMaterno = partcipante.apellidoMaterno;
            p.nombreCompleto = partcipante.nombreCompleto;
            p.fechaNacimiento = partcipante.fechaNacimiento;
            p.sexo = partcipante.sexo;
            p.curp = partcipante.curp;
            p.foto = partcipante.foto;

            p.curpImagen = partcipante.curpImagen;
            p.actaNacimiento = partcipante.actaNacimiento;
            p.identificacion = partcipante.identificacion;
           
            return p;
        });
        return data;
    },
});