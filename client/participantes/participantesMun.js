angular
	.module('insude')
	.controller('ParticipantesMunCtrl', ParticipantesMunCtrl);

function ParticipantesMunCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	window.rc = rc;

	this.action = true;
	this.participante = {};

	this.buscar = {};
	this.buscar.nombre = '';

	rc.objeto = {};


	this.subscribe('buscarPorNombreCompleto', () => {

		if (this.getReactively('buscar.nombre') == "")
			return;

		if (this.getReactively("buscar.nombre").length > 4) {
			return [{
				options: { limit: 10 },
				where: {
					nombreCompleto: this.getReactively('buscar.nombre')
				}
			}];
		}
	});

	this.subscribe('municipios', () => {
		return [{}];
	});

	this.helpers({
		participantes: () => {

			var arreglo = Participantes.find().fetch();
			if (arreglo != undefined) {
				_.each(arreglo, function (p) {
					var m = Municipios.findOne({ _id: p.municipio_id });
					if (m) {
						p.municipio = m.nombre;
					}
				});
			}
			return arreglo;
		},
		municipios: () => {
			return Municipios.find({}, { sort: { nombre: 1 } });
		},
	});


	this.mostrarModal = function (objeto) {
		rc.objeto = objeto;
		$("#modalMunicipio").modal('show');
	};

	this.actualizar = function (objeto) {
		Meteor.call("setMunicipio", objeto._id, objeto.municipio_id, function (error, result) {
			if (error) {
				console.log(error);
				toastr.error('Error al guardar los datos.: ', error.details);
				return
			}
			if (result) {
				toastr.success('Actualizado Correctamente: ');
			}
		});
		$("#modalMunicipio").modal('hide');

	};

};	
