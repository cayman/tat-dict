<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */

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
        $post = $GLOBALS['post'];

        echo $args['before_widget'];
        if ( ! empty( $title ) ) {
            echo $args['before_title'] . $title . $args['after_title'];
        }

        include( TATDICT_DIR . 'views/widget.php');
        include( TATDICT_DIR . 'views/modal.php');

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