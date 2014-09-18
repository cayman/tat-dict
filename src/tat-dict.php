<?php

/*
Plugin Name: {{name}}
Description: {{description}}
Version: {{version}}
Author: {{author}}
*/
error_reporting(E_ALL);
ini_set("display_errors", 1);

define('TATDICT_DIR', plugin_dir_path(__FILE__));
define('TATDICT_URL', plugin_dir_url(__FILE__));
define('DICT_META','Dictionary');

require_once TATDICT_DIR .'inc/db.php';
require_once TATDICT_DIR .'inc/ajax.php';
require_once TATDICT_DIR .'inc/widget.php';

add_action('wp_enqueue_scripts', 'load_tatdict_javascript');

function load_tatdict_javascript() {

    wp_enqueue_style('bootstrap', TATDICT_URL . 'lib/bootstrap/dist/css/bootstrap.css',array(),'3.1.1');
    wp_enqueue_style('dictionary', TATDICT_URL . 'css/dictionary.css', array('style','bootstrap'),'{{version}}');

    /*Loading angular*/
    wp_enqueue_script('angular', TATDICT_URL . 'lib/angular/angular.js', array(),'1.3.0');
    wp_enqueue_script('angular-resource', TATDICT_URL . 'lib/angular-resource/angular-resource.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-cookies', TATDICT_URL . 'lib/angular-cookies/angular-cookies.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-sanitize', TATDICT_URL . 'lib/angular-sanitize/angular-sanitize.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-touch', TATDICT_URL . 'lib/angular-touch/angular-touch.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-animate', TATDICT_URL . 'lib/angular-animate/angular-animate.js', array( 'angular' ),'1.3.0');

    wp_enqueue_script('aes', 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js', array( 'angular' ),'3.1.2');
    wp_enqueue_script('mode-ecb', 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/mode-ecb.js', array( 'angular' ),'3.1.2');

    wp_enqueue_script('angular-bootstrap', TATDICT_URL . 'lib/angular-bootstrap/ui-bootstrap-tpls.js', array( 'angular' ),'0.11.0');

    /*Loading App*/
    wp_enqueue_script('angular-app', TATDICT_URL . '{{js}}', array( 'angular-bootstrap' ),'{{version}}');

    wp_localize_script(
        'angular-app',
        'wpAjax',
        array(
            'url'     => admin_url( 'admin-ajax.php' ),
            'nonce'   => base64_encode(wp_create_nonce( 'ajax_post_validation' ))
        )
    );
}


?>

