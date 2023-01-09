window.camelize = function (str) {
	var res = str.split(" ");
	var cadena = "";
	_.each(res, function (palabra) {
		if (palabra.trim() == 'de' || palabra.trim() == 'del' || palabra.trim() == 'la' || palabra.trim() == 'las' || palabra.trim() == 'los' ||
			palabra.trim() == 'y' || palabra.trim() == 'e')
			cadena += palabra + " ";
		else
			cadena += palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() + " ";
	});
	return cadena.trim();
};

window.camelizeLugar = function (str) {
	var res = str.split(" ");
	var cadena = "";
	_.each(res, function (palabra) {
		if (palabra.trim() == 'de' || palabra.trim() == 'del' || palabra.trim() == 'y' || palabra.trim() == 'e')
			cadena += palabra + " ";
		else
			cadena += palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() + " ";
	});
	return cadena.trim();
};

window.formatDateMinusculas = function (date) {
	date = new Date(date);

	var monthNames = [
		"enero", "febrero", "marzo",
		"abril", "mayo", "junio", "julio",
		"agosto", "septiembre", "octubre",
		"noviembre", "diciembre"
	];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + 'de ' + monthNames[monthIndex] + ' de' + ' ' + year;
};

window.formatDateMayusculas = function (date) {
	date = new Date(date);

	var monthNames = [
		"ENERO", "FEBRERO", "MARZO",
		"ABRIL", "MAYO", "JUNIO", "JULIO",
		"AGOSTO", "SEPTIEMBRE", "OCTUBRE",
		"NOVIEMBRE", "DICIEMBRE"
	];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + 'DE ' + monthNames[monthIndex] + ' DE' + ' ' + year;
};

window.formatDateCedula = function (date) {
	date = new Date(date);

	var monthNames = [
		"Enero", "Febrero", "Marzo",
		"Abril", "Mayo", "Junio", "Julio",
		"Agosto", "Septiembre", "Octubre",
		"Noviembre", "Diciembre"
	];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + '/ ' + monthNames[monthIndex] + ' /' + ' ' + year;
};

window.formatDate = function (date) {
	date = new Date(date);

	var monthNames = [
		"ENERO", "FEBRERO", "MARZO",
		"ABRIL", "MAYO", "JUNIO", "JULIO",
		"AGOSTO", "SEPTIEMBRE", "OCTUBRE",
		"NOVIEMBRE", "DICIEMBRE"
	];
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return day + ' ' + 'DE ' + monthNames[monthIndex] + ' DE' + ' ' + year;
};

