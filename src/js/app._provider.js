_tatApp.provider('tatApp', function () {
    console.log('tatApp.provider');
    var dictionaryConfig = null;
    var modalConfig = null;

    this.setDictionaryConfig = function (config) {
        dictionaryConfig = config;
    };

    this.setModalConfig = function (config) {
        modalConfig = config;
    };

    var ajaxUrl = './example.json';
    var ajaxNonce = null;
    var plugUrl = '';

    this.setParams = function (params) {
        if (angular.isObject(params)) {
            ajaxUrl = params.ajax;
            ajaxNonce = atob(params.nonce);
            plugUrl = params.url;
        }
    };


    this.$get = function ($log, $filter, $modal, $window, $document, $sniffer) {
        var msie = $sniffer.msie;
        var history = [];
        return {
            getConfig: function () {
                return dictionaryConfig;
            },
            getAjaxUrl: function () {
                return ajaxUrl;
            },
            getPlugUrl: function (name) {
                return plugUrl+name;
            },
            getNonce: function () {
                return ajaxNonce;
            },
            getSelectedText: function () {
                var selectedText = null;
                var selection;

                if (msie) {
                    selection = $document.selection;
                    selectedText = selection.createRange().text;
                } else {
                    selection = $window.getSelection();
                    selectedText = (selection.rangeCount) > 1 ? selection.getRangeAt(0).toString() : selection.toString();
                }

                $log.debug('selected', selectedText);

                return (selectedText && selectedText.trim().length > 1) ? selectedText.trim() : null;
            },

            inArray: function (arr, key, comparator) {
                return (arr && arr.length > 0) ? ( $filter('filter')(arr, {name:key}, comparator)[0] || null) : null;
            },
            openDictionary: function (postId, text) {
                var data = {
                    text: text,
                    post: postId
                };
                $log.debug('openDictionary', data);
                modalConfig.resolve.data = function () {
                    return data;
                };
                $modal.open(modalConfig);
            },

            getId: function (text) {
                var hash = 0;
                try {
                    for (var i = 0; i < text.length; i++) {
                        var char = text.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = (hash & hash); // Convert to 32bit integer
                    }
                    return 'a' + hash.toString(16);

                } catch (e) {
                    throw new Error('hashCode: ' + e);
                }
            },

            getHistory: function(){
                return  history;
            },

            size: function (map){
                var i = 0;
                if(map){
                    for (var name in map) {
                        if (map.hasOwnProperty(name) && name.charAt(0)!=='$') {
                            i++;
                        }
                    }
                }
                return i;
            },

            forEach: function (list,callback, compare) {
                var comparable = null;
                var num = 1;
                if(compare){
                    if(angular.isFunction(compare)) {
                        comparable = compare;
                    }else{
                        comparable = function(name,value){
                            return name.substr(0,compare.length)=== compare;
                        };
                    }
                }
                if(angular.isArray(list)){
                    for (var item in list) {
                        if ((!comparable || comparable(item, list[name]))) {
                            callback(item, item, num++);
                        }
                    }
                }else {
                    for (var key in list) {
                        if (list.hasOwnProperty(key) && (!comparable || comparable(key, list[key]))) {
                            callback(key, list[key], num++);
                        }
                    }
                }
            }

        };
    };
});