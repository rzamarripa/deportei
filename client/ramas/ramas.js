angular
	.module('insude')
	.controller('RamasCtrl', RamasCtrl);

function RamasCtrl($scope, $meteor, $reactive, $state, toastr) {
	$reactive(this).attach($scope);
	this.action = true;

	this.subscribe('ramas', () => {
		return [{}]
	});

	this.helpers({
		ramas: () => {
			return Ramas.find({}, { sort: { nombre: 1 } });
		}
	});

	this.nuevo = true;
	this.nuevoRama = function () {
		this.action = true;
		this.nuevo = !this.nuevo;
		this.rama = {};
	};

	this.guardar = function (rama, form) {
		if (form.$invalid) {
			toastr.error('Error al guardar los datos.');
			return;
		}

		rama.estatus = true;
		rama.usuarioInserto = Meteor.userId();
		Ramas.insert(rama);
		toastr.success('Guardado correctamente.');
		rama = {};
		$('.collapse').collapse('hide');
		this.nuevo = true;
		$state.go('root.ramas');
		form.$setPristine();
		form.$setUntouched();
	};

	this.editar = function (id) {
		this.rama = Ramas.findOne({ _id: id });
		this.action = false;
		$('.collapse').collapse('show');
		this.nuevo = false;
	};

	this.actualizar = function (rama, form) {
		if (form.$invalid) {
			toastr.error('Error al actualizar los datos.');
			return;
		}
		var idTemp = rama._id;
		delete rama._id;
		rama.usuarioActualizo = Meteor.userId();
		Ramas.update({ _id: idTemp }, { $set: rama });
		toastr.success('Actualizado correctamente.');
		//console.log(ciclo);
		$('.collapse').collapse('hide');
		this.nuevo = true;
		form.$setPristine();
		form.$setUntouched();
	};

	this.cambiarEstatus = function (id) {
		var rama = Ramas.findOne({ _id: id });
		if (rama.estatus == true)
			rama.estatus = false;
		else
			rama.estatus = true;

		Ramas.update({ _id: id }, { $set: { estatus: rama.estatus } });
	};
};