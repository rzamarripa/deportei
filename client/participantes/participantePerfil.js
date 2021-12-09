angular
	.module('insude')
	.controller('ParticipantePerfilCtrl', ParticipantePerfilCtrl);

function ParticipantePerfilCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);

	let rc = $reactive(this).attach($scope);

	window.rc = rc;

	rc.objeto = {};
	rc.eventos = [];

	this.subscribe('participante', () => {
		return [{ _id: $stateParams.id }]
	});

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
	});

	this.helpers({
		objeto: () => {
			var obj = Participantes.findOne();
			if (obj != undefined) {
				rc.eventos = [];

				var municipio = Municipios.findOne(obj.municipio_id);
				obj.municipio = municipio.nombre;

				Meteor.call('getEventosParticipante', obj._id, function (error, result) {
					if (result) {
						rc.eventos = result;
						$scope.$apply();
					}
				});
				return obj;
			}

		},
	});

	this.download = function (op) {
		var participante = {};
		loading(true);
		Meteor.call('getParticipanteDocumento', rc.objeto._id, op, function (error, response) {
			if (error) {
				console.log('ERROR :', error);
				loading(false);
				return;
			} else {

				var data;
				data = response.data;

				if (data.indexOf("application") > 0) {
					//console.log("entro pdf");
					var pdf = 'data:application/octet-stream;base64,';
					var d = data.replace('data:application/pdf;base64,', '');
					var dlnk = document.getElementById('dwnldLnk');
					if (op == 1) {
						dlnk.download = response.curp + ".pdf";
					}
					else if (op == 2) {
						dlnk.download = response.curp + "-AN.pdf";
					}
					else if (op == 3) {
						dlnk.download = response.curp + "-Ide.pdf";
					}
					dlnk.href = pdf + d;
					dlnk.click();
				}
				else if (data.indexOf("image") > 0) {
					//console.log("entro jpg");
					var jpeg = 'data:image/jpeg;base64,';
					var d = data.replace('data:image/jpeg;base64,', '');
					var dlnk = document.getElementById('dwnldLnk');

					if (op == 1) {
						dlnk.download = response.curp + ".jpeg";
					}
					else if (op == 2) {
						dlnk.download = response.curp + "-AN.jpeg";
					}
					else if (op == 3) {
						dlnk.download = response.curp + "-Ide.jpeg";
					}
					dlnk.href = jpeg + d;
					dlnk.click();
				}
				else {
					console.log("no entro")
				}
				loading(false);
			}
		});
	};

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

	this.abrirModal = function (op) {
		rc.curpImagen = "";
		rc.actaNacimiento = "";
		rc.identificacion = "";

		if (op == 1)
			$("#modalSubirCurp").modal('show');
		else if (op == 2)
			$("#modalSubirActa").modal('show');
		else if (op == 3)
			$("#modalSubirCredencial").modal('show');

	}

	this.actualizar = function (op) {
		
		var imagen = "";
		if (op == 1) {
			imagen = rc.curp;
		}
		else if (op == 2) {
			imagen = rc.actaNacimiento;
		}
		else if (op == 3) {
			imagen = rc.identificacion;
		}
		loading(true);
		Meteor.call('getActualizaDocumento', rc.objeto._id, imagen, op, function (error, result) {
			if (result) {
				if (op == 1) {
					$("#modalSubirCurp").modal('hide');
				}
				else if (op == 2) {
					$("#modalSubirActa").modal('hide');
				}
				else if (op == 3) {
					$("#modalSubirCredencial").modal('hide');
				}
				toastr.success("Actualizado correcmanete");
				loading(false);
			}
		});
	}

	this.AlmacenaImagen = function (imagen, tipo) {

		if (tipo == 1)
			rc.curpImagen = imagen;
		else if (tipo == 3)
			rc.actaNacimiento = imagen;
		else
			rc.identificacion = imagen;

	}

	$(document).ready(function () {


		$(".Mselect2").select2();

		var fileInputCurp = document.getElementById('fileInputCurp');
		var fileInputActa = document.getElementById('fileInputActa');
		var fileInputIdentificacion = document.getElementById('fileInputIdentificacion');


		//JavaScript para agregar el Curp Imagen
		fileInputCurp.addEventListener('change', function (e) {
			var file = fileInputCurp.files[0];

			var imageType;

			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;

			//console.log(imageType);

			if (file.type.match(imageType)) {

				if (file.size <= 1000000) {

					var reader = new FileReader();

					reader.onload = function (e) {

						rc.AlmacenaImagen(reader.result, 2);

					}
					reader.readAsDataURL(file);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}

			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}

		});

		//JavaScript para agregar el Acta Nacimiento
		fileInputActa.addEventListener('change', function (e) {
			var file = fileInputActa.files[0];

			//console.log(file.type);
			var imageType;

			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;

			if (file.type.match(imageType)) {

				if (file.size <= 1000000) {

					var reader = new FileReader();

					reader.onload = function (e) {

						rc.AlmacenaImagen(reader.result, 3);

					}
					reader.readAsDataURL(file);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}

			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}

		});

		//JavaScript para agregar el Identificacion Oficial
		fileInputIdentificacion.addEventListener('change', function (e) {
			var file = fileInputIdentificacion.files[0];

			var imageType;

			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;

			if (file.type.match(imageType)) {

				if (file.size <= 1000000) {

					var reader = new FileReader();

					reader.onload = function (e) {

						rc.AlmacenaImagen(reader.result, 4);

					}
					reader.readAsDataURL(file);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}

			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}

		});

	});



};	
