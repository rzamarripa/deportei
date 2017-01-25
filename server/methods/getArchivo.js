
Meteor.methods({
  
  getGafetes: function (participantes) {
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		
	  var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		
		var produccion = meteor_root+"/web.browser/app/archivos/";
		//var produccion = "/home/insude/archivos/";
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [100,100];
		}
		
		var imageModule=new ImageModule(opts);
		
		_.each(participantes, function(participante){
				if (participante.foto != "")
				{											
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file					
					
					//Usando Meteor_root
					fs.writeFileSync(produccion+participante.curp+".png", bitmap);
					participante.foto = produccion+participante.curp+".png";
					
				}
		})

		
		var content = fs
    							.readFileSync(produccion+"Gafete.docx", "binary");
	  
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
 
		fs.writeFileSync(produccion+"gafeteSalida.docx",buf);
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(produccion+"gafeteSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');

		
		
  },
  getCedula: function (participantes) {
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module');
		//var unoconv = Npm.require('unoconv');
		
		var meteor_root = require('fs').realpathSync( process.cwd() + '/../' );
		
		console.log("Root: ", meteor_root);
		
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
				if (participante.foto != "")
				{						
					participante.fechaNacimiento = participante.fechaNacimiento.getUTCDate() +"-"+ (participante.fechaNacimiento.getUTCMonth()+1) +"-"+ participante.fechaNacimiento.getUTCFullYear();
					
					var f = String(participante.foto);
					participante.foto = f.replace('data:image/jpeg;base64,', '');
					
					// create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
			    var bitmap = new Buffer(participante.foto, 'base64');
			    // write buffer to file
			    
			    //fs.writeFileSync(process.cwd()+"/app/server/fotos/"+participante.curp+".png", bitmap);
					//participante.foto = process.cwd()+"/app/server/fotos/"+participante.curp+".png";									
					
					//Usando Meteor_root
					fs.writeFileSync(meteor_root+"/web.browser/app/fotos/"+participante.curp+".png", bitmap);
					participante.foto = meteor_root + "/web.browser/app/fotos/"+participante.curp+".png";
					
					
				}
		})
		
		
		var content = fs
    							.readFileSync(meteor_root+"/web.browser/app/archivos/cedula.docx", "binary");

	  
		var zip = new JSZip(content);
		var doc=new Docxtemplater()
								.attachModule(imageModule)
								.loadZip(zip)
		
		var fecha = new Date();
		var f = fecha;
		f = fecha.getUTCDate()+'-'+(fecha.getUTCMonth()+1)+'-'+fecha.getUTCFullYear();//+', Hora:'+fecha.getUTCHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
		
		doc.setData({	evento: participantes[0].evento, 
									municipio: participantes[0].municipio, 
									deporte: participantes[0].deporte, 
									categoria: participantes[0].categoria,
									fechaEmision: f,
									participantes});
								
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(meteor_root+"/web.browser/app/descargas/cedulaSalida.docx",buf);

		
		//Convertir a PDF
		
		//unoconv.convert(process.cwd()+"/app/server/descargas/cedulaSalida.docx", 'pdf', function (err, result) {
			// result is returned as a Buffer
		//	fs.writeFile(process.cwd()+"/app/server/descargas/cedulaSalida.pdf", result);
		//});
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(meteor_root+"/web.browser/app/descargas/cedulaSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
		
		
  },
  getExcel: function (participantes) {
	  		
	  		var fs = require('fs');
				var ws_name = "SheetJS";
						
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

