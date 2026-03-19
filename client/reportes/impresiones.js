angular
	.module('insude')
	.controller('ImpresionesCtrl', ImpresionesCtrl);

function ImpresionesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
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

	this.tieneFoto = function (sexo, foto) {
		if (foto === undefined) {
			if (sexo === "Masculino")
				return "img/badmenprofile.jpeg";
			else if (sexo === "Femenino") {
				return "img/badgirlprofile.jpeg";
			} else {
				return "img/badprofile.jpeg";
			}

		} else {
			return foto;
		}
	}

	this.download = function (op) {

		var p = rc.participantes.filter(function (ele) {
			return ele.imprimir === true;
		});

		if (p.length == 0) {
			toastr.error("No hay participantes seleccionados para imprmir");
			return;
		}


		if (op == 1) {
			$("#credencial").prop("disabled", true);
			const param = {};
			param.municipio_id = rc.evento.municipio_id;
			param.evento_id = rc.evento.evento_id;
			param.deporte_id = rc.evento.deporte_id;
			param.categoria_id = rc.evento.categoria_id;
			param.rama_id = rc.evento.rama_id;
			param.funcionEspecifica = rc.evento.funcionEspecifica;
			param.participantes = p;
			loading(true);
			Meteor.call('getCredenciales', param, function (error, file) {
				if (!error) {
					loading(false);
					downloadFile(file);
					toastr.success('Listo.');
				}
				else {
					loading(false);
					console.log(err)
					toastr.warning("Error al generar el reporte");
					$("#credencial").prop("disabled", false);
				}
			});
		}
		else if (op == 2) {
			$("#gafete").prop("disabled", true);
			const param = {};
			param.municipio_id = rc.evento.municipio_id;
			param.evento_id = rc.evento.evento_id;
			param.deporte_id = rc.evento.deporte_id;
			param.categoria_id = rc.evento.categoria_id;
			param.rama_id = rc.evento.rama_id;
			param.funcionEspecifica = rc.evento.funcionEspecifica;
			param.participantes = p;
			loading(true);
			Meteor.call('getGafetes', param, function (err, file) {
				if (!err) {
					loading(false);
					downloadFile(file);
					toastr.success('Listo.');
					$("#gafete").prop("disabled", false);
				} else {
					loading(false);
					console.log(err)
					toastr.warning("Error al generar el reporte");
					$("#gafete").prop("disabled", false);
				}
			});
		}
	};

	this.buscar = async function (form) {

		// if (form.$invalid) {
		// 	toastr.error('Seleccione todos los campos.');
		// 	return;
		// }
		rc.participantes = [];

		loading(true);
		const param = {};
		param.evento_id = rc.evento.evento_id;
		param.deporte_id = rc.evento.deporte_id;
		param.categoria_id = rc.evento.categoria_id;
		param.rama_id = rc.evento.rama_id;
		param.municipio_id = rc.evento.municipio_id;
		param.funcionEspecifica = rc.evento.funcionEspecifica;
		const r = await Meteor.callSync("getParticipanteEventos", param);
		console.log(r);
		rc.participantes = r.arreglo;
		$scope.$apply();

		loading(false);

	}

	this.cambiar = function () {
		const chkImprimir = document.getElementById('todos');
		rc.participantes.forEach(p => {
			p.imprimir = chkImprimir.checked;
		})
	};

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
