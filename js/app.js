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

    var dictionaryHistory = {};


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
                    $log.debug('window.getSelection',selection);
                    selectedText = (selection.rangeCount) > 1 ? selection.getRangeAt(0).toString() : selection.toString();

                } else if (document.getSelection) {
                    selection = document.getSelection();
                    $log.debug('document.getSelection',selection);
                    selectedText = (selection.rangeCount) ? selection.getRangeAt(0).toString() : selection.toString();

                } else if (document.selection) {
                    selection = document.selection;
                    $log.debug('document.selection',selection);
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
        openModal: function(selected,postId){
            var data = {
                text: selected,
                post: postId
            };
            $log.debug('openModal',data);
            modalConfig.resolve.data = function () {
                return data;
            };
            dictionaryConfig.modalInstance = $modal.open(modalConfig);
        },
        getNewRequest: function(){
            return angular.copy(dictionaryRequest);
        },
        getConfig: function(){
            return dictionaryConfig;
        },
        getHistory: function(postId){
            if(postId) {
                return dictionaryHistory[postId] ? dictionaryHistory[postId] : dictRest.getHistory({post: postId});
            }else {
                return null;
            }
        },
        addHistoryItem: function(postId,entry){
            if(postId && entry) {
                var data = {post:postId,id:entry.id};
                $log.info('addHistoryItem',entry.name, data);
                if(!dictionaryHistory[postId]){
                    dictionaryHistory[postId] = [];
                }
                dictionaryHistory[postId].push(entry);
                dictRest.saveHistory(data);
            }
        }
    };

});


_dictApp.directive('dictWatch', function($log,$modal,dictService) {
    $log.info('DictShowCtrl');
    return function(scope, elem, attrs) {
          var postId = attrs.dictWatch;
          elem.on('mouseup', function () {
              var text = dictService.getSelectedText();
              if (text) {
                  dictService.openModal(text,postId);
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

    $scope.dictOpen = function (postId){
        var text = dictService.getSelectedText();
        dictService.openModal(text,postId);
    }
});




_dictApp.controller('DictCtrl', function ( $log, $scope, $filter, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');
    $scope.request = dictService.getNewRequest();
    $scope.result = { };
    $scope.resultId = null;
    $scope.post = data.post;
    $scope.history = dictService.getHistory( data.post );

    if(data.text){
        $scope.request.title = data.text + ' (' + data.post +') ';
        $scope.request.name =  data.text;
        search();
    }

    $scope.deleteSymbol = function (){
        if($scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
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

            var filtered = $filter('filter')($scope.result.like, { id: newId });

            if ($scope.history && filtered.length == 0) {
                filtered = $filter('filter')($scope.history, { id: newId })
            }

            if (filtered.length > 0) {
                $scope.result.item = filtered[0];
            }
        }
	});


    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        dictService.addHistoryItem($scope.post,$scope.result.item);
        $modalInstance.close();
    };

	
});
	
	