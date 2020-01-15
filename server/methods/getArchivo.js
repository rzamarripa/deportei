
Meteor.methods({
  
  getGafetes: function (participantes, municipio, evento, FE, deporte, categoria, rama) {
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		
	  var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		
		//var produccion = meteor_root+"/web.browser/app/archivos/";
		//var produccion = "/home/isde/archivos/";
		
		var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		
		var produccion 					= "";
		var produccionFotos 		= "";
		var produccionDescargas = "";
				
		if(Meteor.isDevelopment){
      produccion 					= meteor_root+"/web.browser/app/archivos/";
      produccionFotos 		= meteor_root+"/web.browser/app/fotos/";
      produccionDescargas = meteor_root+"/web.browser/app/descargas/";
    }else{
      produccion 					= "/home/isde/archivos/";
      produccionFotos 		= "/home/isde/fotos/";
      produccionDescargas = "/home/isde/descargas/";
    }
		

		var eve = Eventos.findOne({_id: evento});

		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [80,80];
		}
		
		var imageModule=new ImageModule(opts);
		
		
		var mun = Municipios.findOne({_id: municipio});
		var dep = Deportes.findOne({_id: deporte});
		var cat = Categorias.findOne({_id: categoria});
		var ram = Ramas.findOne({_id: rama});
		
		
		_.each(participantes, function(participante){
				if (participante.foto != "")
				{							
	
					var f = String(participante.foto);
					var tipo = f.substr(11,4);	
					if (tipo == 'jpeg')
					{						
							participante.foto = f.replace('data:image/jpeg;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".jpeg", bitmap);
							participante.foto = produccionFotos + participante.curp+".jpeg";	
					}
					else if (tipo == 'png;')
					{
							participante.foto = f.replace('data:image/png;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".png", bitmap);
							participante.foto = produccionFotos + participante.curp+".png";						
					}
				}
				
				if (participante.apellidoMaterno == undefined)
					 participante.apellidoMaterno = "";
					 
				
				var cons = "0000";
				if (participante.con < 10)
				{		
						cons = "000".concat(participante.con.toString());
				}		
				else if (participante.con < 100)
				{
						cons = "00".concat(participante.con.toString());
				}		
				else if (participante.con < 1000)
				{
						cons = "0".concat(participante.con.toString());		
				}		
				else
				{
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
		if (FE == "DEPORTISTA")	
		{
				if (eve.nombreGafeteDeportista == undefined || eve.nombreGafeteDeportista == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else		
						content = fs.readFileSync(produccion+eve.nombreGafeteDeportista+".docx", "binary");
		}	
		else if (FE == "ENTRENADOR" || FE == "ENTRENADOR AUXILIAR" || FE == "DELEGADO POR DEPORTE" || FE == "AUXILIAR GENERAL" || FE == "ASOCIACIÓN")
		{
				if (eve.nombreGafeteEntrenador == undefined || eve.nombreGafeteEntrenador == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else		
						content = fs.readFileSync(produccion+eve.nombreGafeteEntrenador+".docx", "binary");	
			
		}
		else if (FE == "DELEGADO GENERAL" || FE == "JUEZ")
		{
				if (eve.nombreGafeteDelegadoGeneral == undefined || eve.nombreGafeteDelegadoGeneral == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else		
						content = fs.readFileSync(produccion+eve.nombreGafeteDelegadoGeneral+".docx", "binary");	
			
		}
		else if (FE == "DELEGADO AUXILIAR")
		{
				if (eve.nombreGafeteDelegadoAuxiliar == undefined || eve.nombreGafeteDelegadoAuxiliar == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else		
						content = fs.readFileSync(produccion+eve.nombreGafeteDelegadoAuxiliar+".docx", "binary");	
			
		}
		else if (FE== "JEFE DE MISIÓN" || FE == "OFICIAL")
		{
				if (eve.nombreGafeteOtros == undefined || eve.nombreGafeteOtros == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else
						content = fs.readFileSync(produccion+eve.nombreGafeteOtros+".docx", "binary");
		}	
		else if (FE == "COMITÉ ORGANIZADOR")	
		{
				if (eve.nombreGafeteComite == undefined || eve.nombreGafeteComite == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else
						content = fs.readFileSync(produccion+eve.nombreGafeteComite+".docx", "binary");
	  }
	  else
	  {
		  	if (eve.nombreGafeteOtros == undefined || eve.nombreGafeteOtros == "")
						content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
				else
						content = fs.readFileSync(produccion+eve.nombreGafeteOtros+".docx", "binary");
		  
	  }
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		/*
		doc.setOptions({
		    parser: function(tag) {
		      return {
		        'get': function(scope) {
		          console.log('evaluating', tag, 'in', JSON.stringify(scope));
		          console.log('evaluated to', scope[tag]);
		          if (tag === '.') {
		            return scope;
		          } else {
		            return scope[tag];
		          }
		        }
		      };
		    },
		})
		*/
		
		doc.setData({participantes})
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccionDescargas+"gafeteSalida.docx",buf);
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(produccionDescargas+"gafeteSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');

		
		
  },
  getCredenciales: function (participantes, municipio, evento, FE, deporte, categoria, rama) {
			
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		
	  var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		
		var produccion 					= "";
		var produccionFotos 		= "";
		var produccionDescargas = "";
				
		if(Meteor.isDevelopment){
      produccion 					= meteor_root+"/web.browser/app/archivos/";
      produccionFotos 		= meteor_root+"/web.browser/app/fotos/";
      produccionDescargas = meteor_root+"/web.browser/app/descargas/";
    }else{
      produccion 					= "/home/isde/archivos/";
      produccionFotos 		= "/home/isde/fotos/";
      produccionDescargas = "/home/isde/descargas/";
    }
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [70,90];
		}
		
		var imageModule=new ImageModule(opts);
		
		
		var eve = Eventos.findOne({_id: evento});
		var mun = Municipios.findOne({_id: municipio});
		var dep = Deportes.findOne({_id: deporte});
		var cat = Categorias.findOne({_id: categoria});
		var ram = Ramas.findOne({_id: rama});
		
		
		_.each(participantes, function(participante){
				if (participante.foto != "")
				{							
	
					var f = String(participante.foto);
					var tipo = f.substr(11,4);	
					if (tipo == 'jpeg')
					{						
							participante.foto = f.replace('data:image/jpeg;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".jpeg", bitmap);
							participante.foto = produccionFotos + participante.curp+".jpeg";	
					}
					else if (tipo == 'png;')
					{
							participante.foto = f.replace('data:image/png;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".png", bitmap);
							participante.foto = produccionFotos + participante.curp+".png";						
					}
				}
				
				if (participante.apellidoMaterno == undefined)
					 participante.apellidoMaterno = "";
					 
				participante.fechaNacimiento = participante.fechaNacimiento.getUTCDate() +"/"+ 
																			(participante.fechaNacimiento.getUTCMonth()+1) +"/"+ 
																			 participante.fechaNacimiento.getUTCFullYear();
				
				var cons = "0000";
				if (participante.con < 10)
				{		
						cons = "000".concat(participante.con.toString());
				}		
				else if (participante.con < 100)
				{
						cons = "00".concat(participante.con.toString());
				}		
				else if (participante.con < 1000)
				{
						cons = "0".concat(participante.con.toString());		
				}		
				else
				{
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
		
		
		if (eve.nombreCredencial == undefined || eve.nombreCredencial == "")
				content = fs.readFileSync(produccion+"sinDefinir.docx", "binary");
		else
				content = fs.readFileSync(produccion+eve.nombreCredencial+".docx", "binary");
		
	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
				
		doc.setData({participantes})
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccionDescargas+"credencialSalida.docx",buf);
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(produccionDescargas+"credencialSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');

		
		
  },
  getCedula: function (evento_id, municipio_id, deporte_id, categoria_id, rama_id, funcionEspecifica) {
		
		var participantes = [];
		
		participantes = ParticipanteEventos.find({ evento_id				: evento_id
																						  ,municipio_id 		: municipio_id
																						  ,deporte_id				: deporte_id
																							,categoria_id			: categoria_id
																						  ,rama_id					: rama_id
																						  ,funcionEspecifica: funcionEspecifica
																							}).fetch();
		var evento 		= Eventos.findOne(evento_id).nombre;
		var municipio = Municipios.findOne(municipio_id).nombre;
		var deporte 	= Deportes.findOne(deporte_id).nombre;
	  var categoria = Categorias.findOne(categoria_id).nombre;
		
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module');
		var cmd = require('node-cmd');
		
		var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
		
		//var produccion = meteor_root+"/web.browser/app/archivos/";
		//var produccion = "/home/isde/archivos/";
		
		var produccion 					= "";
		var produccionFotos 		= "";
		var produccionDescargas = "";

		if(Meteor.isDevelopment){
      produccion 					= meteor_root+"/web.browser/app/archivos/";
      produccionFotos 		= meteor_root+"/web.browser/app/fotos/";
      produccionDescargas = meteor_root+"/web.browser/app/descargas/";
    }else{
      produccion 					= "/home/isde/archivos/";
      produccionFotos 		= "/home/isde/fotos/";
      produccionDescargas = "/home/isde/descargas/";
    }

		
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [80,80];
		}
		
		var imageModule=new ImageModule(opts);
		
		var Cantidad = participantes.length;

		if (Cantidad % 8 != 0)
		{
				//Completar cuantos faltan para ...
				var modulo = Math.round(Cantidad % 8);
				var faltantes = 8 - modulo;				
				for (var i = 1; i <= faltantes; i++)
				{
						objFalatantes = {_id:"s/a"+i,foto:"",nombre:"-",apellidoPaterno:"-", apellidoMaterno:"-",sexo:"-" ,fechaNacimiento:"-",curp:"-",funcionEspecifica:"-",categoria:"-"};
						participantes.push(objFalatantes);
				}
		}		 
		
		_.each(participantes, function(participante){
			
				participante.pruebasNombre = [];
					_.each(participante.pruebas, function(prueba){
							//participante.pruebasNombre.push(Pruebas.findOne(prueba, { fields : { nombre : 1}}))
							var p = Pruebas.findOne(prueba,{ fields : { nombre : 1}});
							participante.pruebasNombre.push({"nombre": p.nombre});
				});
			
				if (participante.foto != "")
				{						
					participante.fechaNacimiento = participante.fechaNacimiento.getUTCDate() +"-"+ (participante.fechaNacimiento.getUTCMonth()+1) +"-"+ participante.fechaNacimiento.getUTCFullYear();
					
					var f = String(participante.foto);
					
					var tipo = f.substr(11,4);	
					if (tipo == 'jpeg')
					{						
							participante.foto = f.replace('data:image/jpeg;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".jpeg", bitmap);
							participante.foto = produccionFotos + participante.curp+".jpeg";	
					}
					else if (tipo == 'png;')
					{
							participante.foto = f.replace('data:image/png;base64,', '');					
							// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
					    var bitmap = new Buffer(participante.foto, 'base64');
							//Usando Meteor_root
							fs.writeFileSync(produccionFotos + participante.curp+".png", bitmap);
							participante.foto = produccionFotos + participante.curp+".png";						
					}
					
					

				}
		})
		
		
		var content = fs
    							.readFileSync(produccion + "cedula.docx", "binary");

	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		var fecha = new Date();
		var f = fecha;
		f = fecha.getUTCDate()+'-'+(fecha.getUTCMonth()+1)+'-'+fecha.getUTCFullYear();//+', Hora:'+fecha.getUTCHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
		
		doc.setData({	evento				:	evento, 
									municipio			: municipio, 
									deporte				: deporte, 
									categoria			: categoria,
									fechaEmision	: f,
									participantes});
								
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(produccionDescargas + "cedulaSalida.docx",buf);

		
		//Convertir a PDF
		
/*
		cmd.get(
        'unoconv -f pdf '+ produccion+'cedulaSalida.docx',
        function(data){
            console.log('ok conversión:',data)
        }
    );
*/

		//cmd.run('unoconv -f pdf '+ produccion+'cedulaSalida.docx');

		//Pasar a base64
		// read binary data
    //var bitmap = fs.readFileSync(produccion+"cedulaSalida.pdf");
    var bitmap = fs.readFileSync(produccionDescargas + "cedulaSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
		
  },
  getExcel: function (participantes) {
	  		
	  		var fs = require('fs');
				var ws_name = "SheetJS";
						
				var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
				//var produccion = meteor_root+"/web.browser/app/archivos/";
				//
				var produccion = "/home/isde/archivos/";
				

				var wscols = [
					{wch:5},
					{wch:15},
					{wch:18},
					{wch:18},
					{wch:20},
					{wch:25},
					{wch:15},
					{wch:20},
					{wch:10},
					{wch:15},
					{wch:20}
				];
				
				if(typeof require !== 'undefined') 
						XLSX = require('xlsx');
				
				var JSZip = require('jszip');
				
				function Workbook() {
					if(!(this instanceof Workbook)) return new Workbook();
					this.SheetNames = [];
					this.Sheets = {};
				}
				var wb = new Workbook();
				
				function datenum(v, date1904) {
					if(date1904) v+=1462;
					var epoch = Date.parse(v);
					return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
				}
				
				/* convert an array of arrays in JS to a CSF spreadsheet */
				function sheet_from_array_of_arrays(data, opts) {
					var ws = {};
					var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
					for(var R = 0; R != data.length; ++R) {
						for(var C = 0; C != data[R].length; ++C) {
							if(range.s.r > R) range.s.r = R;
							if(range.s.c > C) range.s.c = C;
							if(range.e.r < R) range.e.r = R;
							if(range.e.c < C) range.e.c = C;
							var cell = {v: data[R][C] };
							if(cell.v == null) continue;
							var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
				
							/* TEST: proper cell types and value handling */
							if(typeof cell.v === 'number') cell.t = 'n';
							else if(typeof cell.v === 'boolean') cell.t = 'b';
							else if(cell.v instanceof Date) {
								cell.t = 'n'; cell.z = XLSX.SSF._table[14];
								cell.v = datenum(cell.v);
							}
							else cell.t = 's';
							ws[cell_ref] = cell;
						}
					}
				
					/* TEST: proper range */
					if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
					return ws;
				}
				
				
				var ws = sheet_from_array_of_arrays(participantes);

				/* TEST: add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				
				/* TEST: column widths */
				ws['!cols'] = wscols;
				
				//var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
				//console.log(meteor_root);
				
				/* write file */
				XLSX.writeFile(wb, produccion+"sheetjs.xlsx");
				
				
				//Pasar a base64
				// read binary data
		    var bitmap = fs.readFileSync(produccion+"sheetjs.xlsx");
		    
		    // convert binary data to base64 encoded string
		    return new Buffer(bitmap).toString('base64');
		
	  		
	},  
});

