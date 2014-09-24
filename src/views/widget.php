<div ng-controller="SidebarCtrl" ng-init="postId = <?= $post->ID;?>" >

    <input type="checkbox" ng-model="dictConfig.enabled"/> Кабызган<br/>
    <span ng-show="dictConfig.enabled" ><input type="checkbox"ng-model="dictConfig.auto"/> Автоачылу</span>

    <hr ng-show="dictConfig.enabled && glossary && glossary.length"/>

    <ul ng-show="dictConfig.enabled && glossary" class="tat-sidebar-glossary"  >
        <li ng-repeat="(name, term) in glossary" ng-class = "{ 'tat-sidebar-term-dirty': !term.id }">
            <a href="" ng-click="goToHighlight(name)" > - </a>
            <a href="" ng-click="openDictionary(name)" title="{{term.description}}">{{ name }} <span ng-if="!term.parent_name && term.id > 2000000" >( ? )</span></a>
            <a href="" ng-if="term.parent_name" ng-click="openDictionary(term.parent_name)" title="{{term.parent_description}}">({{ term.parent_name }})</a>
        </li>
    </ul>

    <div ng-show="dictConfig.enabled" class="tat-popup-button-block" ng-click="openDictionary()" ng-swipe-left="openDictionary()">
        <div class="tat-popup-button-text" >Cүзлек</div>
    </div>

</div>
