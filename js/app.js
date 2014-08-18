var _dictApp = angular.module('dictApp',['ngCookies','ngResource','ngSanitize']);

_dictApp.factory('dictRest', function ($log, $resource) {
    var restUrl = wp_ajax.ajaxurl;
	$log.info(restUrl);
    return $resource(restUrl);
});


_dictApp.controller('DictCtrl', function ( $log, $window, $scope, $resource, dictRest) {

    $scope.request = { action: 'tatrus_get', security: wp_ajax.ajaxnonce };
    $scope.result = { };
	
	//Error ajax loaded
    function objectsNotFound() {
		$log.debug('not found');
    }

    //Success ajax loaded
    function objectsFound(value) {
		$log.debug(value);
    }
	
	function search(){
		$log.debug('new search:', $scope.request);
		$scope.result = dictRest.get($scope.request,
            objectsFound,
            objectsNotFound);	
	}
	
	function getSelectedText(){
		var selectedText = "";
		if(window.getSelection){
			selectedText = window.getSelection().toString();
		}else if (document.getSelection){
			selectedText = document.getSelection();
		}else if (document.selection){
			selectedText = document.selection.createRange().text;
		} 
		return selectedText;
	}
	
	
	$scope.copyText = function(){
	    var text = getSelectedText();
		if(text && text.trim().length > 1){
			$scope.request.name = text.trim();
		}
	}
	
	 
	$scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {			
			if(newWord.length > 1){
				search();
		    }
		}
	});

	
});
	
	