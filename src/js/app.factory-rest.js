_tatApp.factory('tatRest', function ($log, $resource, tatApp) {
    $log.debug('tatRest');

    return $resource(tatApp.getAjaxUrl(), {security: tatApp.getNonce() }, {
        search: {params: {action: 'tat_search'}},
        getGlossary: {params: {action: 'tat_get_glossary'}},
        addToGlossary: {params: {action: 'tat_save_glossary'}, timeout: 3600000 },
        deleteFromGlossary: {params: {action: 'tat_delete_glossary'}},
        getAbbreviations: { url: tatApp.getPlugUrl('js/abbr.json'), isArray: true, cache: true}
    });

});
