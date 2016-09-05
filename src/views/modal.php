<?php $userId = get_current_user_id(); ?>
<script type="text/ng-template" id="tat_dictionary_modal.html">
    <div class="modal-content">
        <div class="modal-header" ng-swipe-left="close()" ng-swipe-right="close()">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="close()">
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>
            <h4 class="modal-title">Cүзлек<span ng-if="text"> - {{ text }}</span></h4>
        </div>
        <div class="modal-body form form-horizontal" stop-event="touchend">

            <div class="form-group">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon btn" ng-click="restore()">
                        <i class="tat-icon fa fa-arrow-left" aria-hidden="true"></i>
                    </span>
                    <span class="input-group-addon btn" ng-show="request.name" ng-click="deleteSymbol()">
                        <i class="tat-icon fa fa-eraser" aria-hidden="true"></i>
                    </span>
                     <input type="text" name="word" ng-model="request.name"
                           class="form-control tat-search-input" ng-mousedown="copyText()"
                           ng-swipe-left="deleteSymbol()" ng-swipe-right="restore()"
                           placeholder="Языгыз"/>
                    <span class="input-group-addon btn" ng-click="search()">
                       <i class="tat-icon fa {{ searchIcon }}" aria-hidden="true" ng-click="search()"></i>
                    </span>
                </div>
                <!-- <pre>{{  request | json }}</pre>-->
            </div>


            <div class="form-group" ng-if="translation.like && translation.like.length>0">
                <div class="input-group col-sm-12">
                    <span class="input-group-addon">
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

            <div class="row">
                <div class="col-md-6 col-sm-6" style="float:left; width:50%">
                    <div class="input-group" ng-show="hasGlossary()">
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
                </div>
                <div class="col-md-6  col-sm6" style="float:right; width:50%">
                    <?php if ($userId > 0): ?>
                    <button type="button" ng-if="text" class="btn btn-default" data-dismiss="modal" ng-click="save()">
                        <i class="fa fa-bookmark" aria-hidden="true"></i>
                        Сакларга
                    </button>
                    <?php endif; ?>

                    <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="close()">
                        <i class="fa fa-times" aria-hidden="true"></i>
                        Ябырга
                    </button>
                </div>
            </div>

        </div>
    </div>
</script>