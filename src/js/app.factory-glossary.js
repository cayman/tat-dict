_tatApp.factory('tatGlossary', function ($log, tatRest) {
    $log.debug('tatGlossary');
    var glossaries = {};

    function load(postId) {
        return tatRest.getGlossary({post: postId}, function success(data) {
            $log.debug('loaded Glossary for post', postId, ',terms count', data.length);
        }, function (result) {
            $log.debug('error load Glossary for post ', postId, result);
        });
    }

//    function append(postId, entity) {
//        var glossary = glossaries[postId];
//        if (glossary) {
//            var found = false;
//            for (var index = 0; index < glossary.length; index++) {
//                if (glossary[index].name === entity.name) {
//                    glossary[index] = entity;
//                    found = true;
//                }
//            }
//            if (!found) {
//                glossary.push(entity);
//            }
//
//        } else {
//            glossaries[postId] = [ entity ];
//        }
//    }


    return {
        get: function (postId, successCallback) {
            if (postId) {
                return glossaries[postId] ? glossaries[postId] : (glossaries[postId] = load(postId, successCallback));
            } else {
                return null;
            }
        },

        save: function (postId, text, term) {
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
            return tatRest.addToGlossary(params, function success(data) {
                $log.info('success');
            }, function error(result) {
                $log.info('error', result);
                //append(postId,result);//store in cache
            });

        }
    };

});

