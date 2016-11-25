app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
     .when('/Index', {
         templateUrl: 'Index/Index.html',
         controller: 'Index as Index'
     })
     .when('/Role/:type', {
         templateUrl: 'Role/Role.html',
         controller: 'Role as Role'
     })
    .otherwise({
        redirectTo: '/Index'
    });
});
