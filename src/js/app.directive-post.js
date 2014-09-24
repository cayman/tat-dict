_tatApp.directive('tatPost', function ($log, $modal, tatApp, tatGlossary, $compile) {
    $log.debug('directive.tat-post');

    return function (scope, elem, attrs) {
        var postId = attrs.tatPost;
        var config = tatApp.getConfig();
        var post = elem.html();
        scope.glossary = tatGlossary.get(postId);

        elem.on('mouseup', function () {
            if (config.enabled && config.auto) {
                var text = tatApp.getSelectedText();
                if (text && text.length < 100) {
                    tatApp.openDictionary(postId, text);
                }
            }
        });

        scope.open = function (name) {
            $log.info('open dialog', name);
            if (config.enabled && name) {
                tatApp.openDictionary(postId, name);
            }
        };


        function highlight(post, name) {
            var start = '<highlight name="' + name + '">';
            var end = '</highlight>';
            return (name.length > 3) ?
                post.replace(new RegExp('([\\s«])(' + name + ')', 'ig'), '$1' + start + '$2' + end) :
                post.replace(new RegExp('([\\s«])(' + name + ')([-,;:!\\?\\.\\s])', 'ig'), '$1' + start + '$2' + end + '$3');

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
