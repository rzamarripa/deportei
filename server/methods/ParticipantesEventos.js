Meteor.methods({
	insertParticipanteEventos: function (participanteEventos, evento) {
		var e = Eventos.findOne({ _id: evento });
		var c = e.con + 1;
		participanteEventos.con = c;
		ParticipanteEventos.insert(participanteEventos);
		Eventos.update({ _id: evento }, { $set: { con: c } })
	},
	updateParticipanteEventos: function (participante, participanteEventos, evento) {

		var idTemp = participante._id;
		delete participante._id;
		Participantes.update({ _id: idTemp }, { $set: participante });


		participanteEventos.participante_id = idTemp;

		participanteEventos.foto = participante.foto;
		participanteEventos.nombre = participante.nombre;
		participanteEventos.apellidoPaterno = participante.apellidoPaterno;
		participanteEventos.apellidoMaterno = participante.apellidoMaterno;
		participanteEventos.sexo = participante.sexo;
		participanteEventos.curp = participante.curp;
		participanteEventos.fechaNacimiento = participante.fechaNacimiento;
		participanteEventos.nombreCompleto = participante.nombreCompleto

		participanteEventos.municipio_id = Meteor.user().profile.municipio_id;
		participanteEventos.usuarioInserto = Meteor.userId();

		var e = Eventos.findOne({ _id: evento });
		var c = e.con + 1;
		participanteEventos.con = Number(c);
		ParticipanteEventos.insert(participanteEventos);
		Eventos.update({ _id: evento }, { $set: { con: Number(c) } })

		return true;

	},
	removeParticipanteEventos: function (evento_id, participante_id) {
		ParticipanteEventos.remove({ _id: participante_id, evento_id: evento_id });
		return true;
	},
	getEventosParticipante: function (id) {

		var eventos = ParticipanteEventos.find({ participante_id: id }).fetch();
		_.each(eventos, function (pe) {
			var evento = Eventos.findOne(pe.evento_id);
			pe.evento = evento.nombre;

			var deporte = Deportes.findOne(pe.deporte_id);
			pe.deporte = deporte.nombre;

			var categoria = Categorias.findOne(pe.categoria_id);
			pe.categoria = categoria.nombre;

			var rama = Ramas.findOne(pe.rama_id);
			pe.rama = rama.nombre;
			pe.pruebasArreglo = "";

			_.each(pe.pruebas, function (prueba_id) {
				var p = Pruebas.findOne(prueba_id);
				pe.pruebasArreglo += p.nombre + ", ";
			})

		})

		return eventos;

	},
	getParticipanteEventos: function (param) {
		const data = {};
		data.arreglo = [];
		data.arreglo = ParticipanteEventos.find({
			municipio_id: param.municipio_id,
			evento_id: param.evento_id,
			deporte_id: param.deporte_id,
			categoria_id: param.categoria_id,
			rama_id: param.rama_id,
			funcionEspecifica: param.funcionEspecifica
		}).map(p => {
			p.pruebasNombre = [];
			const partcipante = Participantes.findOne(p.participante_id);
			if (partcipante != undefined) {
				p.nombre = partcipante.nombre;
				p.apellidoPaterno = partcipante.apellidoPaterno;
				p.apellidoMaterno = partcipante.apellidoMaterno;
				p.fechaNacimiento = partcipante.fechaNacimiento;
				p.sexo = partcipante.sexo;
				p.curp = partcipante.curp;
				p.foto = partcipante.foto;
				p.imprimir = true;
				// if (p.pruebas != undefined && p.pruebas.length > 0) {
				// 	p.pruebas.forEach(t => {
				// 		const prueba = Pruebas.findOne(t);
				// 		p.pruebasNombre.push({ nombre: prueba.nombre })
				// 	})
				// }
			}
			else {
				ParticipanteEventos.remove({ _id: p._id })
			}
			return p;
		});
		return data;
	},
});