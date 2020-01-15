angular
	.module('insude')
	.controller('listadoCtrl', listadoCtrl);

function listadoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	window.rc = rc;



	this.action = true;
	this.participante = {};
	this.participante.profile = {};
	this.buscar = {};
	this.evento = {};
	this.buscar.nombre = '';
	this.validation = false;
	this.eventoNombre = "";
	this.deporteNombre = "";
	this.categoriaNombre = "";


	let part = this.subscribe('participanteListado', () => {

		if (this.getReactively('evento.municipio_id') != undefined && this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') == undefined) {
			//console.log("entro 1");
			return [{
				evento_id: this.getReactively('evento.evento_id') != undefined ? this.getReactively('evento.evento_id') : ""
				, municipio_id: this.getReactively('evento.municipio_id')
			}];
		} else if (this.getReactively('evento.municipio_id') != undefined && this.getReactively('evento.evento_id') != undefined && this.getReactively('evento.deporte_id') != undefined) {
			//console.log("entro 2");
			return [{
				evento_id: this.getReactively('evento.evento_id') != undefined ? this.getReactively('evento.evento_id') : ""
				, municipio_id: this.getReactively('evento.municipio_id')
				, deporte_id: this.getReactively('evento.deporte_id') != undefined ? this.getReactively('evento.deporte_id') : ""
			}];


		}
	});

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
	});

	this.subscribe('eventos', () => {
		return [{ estatus: true }]
	});

	this.subscribe('deportes', () => {
		return [{
			evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : ""
			, estatus: true
		}]
	});

	this.subscribe('categorias', () => {
		return [{
			evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : "",
			deporte_id: this.getReactively('evento.deporte_id') != undefined ? this.getReactively('evento.deporte_id') : "",
			estatus: true
		}]
	});

	this.subscribe('pruebas', () => {
		return [{
			evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : "",
			estatus: true
		}]
	});

	this.subscribe('ramas', () => {
		return [{ estatus: true }]
	});

	this.helpers({
		participantes: () => {
			return ParticipanteEventos.find();
		},
		municipios: () => {
			return Municipios.find({}, { sort: { nombre: 1 } });
		},
		eventos: () => {
			return Eventos.find({}, { sort: { fechainicio: -1 } });
		},
		deportes: () => {
			return Deportes.find({}, { sort: { nombre: 1 } });
		},
		categorias: () => {
			return Categorias.find({}, { sort: { nombre: 1 } });
		},
		ramas: () => {
			return Ramas.find({}, { sort: { nombre: 1 } });
		},
		pruebas: () => {
			return Pruebas.find({}, { sort: { nombre: 1 } });
		},

	});

	this.download = function (participantes) {

		if (participantes.length == 0) {
			toastr.error("No hay participantes para generar cédula");
			return;
		}


		var participantesArray = [];
		participantesArray.push(["NUM", "NOMBRE", "APELLIDO PATERNO", "APELLIDO MATERNO", "FECHA NACIMIENTO", "CURP", "DEPORTE", "CATEGORIA", "RAMA", "MUNICIPIO", "FUNCION ESPECIFICA"]);
		var con = 1;
		_.each(rc.participantes, function (participante) {


			if (participante.municipio_id != "s/a") {
				var m = Municipios.findOne(participante.municipio_id);
				participante.municipio = m.nombre;
			}
			else
				participante.municipio = "";

			if (participante.evento_id != "s/a") {
				var e = Eventos.findOne(participante.evento_id);
				participante.evento = e.nombre;
			}
			else
				participante.evento = "";

			if (participante.deporte_id != "s/a") {
				var d = Deportes.findOne(participante.deporte_id);
				participante.deporte = d.nombre;
			}
			else
				participante.deporte = "Sin Deporte";

			if (participante.categoria_id != "s/a") {
				var c = Categorias.findOne(participante.categoria_id);
				participante.categoria = c.nombre;
			}
			else
				participante.categoria = "Sin Categoría";

			if (participante.rama_id != "s/a") {
				var r = Ramas.findOne(participante.rama_id);
				participante.rama = r.nombre;
			}
			else
				participante.rama = "Sin Rama";

			participantesArray.push([con, participante.nombre, participante.apellidoPaterno, participante.apellidoMaterno, (participante.fechaNacimiento.getUTCDate() + "/" + (participante.fechaNacimiento.getUTCMonth() + 1) + "/" + participante.fechaNacimiento.getUTCFullYear()), participante.curp, participante.deporte, participante.categoria, participante.rama, participante.municipio, participante.funcionEspecifica]);
			con++;
		})


		Meteor.call('getExcel', participantesArray, function (error, response) {
			if (error) {
				console.log('ERROR :', error);
				return;
			} else {

				var pdf = 'data:application/xlsx;base64,';
				var dlnk = document.getElementById('dwnldLnk');
				dlnk.download = 'Lista.xlsx';
				dlnk.href = pdf + response;
				dlnk.click();
			}
		});

	};

	this.reset = function () {
		rc.evento = {};
	}

	this.tieneFoto = function (sexo, foto) {
		if (foto === undefined) {
			if (sexo === "Hombre")
				return "img/badmenprofile.jpeg";
			else if (sexo === "Mujer") {
				return "img/badgirlprofile.jpeg";
			} else {
				return "img/badprofile.jpeg";
			}

		} else {
			return foto;
		}
	}

};	
