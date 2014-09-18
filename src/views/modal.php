<?php $userId = get_current_user_id(); ?>
<script type="text/ng-template" id="tat_dictionary_modal.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">×</button>
            <h4 class="modal-title">Cүзлек<span ng-if="selectedText"> - {{ selectedText }}</span></h4>
        </div>
        <div class="modal-body" stop-event="touchend">
            <div>
                <input type="text" ng-model="request.name"
                       class="tat-search-input" ng-mousedown="copyText()"
                       ng-swipe-left="deleteSymbol()" ng-swipe-right="restore()"
                       placeholder="Языгыз"/><span ng-class="searchIcon">&nbsp;</span><br/>

                <select ng-if="out.like && out.like.length"  ng-model="out.selected" size="5" style="width: 180px">
                    <option ng-repeat="term in out.like"	value="{{ term.name }}"
                            ng-selected="{{term.id === out.term.id}}" ng-bind="term.name"/>
                </select><span ng-if="out.like && out.like.length" class="tat-search-icon-like">&nbsp;</span>
                <br ng-if="out.like && out.like.length"/>

                <select ng-if="glossary" ng-model="out.selected" style="width: 180px"
                        placeholder="Истәлек">
                    <option ng-repeat="(name, term) in glossary"	value="{{ name }}"
                            ng-selected="{{term.id === out.term.id}}" ng-bind="name"/>
                </select><span ng-if="glossary && glossary.length" class="tat-search-icon-glossary">&nbsp;</span>

            </div>
            <div ng-show="!out.term.parent_name" class="tat-search-result" ng-swipe-left="close()" ng-swipe-right="close()">
                <div class="tat-search-description" ng-bind-html="out.term.description"></div>
            </div>
            <div ng-show="out.term.parent_name" class="tat-search-result" ng-swipe-left="close()" ng-swipe-right="close()">
                <textarea ng-model="out.term.description"<?php echo ($userId !== 1) ? ' readonly': '' ?>></textarea>
                <h4>мөнәсәбәтле сүз</h4>
                <div class="tat-search-description" ng-bind-html="out.term.parent_description"></div>
            </div>
        </div>
<!--        <pre>{{ request | json }}</pre>-->
<!--        <pre>{{ out.term | json }}</pre>-->
        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">Ябырга</button>
            <?php if($userId>0){ ?>
            <button type="button" ng-if="selectedText" class="btn btn-primary" data-dismiss="modal" ng-click="save()">Сакларга</button>
            <?php } ?>
        </div>
    </div>
</script>