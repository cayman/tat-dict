angular.element(document).ready(function() {
    angular.bootstrap(document, ['tatApp']);
});
var _tatApp = angular.module('tatApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'ngAnimate']);