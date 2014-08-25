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
define('DICT_META','Dictionary');

require_once TATDICT_DIR .'inc/ajax.php';
require_once TATDICT_DIR .'inc/widget.php';
require_once TATDICT_DIR .'inc/script.php';


?>
