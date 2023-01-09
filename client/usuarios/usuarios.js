angular
	.module("insude")
	.controller("UsuariosCtrl", UsuariosCtrl);
function UsuariosCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

	this.action = true;
	this.subscribe('usuarios', () => {
		return [{}]
	});

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
	});

	this.helpers({
		usuarios: () => {
			return Meteor.users.find({ "profile.nombre": { $ne: "Super Administrador" } });
		},
		municipios: () => {
			return Municipios.find();
		}
	});

	this.nuevo = true;
	this.nuevoUsuario = function () {
		this.action = true;
		this.nuevo = !this.nuevo;
		this.usuario = {};
	};

	this.guardar = function (usuario, form) {
		if (form.$invalid) {
			toastr.error('Error al guardar los datos.');
			return;
		}

		usuario.profile.estatus = true;
		usuario.profile.usuarioInserto = Meteor.userId();
		Meteor.call('createUsuario', usuario, usuario.profile.tipo);
		toastr.success('Guardado correctamente.');
		this.usuario = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
		form.$setPristine();
		form.$setUntouched();
		$state.go('root.usuarios');

	};

	this.editar = function (id) {
		this.usuario = Meteor.users.findOne({ _id: id });
		this.action = false;
		$('.collapse').collapse('show');
		this.nuevo = false;
	};

	this.actualizar = function (usuario, form) {
		if (form.$invalid) {
			toastr.error('Error al guardar los datos.');
			return;
		}

		//var idTemp = usuario._id;
		//delete usuario._id;		
		usuario.profile.usuarioActualizo = Meteor.userId();
		//Usuarios.update({_id:idTemp},{$set:usuario});
		Meteor.call('updateUsuario', usuario, usuario.profile.tipo);
		toastr.success('Actualizado correctamente.');
		$('.collapse').collapse('hide');
		this.nuevo = true;
		form.$setPristine();
		form.$setUntouched();
		$state.go('root.usuarios');
	};

	this.cambiarEstatus = async function (usuario) {
		const r = await Meteor.callSync('setEstatusUsuario', { _id: usuario._id, estatus: usuario.profile.estatus });
	};

	this.getMunicipio = function (municipio_id) {
		var municipio = Municipios.findOne({ _id: municipio_id });
		if (municipio)
			return municipio.nombre;
	};

};