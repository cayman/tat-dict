<div ng-controller="DictHandlerCtrl" ng-init="postId = <?= $post->ID;?>" >

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>
    <span ng-show="dictConfig.enabled" ><input type="checkbox"ng-model="dictConfig.auto"/> Автоачылу</span>

    <hr ng-show="dictConfig.enabled && dictionary && dictionary.length"/>

    <ul ng-show="dictConfig.enabled && dictionary && dictionary.length" class="dict_search_history"  >
        <li ng-repeat="item in dictionary">
            <a href="#dic{{ item.id }}">-</a>
            <a href="#" ng-click="dictOpen(item.name)" title="{{item.description}}">{{ item.name }} <span ng-if="!item.parent_name && item.id > 2000000" >( ? )</span></a>
            <a href="#" ng-if="item.parent_name" ng-click="dictOpen(item.parent_name)" title="{{item.parent_description}}">({{ item.parent_name }})</a>
        </li>
    </ul>

    <div ng-show="dictConfig.enabled" class="dict_button_block" ng-click="dictOpen()" ng-swipe-left="dictOpen()">
        <div class="dict_button_text" >Cүзлек</div>
    </div>

</div>
