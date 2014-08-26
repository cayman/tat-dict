<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */

function _rp($param){
    return empty($_GET[$param])? null:$_GET[$param];
}

add_action('wp_ajax_tatrus_search', 'tatrus_search_callback');
add_action('wp_ajax_nopriv_tatrus_search', 'tatrus_search_callback');

function tatrus_search_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    $name = _rp('name');
    if(isset($name)){
        $db = new DBDict();
        $result = new stdClass();
        $result->item = $db->getByName($name);
        $result->like = $db->findLike($name);
        wp_send_json($result);
    }else{
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("empty name param");
    }
    //wp_send_json_success('json_encode($result)');

}

add_action('wp_ajax_tatrus_get_history', 'tatrus_get_history_callback');
add_action('wp_ajax_nopriv_tatrus_get_history', 'tatrus_get_history_callback');

function tatrus_get_history_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    $post = _rp('post');
    if(empty($post)){
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("empty post param");
    }
    $db = new DBDict();
    $result = $db->findByPost($_GET['post']);
    wp_send_json($result);

}

add_action('wp_ajax_tatrus_save_history', 'tatrus_save_history_callback');


function tatrus_save_history_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );


    $post = _rp('post');
    $id = _rp('id');
    $name = _rp('name');
    $description = _rp('description');


    if(empty($name)){
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error name value");
    }

    if(empty($post)){
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error post value");
    }

    $db = new DBDict();

    $result = $db->getByName($name);

    if(isset($result)) {
        //Объект с таким именем уже существует
        if(isset($id) && ($id < 2000000) && ($result->id > 2000000)) {
            //Можно подифицировать только производные объекты (базовые $id < 2000000 запрещено)
            //Родителем может быть только базовый обьект
            $hasNewParent =  ($id != $result->parent);
            if ($hasNewParent) {

                $parent = $db->get($id);
                if(empty($parent)){
                    header('HTTP/1.0 404 Not Found');
                    wp_send_json_error("error id value, object not exist");
                }

            }
            $hasNewDescription = isset($description) && ($description != $result->$description);

            //меняем или задаем родителя или содержимое слова
            if($hasNewParent || $hasNewDescription){
                if (empty($description)) $description = $result->$description;
                $result = $db->modify($result->id, $name, $description, $id);
            }

        }
    }else{
        //Слово не найдено создаем при условии
        $parent = null;
        if(isset($id)) {

            if ($id > 2000000) {
                //Родителем может быть только базовый обьект
                header('HTTP/1.0 400 Bad Request');
                wp_send_json_error("error id value, mast bee > 2000000");
            }
            $parent = $db->get($id);
            if (empty($parent)){
                //Родитель должен существовать либо равен нулю (непривязанные объекты)
                header('HTTP/1.0 404 Not Found');
                wp_send_json_error("error id value, object not exist");
            }
        }
        header('HTTP/1.0 201 Created');
        $result = $db->create($name, $description, $parent );
    }

    //Добавляем связь со статьей
    $db->addPost($result->id,$post);

    wp_send_json($result);

    //wp_send_json_success('json_encode($result)');

}
