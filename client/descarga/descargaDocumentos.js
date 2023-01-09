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


	// this.action = true;
	// this.participante = {};
	// this.participante.profile = {};
	// this.buscar = {};
	// this.evento = {};
	// this.buscar.nombre = '';
	// this.validation = false;


	// let part = this.subscribe('participanteEventos', () => {
	// 	return [{
	// 		municipio_id: this.getReactively('evento.municipio_id') != undefined ? this.getReactively('evento.municipio_id') : ""
	// 		, evento_id: this.getReactively('evento.evento_id') != undefined ? this.getReactively('evento.evento_id') : ""
	// 		, deporte_id: this.getReactively('evento.deporte_id') != undefined ? this.getReactively('evento.deporte_id') : ""
	// 		, categoria_id: this.getReactively('evento.categoria_id') != undefined ? this.getReactively('evento.categoria_id') : ""
	// 		, rama_id: this.getReactively('evento.rama_id') != undefined ? this.getReactively('evento.rama_id') : ""
	// 	}]
	// });


	// if (Meteor.user().roles[0] == 'admin') {
	// 	this.subscribe('municipios', () => {
	// 		return [{ estatus: true }]
	// 	});
	// }
	// else if (Meteor.user().roles[0] == 'DelegadoMunicipal') {
	// 	this.subscribe('municipios', () => {
	// 		return [{ _id: Meteor.user().profile.municipio_id }]
	// 	});
	// }


	// this.subscribe('eventos', () => {
	// 	return [{ estatus: true }]
	// });

	// this.subscribe('deportes', () => {
	// 	return [{
	// 		evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : ""
	// 		, estatus: true
	// 	}]
	// });

	// this.subscribe('categorias', () => {
	// 	return [{
	// 		evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : ""
	// 		, deporte_id: this.getReactively('evento.deporte_id') != undefined ? this.getReactively('evento.deporte_id') : ""
	// 		, estatus: true
	// 	}]
	// });

	// this.subscribe('pruebas', () => {
	// 	return [{
	// 		evento_id: this.getReactively('evento.evento_id') ? this.getReactively('evento.evento_id') : ""
	// 		, estatus: true
	// 	}]
	// });

	// this.subscribe('ramas', () => {
	// 	return [{ estatus: true }]
	// });


	// this.helpers({
	// 	participantes: () => {
	// 		return ParticipanteEventos.find();
	// 	},
	// 	municipios: () => {
	// 		return Municipios.find({}, { sort: { nombre: 1 } });
	// 	},
	// 	eventos: () => {
	// 		return Eventos.find();
	// 	},
	// 	deportes: () => {
	// 		return Deportes.find({}, { sort: { nombre: 1 } });
	// 	},
	// 	categorias: () => {
	// 		return Categorias.find({}, { sort: { nombre: 1 } });
	// 	},
	// 	pruebas: () => {
	// 		return Pruebas.find({}, { sort: { nombre: 1 } });
	// 	},
	// 	ramas: () => {
	// 		return Ramas.find();
	// 	},
	// 	todosParticipantes: () => {
	// 		if (part.ready()) {
	// 			_.each(rc.participantes, function (participante) {
	// 				participante.municipio = Municipios.findOne(participante.municipio_id);
	// 				participante.evento = Eventos.findOne(participante.evento_id);
	// 				participante.deporte = Deportes.findOne(participante.deporte_id);
	// 				participante.categoria = Categorias.findOne(participante.categoria_id);

	// 				participante.pruebasNombre = [];
	// 				_.each(participante.pruebas, function (prueba) {
	// 					participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields: { nombre: 1 } }))
	// 				})

	// 			})
	// 		}
	// 	}

	// });




	// this.download = function (p, op) {
	// 	var participante = {};
	// 	loading(true);
	// 	Meteor.call('getParticipanteDocumento', p.participante_id, op, function (error, response) {
	// 		if (error) {
	// 			console.log('ERROR :', error);
	// 			loading(false);
	// 			return;
	// 		} else {
	// 			//console.log(response);
	// 			var data;
	// 			data = response.data;

	// 			if (data.indexOf("application") > 0) {
	// 				//console.log("entro pdf");
	// 				var pdf = 'data:application/octet-stream;base64,';
	// 				var d = data.replace('data:application/pdf;base64,', '');
	// 				var dlnk = document.getElementById('dwnldLnk');
	// 				if (op == 1) {
	// 					dlnk.download = response.curp + ".pdf";
	// 				}
	// 				else if (op == 2) {
	// 					dlnk.download = response.curp + "-AN.pdf";
	// 				}
	// 				else if (op == 3) {
	// 					dlnk.download = response.curp + "-Ide.pdf";
	// 				}
	// 				dlnk.href = pdf + d;
	// 				dlnk.click();
	// 			}
	// 			else if (data.indexOf("image") > 0) {
	// 				//console.log("entro jpg");
	// 				var jpeg = 'data:image/jpeg;base64,';
	// 				var d = data.replace('data:image/jpeg;base64,', '');
	// 				var dlnk = document.getElementById('dwnldLnk');

	// 				if (op == 1) {
	// 					dlnk.download = response.curp + ".jpeg";
	// 				}
	// 				else if (op == 2) {
	// 					dlnk.download = response.curp + "-AN.jpeg";
	// 				}
	// 				else if (op == 3) {
	// 					dlnk.download = response.curp + "-Ide.jpeg";
	// 				}
	// 				dlnk.href = jpeg + d;
	// 				dlnk.click();
	// 			}
	// 			else {
	// 				console.log("no entro")
	// 			}
	// 			loading(false);
	// 		}
	// 	});
	// };

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
		const r = await Meteor.callSync("getParticipantesEventosDocumentos", param);
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

	$(function () {
		rc.cargarDatos();
	});


};
