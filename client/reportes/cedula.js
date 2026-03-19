angular
	.module('insude')
	.controller('CedulaCtrl', CedulaCtrl);

function CedulaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	Window.rc = rc;

	this.action = true;
	this.participante = {};
	this.participante.profile = {};
	this.buscar = {};
	this.evento = {};
	this.buscar.nombre = '';
	this.validation = false;
	this.deporteNombre = "";
	this.categoriaNombre = "";

	rc.municipios = [];


	this.download = function () {

		if (rc.arreglo.length == 0) {
			toastr.error("No hay registros para generar cédula");
			return;
		}


		$("#cedula").prop("disabled", true);

		const param = {};
		param.evento_id = rc.evento.evento_id;
		param.deporte_id = rc.evento.deporte_id;
		param.categoria_id = rc.evento.categoria_id;
		param.rama_id = rc.evento.rama_id;
		param.funcionEspecifica = rc.evento.funcionEspecifica;
		if (Meteor.user().roles[0] == "admin") {
			param.municipio_id = rc.evento.municipio_id;
		}
		else
			param.municipio_id = Meteor.user().profile.municipio_id;

		loading(true);
		Meteor.call('getCedula', param, function (err, file) {
			if (!err) {
				loading(false);
				downloadFile(file);
				toastr.success('Listo.');
			} else {
				loading(false);
				console.log(err)
				toastr.warning("Error al generar el reporte");
			}
		});

	};

	this.buscar = async function () {
		const param = {};
		param.evento_id = rc.evento.evento_id;
		param.deporte_id = rc.evento.deporte_id;
		param.categoria_id = rc.evento.categoria_id;
		param.rama_id = rc.evento.rama_id;
		if (Meteor.user().roles[0] == "admin") {
			param.municipio_id = rc.evento.municipio_id;
		}
		else
			param.municipio_id = Meteor.user().profile.municipio_id;

		param.funcionEspecifica = rc.evento.funcionEspecifica;
		const r = await Meteor.callSync("getParticipantesEventosCedula", param);
		console.log(r);
		rc.arreglo = r.arreglo;
		$scope.$apply();
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

	this.seleccionaEvento = async function (evento_id) {
		rc.deportes = await Meteor.callSync("getDeportes", evento_id);
		$scope.$apply();
	}

	this.seleccionaDeporte = async function (evento_id, deporte_id) {
		const param = {};
		param.evento_id = evento_id;
		param.deporte_id = deporte_id;
		rc.categorias = await Meteor.callSync("getCategorias", param);
		$scope.$apply();
	}

	rc.cargarDatos = async function () {
		rc.eventos = await Meteor.callSync("getEventosActivos");
		rc.ramas = await Meteor.callSync("getRamas");
		rc.municipios = await Meteor.callSync("getMunicipios");
		$scope.$apply();
	}

	$(function () {
		rc.cargarDatos();
	});

};	
