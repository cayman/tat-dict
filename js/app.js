var _dictApp = angular.module('wpApp',['ngCookies','ngResource','ngSanitize','ngTouch','ui.bootstrap']);

_dictApp.factory('dictRest', function ($resource) {
    var ajaxUrl = "./example.json";
    var ajaxNonce = null;

    if(angular.isObject(wp_ajax)){
        ajaxUrl =   wp_ajax.ajaxurl;
        ajaxNonce = wp_ajax.ajaxnonce;
    }

    return $resource(ajaxUrl,{},{
        search: {params: {security:ajaxNonce, action:'tatrus_search'}, cache:true },
        getHistory: {params: {security:ajaxNonce, action:'tatrus_get_history'}, isArray: true},
        saveHistory: {params: {security:ajaxNonce, action:'tatrus_save_history'} }
    });
});


_dictApp.factory('dictService', function ($log, dictRest, $modal) {
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

    var dictionaryHistory = dictRest.getHistory();
    $log.info('dictHistory',dictionaryHistory);

    function saveHistory(){
        var ids = '';
        dictionaryHistory.forEach(function(entry) {
            ids += (ids)? (','+entry.id) : entry.id;
        });
        $log.info('saveHistory:ids=',ids);
        dictRest.saveHistory({ids:ids});
    }


    var dictionaryRequest = {
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
        getConfig: function(){
            return dictionaryConfig;
        },
        getHistory: function(){
            return dictionaryHistory;
        },
        saveHistory: saveHistory
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

_dictApp.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on(attr.stopEvent, function (e) {
                e.stopPropagation();
            });
        }
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




_dictApp.controller('DictCtrl', function ( $log, $scope, $filter, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');
    $scope.request = dictService.getNewRequest();
    $scope.result = { };
    $scope.resultId = null;
    $scope.history =  dictService.getHistory();

    if(data){
        $scope.request.title = $scope.request.name =  data;
        search();
    }

    $scope.deleteSymbol = function (id){
        if($scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
        $scope.focus(id);
    };

    $scope.focus = function (id){
        // angular.element(id).focus();
    };

    $scope.copyText = function(){
        var text = dictService.getSelectedText();
        if(text){
            $scope.request.name = text;
        }
    };

    //searching

    $scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {
            search();
        }
    });

    function search(){
        $log.debug('new search:', $scope.request);
        $scope.result = dictRest.search($scope.request,
            objectsFound,
            objectsNotFound);
    }

    //Error ajax loaded
    function objectsNotFound() {
		$log.debug('not found');
    }

    //Success ajax loaded
    function objectsFound(value) {
		$log.debug(value);
        if($scope.result.item){
            $scope.result.selected = $scope.result.item.id;
        }else if($scope.result.like && $scope.result.like.length > 0){
            $scope.result.selected = $scope.result.like[0].id;
        }
    }

    //change selectbox

    $scope.$watch('result.selected', function (newId, oldId) {
        if (newId && newId!=oldId) {
            var filtered = $filter('filter')($scope.history, { id: newId });
            if (filtered.length == 0) {
                filtered = $filter('filter')($scope.result.like, { id: newId });
            }
            if (filtered.length > 0) {
                $scope.result.item = filtered[0];
            }
        }
	});


    //closing

    $scope.close = function (result) {
        if($scope.result.item) {
            $scope.history.push($scope.result.item);
        }
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        if($scope.result.item) {
            $scope.history.push($scope.result.item);
        }
        dictService.saveHistory();
        $modalInstance.close();
    };

	
});
	
	