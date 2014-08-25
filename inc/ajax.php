<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */

add_action('wp_ajax_tatrus_search', 'tatrus_search_callback');
add_action('wp_ajax_nopriv_tatrus_search', 'tatrus_search_callback');

function tatrus_search_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    $word = $_GET['name'];
    header( "Content-Type: application/json" );
    if(!empty($word)){
        global $wpdb;
        $table = 'wp_dict_tatrus';
        $result->item = $wpdb->get_row(
            "SELECT * FROM $table
				 WHERE name = '$word' ");

        $result->like = $wpdb->get_results(
            "SELECT * FROM $table
				 WHERE name like '$word%' ");

        header( "Content-Type: application/json" );
        echo json_encode($result);
    }
    die();
    //wp_send_json_success('json_encode($result)');

}

add_action('wp_ajax_tatrus_get_history', 'tatrus_get_history_callback');

function tatrus_get_history_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    global $wpdb;
    $post = $_GET['post'];
    if(!empty($post)) {
        $ids = get_post_meta($post, DICT_META, true);

        if(!empty($post)) {
            $table = 'wp_dict_tatrus';

            $result = $wpdb->get_results(
                "SELECT * FROM $table
				 WHERE id IN ($ids) ");

            header("Content-Type: application/json");
            echo json_encode($result);
        }
    }
    die();
    //wp_send_json_success('json_encode($result)');

}

add_action('wp_ajax_tatrus_save_history', 'tatrus_save_history_callback');

function tatrus_save_history_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    $id = $_GET['id'];
    $post = $_GET['post'];
    if(!empty($id) && !empty($post)){
        $ids = get_post_meta($post, DICT_META, true);
        $ids = empty($ids) ? $id : $ids .','.$id;
        update_post_meta( $post, DICT_META, $ids);
    }
    die();
    //wp_send_json_success('json_encode($result)');

}
