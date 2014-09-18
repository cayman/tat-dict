_tatApp.factory('tatService', function ($log, $filter, $modal, $window, $document, $sniffer) {
    $log.debug('tatService');
    var dictionaryConfig = {
        enabled: true,
        auto: true
    };

    var modalConfig = {
        templateUrl: 'tat_dictionary_modal.html',
        controller: 'DictionaryCtrl',
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
        hashCode: function (text) {
            var hash = 0;
            try {
                for (var i = 0; i < text.length; i++) {
                    var char = text.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = (hash & hash); // Convert to 32bit integer
                }
                return hash;

            } catch (e) {
                throw new Error('hashCode: ' + e);
            }
        }

    };

});