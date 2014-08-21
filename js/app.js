var _dictApp = angular.module('wpApp',['ngCookies','ngResource','ngSanitize','ngTouch','ui.bootstrap']);

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
        modalInstance:null,
        blockStyle:{
            display:"block",
            width:"20px",
            height:"120px",
            position:"fixed",
            left:"0px",
            top:"80px",
            "z-index":5,
            border:"1px solid #2c807f"
        },
        textStyle:{
            color:"#2c807f",
            "font-size": "10pt",
            "font-weight":"lighter",
            "margin":"65px 0 0 0",
            "text-align": "justify",
            "-moz-transform": "rotate(-90deg)",
            "-webkit-transform": "rotate(-90deg)",
            "-ms-transform": "rotate(-90deg)",
            "-o-transform": "rotate(-90deg)",
            "transform": "rotate(-90deg)",
            "writing-mode": "tb-rl"
        }
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
                var selection;
                if (window.getSelection) {
                    selection = window.getSelection();
                    selectedText = (selection.rangeCount) > 1 ? selection.getRangeAt(0).toString() : selection.toString();

                } else if (document.getSelection) {
                    selection = document.getSelection();
                    selectedText = (selection.rangeCount) ? selection.getRangeAt(0).toString() : selection.toString();

                } else if (document.selection) {
                    selection = document.selection;
                    selectedText = selection.createRange().text;
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
    $scope.dictConfig = dictService.getConfig();

    $scope.dictOpen = function (){
        var text = dictService.getSelectedText();
        dictService.openModal(text);
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
		if(text){
			$scope.request.name = text;
		}
	};
	
	 
	$scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {			
			search();
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
	
	