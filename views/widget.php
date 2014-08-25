<div ng-controller="DictHandlerCtrl">

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>

    <div ng-show="dictConfig.enabled" class="dict_button_block" ng-click="dictOpen(<?= $post->ID;?>)" ng-swipe-right="dictOpen(<?= $post->ID;?>)">
        <div class="dict_button_text" >Cүзлек</div>
    </div>
</div>
