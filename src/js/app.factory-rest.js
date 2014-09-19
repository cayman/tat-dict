_tatApp.factory('tatRest', function ($log, $resource, tatApp) {
    $log.debug('tatRest');

    return $resource(tatApp.getUrl(), {}, {
        search: {params: {security: tatApp.getNonce(), action: 'tat_search', cache: true}},
        getGlossary: {params: {security: tatApp.getNonce(), action: 'tat_get_glossary'}},
        addToGlossary: {params: {security: tatApp.getNonce(), action: 'tat_save_glossary'}},
        deleteFromGlossary: {params: {security: tatApp.getNonce(), action: 'tat_delete_glossary'}}
    });

});
