var _dictApp = angular.module('wpApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.bootstrap']);

_dictApp.factory('dictRest', function ($log, $resource) {
    var ajaxUrl = './example.json';
    var ajaxNonce = null;

    if (angular.isObject(wpAjax)) {
        ajaxUrl = wpAjax.url;
        ajaxNonce = atob(wpAjax.nonce);
    }

    function decodeResponse(response, header) {
        if(angular.isString(response) && response.trim()!=='-1' && response.trim()!=='0') {
            var jsonResponse = angular.fromJson(response);
            if (jsonResponse.success) {
                return jsonResponse.data;
            } else {
                return jsonResponse;
            }
        }
        $log.debug('error response');
        return null;
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
        });
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

