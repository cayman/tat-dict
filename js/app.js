var _dictApp = angular.module('wpApp',['ngCookies','ngResource','ngSanitize','ui.bootstrap']);

_dictApp.factory('dictService', function ($log, $modal, $resource) {
    var ajaxUrl = "./example.json";
    var ajaxNonce = null;
    var ajaxAction = 'tatrus_get';

    if(angular.isObject(wp_ajax)){
        ajaxUrl =   wp_ajax.ajaxurl;
        ajaxNonce = wp_ajax.ajaxnonce;
    }
    var dictionaryConfig = {
        enabled: true,
        modalInstance:null
    };

    var dictionaryRest = $resource(ajaxUrl);

    var dictionaryHistory = [];


    var dictionaryRequest = {
        action: ajaxAction,
        security: ajaxNonce ,
        title: null ,
        name: null
    };


    var modalConfig = {
        templateUrl: 'dictModalContent.html',
        controller: 'DictCtrl',
        backdrop: 'static',
        keyboard: true,
        resolve:{
            data: null
        }
    };


    return {
        getRest: function(){
          return dictionaryRest;
        },
        getSelectedText: function () {
            if(dictionaryConfig.enabled) {
                var selectedText = "";
                if (window.getSelection) {
                    selectedText = window.getSelection().toString();
                } else if (document.getSelection) {
                    selectedText = document.getSelection().toString();
                } else if (document.selection) {
                    selectedText = document.selection.createRange().text;
                }
                if (angular.isString(selectedText)) {
                    var trimmedText = selectedText.trim();
                    if (trimmedText.length > 1) {
                        return trimmedText;
                    }

                }
            }
            return null;
        },
        openModal: function(selected){
            modalConfig.resolve.data = function () {
                return selected;
            };
            dictionaryConfig.modalInstance = $modal.open(modalConfig);
        },
        getNewRequest: function(){
            return angular.copy(dictionaryRequest);
        },
        getHistory: function(){
            return dictionaryHistory;
        },
        saveHistory: function(item){
            return dictionaryHistory.push(item);
        },
        getConfig: function(){
            return dictionaryConfig;
        }
    };

});


_dictApp.directive('dictWatch', function($log,$modal,dictService) {
    $log.info('DictShowCtrl');
    return function(scope, elem) {
          elem.on('mouseup', function () {
              var text = dictService.getSelectedText();
              if (text) {
                  dictService.openModal(text);
              }
          });
    };
});

//
//
//
//_dictApp.filter('dictSearch', function ($log, dictRest, dictAjax) {
//    var search ={ action: 'tatrus_get', security: dictAjax.ajaxnonce};
//
//    return function (name) {
//        search.name = name;
//        $log.info(search);
//        var value = dictRest.get(search);
//        if (value)
//          return value.description;
//        else
//          return name;
//    };
//
//});

_dictApp.controller('DictHandlerCtrl', function ( $log, $scope, dictService) {
    $log.info('DictHandlerCtrl');
    var config = dictService.getConfig();
    $scope.dictToggle = function(){
        $log.info(config.enabled);
        config.enabled = !config.enabled;
        $log.info(config.enabled);
    };
    $scope.dictIsEnabled = function(){
        return config.enabled;
    };

    $scope.dictOpen = function (){
        dictService.openModal();
    }
});




_dictApp.controller('DictCtrl', function ( $log, $scope, $filter, dictService, $modalInstance, data) {
    $log.info('DictCtrl');
    $scope.request = dictService.getNewRequest();
    $scope.result = { };
    $scope.meaning = null;
    $scope.history =  dictService.getHistory();

    if(data){
        $scope.request.title = $scope.request.name =  data;
        search();
    }
	
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
		$scope.result = dictService.getRest().get($scope.request,
            objectsFound,
            objectsNotFound);	
	}

	$scope.copyText = function(){
	    var text = dictService.getSelectedText();
		if(text && text.length > 1){
			$scope.request.name = text;
		}
	};
	
	 
	$scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {			
			if(newWord.length > 1){
				search();
		    }
		}
	});

    $scope.$watch('result.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {
            var filtered = $filter('filter')($scope.result.like, { name: newWord });
            if(filtered.length>0) {
                $scope.meaning = filtered[0];
            }
        }
	});


    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        dictService.saveHistory({
            title: $scope.request.title ? $scope.request.title : $scope.request.name ,
            name: $scope.meaning.name
        });
        $modalInstance.close();

    };

	
});
	
	