window.formatDateShortTime = function (fecha) {
	const date = new Date(fecha);
	return date.getDate() +
		"/" + (date.getMonth() + 1) +
		"/" + date.getFullYear() +
		" Hora:" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

window.formatDateShort = function (fecha) {
	const date = new Date(fecha);
	return date.getDate() +
		"/" + (date.getMonth() + 1) +
		"/" + date.getFullYear();
};

window.nombreCompleto = function (nombre, apellidoPaterno, apellidoMaterno) {

	var nombreCompleto = "";

	apellidoPaterno = apellidoPaterno == undefined ? "" : apellidoPaterno.trim();
	apellidoMaterno = apellidoMaterno == undefined ? "" : apellidoMaterno.trim();

	if (apellidoPaterno == "" && apellidoMaterno == "")
		nombreCompleto = nombre.trim();
	else if (apellidoPaterno == "" && apellidoMaterno != "")
		nombreCompleto = apellidoMaterno + " " + nombre.trim();
	else if (apellidoPaterno != "" && apellidoMaterno == "")
		nombreCompleto = apellidoPaterno + " " + nombre.trim();
	else
		nombreCompleto = apellidoPaterno + (apellidoMaterno == "" ? "" : " " + apellidoMaterno) + " " + nombre.trim();

	return nombreCompleto;

};

window.nombreCompletoEmpiezaNombre = function (nombre, apellidoPaterno, apellidoMaterno) {

	var nombreCompleto = "";

	apellidoPaterno = apellidoPaterno == undefined ? "" : apellidoPaterno;
	apellidoMaterno = apellidoMaterno == undefined ? "" : apellidoMaterno;


	if (apellidoPaterno == "" && apellidoMaterno == "")
		nombreCompleto = nombre;
	else if (apellidoPaterno == "" && apellidoMaterno != "")
		nombreCompleto = nombre + " " + apellidoMaterno;
	else if (apellidoPaterno != "" && apellidoMaterno == "")
		nombreCompleto = nombre + " " + apellidoPaterno;
	else
		nombreCompleto = nombre + " " + apellidoPaterno + (apellidoMaterno == "" ? "" : " " + apellidoMaterno);

	return nombreCompleto;

};

//Quita los acentos
window.getCleanedString = function (cadena) {
	cadena = cadena.replace(/á/gi, "A");
	cadena = cadena.replace(/é/gi, "E");
	cadena = cadena.replace(/í/gi, "I");
	cadena = cadena.replace(/ó/gi, "O");
	cadena = cadena.replace(/ú/gi, "U");
	return cadena;
}

window.quitarAcentos = function (str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Paginador
//Funcion que regresa el arreglo para un paginador
window.arregloPaginador = function (tam, total) {
	var incremento = 0;
	var arregloMostrar = [];
	for (let index = 1; index <= total; index++) {
		if (index > 5 && arregloMostrar.filter(x => x.numero == "...").length == 0)
			arregloMostrar.push({ numero: "...", avance: -1 });
		else if (arregloMostrar.filter(x => x.numero == "...").length == 0)
			arregloMostrar.push({ numero: index, avance: incremento, estaActivo: false });
		incremento += tam;
	}
	return arregloMostrar;
}

window.round = function (value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function Unidades(num) {

	switch (num) {
		case 1: return 'UN';
		case 2: return 'DOS';
		case 3: return 'TRES';
		case 4: return 'CUATRO';
		case 5: return 'CINCO';
		case 6: return 'SEIS';
		case 7: return 'SIETE';
		case 8: return 'OCHO';
		case 9: return 'NUEVE';
	}

	return '';

}//Unidades()
function Decenas(num) {

	let decena = Math.floor(num / 10);
	let unidad = num - (decena * 10);

	switch (decena) {
		case 1:
			switch (unidad) {
				case 0: return 'DIEZ';
				case 1: return 'ONCE';
				case 2: return 'DOCE';
				case 3: return 'TRECE';
				case 4: return 'CATORCE';
				case 5: return 'QUINCE';
				default: return 'DIECI' + Unidades(unidad);
			}
		case 2:
			switch (unidad) {
				case 0: return 'VEINTE';
				default: return 'VEINTI' + Unidades(unidad);
			}
		case 3: return DecenasY('TREINTA', unidad);
		case 4: return DecenasY('CUARENTA', unidad);
		case 5: return DecenasY('CINCUENTA', unidad);
		case 6: return DecenasY('SESENTA', unidad);
		case 7: return DecenasY('SETENTA', unidad);
		case 8: return DecenasY('OCHENTA', unidad);
		case 9: return DecenasY('NOVENTA', unidad);
		case 0: return Unidades(unidad);
	}
}//Unidades()
function DecenasY(strSin, numUnidades) {
	if (numUnidades > 0)
		return strSin + ' Y ' + Unidades(numUnidades)

	return strSin;
}//DecenasY()
function Centenas(num) {
	let centenas = Math.floor(num / 100);
	let decenas = num - (centenas * 100);

	switch (centenas) {
		case 1:
			if (decenas > 0)
				return 'CIENTO ' + Decenas(decenas);
			return 'CIEN';
		case 2: return 'DOSCIENTOS ' + Decenas(decenas);
		case 3: return 'TRESCIENTOS ' + Decenas(decenas);
		case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
		case 5: return 'QUINIENTOS ' + Decenas(decenas);
		case 6: return 'SEISCIENTOS ' + Decenas(decenas);
		case 7: return 'SETECIENTOS ' + Decenas(decenas);
		case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
		case 9: return 'NOVECIENTOS ' + Decenas(decenas);
	}

	return Decenas(decenas);
}//Centenas()
function Seccion(num, divisor, strSingular, strPlural) {
	let cientos = Math.floor(num / divisor)
	let resto = num - (cientos * divisor)

	let letras = '';

	if (cientos > 0)
		if (cientos > 1)
			letras = Centenas(cientos) + ' ' + strPlural;
		else
			letras = strSingular;

	if (resto > 0)
		letras += '';

	return letras;
}//Seccion()
function Miles(num) {
	let divisor = 1000;
	let cientos = Math.floor(num / divisor)
	let resto = num - (cientos * divisor)

	let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
	let strCentenas = Centenas(resto);

	if (strMiles == '')
		return strCentenas;

	return strMiles + ' ' + strCentenas;
}//Miles()
function Millones(num) {
	let divisor = 1000000;
	let cientos = Math.floor(num / divisor)
	let resto = num - (cientos * divisor)

	let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
	let strMiles = Miles(resto);

	if (strMillones == '')
		return strMiles;

	return strMillones + ' ' + strMiles;
}//Millones()

window.NumeroALetras = function (num, currency) {
	currency = currency || {};
	let data = {
		numero: num,
		enteros: Math.floor(num),
		centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
		letrasCentavos: '',
		letrasMonedaPlural: currency.plural || '',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
		letrasMonedaSingular: currency.singular || '', //'PESO', 'Dólar', 'Bolivar', 'etc'
		letrasMonedaCentavoPlural: currency.centPlural || '',
		letrasMonedaCentavoSingular: currency.centSingular || ''

	};

	if (data.centavos > 0) {
		data.letrasCentavos = 'CON ' + (function () {
			if (data.centavos == 1)
				return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
			else
				return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
		})();
	};

	if (data.enteros == 0)
		return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
	if (data.enteros == 1)
		return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
	else
		return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
}

//busca un elemento en el arreglo
window.functiontofindIndexByKeyValue = function (arraytosearch, key, valuetosearch) {
	for (var i = 0; i < arraytosearch.length; i++) {
		if (arraytosearch[i][key] == valuetosearch) {
			return i;
		}
	}
	return null;
};
//Obtener el mayor
window.functiontoOrginiceNum = function (arraytosearch, key) {
	var mayor = 0;
	for (var i = 0; i < arraytosearch.length; i++) {
		arraytosearch[i][key] = i + 1;
	}
};

Number.prototype.format = function (n, x) {
	var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};



