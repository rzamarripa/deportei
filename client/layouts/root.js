angular.module("insude")
	.controller("RootCtrl", RootCtrl);
function RootCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr) {
	let ro = $reactive(this).attach($scope);
  window.ro = ro;
  
  ro.usuarioActual = Meteor.user();

  this.autorun(function () {
    if (!Meteor.user()) {
      $state.go('anon.noUser');
    }
  });


};