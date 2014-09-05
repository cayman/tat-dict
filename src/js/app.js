var _dictApp = angular.module('wpApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.bootstrap']);

_dictApp.factory('dictRest', function ($log, $resource) {
    var ajaxUrl = "./example.json";
    var ajaxNonce = null;

    if (angular.isObject(wp_ajax)) {
        ajaxUrl = wp_ajax.ajaxurl;
        ajaxNonce = atob(wp_ajax.ajaxnonce);
    }

    function decodeResponse(response, header) {
        if(angular.isString(response) && response.trim()!=-1 && response.trim()!=0) {
            var jsonResponse = angular.fromJson(response);
            if (jsonResponse.success) {
                return jsonResponse.data;
            } else {
                return jsonResponse;
            }
        }
        $log.debug('error response');
        return null
    }

    return $resource(ajaxUrl, {}, {
        search: {params: {security: ajaxNonce, action: 'tatrus_search'}, cache: true,  transformResponse:  decodeResponse},
        getHistory: {params: {security: ajaxNonce, action: 'tatrus_get_history'}, isArray: true,  transformResponse:  decodeResponse },
        saveHistory: {params: {security: ajaxNonce, action: 'tatrus_save_history'} ,  transformResponse:  decodeResponse}
    });

});


_dictApp.factory('dictService', function ($log, $filter, $modal, $window, $document, $sniffer) {
    var dictionaryConfig = {
        enabled: true,
        auto: true
    };

    var modalConfig = {
        templateUrl: 'dictModalContent.html',
        controller: 'dictCtrl',
        backdrop: 'static',
        keyboard: true,
        resolve: {
            data: null
        }
    };

    return {
        getConfig: function () {
            return dictionaryConfig;
        },
        getSelectedText: function () {
            var selectedText = null;
            var selection;

            if (!$sniffer.msie) {
                selection = $window.getSelection();
                selectedText = (selection.rangeCount) > 1 ? selection.getRangeAt(0).toString() : selection.toString();
            } else {
                selection = $document.selection;
                selectedText = selection.createRange().text;
            }

            $log.debug('selected', selectedText );

            return (selectedText && selectedText.trim().length > 1) ? selectedText.trim() : null;
        },

        inArray: function (arr, criteria) {
            return (arr && arr.length > 0) ? ( $filter('filter')(arr, criteria, true)[0] || null) : null;
        },
        openModal: function (postId, text) {
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

    };

});

_dictApp.factory('dictHistory', function ($log, dictRest) {

    var dictionaryHistory = {};


    function load(postId) {
        return dictRest.getHistory({post: postId}, function success(data) {
            $log.debug('loaded history post=' + postId + ' items=' + data.length);
        }, function (result) {
            $log.debug('error load history post=' + postId, result);
            return [];
        })
    }

    function append(postId, entry) {
        var dictionary = dictionaryHistory[postId];
        if (dictionary) {
            var found = false;
            for (var index = 0; index < dictionary.length; index++) {
                if (dictionary[index].name === entry.name) {
                    dictionary[index] = entry;
                    found = true;
                }
            }
            if (!found) {
                dictionary.push(entry);
            }

        } else {
            dictionaryHistory[postId] = [ entry ];
        }
    }


    return {
        get: function (postId, successCallback) {
            if (postId) {
                return dictionaryHistory[postId] ? dictionaryHistory[postId] : (dictionaryHistory[postId] = load(postId, successCallback));
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
                            params.parent = entry.parent > 0 ? entry.parent : null;
                        }

                    } else { //Выделенные текст равен найденному слову (его id мы не знаем)
                        params.id = entry.id;
                        if (entry.id > 2000000) {//Мы можем меняем только описание производного объект
                            params.description = entry.description;
                            params.parent = entry.parent > 0 ? entry.parent : null;
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


_dictApp.directive('dictWatch', function ($log, $modal, dictService, dictHistory, $compile) {
    $log.info('DictShowCtrl');
    return function (scope, elem, attrs) {
        var postId = attrs.dictWatch;
        var config = dictService.getConfig();
        scope.history = dictHistory.get(postId);

        elem.on('mouseup', function () {
            if (config.enabled && config.auto) {
                var text = dictService.getSelectedText();
                if (text && text.length < 100) {
                    dictService.openModal(postId, text);
                }
            }
        });

        scope.highlightOpen = function (id) {
            $log.info('highlightOpen', id);
            if (config.enabled) {
                scope.history.forEach(function (item) {
                    if (item.id == id) {
                        dictService.openModal(postId, item.name);
                    }
                });
            }
        };

        function highlight(item) {
            if (item && item.name) {
                var tag = '<a name="dic' + item.id + '" class="dict_word" ng-click="highlightOpen(' + item.id + ')">' + item.name + '</a>';
                var replaced = (item.name.length > 3) ?
                    elem.html().replace(new RegExp('\\s' + item.name, 'ig'), ' ' + tag) :
                    elem.html().replace(new RegExp('\\s' + item.name + '\\s', 'ig'), ' ' + tag + ' ');

                elem.html(replaced);
            }
        }

        scope.$watch('history', function (list, oldList) {
            if (list.length !== oldList.length) {
                $log.info('highlight items', scope.history.length);
                scope.history.forEach(highlight);
                $compile(elem.contents())(scope);
            }
        }, true);

    }
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

_dictApp.controller('dictHandlerCtrl', function ($log, $scope, dictService, dictHistory) {
    $log.info('DictHandlerCtrl:' + $scope.postId);
    $scope.dictConfig = dictService.getConfig();
    $scope.dictionary = null;

    $scope.$watch('postId', function (postId) {
        $log.info('postId:' + $scope.postId);
        $scope.dictionary = dictHistory.get(postId);
    });

    $scope.dictOpen = function (text) {
        if ($scope.dictConfig.enabled) {
            dictService.openModal($scope.postId, text || dictService.getSelectedText());
        }
    }

});


_dictApp.controller('dictCtrl', function ($log, $scope, $timeout, dictHistory, dictRest, dictService, $modalInstance, data) {
    $log.info('DictCtrl');

    $scope.currentPost = data.post;
    $scope.selectedText = null;
    $scope.searchClass = 'dpfx_empty';
    $scope.searching = false;
    $scope.history = dictHistory.get($scope.currentPost);

    $scope.request = {};
    $scope.result = {};

    if (data.text) {
        $scope.request.name = $scope.selectedText = data.text;
        search();
    }


    $scope.deleteSymbol = function () {
        if ($scope.request.name && $scope.request.name.length > 2) {
            $scope.request.name = $scope.request.name.slice(0, -1);
        }
    };


    $scope.copyText = function () {
        var subSearchText = dictService.getSelectedText();
        if (subSearchText) {
            $scope.request.name = subSearchText;
        }
    };

    var searchWord = null;
    //searching
    $scope.$watch('request.name', function (newWord, oldWord) {
        if (newWord && newWord != oldWord) {
            searchWord = newWord;
            $timeout(function () {
                if (searchWord === newWord) {
                    search();
                }
            }, 900);
        }
    });

    function search() {
        if ($scope.request.name) {
            $scope.result.item = dictService.inArray($scope.history, { name: $scope.request.name });

            if (!$scope.result.item) {
                $scope.searching = true;
                $scope.searchClass = 'dpfx_process';
                $log.debug('new search:', $scope.request);
                $scope.result = dictRest.search($scope.request,
                    objectsFound,
                    objectsNotFound);
            } else {
                $scope.searchClass = 'dpfx_history';
                $log.debug('selected:', $scope.result.item.id, $scope.result.item.name);
                $scope.result.selected = $scope.result.item.id;

            }
        } else {
            $scope.result.item = null;
        }
    }

    //Error ajax loaded
    function objectsNotFound(result) {
        $scope.searching = false;
        $scope.searchClass = 'dpfx_error';
        $log.debug('not found:', result);
    }

    //Success ajax loaded
    function objectsFound(value) {
        $scope.searching = false;
        var hasLike = (value.like && value.like.length);
        if (value.item || hasLike) {
            $log.debug('found:', $scope.result);
            $scope.result = value;
            $scope.searchClass = $scope.result.item ? 'dpfx_success' : 'dpfx_like';

            if ($scope.result.item && hasLike) {
                $scope.result.selected = $scope.result.item.id;
            }

        } else {
            objectsNotFound(value);
        }
    }

    //change selectbox

    function decodeDescription(value){
        return value;
//        atob(CryptoJS.AES.decrypt($scope.result.raw, 'zarur',{
//              mode: mode,
//                padding: padding
//            }
    }

    $scope.$watch('result.selected', function (newId, oldId) {
        if (newId && newId != oldId) {
            $scope.result.item = dictService.inArray($scope.result.like, { id: newId })
                || dictService.inArray($scope.history, { id: newId });

//            if($scope.result.item) {
//                if (!$scope.result.item._description && $scope.result.item.description ) {
//                    $scope.result.item._description = decodeDescription($scope.result.item.description);
//                }
//                if (!$scope.result.item._parent_description && $scope.result.item._parent_description ) {
//                    $scope.result.item._parent_description = decodeDescription($scope.result.item._parent_description);
//                }
//            }
        }
    });




    //closing

    $scope.close = function (result) {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        if ($scope.selectedText) {
            dictHistory.add($scope.currentPost, $scope.selectedText, $scope.result.item);
        }
        $modalInstance.close($scope.selectedText);
    };

});