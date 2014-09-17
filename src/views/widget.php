<div ng-controller="SidebarCtrl" ng-init="postId = <?= $post->ID;?>" >

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>
    <span ng-show="dictConfig.enabled" ><input type="checkbox"ng-model="dictConfig.auto"/> Автоачылу</span>

    <hr ng-show="dictConfig.enabled && glossary && glossary.length"/>

    <ul ng-show="dictConfig.enabled && glossary && glossary.length" class="tat-sidebar-glossary"  >
        <li ng-repeat="term in glossary">
            <a href="" ng-click="goToHighlight(term)" > - </a>
            <a href="" ng-click="openDictionary(term.name)" title="{{term.description}}">{{ term.name }} <span ng-if="!term.parent_name && term.id > 2000000" >( ? )</span></a>
            <a href="" ng-if="term.parent_name" ng-click="openDictionary(term.parent_name)" title="{{term.parent_description}}">({{ term.parent_name }})</a>
        </li>
    </ul>

    <div ng-show="dictConfig.enabled" class="tat-popup-button-block" ng-click="openDictionary()" ng-swipe-left="openDictionary()">
        <div class="tat-popup-button-text" >Cүзлек</div>
    </div>

</div>
