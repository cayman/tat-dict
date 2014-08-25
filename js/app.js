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


_dictApp.factory('dictService', function ($log, $modal) {
    var dictionaryConfig = {
        enabled: true,
        auto: true
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
        getConfig: function(){
            return dictionaryConfig;
        },
        getSelectedText: function () {
            var selectedText = "";
            var selection;
            if (window.getSelection) {
                selection = window.getSelection();
                $log.debug('window.getSelection', selection);
                selectedText = (selection.rangeCount) > 1 ? selection.getRangeAt(0).toString() : selection.toString();

            } else if (document.getSelection) {
                selection = document.getSelection();
                $log.debug('document.getSelection', selection);
                selectedText = (selection.rangeCount) ? selection.getRangeAt(0).toString() : selection.toString();

            } else if (document.selection) {
                selection = document.selection;
                $log.debug('document.selection', selection);
                selectedText = selection.createRange().text;
            }
            if (angular.isString(selectedText)) {
                var trimmedText = selectedText.trim();
                if (trimmedText.length > 1) {
                    return trimmedText;
                }

            }
            return null;
        },
        openModal: function (postId, text) {
            if (text && text.length < 128){
                var data = {
                    text: text,
                    post: postId
                };
                $log.debug('openModal', data);
                modalConfig.resolve.data = function () {
                    return data;
                };
                $modal.open(modalConfig);
            }
        }

    };

});

_dictApp.factory('dictHistory', function ($log, dictRest, $filter) {

    var dictionaryHistory = {};

    return {
        inArray: function (arr, criteria) {
            return (arr && arr.length>0) ? ( $filter('filter')(arr, criteria)[0] || null) : null ;
        },
        get: function (postId) {
            if (postId) {
                return dictionaryHistory[postId] ? dictionaryHistory[postId] : (dictionaryHistory[postId] = dictRest.getHistory({post: postId}));
            } else {
                return null;
            }
        },
        add: function (postId, entry) {
            if (postId && entry) {
                var data = {post: postId, id: entry.id};
                if (!this.inArray(dictionaryHistory[postId],{ id: entry.id })) {
                    $log.info('addHistoryItem', entry.name, data);

                    ( dictionaryHistory[postId] || (dictionaryHistory[postId] = [])).push(entry);

                    dictRest.saveHistory(data);

                }
            }
        }
    };

});


_dictApp.directive('dictWatch', function($log,$modal,dictService) {
    $log.info('DictShowCtrl');
    return function(scope, elem, attrs) {
          var postId = attrs.dictWatch;
          var config = dictService.getConfig();
          elem.on('mouseup', function () {
              if(config.enabled && config.auto){
                  var text = dictService.getSelectedText();
                  if (text) {
                      dictService.openModal(postId, text);
                  }
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

_dictApp.controller('DictHandlerCtrl', function ( $log, $scope, dictService, dictHistory) {
    $log.info('DictHandlerCtrl:'+$scope.postId);
    $scope.dictConfig = dictService.getConfig();
    $scope.dictionary = null;

    $scope.$watch('postId', function (postId) {
        $log.info('postId:'+$scope.postId);
        $scope.dictionary = dictHistory.get(postId);
    });

    $scope.dictOpen = function (text){
        if($scope.dictConfig.enabled) {
            dictService.openModal($scope.postId, text || dictService.getSelectedText());
        }
    }
});



_dictApp.controller('DictCtrl', function ( $log, $scope, dictHistory, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');
    $scope.post = data.post;
    $scope.history = dictHistory.get(data.post);
    $scope.request = { title: null ,  name: null  };
    $scope.resultId = null;
    $scope.result = { };

    if(data.text){
        $scope.request.title = data.text;
        $scope.request.name =  data.text;
        $scope.result.item = dictHistory.inArray($scope.history,{ name: data.text });
        if(!$scope.result.item) {
            search();
        }
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
            $scope.result.item = dictHistory.inArray($scope.result.like,{ id: newId } )
                || dictHistory.inArray($scope.history,{ id: newId });
        }
	});


    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        dictHistory.add($scope.post,$scope.result.item);
        $modalInstance.close();
    };

	
});

	