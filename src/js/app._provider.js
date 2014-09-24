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
    var img = '';

    this.setAjax = function (ajax) {
        if (angular.isObject(ajax)) {
            ajaxUrl = ajax.url;
            img = ajax.img;
            ajaxNonce = atob(ajax.nonce);
        }
    };


    this.$get = function ($log, $filter, $modal, $window, $document, $sniffer) {
        var msie = $sniffer.msie;
        var history = [];
        return {
            getConfig: function () {
                return dictionaryConfig;
            },
            getUrl: function () {
                return ajaxUrl;
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

            inArray: function (arr, criteria, comparator) {
                return (arr && arr.length > 0) ? ( $filter('filter')(arr, criteria, comparator)[0] || null) : null;
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
            getImage: function (name) {
                return img + name;
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
            }

        };
    };
});