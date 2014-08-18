var _dictApp = angular.module('wpApp',['ngCookies','ngResource','ngSanitize','ui.bootstrap']);

_dictApp.value('dictAjax', wp_ajax);

_dictApp.factory('dictRest', function ($log, $resource, dictAjax) {
    var restUrl = dictAjax.ajaxurl;
	$log.info(restUrl);
    return $resource(restUrl);
});

_dictApp.filter('dictSearch', function ($log, dictRest, dictAjax) {
    var search ={ action: 'tatrus_get', security: dictAjax.ajaxnonce};

    return function (name) {
        search.name = name;
        $log.info(search);
        var value = dictRest.get(search);
        if (value)
          return value.description;
        else
          return name;
    };

});


_dictApp.controller('DictShowCtrl', function ($log, $scope, $modal) {
    $log.info('DictShowCtrl');

    var modalConfig = {
        templateUrl: 'dictModalContent.html',
        controller: 'DictCtrl',
        backdrop: 'static',
        keyboard: true,
        resolve:{
            messageTitle: function () {
                return "Cүзлек";
            }
        }
    };

    var modalInstance;

    $scope.showDictionary = function(){
        modalInstance = $modal.open(modalConfig);
    }

});



_dictApp.controller('DictCtrl', function ( $log, $window, $scope, $modalInstance, dictRest, dictAjax) {
    $log.info('DictCtrl');
    $scope.request = { action: 'tatrus_get', security: dictAjax.ajaxnonce };
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
	};
	
	 
	$scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {			
			if(newWord.length > 1){
				search();
		    }
		}
	});


    $scope.close = function (result) {
        $modalInstance.close(result);
    };

	
});
	
	