angular.module("insude").run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    switch (error) {
      case "AUTH_REQUIRED":
        $state.go('anon.login');
        break;
      case "FORBIDDEN":
        //$state.go('root.home');
        break;
      case "UNAUTHORIZED":
        toastr.error("Acceso Denegado");
        toastr.error("No tiene permiso para ver esta opción");
        break;
      default:
        $state.go('internal-client-error');
    }
  });
});

angular.module('insude').config(['$injector', function ($injector) {
  var $stateProvider = $injector.get('$stateProvider');
  var $urlRouterProvider = $injector.get('$urlRouterProvider');
  var $locationProvider = $injector.get('$locationProvider');

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  /***************************
   * Anonymous Routes
   ***************************/
  $stateProvider
    .state('anon', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })
    .state('anon.login', {
      url: '/login',
      templateUrl: 'client/login/login.ng.html',
      controller: 'LoginCtrl',
      controllerAs: 'lc'
    })
    .state('anon.participantesver', {
      url: '/participantesver/:id/:evento/:deporte/:categoria/:rama',
      templateUrl: 'client/participantes/participantesver.ng.html',
      controller: 'ParticipantesVerCtrl as pv'
    })
    .state('anon.logout', {
      url: '/logout',
      resolve: {
        'logout': ['$meteor', '$state', 'toastr', function ($meteor, $state, toastr) {
          return $meteor.logout().then(
            function () {
              toastr.success("Vuelva pronto.");
              $state.go('anon.login');
            },
            function (error) {
              toastr.error(error.reason);
            }
          );
        }]
      }
    });

  /***************************
   * Login Users Routes
   ***************************/
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'client/layouts/root.ng.html',
      controller: 'RootCtrl as ro',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.home', {
      url: '/',
      templateUrl: 'client/home/home.ng.html',
      controller: 'HomeCtrl as ho',
      ncyBreadcrumb: {
        label: "Home"
      },
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      },
    })
    .state('root.usuarios', {
      url: '/usuarios',
      templateUrl: 'client/usuarios/usuarios.ng.html',
      controller: 'UsuariosCtrl as us',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.municipios', {
      url: '/municipios',
      templateUrl: 'client/municipios/municipios.ng.html',
      controller: 'MunicipiosCtrl as mun',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.eventos', {
      url: '/eventos',
      templateUrl: 'client/eventos/eventos.ng.html',
      controller: 'EventosCtrl as eve',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.deportes', {
      url: '/deportes',
      templateUrl: 'client/deportes/deportes.ng.html',
      controller: 'DeportesCtrl as dep',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.categorias', {
      url: '/categorias',
      templateUrl: 'client/categorias/categorias.ng.html',
      controller: 'CategoriasCtrl as cat',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.pruebas', {
      url: '/pruebas/:id/:evento_id/:deporte_id/:categoria_id/:rama_id',
      templateUrl: 'client/pruebas/pruebas.ng.html',
      controller: 'PruebasCtrl as pru',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.ramas', {
      url: '/ramas',
      templateUrl: 'client/ramas/ramas.ng.html',
      controller: 'RamasCtrl as ram',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.modalidaddeportivas', {
      url: '/modalidaddeportivas',
      templateUrl: 'client/modalidaddeportivas/modalidaddeportivas.ng.html',
      controller: 'ModalidadDeportivaCtrl as mod',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.participantesnuevo', {
      url: '/participantesnuevo/:id',
      templateUrl: 'client/participantes/participantesnuevo.ng.html',
      controller: 'ParticipantesNuevoCtrl as pn',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.participanteseditar', {
      url: '/participanteseditar/:id',
      templateUrl: 'client/participantes/participanteseditar.ng.html',
      controller: 'ParticipantesEditarCtrl as pe',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.listarparticipantes', {
      url: '/listarparticipantes',
      templateUrl: 'client/participantes/listarparticipantes.ng.html',
      controller: 'ListarParticipantesCtrl as lp',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.participantePerfil', {
      url: '/participantesPerfil/:id',
      templateUrl: 'client/participantes/participantePerfil.html',
      controller: 'ParticipantePerfilCtrl as obj',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.participantes', {
      url: '/participantes',
      templateUrl: 'client/participantes/participantes.html',
      controller: 'ParticipantesCtrl as obj',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.eventosmostrar', {
      url: '/eventosmostrar',
      templateUrl: 'client/participantes/eventosmostrar.ng.html',
      controller: 'EventosMostarCtrl as em',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.cedula', {
      url: '/cedula',
      templateUrl: 'client/reportes/cedula.ng.html',
      controller: 'CedulaCtrl as ced',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('anon.imprimircedula', {
      url: '/cedula/:evento/:deporte/:categoria/:rama/:funcionEspecifica/:municipio',
      templateUrl: 'client/reportes/imprimircedula.ng.html',
      controller: 'imprimirCedulaCtrl as impced',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('anon.credenciales', {
      url: '/credenciales/:evento/:municipio/:deporte/:categoria/:rama',
      templateUrl: 'client/reportes/credenciales.ng.html',
      controller: 'CredencialesCtrl as cre',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('anon.gafetes', {
      url: '/gafetes/:evento/:municipio/:deporte/:categoria/:rama',
      templateUrl: 'client/reportes/gafetes.ng.html',
      controller: 'GafetesCtrl as gaf',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.impresiones', {
      url: '/impresiones',
      templateUrl: 'client/reportes/impresiones.ng.html',
      controller: 'ImpresionesCtrl as imp',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.descargadocumentos', {
      url: '/descargadocumentos',
      templateUrl: 'client/descarga/descargaDocumentos.ng.html',
      controller: 'descargaDocumentosCtrl as dc',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.listado', {
      url: '/listado',
      templateUrl: 'client/reportes/listado.ng.html',
      controller: 'listadoCtrl as lis',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })
    .state('root.participantesMunicipio', {
      url: '/participantesMunicipio',
      templateUrl: 'client/participantes/participantesMun.html',
      controller: 'ParticipantesMunCtrl as obj',
      resolve: {
        "currentUser": ["$meteor", function ($meteor) {
          return $meteor.requireUser();
        }]
      }
    })


}]);     