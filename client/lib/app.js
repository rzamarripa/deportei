

angular.module('insude',
  [
    'angular-meteor',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'toastr',
    'ui.router',
    'ui.grid',
    'smartadmin',
    'datePicker',
    'ui.calendar',
    'ui.bootstrap',
    'checklist-model',
    'ncy-angular-breadcrumb'
  ]
);



$("html").attr({ lang: "es" });


Meteor.callSync = (method, params) => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, params, (err, res) => {
      if (err) {
        return reject(err)
      }
      resolve(res)
    })
  })
}

