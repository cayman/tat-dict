<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:05
 */
add_action('wp_enqueue_scripts', 'load_tatdict_javascript');

function load_tatdict_javascript() {

    wp_enqueue_style('bootsrap', TATDICT_URL . 'lib/bootstrap/dist/css/bootstrap.css');
    wp_enqueue_style('dictionary', TATDICT_URL . 'css/dictionary.css');

    /*Loading angular*/
    wp_enqueue_script('angular', TATDICT_URL . 'lib/angular/angular.js', array(),'1.3.0');
    wp_enqueue_script('angular-resource', TATDICT_URL . 'lib/angular-resource/angular-resource.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-cookies', TATDICT_URL . 'lib/angular-cookies/angular-cookies.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-sanitize', TATDICT_URL . 'lib/angular-sanitize/angular-sanitize.js', array( 'angular' ),'1.3.0');
    wp_enqueue_script('angular-touch', TATDICT_URL . 'lib/angular-touch/angular-touch.js', array( 'angular' ),'1.3.0');

//    wp_enqueue_script('angularjs-crypto', TATDICT_URL . 'lib/angularjs-crypto/public/js/lib/angularjs-crypto.js', array( 'angular' ),'0.0.2');
    wp_enqueue_script('aes', 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js', array( 'angular' ),'3.1.2');
    wp_enqueue_script('mode-ecb', 'http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/mode-ecb.js', array( 'angular' ),'3.1.2');

    wp_enqueue_script('angular-bootstrap', TATDICT_URL . 'lib/angular-bootstrap/ui-bootstrap-tpls.js', array( 'angular' ),'0.11.0');

    /*Loading App*/
    wp_enqueue_script('angular-app', TATDICT_URL . 'js/app.js', array( 'angular-bootstrap' ),'0.0.1');

    wp_localize_script(
        'angular-app',
        'wp_ajax',
        array(
            'ajaxurl'     => admin_url( 'admin-ajax.php' ),
            'ajaxnonce'   => base64_encode(wp_create_nonce( 'ajax_post_validation' ))
        )
    );
}


//<script type='text/javascript' src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js"></script>
//<script type='text/javascript' src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/mode-ecb.js"></script>