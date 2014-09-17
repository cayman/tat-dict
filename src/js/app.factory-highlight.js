_tatApp.factory('tatHighlight', function ($log) {
    $log.debug('tatHighlight');

    function hashCode (text) {
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


    function getTagId(term) {
        return 't' + hashCode(term.name);
    }

    function getTagClass(term) {
        return term.id > 0 ? 'tat-highlight' : 'dict-highlight-dirty';
    }


    return {
        getTagId: getTagId,
        highlight: function (elem, term, method) {
            if (term && term.name) {
                $log.debug('highlight:',term.name);
                var start = '<a id="' + getTagId(term) + '" class="' + getTagClass(term) + '" ng-click="' + method + '(\'' + term.name + '\')">';
                var end = '</a>';
                var replaced = (term.name.length > 3) ?
                    elem.html().replace(new RegExp('(\\s)(' + term.name + ')', 'ig'), '$1' + start + '$2' + end) :
                    elem.html().replace(new RegExp('(\\s)(' + term.name + ')([,;!\\?\\.\\s])', 'ig'), '$1' + start + '$2' + end + '$3');

                elem.html(replaced);
            }
        }
    };

});

