angular
	.module('insude')
	.controller('ParticipantesCtrl', ParticipantesCtrl);

function ParticipantesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	window.rc = rc;

	this.action = true;
	this.participante = {};
	this.participante.profile = {};
	this.buscar = {};
	this.buscar.nombre = '';
	this.validation = false;


	this.subscribe('buscarNombreNuevo', () => {
		if ((Meteor.user().roles[0] == 'admin') && (this.getReactively('buscar.municipio_id') == undefined))
			return;
		if (this.getReactively('buscar.nombre') == "")
			return;

		if (this.getReactively("buscar.nombre").length > 4) {

			return [{
				options: { limit: 8 },
				where: {
					municipio_id: ((Meteor.user().roles[0] == 'admin') && (this.getReactively('buscar.municipio_id') != undefined))
						? this.getReactively('buscar.municipio_id')
						: Meteor.user().profile.municipio_id,
					nombreCompleto: this.getReactively('buscar.nombre')
				}
			}];
		}
	});

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
	});


	this.helpers({
		participantes: () => {
			return Participantes.find();
		},
		municipios: () => {
			return Municipios.find({}, { sort: { nombre: 1 } });
		},
	});

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

};	
