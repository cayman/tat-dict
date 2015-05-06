<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */

function _rp($param)
{
    return empty($_GET[$param]) ? null : trim($_GET[$param]);
}


add_action('wp_ajax_tat_search', 'tat_search_callback');
add_action('wp_ajax_nopriv_tat_search', 'tat_search_callback');

function tat_search_callback()
{

    check_ajax_referer('ajax_post_validation', 'security');

    $name = _rp('name');
    $userId = get_current_user_id();

    if (empty($name)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("empty name param");
    }

    $db = new TatDict();
    $result = new stdClass();
    $result->term = $db->findByName($name);
    if (!empty($userId) || ( empty($result->term) && strlen($name)>2 ))
        $result->like = $db->findLike($name);

    if (empty($result->term)) {
        if (empty($result->like)) {
            header('HTTP/1.0 404 Not Found');
            wp_send_json_error($name." not found");
        }
        else
            header('HTTP/1.0 206 Partial Content');
    }

    wp_send_json($result);

}

add_action('wp_ajax_tat_get_glossary', 'tat_get_glossary_callback');
add_action('wp_ajax_nopriv_tat_get_glossary', 'tat_get_glossary_callback');

function tat_get_glossary_callback()
{

    check_ajax_referer('ajax_post_validation', 'security');

    $post = _rp('post');
    $userId = get_current_user_id();

    if (empty($post)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("empty post param");
    }

    $db = new TatDict();
    $result = $db->findByPost($post, empty($userId) ? 1 : $userId);

    if(count($result)==0) {
        header('HTTP/1.0 404 Not Found');
        wp_send_json_error("glossary not exist");
    }

    $map = array();
    foreach ($result as $term) {
        $map[$term->name] = $term;
    }
    wp_send_json($map);

}

add_action('wp_ajax_tat_save_glossary', 'tat_save_glossary_callback');
add_action('wp_ajax_nopriv_tat_save_glossary', 'tat_save_glossary_callback');


function tat_save_glossary_callback()
{

    check_ajax_referer('ajax_post_validation', 'security');

    $userId = get_current_user_id();

    if (empty($userId)) {
        header('HTTP/1.0 401 Unauthorized');
        wp_send_json_error("save not allowed");
    }

    $post = _rp('post');
    $id = _rp('id');
    $name = _rp('name');
    $description = _rp('description');
    $parentId = _rp('parent');


    if (empty($post)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error post value");
    }

    if (empty($name)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error name value");
    }

    $db = new TatDict();
    $result = null;

    if (isset($id)) { //В параметре задан id, только для существующих объектов
        $result = ($id < 20000000) ? $db->get($id) : $db->find($id);

        if (empty($result)) {
            header('HTTP/1.0 400 Bad Request');
            wp_send_json_error("error id value, object not exist");
        }
        if ($result->name !== $name) {
            header('HTTP/1.0 404 Not Found');
            wp_send_json_error("error id value, object not exist");
        }

    } else { //id не указан, т.е слова нужно искать и если его нет то добавлять

        $result = $db->findByName($name);

        if (!empty($result))
            $id = $result->id;

        else {
            //Слово не найдено создаем новое при условии
            if (isset($parentId)) { //если родитель указан

                if ($parentId < 1000000 && $parentId > 2000000) {
                    //Родителем может быть только базовый обьект
                    header('HTTP/1.0 400 Bad Request');
                    wp_send_json_error("error parent value, mast bee [1000000-2000000]");
                }

                if ($db->get($parentId) == null) {
                    //Родитель должен существовать либо равен нулю (непривязанные объекты)
                    header('HTTP/1.0 404 Not Found');
                    wp_send_json_error("error parent value, object not exist");
                }

            }
            //если родитель не указан все равно создаем
            if ($db->create($name, $description, $parentId, $userId)) {
                $result = $db->find($db->insertId());
            }

            if (empty($result)) {
                header('HTTP/1.0 409 Conflict');
                wp_send_json_error("error create object: " . $db->lastError());

            }

            header('HTTP/1.0 201 Created');

        }

    }


    //Объект уже существует (не вновь созданный), можно модифицировать при условии
    if (isset($id) && isset($parentId) && ($id > 2000000) && ($parentId >= 1000000) && ($parentId < 2000000)) {

        //Можно подифицировать только производные объекты (базовые с ID < 2000000 запрещено)
        //Родителем может быть только базовый обьект
        $hasNewParent = ($parentId != $result->parent); //Нужно менять родителя
        if ($hasNewParent && $db->get($parentId) == null) {
            header('HTTP/1.0 404 Not Found');
            wp_send_json_error("error parent value, object not exist");
        }

        $hasNewDescription = isset($description) && ($description != $result->description); //Нужно менять описание

        //меняем или задаем родителя или описание слова
        if ($hasNewParent || $hasNewDescription) {

            $modified = $db->modify($result->id, isset($description) ? $description : $result->description, $parentId, $userId);

            if ($modified) {
                $result = $db->find($result->id);
            }

            if (empty($result)) {
                header('HTTP/1.0 409 Conflict');
                wp_send_json_error("error modify object: " . $db->lastError());
            }

            header('HTTP/1.0 202 Accepted');

        }

    }

    //Добавляем связь со статьей
    if ($db->getPost($result->id, $post, $userId) == null && !$db->addPost($result->id, $post, $userId)) {
        header('HTTP/1.0 409 Conflict');
        wp_send_json_error("error append to post:" . $db->lastError());
    }

    wp_send_json($result);

}


add_action('wp_ajax_tat_delete_glossary', 'tat_delete_glossary_callback');
add_action('wp_ajax_nopriv_tat_delete_glossary', 'tat_delete_glossary_callback');


function tat_delete_glossary_callback()
{

    check_ajax_referer('ajax_post_validation', 'security');

    $userId = get_current_user_id();

    if (empty($userId)) {
        header('HTTP/1.0 401 Unauthorized');
        wp_send_json_error("save not allowed");
    }

    $post = _rp('post');
    $id = _rp('id');
    $name = _rp('name');

    if (empty($post)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error post value");
    }

    if (empty($name)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error name value");
    }

    if (empty($id)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error id value");
    }

    $db = new TatDict();
    $result = null;

    $result = $db->get($id);

    if (empty($result)) {
        header('HTTP/1.0 400 Bad Request');
        wp_send_json_error("error id value, object not exist");
    }

    if ($result->name != $name) {
        header('HTTP/1.0 409 Conflict');
        wp_send_json_error("error name value, identifier does not match the name");
    }

    if($db->deletePost($id, $post, $userId)>0)
        wp_send_json_success("deleted");
    else{
        header('HTTP/1.0 404 Not Found');
        wp_send_json_error("error, object not exist");
    }

}