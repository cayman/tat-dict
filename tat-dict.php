<?php

/*
Plugin Name: Tatar dictionary
Description: Tatar-russion dictionary
Version: 1.0
Author: Zakirov Rustem
Author URI: http://zarur.ru
Plugin URI: http://zarur.ru/tat-dict
*/
error_reporting(E_ALL); 
ini_set("display_errors", 1); 

define('TATDICT_DIR', plugin_dir_path(__FILE__));
define('TATDICT_URL', plugin_dir_url(__FILE__));

add_action('wp_ajax_tatrus_search', 'tatrus_search_callback');
add_action('wp_ajax_nopriv_tatrus_search', 'tatrus_search_callback');

function tatrus_search_callback() {

	check_ajax_referer( 'ajax_post_validation', 'security' );
	$word = $_GET['name'];
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
    $ids = get_post_meta(1, 'Dictionary', true);
    if(!empty($ids )) {
        $table = 'wp_dict_tatrus';

        $result = $wpdb->get_results(
            "SELECT * FROM $table
				 WHERE id IN ($ids) ");

        header("Content-Type: application/json");
        echo json_encode($result);
    }
    die();
    //wp_send_json_success('json_encode($result)');

}

add_action('wp_ajax_tatrus_save_history', 'tatrus_save_history_callback');

function tatrus_save_history_callback() {

    check_ajax_referer( 'ajax_post_validation', 'security' );
    $ids = $_GET['ids'];
    if(!empty($ids)){
        update_post_meta( 1, 'Dictionary', $ids);
    }
    die();
    //wp_send_json_success('json_encode($result)');

}


class tatdict_widget extends WP_Widget {

	function __construct() {
		parent::__construct(
			'tatdict_widget',
			__('Tatar Dictionary Widget','tatdict_widget_domain'),
			array('description' => __('Виджет татарско-русского словаря','tatdict_widget_domain'),
			)
		);
	}
	
	public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );

		echo $args['before_widget'];
		if ( ! empty( $title ) ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }
		include( TATDICT_DIR . 'views/form.php');
		echo $args['after_widget'];
    }
	
	public function form( $instance ) {
		if ( isset( $instance[ 'title' ] ) ) {
			$title = $instance[ 'title' ];
		} else {
            $title = __( 'Cүзлек', 'tatdict_widget_domain' );
        }
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>">Заголовок</label> 
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' );?>" 
			name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" 
			value="<?php echo esc_attr( $title ); ?>" />
		</p>
		<?php 
	}
	
	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		return $instance;
	}
}

add_action( 'widgets_init', 'tatdict_load_widget' );
function tatdict_load_widget() {
    register_widget( 'tatdict_widget' );
}

add_action('wp_enqueue_scripts', 'load_tatdict_javascript');
function load_tatdict_javascript() {

    wp_enqueue_style('bootsrap', TATDICT_URL . 'lib/bootstrap/dist/css/bootstrap.css');

    /*Loading angular*/
    wp_enqueue_script('angular', TATDICT_URL . 'lib/angular/angular.js');
    wp_enqueue_script('angular-resource', TATDICT_URL . 'lib/angular-resource/angular-resource.js', array( 'angular' ));
    wp_enqueue_script('angular-cookies', TATDICT_URL . 'lib/angular-cookies/angular-cookies.js', array( 'angular' ));
    wp_enqueue_script('angular-sanitize', TATDICT_URL . 'lib/angular-sanitize/angular-sanitize.js', array( 'angular' ));
    wp_enqueue_script('angular-touch', TATDICT_URL . 'lib/angular-touch/angular-touch.js', array( 'angular' ));
    wp_enqueue_script('angular-bootstrap', TATDICT_URL . 'lib/angular-bootstrap/ui-bootstrap-tpls.js', array( 'angular' ));
	
    /*Loading App*/
    wp_enqueue_script('angular-app', TATDICT_URL . 'js/app.js', array( 'angular' ));
	
	wp_localize_script( 
        'angular-app', 
        'wp_ajax',
        array( 
              'ajaxurl'     => admin_url( 'admin-ajax.php' ),
              'ajaxnonce'   => wp_create_nonce( 'ajax_post_validation' ) 
         ) 
    );

}




?>
