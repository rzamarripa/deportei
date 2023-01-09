
Meteor.methods({

  setMunicipio: function (id, municipio_id) {
    Participantes.update({ _id: id }, { $set: { municipio_id: municipio_id } });
    return true;
  },

  setParticipante: function (objeto) {
    const data = {};
    if (objeto._id == undefined) {
      try {
        data.resultado = true;
        objeto.curpImagen = "";
        objeto.identificacion = "";
        objeto.actaNacimiento = "";
        objeto.fecha = new Date();
        objeto.nombreCompleto = quitarAcentos(`${objeto.nombre.trim()} ${objeto.apellidoPaterno} ${objeto.apellidoMaterno.trim()}`)
        objeto.usuario_id = Meteor.userId();
        data._id = Participantes.insert(objeto);
        return data;
      } catch (error) {
        console.log(error)

      }

    }
    else {
      const tempId = objeto._id;
      delete objeto._id;
      Participantes.update({ _id: tempId }, { $set: objeto })
      return true;
    }


  },

  setParticipanteEventos: function (objeto) {
    try {
      let ret = Eventos.findAndModify(
        {
          query: { _id: objeto.evento_id },
          update: { $inc: { con: 1 } },
          new: true
        }
      );
      const p = Participantes.findOne({ _id: objeto.participante_id }, { fields: { municipio_id: 1 } });
      objeto.municipio_id = p.municipio_id;
      objeto.con = ret.con;
      objeto.fecha = new Date();
      objeto.usuarioInserto = Meteor.userId();
      ParticipanteEventos.insert(objeto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  setArchivo: function (objeto) {
    const fs = require("fs");
    objeto.folder = objeto.opcion == 1 ? "curp" : objeto.opcion == 2 ? "AN" : "Iden";

    objeto.archivoRuta = almacenaFile(objeto);
    delete objeto.archivoBase64;

    const archivo = {};
    archivo.archivoRuta = objeto.archivoRuta;
    archivo.archivoNombre = objeto.archivoNombre;
    archivo.archivoTipo = objeto.tipo;
    archivo.estaValidado = objeto.estaValidado;
    if (objeto.opcion == 1) {
      const p = Participantes.findOne({ _id: objeto._id }, { fields: { curpImagen: 1 } });
      if (p.curpImagen != "") {
        fs.unlink(p.curpImagen.archivoRuta, (error) => { /* handle error */ });
      }
      Participantes.update({ _id: objeto._id }, { $set: { curpImagen: archivo } })
    }
    else if (objeto.opcion == 2) {
      const p = Participantes.findOne({ _id: objeto._id }, { fields: { actaNacimiento: 1 } });
      if (p.actaNacimiento != "") {
        fs.unlink(p.actaNacimiento.archivoRuta, (error) => { /* handle error */ });
      }
      Participantes.update({ _id: objeto._id }, { $set: { actaNacimiento: archivo } })
    }
    else if (objeto.opcion == 3) {
      archivo.fechaVencimiento = objeto.fechaVencimiento;
      const p = Participantes.findOne({ _id: objeto._id }, { fields: { identificacion: 1 } });
      if (p.identificacion != "") {
        fs.unlink(p.identificacion.archivoRuta, (error) => { /* handle error */ });
      }
      Participantes.update({ _id: objeto._id }, { $set: { identificacion: archivo } })
    }
    return true;
  },

});

function almacenaFile(objeto) {

  const fs = require("fs");
  let templateRoute = "";

  if (Meteor.isDevelopment) {
    var path = require('path');
    var publicPath = path.resolve('.').split('.meteor')[0];
    if (!fs.existsSync(`${publicPath}.outputs/${objeto.anio}`))
      fs.mkdirSync(`${publicPath}.outputs/${objeto.anio}`);
    if (!fs.existsSync(`${publicPath}.outputs/${objeto.anio}/${objeto._id}`)) {
      fs.mkdirSync(`${publicPath}.outputs/${objeto.anio}/${objeto._id}`);
    }
    templateRoute = `${publicPath}.outputs/${objeto.anio}/${objeto._id}/${objeto.folder}/`;
    if (!fs.existsSync(templateRoute)) {
      fs.mkdirSync(templateRoute);
    }
  } else {
    var publicPath = '/var/www/isde/documentos/';
    if (!fs.existsSync(`${publicPath}/${objeto.anio}`))
      fs.mkdirSync(`${publicPath}/${objeto.anio}`);
    if (!fs.existsSync(`${publicPath}/${objeto.anio}/${objeto._id}`))
      fs.mkdirSync(`${publicPath}/${objeto.anio}/${objeto._id}`);
    
      templateRoute = `${publicPath}/${objeto.anio}/${objeto._id}/${objeto.folder}/`;
    if (!fs.existsSync(templateRoute)) {
      fs.mkdirSync(templateRoute);
    }
  }

  const ruta = templateRoute + objeto.archivoNombre;
  require("fs").writeFile(templateRoute + objeto.archivoNombre, objeto.archivoBase64, 'base64', function (err, result) {
    if (err)
      console.log(err);
  });
  return ruta
}

const quitarAcentos = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}