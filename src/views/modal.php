<?php $userId = get_current_user_id(); ?>
<script type="text/ng-template" id="tat_dictionary_modal.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <h4 class="modal-title">Cүзлек<span ng-if="text"> - {{ text }}</span>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </h4>
        </div>
        <div class="modal-body form form-horizontal" stop-event="touchend">


            <div class="form-group">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon btn" ng-click="prev()">
                        <i class="tat-icon fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
<!--                    <span class="input-group-addon btn" nng-click="next()">-->
<!--                        <i class="tat-icon fa fa-arrow-right" aria-hidden="true"></i>-->
<!--                    </span>-->

                    <input type="text" name="word" ng-model="request.name"
                           class="form-control tat-search-input" ng-mousedown="copyText()"
                           ng-swipe-left="addSymbol(-1)" ng-swipe-right="addSymbol(1)"
                           placeholder="Языгыз"/>

                    <span ng-show="translation.$resolved === false" class="input-group-addon btn" ng-click="search()">
                       <i class="tat-icon fa fa-refresh fa-spin" aria-hidden="true"></i>
                    </span>
                    <span ng-hide="translation.$resolved === false" class="input-group-addon btn" ng-click="search()">
                       <i ng-show="status===0" class="tat-icon fa fa-times-circle-o" aria-hidden="true"></i>
                       <i ng-show="status===1" class="tat-icon fa fa-bookmark-o" aria-hidden="true"></i>
                       <i ng-show="status===2" class="tat-icon fa fa-question-circle-o" aria-hidden="true"></i>
                       <i ng-show="status===3" class="tat-icon fa fa-search-minus" aria-hidden="true"></i>
                       <i ng-show="status===4" class="tat-icon fa fa-search" aria-hidden="true"></i>
                       <i ng-show="status===5" class="tat-icon fa fa-search-plus" aria-hidden="true"></i>
                    </span>

                </div>
<!--                 <pre>{{  request | json }}</pre>-->


            <div class="btn-toolbar">

                <div class="btn-group btn-group-sm">
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-3)">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-3,'у')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true"></i>у
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-3,'ү')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true"></i>ү
                    </button>
                </div>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-2)">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-2,'у')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i>у
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-2,'ү')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i>ү
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-2,'ау')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i>ау
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-2,'әү')">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i><i class="tat-icon fa fa-angle-left" aria-hidden="true">
                        </i>әү
                    </button>
                </div>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(-1)">
                        <i class="tat-icon fa fa-angle-left" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'у')">
                        у
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'ү')">
                        ү
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'а')">
                        а
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'ә')">
                        ә
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'к')">
                        к
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'л')">
                        л
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'м')">
                        м
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'н')">
                        н
                    </button>
                    <button type="button" class="tat-add btn btn-default" ng-click="addSymbol(0,'с')">
                        с
                    </button>
                </div>
            </div>
            </div>

            <div class="form-group" ng-if="translation.like && translation.like.length>0">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon btn" ng-click="copyLike()">
                        <i class="tat-icon fa fa-hand-o-right " aria-hidden="true"></i>
                    </span>
                    <select class="form-control" ng-model="selected.like" style="width: 100%"
                            ng-change="selectLike(selected.like)"
                            data-ng-attr-size="{{ translation.like.length > 5 ? 5 : (translation.like.length < 2 ? 2 : translation.like.length) }}"
                            ng-options="term.name as term.name for term in translation.like">
                    </select>
                </div>
                <!-- <pre>{{ selected.like | json }}</pre>-->
            </div>

            <div class="form-group" ng-show="translation.term.parent_name" ng-cloak>
                <?php if ($userId == 1): ?>
                    <textarea  class="form-control" ng-model="translation.term.description" rows="2" placeholder="Тәрҗемә"></textarea>
                <?php else: ?>
                    <textarea  class="form-control" ng-show="translation.term.description && translation.term.description.length>0"
                               ng-model="translation.term.description" readonly></textarea>
                <?php endif; ?>
            </div>

            <div class="form-group" ng-show="translation.term.parent_name">
                <h6 class="tat-search-linked">Мөнәсәбәтле сүз</h6>
                <div class="tat-search-description"
                     tat-description="translation.term.parent_description" ng-swipe-right="close()"></div>
            </div>

            <div class="form-group" ng-hide="translation.term.parent_name">
                <!-- <pre>{{ translation.term.name | json }}</pre>-->
                <!-- <pre>{{ translation.term.description | json }}</pre>-->
                <h6 class="tat-search-linked" ng-show="translation.term.description && translation.term.description.length>0">Тәрҗемә</h6>
                <div class="tat-search-description"
                     tat-description="translation.term.description" ng-swipe-right="close()"></div>
            </div>
        </div>


        <div class="modal-footer" ng-swipe-left="close()" ng-swipe-right="close()">
                <div class="input-group" ng-show="hasGlossary()" style="float:left; width:42%">
                    <span class="input-group-addon btn" ng-click="copyGlossary()">
                        <i class="fa fa-book" aria-hidden="true"></i>
                    </span>
                    <select class="form-control" ng-model="selected.glossary" placeholder="Истәлек"
                        ng-change="selectGlossary(selected.glossary)"
                        ng-options="name as name for (name, term) in glossary"></option>
                    </select>
                    <?php if ($userId > 0): ?>
                        <span class="input-group-addon btn" ng-show="inGlossary()" ng-click="deleteGlossary()">
                             <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                        <span class="input-group-addon btn" ng-hide="inGlossary()" ng-click="saveGlossary()" >
                             <i class="fa fa-bookmark-o" aria-hidden="true"></i>
                        </span>
                    <?php endif; ?>
                </div>

            <div class="btn-group">
                <?php if ($userId > 0): ?>
                <button type="button" ng-if="text" class="btn btn-default" data-dismiss="modal" ng-click="save()">
<!--                    <i class="fa fa-bookmark" aria-hidden="true"></i>-->
                    Сакларга
                </button>
                <?php endif; ?>

                <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">
<!--                    <i class="fa fa-times" aria-hidden="true"></i>-->
                    Ябырга
                </button>
            </div>

         </div>
    </div>
</script>