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

add_action('wp_enqueue_scripts', 'load_tat_javascript');

function load_tat_javascript() {

    wp_enqueue_style('bootstrap', TATDICT_URL . 'lib/bootstrap.min.css',array(),'{{bootstrap}}');

    wp_enqueue_style('font-awesome', 'http://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css',array(),'4.6.3');

    wp_enqueue_style('{{name}}-style', TATDICT_URL . 'css/{{name}}.min.css', array('style','font-awesome','bootstrap'),'{{version}}');

    /*Loading angular*/
    wp_enqueue_script('js-yaml', TATDICT_URL . 'lib/js-yaml.min.js', array(),'{{js-yaml}}');

    wp_enqueue_script('angular', TATDICT_URL . 'lib/angular.min.js', array('js-yaml'),'{{angular}}');
    wp_enqueue_script('angular-animate', TATDICT_URL . 'lib/angular-animate.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-aria', TATDICT_URL . 'lib/angular-aria.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-cookies', TATDICT_URL . 'lib/angular-cookies.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-messages', TATDICT_URL . 'lib/angular-messages.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-resource', TATDICT_URL . 'lib/angular-resource.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-sanitize', TATDICT_URL . 'lib/angular-sanitize.min.js', array( 'angular' ),'{{angular}}');
    wp_enqueue_script('angular-touch', TATDICT_URL . 'lib/angular-touch.min.js', array( 'angular' ),'{{angular}}');


    wp_enqueue_script('angular-bootstrap', TATDICT_URL . 'lib/ui-bootstrap-tpls.min.js', array( 'angular' ),'{{angular-bootstrap}}');

    /*Loading App*/
    wp_enqueue_script('{{name}}-app', TATDICT_URL . 'js/{{name}}.min.js', array( 'angular-bootstrap' ),'{{version}}');

    wp_localize_script(
        '{{name}}-app',
        'appParams',
        array(
            'ajax'     => admin_url( 'admin-ajax.php' ),
            'url'     => TATDICT_URL,
            'nonce'   => base64_encode(wp_create_nonce( 'ajax_post_validation' ))
        )
    );
//
//    wp_localize_script('angular-app', 'ql',
//        "angular.element(document).ready(function() {
//            angular.bootstrap(document, ['tatApp']);
//        });"
//    );

}
