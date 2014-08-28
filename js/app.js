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


_dictApp.factory('dictService', function ($log, $filter, $modal) {
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
        inArray: function (arr, criteria) {
            return (arr && arr.length>0) ? ( $filter('filter')(arr, criteria, true)[0] || null) : null ;
        },
        openModal: function (postId, text) {
           // if (text && text.length < 128){
                var data = {
                    text: text,
                    post: postId
                };
                $log.debug('openModal', data);
                modalConfig.resolve.data = function () {
                    return data;
                };
                $modal.open(modalConfig);
           // }
        }

    };

});

_dictApp.factory('dictHistory', function ($log, dictRest) {

    var dictionaryHistory = {};

    function load(postId){
        return dictRest.getHistory({post: postId},function success(data){
            $log.debug('loaded history post='+postId, data);
        })
    }

    function append(postId,entry){
        var dictionary = dictionaryHistory[postId];
        if(dictionary){
            var found = false;
            for(var index=0;index<dictionary.length;index++){
                if(dictionary[index].name === entry.name){
                    dictionary[index] = entry;
                    found = true;
                }
            }
            if(!found){
                dictionary.push(entry);
            }

        }else{
            dictionaryHistory[postId] = [ entry ];
        }
    }

    return {
        get: function (postId) {
            if (postId) {
                return dictionaryHistory[postId] ?  dictionaryHistory[postId] : (dictionaryHistory[postId] = load(postId));
            } else {
                return null;
            }
        },
        add: function (postId, text, entry) {
            if (postId && text) {
                // text is main identify
                var params = {post: postId, name: text };

                if (entry) {
                    if (entry.name !== text) { //Выделенные текст не равено найденному слову (его id мы не знаем)
                        //Мы можем меняем только ссылку на объект (то бишь задаем родителя) для производного объекта
                        if (entry.id < 2000000) {//Выбрали в combo базовое слово
                            params.parent = entry.id;
                        } else { //Выбрали в combo производное слово
                            params.parent = entry.parent > 0 ? entry.parent :  null;
                        }

                    } else { //Выделенные текст равен найденному слову (его id мы не знаем)
                        params.id = entry.id;
                        if (entry.id > 2000000) {//Мы можем меняем только описание производного объект
                            params.description = entry.description;
                            params.parent = entry.parent > 0 ? entry.parent :  null;
                        }
                        //если объект базовый то его менять нельзя поэтому другие параметры не задаем
                    }

                }

                $log.debug('saveHistory', params);
                dictRest.saveHistory(params, function success(data) {
                    $log.info('success');
                    append(postId, data);
                }, function error(result) {
                    $log.info('error', result);
                    //append(postId,result);//store in cache
                });

            }
        }
    }

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



_dictApp.controller('DictCtrl', function ( $log, $scope, $timeout, dictHistory, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');

    $scope.currentPost = data.post;
    $scope.selectedText =  null;
    $scope.searchProcess = null;
    $scope.searching = false;

    $scope.request = {};
    $scope.result =  {};

    $scope.history = dictHistory.get($scope.currentPost);

    if(data.text){
        $scope.selectedText = data.text;
        $scope.request.name =  data.text;
        search();
    }

    $scope.deleteSymbol = function (){
        if($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };


    $scope.copyText = function(){
        var subSearchText = dictService.getSelectedText();
        if(subSearchText){
            $scope.request.name = subSearchText;
        }
    };

    //searching
    $scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord!=oldWord ) {
            //$timeout(function(){
                search();
            //},300);
        }
    });

    function search(){
        if($scope.request.name) {
            $scope.result.item = dictService.inArray($scope.history, { name: $scope.request.name });
            if (!$scope.result.item) {
                $scope.searching = true;
                $scope.searchProcess = '?';
                $log.debug('new search:', $scope.request);
                $scope.result = dictRest.search($scope.request,
                    objectsFound,
                    objectsNotFound);
            }else{
                $log.debug('selected:',$scope.result.item.id, $scope.result.item.name);
                $scope.result.selected = $scope.result.item.id;

            }
        }else{
            $scope.result.item = null;
        }
    }

    //Error ajax loaded
    function objectsNotFound() {
        $scope.searching = false;
        $scope.searchProcess = '-';
		$log.debug('not found:' + $scope.request.name);
    }

    //Success ajax loaded
    function objectsFound(value) {
        $scope.searching = false;
        var hasLike = (value.like && value.like.length);
        if(value.item || hasLike) {
            $log.debug('found:' + $scope.request.name, $scope.result);
            $scope.result = value;
            $scope.searchProcess = $scope.result.item ? '+' : '~';

            if($scope.result.item && hasLike) {
                $scope.result.selected = $scope.result.item.id;
            }

        }else{
            objectsNotFound();
        }
    }

    //change selectbox

    $scope.$watch('result.selected', function (newId, oldId) {
        if (newId && newId!=oldId) {
            $scope.result.item = dictService.inArray($scope.result.like,{ id: newId } )
                || dictService.inArray($scope.history,{ id: newId });
        }
	});


    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        if($scope.selectedText) {
            dictHistory.add($scope.currentPost, $scope.selectedText, $scope.result.item);
        }
        $modalInstance.close();
    };

	
});

	