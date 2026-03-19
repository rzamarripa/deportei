angular
	.module('insude')
	.controller('descargaDocumentosCtrl', descargaDocumentosCtrl);

function descargaDocumentosCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	window.rc = rc;

	rc.eventos = [];
	rc.ramas = [];
	rc.municipios = [];
	rc.deportes = [];
	rc.categorias = [];

	this.evento = {};

	this.descargar = function (objeto) {
		const archivo = {};
		archivo.ruta = objeto.archivoRuta;
		archivo.archivoNombre = objeto.archivoNombre;
		archivo.archivoTipo = objeto.archivoTipo;
		loading(true);
		Meteor.call("getArchivo", archivo, function (error, response) {
			if (!error) {
				downloadFile(response)
				loading(false);
			}
			else
				loading(true);

		})
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

	this.buscar = async function () {
		const param = {};
		param.evento_id = rc.evento.evento_id;
		param.deporte_id = rc.evento.deporte_id;
		param.categoria_id = rc.evento.categoria_id;
		param.rama_id = rc.evento.rama_id;
		param.municipio_id = rc.evento.municipio_id;
		loading(true)
		const r = await Meteor.callSync("getParticipantesEventosDocumentos", param);
		loading(false)
		rc.arreglo = r.arreglo;
		$scope.$apply();
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

	this.validar = function (objeto, op, tipo) {
		let mensaje = tipo == 2 ? `Autorizar` : `Rechazar`;
		let tipoDocumento = op == 1 ? "CURP" : op == 2 ? "Carta de Consentimiento" : "Identificación";
		customConfirm(`¿Estás seguro de ${mensaje} el documento ${tipoDocumento} de ${objeto.nombreCompleto}?`, function () {
			loading(true);
			const param = {};
			param._id = objeto.participante_id;
			param.opcion = op;
			param.tipo = tipo;
			Meteor.call("setValidarDocumento", param, function (error, result) {
				if (error) {
					console.log(error);
					toastr.error('Error al validar los datos.');
					return
				}
				if (result) {
					toastr.success('Validado correctamente.');
					rc.buscar();
				}
			});
			loading(false);
		});

		// const param = {};
		// param.participante_id = objeto._id;
		// param.opcion = oj;
		// const r = await Meteor.callSync("setValidarDocumento", param);
		//$scope.$apply();
	}

	$(function () {
		rc.cargarDatos();
	});


};
