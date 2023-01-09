angular
	.module('insude')
	.controller('listadoCtrl', listadoCtrl);

function listadoCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	let rc = $reactive(this).attach($scope);
	window.rc = rc;

	this.municipios = [];
	this.evento = {};
	this.evento.deporte_id = "";
	this.reset = function () {
		rc.evento = {};
		rc.evento.deporte_id = "";
	}

	this.seleccionaEvento = async function (evento_id) {
		rc.deportes = await Meteor.callSync("getDeportes", evento_id);
		$scope.$apply();
	}

	rc.cargarDatos = async function () {
		rc.eventos = await Meteor.callSync("getEventosActivos");
		if (Meteor.user() && Meteor.user().roles[0] == "admin") {
			rc.municipios = await Meteor.callSync("getMunicipios");
		}

		$scope.$apply();
	}

	this.buscar = async function () {
		const param = {};
		param.evento_id = rc.evento.evento_id;
		param.deporte_id = rc.evento.deporte_id;
		if (Meteor.user().roles[0] == "admin") {
			param.municipio_id = rc.evento.municipio_id;
		}
		else {
			param.municipio_id = Meteor.user().profile.municipio_id;
		}
		loading(true);
		const r = await Meteor.callSync("getParticipantesEventosListado", param);
		loading(false);
		rc.arreglo = r.arreglo;
		$scope.$apply();
	}

	this.exportarExcel = function () {

		const participantesArray = [];
		let con = 1;
		rc.arreglo.forEach(participante => {
			participantesArray.push([con,
				participante.nombre,
				participante.apellidoPaterno,
				participante.apellidoMaterno,
				(participante.fechaNacimiento.getUTCDate() + "/" + (participante.fechaNacimiento.getUTCMonth() + 1) + "/" + participante.fechaNacimiento.getUTCFullYear()),
				participante.curp,
				participante.deporte,
				participante.categoria,
				participante.rama,
				participante.municipio,
				participante.funcionEspecifica]);
			con++;
		});

		console.log(participantesArray)
		loading(true);
		Meteor.call('getExcel', participantesArray, function (error, file) {
			if (error) {
				console.log('ERROR :', error);
				return;
			} else {
				downloadFile(file);
				loading(false);
			}
		});
	}

	$(function () {
		rc.cargarDatos();
	});

};	
