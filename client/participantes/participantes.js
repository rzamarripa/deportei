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
	this.buscar.municipio_id = '';
	this.validation = false;

	rc.numeroPagina = 0;
	rc.avance = 15;

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
	});


	this.helpers({
		// participantes: () => {
		// 	return Participantes.find();
		// },
		municipios: () => {
			return Municipios.find({}, { sort: { nombre: 1 } });
		},
	});
	


	this.modalNuevoParticipante = function () {
		rc.objeto = {};
		rc.objeto.estado = "SINALOA";
		$("#modalNuevoParticipante").modal('show');
	}

	this.guardarParticipante = async function (objeto, form) {

		if (form.$invalid) {
			toastr.error('Error al guardar los datos.');
			return;
		}

		if (objeto.foto == undefined) {
			toastr.error('Error no se ha cargado la foto del participante.');
			return;
		}

		const valida = await Meteor.callSync("getValidarParticipante", objeto.curp);
		if (valida.resultado) {
			toastr.error(`El partcipante con el curp ${objeto.curp} ya se encunetra dado de alta en ${valida.municipio}`);
			return;
		}

		if (Meteor.user().roles[0] == "admin") {
			if (rc.buscar.municipio_id == "") {
				toastr.error("Seleccione unMmunicipio");
				return;
			}
			objeto.municipio_id = rc.buscar.municipio_id;
		}
		else {
			objeto.municipio_id = Meteor.user().profile.municipio_id;
		}
		const r = await Meteor.callSync("setParticipante", objeto);
		if (r.resultado) {
			$("#modalNuevoParticipante").modal('hide');
			setTimeout(() => {
				toastr.success('Guardado correctamente.');
				$state.go('root.participantePerfil', { id: r._id });
			}, 1000);
		}
	}

	// this.ValidaCurpParticipante = function (curp) {
	// 	//console.log(curp);
	// 	loading(true);
	// 	Meteor.call('getParticipanteCurp', curp, function (error, response) {
	// 		if (error) {
	// 			console.log('ERROR :', error);
	// 			loading(false);
	// 			return;
	// 		} else {
	// 			if (response) {

	// 				toastr.info('El Participante ya se encuentra en la base de datos se cargara sus datos de Curp, Acta de Nacimiento e Identificación');
	// 				rc.participante = response;

	// 				fileDisplayArea1.innerHTML = "";

	// 				var img = new Image();

	// 				img.id = "fotoCargada";
	// 				img.src = rc.participante.foto;
	// 				img.width = 200;
	// 				img.height = 200;

	// 				fileDisplayArea1.appendChild(img);
	// 				loading(false);
	// 			}
	// 		}
	// 	});
	// }

	this.GeneraCurp = function (participante) {
		if (participante.nombre == undefined) {
			toastr.error('Falta proporcionar el nombre.');
			return;
		}

		if (participante.apellidoPaterno == undefined) {
			toastr.error('Falta proporcionar el apellido paterno.');
			return;

		}

		if (participante.fechaNacimiento == undefined) {
			toastr.error('Falta proporcionar la fecha de nacimiento.');
			return;

		}

		if (participante.sexo == undefined) {
			toastr.error('Falta proporcionar el sexo.');
			return;

		}

		if (participante.estado == undefined) {
			toastr.error('Falta seleccionar el estado.');
			return;

		}

		var curp = generaCurp({
			nombre: participante.nombre,
			apellido_paterno: participante.apellidoPaterno,
			apellido_materno: participante.apellidoMaterno,
			sexo: participante.sexo == 'Hombre' ? 'H' : 'M',
			estado: Estado(participante.estado),
			fecha_nacimiento: [participante.fechaNacimiento.getUTCDate(), participante.fechaNacimiento.getUTCMonth() + 1, participante.fechaNacimiento.getUTCFullYear()]
		});

		participante.curp = curp;

		//this.ValidaCurpParticipante(curp);

	};

	function Estado(estado) {
		var e = '';
		switch (estado) {
			case 'AGUASCALIENTES': e = 'AS'; break;
			case 'BAJA CALIFORNIA NTE.': e = 'BC'; break;
			case 'BAJA CALIFORNIA SUR': e = 'BS'; break;
			case 'CAMPECHE': e = 'CC'; break;
			case 'COAHUILA': e = 'CL'; break;
			case 'COLIMA': e = 'CM'; break;
			case 'CHIAPAS': e = 'CS'; break;
			case 'CHIHUAHUA': e = 'CH'; break;
			case 'DISTRITO FEDERAL': e = 'DF'; break;
			case 'DURANGO': e = 'DG'; break;
			case 'GUANAJUATO': e = 'GT'; break;
			case 'GUERRERO': e = 'GR'; break;
			case 'HIDALGO': e = 'HG'; break;
			case 'JALISCO': e = 'JC'; break;
			case 'MEXICO': e = 'MC'; break;
			case 'MICHOACAN': e = 'MN'; break;
			case 'NAYARIT': e = 'NT'; break;
			case 'NUEVO LEON': e = 'NL'; break;
			case 'PUEBLA': e = 'PL'; break;
			case 'QUERETARO': e = 'QT'; break;
			case 'QUINTANA ROO': e = 'QR'; break;
			case 'SAN LUIS POTOSI': e = 'SP'; break;
			case 'SINALOA': e = 'SL'; break;
			case 'SONORA': e = 'SR'; break;
			case 'TABASCO': e = 'TC'; break;
			case 'TAMAULIPAS': e = 'TS'; break;
			case 'TLAXCALA': e = 'TL'; break;
			case 'VERACRUZ': e = 'VZ'; break;
			case 'YUCATAN': e = 'YN'; break;
			case 'ZACATECAS': e = 'ZS'; break;
			case 'SERV. EXTERIOR MEXICANO': e = 'SM'; break;
			case 'NACIDO EN EL EXTRANJERO': e = 'NE'; break;
		}

		return e;
	}

	this.AlmacenaImagen = function (imagen) {
		this.objeto.foto = imagen;
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

	rc.cargarDatos = function () {
		let options = {}

		if (rc.buscar.nombre.length >= 4) {

			if (Meteor.user().roles[0] == "admin") {
				if (rc.buscar.municipio_id == "") {
					toastr.error("Seleccione unMmunicipio");
					return;
				}

				options = {
					skip: rc.numeroPagina,
					limit: rc.avance,
					where: {
						municipio_id: rc.buscar.municipio_id,
						nombreCompleto: this.getReactively('buscar.nombre')
					}
				}
			}
			else {
				options = {
					skip: rc.numeroPagina,
					limit: rc.avance,
					where: {
						municipio_id: Meteor.user().profile.municipio_id,
						nombreCompleto: this.getReactively('buscar.nombre')
					}
				}
			}



			loading(true);
			Meteor.call('getBuscarParticipantes', options, function (error, result) {
				if (result) {
					rc.arreglo = result.arreglo;
					const cantidad = result.cantidad;
					const avance = Number(rc.avance);
					rc.paginas = cantidad % avance === 0
						? Math.trunc(cantidad / avance)
						: Math.trunc(cantidad / avance) + 1;
					console.log(rc.arreglo)
					$scope.$apply();
				}
				loading(false);
			});
		}
		else {
			rc.numeroPagina = 0;
			rc.avance = 15;
			rc.arreglo = [];
			$scope.$apply();
		}
	}

	$(function () {
		$(".Mselect2").select2();

		let fileInput1 = document.getElementById('fileInput1');
		// var fileInputCurp = document.getElementById('fileInputCurp');
		// var fileInputActa = document.getElementById('fileInputActa');
		// var fileInputIdentificacion = document.getElementById('fileInputIdentificacion');

		var fileDisplayArea1 = document.getElementById('fileDisplayArea1');


		//JavaScript para agregar la Foto
		fileInput1.addEventListener('change', function (e) {
			var file = fileInput1.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {

				if (file.size <= 512000) {

					var reader = new FileReader();

					reader.onload = function (e) {
						fileDisplayArea1.innerHTML = "";

						var img = new Image();

						img.id = "fotoCargada";
						img.src = reader.result;
						img.width = 200;
						img.height = 200;

						rc.AlmacenaImagen(reader.result);

						fileDisplayArea1.appendChild(img);

					}
					reader.readAsDataURL(file);
				} else {
					toastr.error("Error la Imagen supera los 512 KB");
					return;
				}

			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}
		});

		// //JavaScript para agregar el Curp Imagen
		// fileInputCurp.addEventListener('change', function (e) {
		// 	var file = fileInputCurp.files[0];

		// 	var imageType;

		// 	if (file.type == "application/pdf")
		// 		imageType = /application.*/;
		// 	else
		// 		imageType = /image.*/;

		// 	//console.log(imageType);

		// 	if (file.type.match(imageType)) {

		// 		if (file.size <= 1000000) {

		// 			var reader = new FileReader();

		// 			reader.onload = function (e) {

		// 				rc.AlmacenaImagen(reader.result, 2);

		// 			}
		// 			reader.readAsDataURL(file);
		// 		} else {
		// 			toastr.error("Error el archivo supera 1 MB");
		// 			return;
		// 		}

		// 	} else {
		// 		fileDisplayArea1.innerHTML = "File not supported!";
		// 	}

		// });

		// //JavaScript para agregar el Acta Nacimiento
		// fileInputActa.addEventListener('change', function (e) {
		// 	var file = fileInputActa.files[0];

		// 	//console.log(file.type);
		// 	var imageType;

		// 	if (file.type == "application/pdf")
		// 		imageType = /application.*/;
		// 	else
		// 		imageType = /image.*/;

		// 	if (file.type.match(imageType)) {

		// 		if (file.size <= 1000000) {

		// 			var reader = new FileReader();

		// 			reader.onload = function (e) {

		// 				rc.AlmacenaImagen(reader.result, 3);

		// 			}
		// 			reader.readAsDataURL(file);
		// 		} else {
		// 			toastr.error("Error el archivo supera 1 MB");
		// 			return;
		// 		}

		// 	} else {
		// 		fileDisplayArea1.innerHTML = "File not supported!";
		// 	}

		// });

		// //JavaScript para agregar el Identificacion Oficial
		// fileInputIdentificacion.addEventListener('change', function (e) {
		// 	var file = fileInputIdentificacion.files[0];

		// 	var imageType;

		// 	if (file.type == "application/pdf")
		// 		imageType = /application.*/;
		// 	else
		// 		imageType = /image.*/;

		// 	if (file.type.match(imageType)) {

		// 		if (file.size <= 1000000) {

		// 			var reader = new FileReader();

		// 			reader.onload = function (e) {

		// 				rc.AlmacenaImagen(reader.result, 4);

		// 			}
		// 			reader.readAsDataURL(file);
		// 		} else {
		// 			toastr.error("Error el archivo supera 1 MB");
		// 			return;
		// 		}

		// 	} else {
		// 		fileDisplayArea1.innerHTML = "File not supported!";
		// 	}

		// });

		let input = document.getElementById('buscar');
		let timeout = null;
		input.addEventListener('keyup', function (e) {
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				rc.cargarDatos();
			}, 500);
		});

	});

};	
