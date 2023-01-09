angular
	.module('insude')
	.controller('ParticipantePerfilCtrl', ParticipantePerfilCtrl);

function ParticipantePerfilCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	$reactive(this).attach($scope);
	let rc = $reactive(this).attach($scope);

	window.rc = rc;

	rc._id = $stateParams.id;
	rc.objeto = {};
	rc.eventos = [];

	this.subscribe('municipios', () => {
		return [{ estatus: true }]
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

	this.cargarDatos = async function () {
		const r = await Meteor.callSync("getParticipantePerfil", rc._id);
		rc.objeto = r.objeto;
		rc.arreglo = r.arreglo;
		$scope.$apply();
	}

	this.modalAgregarEvento = async function () {

		if (rc.objeto.actaNacimiento == "") {
			toastr.error("Antes de Agregar a un evento debe de subir el documento de Acta de Nacimiento");
			return;
		}
		if (rc.objeto.identificacion == "") {
			toastr.error("Antes de Agregar a un evento debe de subir el documento de Identificación");
			return;
		}
		if (rc.objeto.curpImagen == "") {
			toastr.error("Antes de Agregar a un evento debe de subir el documento de CURP");
			return;
		}

		rc.evento = {};
		rc.evento.participante_id = rc._id;
		rc.eventos = await Meteor.callSync("getEventosActivosInscribir");
		rc.ramas = await Meteor.callSync("getRamas");
		rc.deportes = [];
		rc.categorias = [];
		rc.pruebas = [];

		$scope.$apply();
		$("#modalAgregarEvento").modal('show');


	}

	this.guardarEventoParticipante = async function (objeto, form) {

		if (form.$invalid) {
			toastr.error('Error al guardar los datos.');
			return;
		}

		//Validar la categoria a la cual se mete
		if (objeto.funcionEspecifica == 'DEPORTISTA') {
			const categoria = await Meteor.callSync("getCategoria", objeto.categoria_id);
			const anioInicio = categoria.anioinicio;
			const anioFin = categoria.aniofin;
			const anioNacimiento = rc.objeto.fechaNacimiento.getFullYear();
			if (anioNacimiento <= anioInicio && anioNacimiento >= anioFin) {

			}
			else {
				toastr.error("La edad no corresponde a la categoria verificar por favor.")
				return;
			}
		}

		document.getElementById("grabarEvento").disabled = true;
		const r = await Meteor.callSync("setParticipanteEventos", objeto);

		if (r) {
			document.getElementById("grabarEvento").disabled = false;
			toastr.success("Agregado Correctamente.");
		}
		else {
			document.getElementById("grabarEvento").disabled = false;
			toastr.error("Error al agregar el evento.");
		}
		$("#modalAgregarEvento").modal('hide');
		rc.cargarDatos();
	}

	this.descargar = function (objeto) {
		const archivo = {};
		archivo.ruta = objeto.archivoRuta;
		archivo.archivoNombre = objeto.archivoNombre;
		archivo.archivoTipo = objeto.archivoTipo;

		loading(true);
		Meteor.call("getArchivo", archivo, function (error, response) {
			if (!error) {
				//console.log(response)
				downloadFile(response)
				loading(false);
			}
			else
				loading(true);

		})
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

	this.seleccionaCategoria = async function (evento_id, deporte_id, categoria_id, rama_id) {
		const param = {};
		param.evento_id = evento_id;
		param.deporte_id = deporte_id;
		param.categoria_id = categoria_id;
		param.rama_id = rama_id;
		rc.pruebas = await Meteor.callSync("getPruebas", param);
		console.log(rc.pruebas)
		$scope.$apply();
	}

	this.modalSubirCurp = function () {
		rc.archivo = undefined;
		$("#modalSubirCurp").modal('show');
	}

	this.modalSubirActa = function () {
		rc.archivo = undefined;
		$("#modalSubirActa").modal('show');
	}

	this.modalSubirCredencial = function () {
		rc.archivo = undefined;
		rc.fechaVencimiento = rc.objeto.identificacion.fechaVencimiento;
		$("#modalSubirCredencial").modal('show');
	}

	this.AlmacenaImagen = async function (base64, file) {
		rc.archivo = {};
		rc.archivo._id = rc._id;
		rc.archivo.archivoNombre = file.name;
		rc.archivo.archivoBase64 = base64.replace(`data:${file.type};base64,`, "");
		rc.archivo.tipo = file.type;
		rc.archivo.anio = rc.objeto.fechaNacimiento.getFullYear();
		rc.archivo.estaValidado = false;
	}

	this.AlmacenaFoto = function (imagen) {
		this.objeto.foto = imagen;
	}

	this.grabarArchivo = async function (opcion) {

		if (opcion == 3) {
			if (rc.fechaVencimiento == "" || rc.fechaVencimiento == undefined) {
				toastr.error("Seleccione la fecha de Vencieminto");
				return;
			}
			rc.archivo.fechaVencimiento = rc.fechaVencimiento;
		}

		if (rc.archivo == undefined) {
			toastr.error("No ha seleccionado ningun archivo");
			return;
		}

		rc.archivo.opcion = opcion;
		const r = await Meteor.callSync("setArchivo", rc.archivo);
		if (opcion == 1)
			$("#modalSubirCurp").modal('hide');
		else if (opcion == 2)
			$("#modalSubirActa").modal('hide');
		else if (opcion == 3) {
			$("#modalSubirCredencial").modal('hide');
		}
		rc.cargarDatos();

	}

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

	this.modalEditarParticipante = function () {
		rc.participante = rc.objeto;
		$("#modalEditarParticipante").modal('show');
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

		// const valida = await Meteor.callSync("getValidarParticipante", objeto.curp);
		// if (valida.resultado) {
		// 	toastr.error(`El partcipante con el curp ${objeto.curp} ya se encunetra dado de alta en ${valida.municipio}`);
		// 	return;
		// }

		const r = await Meteor.callSync("setParticipante", objeto);
		if (r) {
			$("#modalEditarParticipante").modal('hide');
			toastr.success('Guardado correctamente.');
			rc.cargarDatos();
		}
	}

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

	$(function () {

		rc.cargarDatos();

		$(".Mselect2").select2();

		let fileInput1 = document.getElementById('fileInput1');//Foto
		var fileInputCurp = document.getElementById('fileInputCurp');
		var fileInputActa = document.getElementById('fileInputActa');
		var fileInputIdentificacion = document.getElementById('fileInputIdentificacion');

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

						rc.AlmacenaFoto(reader.result);

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
		fileInputCurp.addEventListener('change', function (e) {
			const file = fileInputCurp.files[0];
			var imageType;
			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;
			if (file.type.match(imageType)) {
				if (file.size <= 1000000) {
					getBase64(file).then(
						data => pasarValor(data, file)
					);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}
			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}
		});

		// //JavaScript para agregar el Acta Nacimiento
		fileInputActa.addEventListener('change', function (e) {
			const file = fileInputActa.files[0];
			var imageType;
			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;
			if (file.type.match(imageType)) {
				if (file.size <= 1000000) {
					getBase64(file).then(
						data => pasarValor(data, file)
					);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}
			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}
		});

		// //JavaScript para agregar el Identificacion Oficial
		fileInputIdentificacion.addEventListener('change', function (e) {
			const file = fileInputIdentificacion.files[0];
			var imageType;
			if (file.type == "application/pdf")
				imageType = /application.*/;
			else
				imageType = /image.*/;
			if (file.type.match(imageType)) {
				if (file.size <= 1000000) {
					getBase64(file).then(
						data => pasarValor(data, file)
					);
				} else {
					toastr.error("Error el archivo supera 1 MB");
					return;
				}
			} else {
				fileDisplayArea1.innerHTML = "File not supported!";
			}
		});

		function getBase64(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			});
		}
		function pasarValor(b, f) {
			rc.AlmacenaImagen(b, f);
		}

	});



};	
