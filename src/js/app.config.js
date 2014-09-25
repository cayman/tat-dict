_tatApp.config(function(tatAppProvider){
    console.log('tatApp.config');

    tatAppProvider.setParams(appParams);

    tatAppProvider.setDictionaryConfig({
        enabled: true,
        auto: true
    });

    tatAppProvider.setModalConfig({
        templateUrl: 'tat_dictionary_modal.html',
        controller: 'DictionaryCtrl',
        backdrop: 'static',
        keyboard: true,
        resolve: {
            data: null
        }
    });


});