_tatApp.factory('tatGlossary', function ($log, tatRest,tatApp) {
    $log.debug('tatGlossary');
    var glossaries = {};

    function load(postId) {
        return tatRest.getGlossary({post: postId}, function success(data) {
            $log.debug('loaded Glossary for post', postId, ',terms count', tatApp.size(data));
        }, function (result) {
            $log.debug('error load Glossary for post ', postId, result);
        });
    }

    return {
        get: function (postId) {
            if (postId) {
                return glossaries[postId] ? glossaries[postId] : (glossaries[postId] = load(postId));
            } else {
                return null;
            }
        },

        save: function (postId, text, term, callback) {

            if (!postId || !text) {
                return;
            }
            // text is main identify
            var params = {post: postId, name: text };

            if (term) {
                if (term.name !== text) { //Выделенные текст не равено найденному слову (его id мы не знаем)
                    //Мы можем меняем только ссылку на объект (то бишь задаем родителя) для производного объекта
                    if (term.id < 2000000) {//Выбрали в combo базовое слово
                        params.parent = term.id;
                    } else { //Выбрали в combo производное слово
                        params.parent = term.parent > 0 ? term.parent : null;
                    }

                } else { //Выделенные текст равен найденному слову (его id мы не знаем)
                    params.id = term.id;
                    if (term.id > 2000000) {//Мы можем меняем только описание производного объект
                        params.description = term.description;
                        params.parent = term.parent > 0 ? term.parent : null;
                    }
                    //если объект базовый то его менять нельзя поэтому другие параметры не задаем
                }

            }

            $log.debug('addToGlossary', params);

            glossaries[postId][text] = tatRest.addToGlossary(params, function success(data) {
                $log.info('success');
                callback()
            }, function error(result) {
                $log.info('error', result);
                //append(postId,result);//store in cache
            });


        },

        delete: function (postId, term) {
            if (!postId || !term) {
                return;
            }

            if (term === glossaries[postId][term.name]) {

                if(term.id) {

                    var params = {post: postId, name: term.name, id: term.id };

                    tatRest.deleteFromGlossary(params, function success(data) {
                        delete glossaries[postId][term.name];
                        $log.info('success deleted', tatApp.size(glossaries[postId]));

                    }, function error(result) {
                        $log.info('error', result);
                        //append(postId,result);//store in cache
                    });

                }else{

                    delete glossaries[postId][term.name];

                }

            }
        }
    };

});

