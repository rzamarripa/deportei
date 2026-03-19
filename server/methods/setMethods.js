
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
      objeto.nombreCompleto = quitarAcentos(`${objeto.nombre.trim()} ${objeto.apellidoPaterno} ${objeto.apellidoMaterno.trim()}`)
      objeto.fechaActualizacion = new Date();
      objeto.usuarioActualizo_id = Meteor.userId();
      const tempId = objeto._id;
      delete objeto._id;
      Participantes.update({ _id: tempId }, { $set: objeto })
      return true;
    }
  },

  setParticipanteEventos: function (objeto) {
    if (objeto._id == undefined) {
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
    }
    else {
      try {
        ParticipanteEventos.update({ _id: objeto._id }, {
          $set: {
            funcionEspecifica: objeto.funcionEspecifica,
            rama_id: objeto.rama_id,
            evento_id: objeto.evento_id,
            deporte_id: objeto.deporte_id,
            categoria_id: objeto.categoria_id,
            pruebas: objeto.pruebas,
            fechaActualizacion: new Date(),
            usuarioActualizo: Meteor.userId(),
          }
        });
        return true;
      } catch (error) {
        console.log(error)
        return false;
      }
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
    archivo.estatus = objeto.estatus;
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

  setEliminarParticipanteEvento: function (id) {
    try {
      ParticipanteEventos.remove({ _id: id });
      return true;
    } catch (error) {
      return false;
    }
  },

  setEliminarParticipante: function (id) {
    try {
      eliminaFolder(id);
      ParticipanteEventos.remove({ participante_id: id });
      Participantes.remove({ _id: id });
      return true;
    } catch (error) {
      return false;
    }
  },

  setValidarDocumento: function (datos) {
    try {
      //‡const p = Participantes.findOne(datos._id);
      if (datos.opcion == 1) {
        Participantes.update({ _id: datos._id }, { $set: { "curpImagen.estaValidado": true, "curpImagen.estatus": datos.tipo } });
      }
      else if (datos.opcion == 2) {
        Participantes.update({ _id: datos._id }, { $set: { "actaNacimiento.estaValidado": true, "actaNacimiento.estatus": datos.tipo } });
      }
      else if (datos.opcion == 3) {
        Participantes.update({ _id: datos._id }, { $set: { "identificacion.estaValidado": true, "identificacion.estatus": datos.tipo } });
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }

  },



  // almacenaArchivoFSCurpEvento: function (evento_id) {
  //   //const database = new MongoInternals.RemoteCollectionDriver(`mongodb://localhost:27017/insude_old`);
  //   //let ParticipantesOld = "";
  //   //ParticipantesOld = new Mongo.Collection("participantes_old", { _driver: database });

  //   Participantes.find({ evento_id: evento_id }).forEach(p => {
  //     let archivoCurp = p.curpImagen;
  //     if (archivoCurp != "") {
  //       let position = archivoCurp.indexOf(',');
  //       let valor = archivoCurp.substring(0, position + 1);
  //       let tipo = valor.split(';')[0];
  //       let type = tipo.split(':')[1];
  //       let base64 = archivoCurp.replace(valor, "");
  //       let extension = tipo.split('/')[1];
  //       const archivo = {};
  //       archivo._id = p._id;
  //       archivo.archivoBase64 = base64;
  //       archivo.folder = "curp";
  //       archivo.anio = p.fechaNacimiento.getFullYear();
  //       archivo.archivoNombre = `curp_${p._id}.${extension}`;
  //       let r = almacenaFile(archivo);
  //       const curpImagen = {}
  //       curpImagen.archivoRuta = r;
  //       curpImagen.archivoNombre = `curp_${p._id}.${extension}`;
  //       curpImagen.archivoTipo = type;
  //       curpImagen.estaValidado = true;
  //       Participantes.update({ _id: p._id }, { $set: { curpImagen: curpImagen } });
  //     }
  //   });
  //   console.log("termino_Curp");
  //   return true;
  // },
  // almacenaArchivoFSActaNacimiento: function (evento_id) {
  //   const database = new MongoInternals.RemoteCollectionDriver(`mongodb://localhost:27017/insude_old`);
  //   let ParticipantesOld = "";
  //   ParticipantesOld = new Mongo.Collection("participantes_old", { _driver: database });
  //   ParticipantesOld.find({}).forEach(p => {
  //     let archivoAlmacenar = p.actaNacimiento;
  //     if (archivoAlmacenar != "") {
  //       let position = archivoAlmacenar.indexOf(',');
  //       let valor = archivoAlmacenar.substring(0, position + 1);
  //       let tipo = valor.split(';')[0];
  //       let type = tipo.split(':')[1];
  //       let base64 = archivoAlmacenar.replace(valor, "");
  //       let extension = tipo.split('/')[1];
  //       const archivo = {};
  //       archivo._id = p._id;
  //       archivo.archivoBase64 = base64;
  //       archivo.folder = "AN";
  //       archivo.anio = p.fechaNacimiento.getFullYear();
  //       archivo.archivoNombre = `curp_${p._id}.${extension}`;
  //       let r = almacenaFile(archivo);
  //       const archivoNuevo = {}
  //       archivoNuevo.archivoRuta = r;
  //       archivoNuevo.archivoNombre = `an_${p._id}.${extension}`;
  //       archivoNuevo.archivoTipo = type;
  //       archivoNuevo.estaValidado = true;
  //       Participantes.update({ _id: p._id }, { $set: { actaNacimiento: archivoNuevo } });
  //     }
  //   })
  //   console.log("termino_AN");
  //   return true;
  // },
  // almacenaArchivoFSIdentificacion: function (evento_id) {
  //   const database = new MongoInternals.RemoteCollectionDriver(`mongodb://localhost:27017/insude_old`);
  //   let ParticipantesOld = "";
  //   ParticipantesOld = new Mongo.Collection("participantes_old", { _driver: database });
  //   ParticipantesOld.find({}).forEach(p => {
  //     let archivoAlmacenar = p.identificacion;
  //     if (archivoAlmacenar != undefined && archivoAlmacenar != "") {
  //       let position = archivoAlmacenar.indexOf(',');
  //       let valor = archivoAlmacenar.substring(0, position + 1);
  //       let tipo = valor.split(';')[0];
  //       let type = tipo.split(':')[1];
  //       let base64 = archivoAlmacenar.replace(valor, "");
  //       let extension = tipo.split('/')[1];
  //       const archivo = {};
  //       archivo._id = p._id;
  //       archivo.archivoBase64 = base64;
  //       archivo.folder = "Iden";
  //       archivo.anio = p.fechaNacimiento.getFullYear();
  //       archivo.archivoNombre = `curp_${p._id}.${extension}`;
  //       let r = almacenaFile(archivo);
  //       const archivoNuevo = {}
  //       archivoNuevo.archivoRuta = r;
  //       archivoNuevo.archivoNombre = `Iden_${p._id}.${extension}`;
  //       archivoNuevo.archivoTipo = type;
  //       archivoNuevo.estaValidado = true;
  //       Participantes.update({ _id: p._id }, { $set: { identificacion: archivoNuevo } });
  //     }
  //   })
  //   console.log("termino_identificacion");
  //   return true;
  // },

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