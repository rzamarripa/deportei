
Meteor.methods({

	getGafetes: function (dato) {

		var fs = require('fs');
		var future = require('fibers/future');
		var res = new future();
		var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')

		var meteor_root = require('fs').realpathSync(process.cwd() + '/../');

		var produccion = "";
		var produccionFotos = "";
		var produccionDescargas = "";

		if (Meteor.isDevelopment) {
			produccion = meteor_root + "/web.browser/app/archivos/";
			produccionFotos = meteor_root + "/web.browser/app/fotos/";
			produccionDescargas = meteor_root + "/web.browser/app/descargas/";
		} else {
			produccion = "/var/www/isde/archivos/";
			produccionFotos = "/var/www/isde/fotos/";
			produccionDescargas = "/var/www/isde/descargas/";
		}

		var opts = {}
		opts.centered = false;
		opts.getImage = function (tagValue, tagName) {
			var binaryData = fs.readFileSync(tagValue, 'binary');
			return binaryData;
		}

		opts.getSize = function (img, tagValue, tagName) {
			return [80, 80];
		}

		var imageModule = new ImageModule(opts);

		const evento = eventos.findOne({ _id: dato.evento_id });
		const munincipio = Municipios.findOne({ _id: dato.municipio_id });
		const depoirte = Deportes.findOne({ _id: dato.deporte_id });
		const categoria = Categorias.findOne({ _id: dato.categoria_id });
		const rama = Ramas.findOne({ _id: dato.rama_id });


		_.each(participantes, function (participante) {
			if (participante.foto != "") {

				var f = String(participante.foto);
				var tipo = f.substr(11, 4);
				if (tipo == 'jpeg') {
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".jpeg", bitmap);
					participante.foto = produccionFotos + participante.curp + ".jpeg";
				}
				else if (tipo == 'png;') {
					participante.foto = f.replace('data:image/png;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".png", bitmap);
					participante.foto = produccionFotos + participante.curp + ".png";
				}
			}

			if (participante.apellidoMaterno == undefined)
				participante.apellidoMaterno = "";


			var cons = "0000";
			if (participante.con < 10) {
				cons = "000".concat(participante.con.toString());
			}
			else if (participante.con < 100) {
				cons = "00".concat(participante.con.toString());
			}
			else if (participante.con < 1000) {
				cons = "0".concat(participante.con.toString());
			}
			else {
				cons = participante.con;
			}
			participante.con = cons;

			participante.municipio = mun.nombre;
			participante.deporte = dep.nombre;
			participante.categoria = cat.nombre;
			participante.rama = ram.nombre;

			participante.nombre = participante.nombre.toUpperCase();
			participante.apellidoPaterno = participante.apellidoPaterno.toUpperCase();
			participante.apellidoMaterno = participante.apellidoMaterno.toUpperCase();

		});

		var content;
		if (FE == "DEPORTISTA") {
			if (evento.nombreGafeteDeportista == undefined || evento.nombreGafeteDeportista == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteDeportista + ".docx", "binary");
		}
		else if (FE == "ENTRENADOR" || FE == "ENTRENADOR AUXILIAR" || FE == "DELEGADO POR DEPORTE" || FE == "AUXILIAR GENERAL" || FE == "ASOCIACIÓN") {
			if (evento.nombreGafeteEntrenador == undefined || evento.nombreGafeteEntrenador == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteEntrenador + ".docx", "binary");

		}
		else if (FE == "DELEGADO GENERAL" || FE == "JUEZ") {
			if (evento.nombreGafeteDelegadoGeneral == undefined || evento.nombreGafeteDelegadoGeneral == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteDelegadoGeneral + ".docx", "binary");

		}
		else if (FE == "DELEGADO AUXILIAR") {
			if (evento.nombreGafeteDelegadoAuxiliar == undefined || evento.nombreGafeteDelegadoAuxiliar == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteDelegadoAuxiliar + ".docx", "binary");

		}
		else if (FE == "JEFE DE MISIÓN" || FE == "OFICIAL") {
			if (evento.nombreGafeteOtros == undefined || evento.nombreGafeteOtros == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteOtros + ".docx", "binary");
		}
		else if (FE == "COMITÉ ORGANIZADOR") {
			if (evento.nombreGafeteComite == undefined || evento.nombreGafeteComite == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteComite + ".docx", "binary");
		}
		else {
			if (evento.nombreGafeteOtros == undefined || evento.nombreGafeteOtros == "")
				content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
			else
				content = fs.readFileSync(produccion + evento.nombreGafeteOtros + ".docx", "binary");

		}

		var zip = new JSZip(content);
		var doc = new Docxtemplater()
			.attachModule(imageModule)
			.loadZip(zip)

		doc.setData({ participantes })
		doc.render();
		var buf = doc.getZip()
			.generate({ type: "nodebuffer" });

		try {
			fs.writeFileSync(produccionDescargas + "gafeteSalida.docx", buf);
			var bitmap = fs.readFileSync(produccionDescargas + "gafeteSalida.docx");

			res['return']({ uri: 'data:application/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + bitmap.toString('base64'), nombre: archivo.archivoNombre });
			return res.wait();

		} catch (error) {
			console.log(error)
		}

	},

	getCredenciales: function (participantes, municipio, evento, FE, deporte, categoria, rama) {

		var fs = require('fs');
		var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')

		var meteor_root = require('fs').realpathSync(process.cwd() + '/../');

		var produccion = "";
		var produccionFotos = "";
		var produccionDescargas = "";

		if (Meteor.isDevelopment) {
			produccion = meteor_root + "/web.browser/app/archivos/";
			produccionFotos = meteor_root + "/web.browser/app/fotos/";
			produccionDescargas = meteor_root + "/web.browser/app/descargas/";
		} else {
			produccion = "/var/www/isde/archivos/";
			produccionFotos = "/var/www/isde/fotos/";
			produccionDescargas = "/var/www/isde/descargas/";
		}

		var opts = {}
		opts.centered = false;
		opts.getImage = function (tagValue, tagName) {
			var binaryData = fs.readFileSync(tagValue, 'binary');
			return binaryData;
		}

		opts.getSize = function (img, tagValue, tagName) {
			return [70, 90];
		}

		var imageModule = new ImageModule(opts);


		var evento = eventos.findOne({ _id: evento });
		var mun = Municipios.findOne({ _id: municipio });
		var dep = Deportes.findOne({ _id: deporte });
		var cat = Categorias.findOne({ _id: categoria });
		var ram = Ramas.findOne({ _id: rama });


		_.each(participantes, function (participante) {
			if (participante.foto != "") {

				var f = String(participante.foto);
				var tipo = f.substr(11, 4);
				if (tipo == 'jpeg') {
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".jpeg", bitmap);
					participante.foto = produccionFotos + participante.curp + ".jpeg";
				}
				else if (tipo == 'png;') {
					participante.foto = f.replace('data:image/png;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".png", bitmap);
					participante.foto = produccionFotos + participante.curp + ".png";
				}
			}

			if (participante.apellidoMaterno == undefined)
				participante.apellidoMaterno = "";


			participante.fechaNacimiento = `${participante.fechaNacimiento.getDate()}/${participante.fechaNacimiento.getMonth() + 1}/${participante.fechaNacimiento.getFullYear()}`;


			var cons = "0000";
			if (participante.con < 10) {
				cons = "000".concat(participante.con.toString());
			}
			else if (participante.con < 100) {
				cons = "00".concat(participante.con.toString());
			}
			else if (participante.con < 1000) {
				cons = "0".concat(participante.con.toString());
			}
			else {
				cons = participante.con;
			}
			participante.con = cons;

			participante.municipio = mun.nombre;
			participante.deporte = dep.nombre;
			participante.categoria = cat.nombre;
			participante.rama = ram.nombre;

			participante.nombre = participante.nombre.toUpperCase();
			participante.apellidoPaterno = participante.apellidoPaterno.toUpperCase();
			participante.apellidoMaterno = participante.apellidoMaterno.toUpperCase();

		});

		var content;


		if (evento.nombreCredencial == undefined || evento.nombreCredencial == "")
			content = fs.readFileSync(produccion + "sinDefinir.docx", "binary");
		else
			content = fs.readFileSync(produccion + evento.nombreCredencial + ".docx", "binary");


		var zip = new JSZip(content);
		var doc = new Docxtemplater()
			.attachModule(imageModule)
			.loadZip(zip)

		doc.setData({ participantes })

		doc.render();

		var buf = doc.getZip()
			.generate({ type: "nodebuffer" });

		fs.writeFileSync(produccionDescargas + "credencialSalida.docx", buf);


		//Pasar a base64
		// read binary data
		var bitmap = fs.readFileSync(produccionDescargas + "credencialSalida.docx");

		// convert binary data to base64 encoded string
		return new Buffer(bitmap).toString('base64');



	},

	getCedula: function (dato) {

		var fs = require('fs');
		var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module');
		var future = require('fibers/future');
		var res = new future();

		var meteor_root = Npm.require('fs').realpathSync(process.cwd() + '/../');

		var produccion = "";
		var produccionFotos = "";
		var produccionDescargas = "";

		//////////////////////////////////////////////////////////////////////////////////////////

		if (Meteor.isDevelopment) {
			produccion = meteor_root + "/web.browser/app/archivos/";
			produccionFotos = meteor_root + "/web.browser/app/fotos/";
			produccionDescargas = meteor_root + "/web.browser/app/descargas/";
		} else {
			produccion = "/var/www/isde/archivos/";
			produccionFotos = "/var/www/isde/fotos/";
			produccionDescargas = "/var/www/isde/descargas/";
		}
		//////////////////////////////////////////////////////////////////////////////////////////

		const participantes = ParticipanteEventos.find({
			evento_id: dato.evento_id
			, municipio_id: dato.municipio_id
			, deporte_id: dato.deporte_id
			, categoria_id: dato.categoria_id
			, rama_id: dato.rama_id
			, funcionEspecifica: dato.funcionEspecifica
		}).map(p => {

			let participante = Participantes.findOne({ _id: p.participante_id })
			p.nombre = participante.nombre;
			p.apellidoPaterno = participante.apellidoPaterno;
			p.apellidoMaterno = participante.apellidoMaterno;
			p.fechaNacimiento = `${participante.fechaNacimiento.getDate()}/${participante.fechaNacimiento.getMonth() + 1}/${participante.fechaNacimiento.getFullYear()}`;
			p.sexo = participante.sexo;
			p.curp = participante.curp;

			p.pruebasNombre = [];
			if (p.pruebas != undefined && p.pruebas.length > 0) {
				p.pruebas.forEach(t => {
					const prueba = Pruebas.findOne(t);
					p.pruebasNombre.push({ nombre: prueba.nombre })
				})
			}

			if (participante.foto != "") {
				participante.fechaNacimiento = participante.fechaNacimiento.getUTCDate() + "-" + (participante.fechaNacimiento.getUTCMonth() + 1) + "-" + participante.fechaNacimiento.getUTCFullYear();

				var f = String(participante.foto);

				var tipo = f.substr(11, 4);
				if (tipo == 'jpeg') {
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".jpeg", bitmap);
					p.foto = produccionFotos + participante.curp + ".jpeg";
				}
				else if (tipo == 'png;') {
					participante.foto = f.replace('data:image/png;base64,', '');
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					var bitmap = new Buffer(participante.foto, 'base64');
					//Usando Meteor_root
					fs.writeFileSync(produccionFotos + participante.curp + ".png", bitmap);
					p.foto = produccionFotos + participante.curp + ".png";
				}
			}

			return p;
		});

		// var Cantidad = participantes.length;
		// if (Cantidad % 8 != 0) {
		// 	//Completar cuantos faltan para ...
		// 	var modulo = Math.round(Cantidad % 8);
		// 	var faltantes = 8 - modulo;
		// 	for (var i = 1; i <= faltantes; i++) {
		// 		objFalatantes = { _id: "s/a" + i, foto: "", nombre: "-", apellidoPaterno: "-", apellidoMaterno: "-", sexo: "-", fechaNacimiento: "-", curp: "-", funcionEspecifica: "-", categoria: "-" };
		// 		participantes.push(objFalatantes);
		// 	}
		// }

		const evento = Eventos.findOne(dato.evento_id).nombre;
		const municipio = Municipios.findOne(dato.municipio_id).nombre;
		const deporte = Deportes.findOne(dato.deporte_id).nombre;
		const categoria = Categorias.findOne(dato.categoria_id).nombre;

		var opts = {}
		opts.centered = false;
		opts.getImage = function (tagValue, tagName) {
			var binaryData = fs.readFileSync(tagValue, 'binary');
			return binaryData;
		}

		opts.getSize = function (img, tagValue, tagName) {
			return [80, 80];
		}

		var imageModule = new ImageModule(opts);

		var content = fs
			.readFileSync(produccion + "cedula.docx", "binary");

		var zip = new JSZip(content);
		var doc = new Docxtemplater()
			.attachModule(imageModule)
			.loadZip(zip)

		var fecha = new Date();
		const f = fecha.getUTCDate() + '-' + (fecha.getUTCMonth() + 1) + '-' + fecha.getUTCFullYear();

		doc.setData({
			evento: evento,
			municipio: municipio,
			deporte: deporte,
			categoria: categoria,
			fechaEmision: f,
			participantes
		});

		doc.render();

		var buf = doc.getZip()
			.generate({ type: "nodebuffer" });


		try {
			fs.writeFileSync(produccionDescargas + "cedulaSalida.docx", buf);
			var bitmap = fs.readFileSync(produccionDescargas + "cedulaSalida.docx");

			res['return']({ uri: 'data:application/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + bitmap.toString('base64'), nombre: "cedulaSalida.docx" });
			return res.wait();

		} catch (error) {
			console.log(error)
		}


	},

	getExcel: function (participantes) {
		var fs = require('fs');
		var ws_name = "SheetJS";
		var future = require('fibers/future');
		var res = new future();

		var meteor_root = require('fs').realpathSync(process.cwd() + '/../');

		if (Meteor.isDevelopment) {
			var produccion = "/Users/alfonsoduarte/Documents/Meteor/isde/public";
		} else {
			var produccion = "/var/www/isde/archivos/";
		}

		var wscols = [
			{ wch: 5 },
			{ wch: 15 },
			{ wch: 18 },
			{ wch: 18 },
			{ wch: 20 },
			{ wch: 25 },
			{ wch: 15 },
			{ wch: 20 },
			{ wch: 10 },
			{ wch: 15 },
			{ wch: 20 }
		];

		if (typeof require !== 'undefined')
			XLSX = require('xlsx');

		var JSZip = require('jszip');

		function Workbook() {
			if (!(this instanceof Workbook)) return new Workbook();
			this.SheetNames = [];
			this.Sheets = {};
		}
		var wb = new Workbook();

		function datenum(v, date1904) {
			if (date1904) v += 1462;
			var epoch = Date.parse(v);
			return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
		}

		/* convert an array of arrays in JS to a CSF spreadsheet */
		function sheet_from_array_of_arrays(data, opts) {
			var ws = {};
			var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
			for (var R = 0; R != data.length; ++R) {
				for (var C = 0; C != data[R].length; ++C) {
					if (range.s.r > R) range.s.r = R;
					if (range.s.c > C) range.s.c = C;
					if (range.e.r < R) range.e.r = R;
					if (range.e.c < C) range.e.c = C;
					var cell = { v: data[R][C] };
					if (cell.v == null) continue;
					var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

					/* TEST: proper cell types and value handling */
					if (typeof cell.v === 'number') cell.t = 'n';
					else if (typeof cell.v === 'boolean') cell.t = 'b';
					else if (cell.v instanceof Date) {
						cell.t = 'n'; cell.z = XLSX.SSF._table[14];
						cell.v = datenum(cell.v);
					}
					else cell.t = 's';
					ws[cell_ref] = cell;
				}
			}

			/* TEST: proper range */
			if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
			return ws;
		}

		var ws = sheet_from_array_of_arrays(participantes);

		/* TEST: add worksheet to workbook */
		wb.SheetNames.push(ws_name);
		wb.Sheets[ws_name] = ws;

		/* TEST: column widths */
		ws['!cols'] = wscols;

		try {
			/* write file */
			XLSX.writeFile(wb, produccion + "sheetjs.xlsx");
			var bitmap = fs.readFileSync(produccion + "sheetjs.xlsx");
			res['return']({ uri: 'data:application/xlsx;base64,' + bitmap.toString('base64'), nombre: "sheetjs.xlsx" });
			return res.wait();

		} catch (error) {
			console.log(error)
		}

	},

	getArchivo: function (archivo) {
		var fs = require('fs');
		var future = require('fibers/future');
		var res = new future();
		try {
			var bitmap = fs.readFileSync(archivo.ruta);
			res['return']({ uri: `data:${archivo.archivoTipo};base64,` + bitmap.toString('base64'), nombre: archivo.archivoNombre });
			return res.wait();

		} catch (error) {
			console.log(error)
		}

	},

	getArchivoWord: function (archivo) {
		var fs = require('fs');
		var future = require('fibers/future');
		var res = new future();
		try {
			var bitmap = fs.readFileSync(archivo.ruta);
			res['return']({ uri: 'data:application/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + bitmap.toString('base64'), nombre: archivo.archivoNombre });
			return res.wait();

		} catch (error) {
			console.log(error)
		}

	},
});

