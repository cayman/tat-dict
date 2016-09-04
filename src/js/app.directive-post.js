_tatApp.directive('tatPost', function ($log, tatApp, tatGlossary, $compile) {
    $log.debug('directive.tat-post');

    function countWords(str) {
        return str.split(/\s+/).length;
    }

    return function (scope, elem, attrs) {
        var postId = attrs.tatPost;
        var config = tatApp.getConfig();
        var post = elem.html();
        scope.glossary = tatGlossary.get(postId);

        elem.on('mouseup', function (ev) {
            if (config.enabled && config.auto) {
                var text = tatApp.getSelectedText();
                if (text && text.length < 100 && countWords(text)<4) {
                    tatApp.openDictionary(ev, postId, text);
                }
            }
        });

        scope.open = function (ev, name) {
            $log.info('open dialog', name);
            if (config.enabled && name) {
                tatApp.openDictionary(ev, postId, name);
            }
        };


        function highlight(post, name) {
            var start = '<highlight name="' + name + '">';
            var end = '</highlight>';
            return (name.length > 3) ?
                post.replace(new RegExp('([-,;:!>\\s«])(' + name + ')', 'ig'), '$1' + start + '$2' + end) :
                post.replace(new RegExp('([-,;:!>\\s«])(' + name + ')([-,;:!\\?\\.\\s])', 'ig'), '$1' + start + '$2' + end + '$3');

        }

        scope.$watch('glossary', function (list, oldList) {
            $log.info('highlight items', tatApp.size(list));
            if (list !== null) {
                var _post = post;
                for (var name in scope.glossary) {
                    if (scope.glossary.hasOwnProperty(name) && name.charAt(0)!=='$') {
                        _post = highlight(_post, name);
                    }
                }
                elem.html(_post);
                $compile(elem.contents())(scope);
            }
        }, true);

    };
});
