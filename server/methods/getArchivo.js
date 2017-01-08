
Meteor.methods({
  
  getGafetes: function (participantes) {
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module')
		//var unoconv = require('unoconv');
		
	  var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
		
		var opts = {}
			opts.centered = false;
			opts.getImage=function(tagValue, tagName) {
					var binaryData =  fs.readFileSync(tagValue,'binary');
					return binaryData;
		}
		
		opts.getSize=function(img,tagValue, tagName) {
		    return [90,90];
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
					fs.writeFileSync(meteor_root+"/web.browser/app/fotos/"+participante.curp+".png", bitmap);
					participante.foto = meteor_root + "/web.browser/app/fotos/"+participante.curp+".png";
					
				}
		})

		
		var content = fs
    							//.readFileSync("/Users/alfonsoduarte/Documents/Meteor/deporteb/cedula.docx", "binary");
    							.readFileSync(meteor_root+"/web.browser/app/archivos/gafete.docx", "binary");
	  
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
		
		/*
		participantes = [{   nombre: "Alfonso",
								 apellidoPaterno:"Duarte",
								 apellidoMaterno:"Jimenez",
								 funcionEspecifica:"Deportista",
								 categoria:"JUNIOR",
								 municipio:"CULIACAN",
								 rama:"VARONIL",
								 deporte:"BIESBOL",
								 foto:"/Users/alfonsoduarte/Documents/Meteor/isde/.meteor/local/build/programs/web.browser/app/fotos/DUJA020722HSLRMLA8.png"
								},
								{nombre: "Fernando",
								 apellidoPaterno:"Duarte",
								 apellidoMaterno:"Jimenez",
								 funcionEspecifica:"Deportista",
								 categoria:"JUNIOR",
								 municipio:"CULIACAN",
								 rama:"VARONIL",
								 deporte:"BIESBOL",
								 foto:"/Users/alfonsoduarte/Documents/Meteor/isde/.meteor/local/build/programs/web.browser/app/fotos/DUJA020722HSLRMLA8.png"
								}];
								
    */
		//console.log(participantes);
		doc.setData({participantes})
		
		doc.render();
 
		var buf = doc.getZip()
             		 .generate({type:"nodebuffer"});
 
		fs.writeFileSync(meteor_root+"/web.browser/app/descargas/gafeteSalida.docx",buf);
		
		
		//Pasar a base64
		// read binary data
    var bitmap = fs.readFileSync(meteor_root+"/web.browser/app/descargas/gafeteSalida.docx");
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');

		
		
  },
  getCedula: function (participantes) {
		
		var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
		var JSZip = require('jszip');
		var ImageModule = require('docxtemplater-image-module');
		//var unoconv = Npm.require('unoconv');
		
		var meteor_root = Npm.require('fs').realpathSync( process.cwd() + '/../' );
		
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
  
});

