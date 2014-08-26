<?php
/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */

class DBDict{
    private $db,$dict,$post;

    function __construct() {
        global $wpdb;
        $this ->db = $wpdb;
        $this ->dict = $wpdb->prefix . 'dict_tatrus';
        $this ->post = $wpdb->prefix . 'dict_post';
    }

    public function get($id){
        if(empty($id)) return null;
        return $this->db->get_row("SELECT * FROM $this->dict WHERE id = $id ");
    }

    public function getByName($name){
        if(empty($name)) return null;
        return $this->db->get_row("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->dict dic
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE name = '$name' ");
    }

    public function findByPost($post){
        if(empty($post)) return null;
        return $this->db->get_results("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->post dp
            INNER JOIN $this->dict dic ON dic.id = dp.dict_id
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dp.post_id = $post ");
    }

    public function findLike($name){
        if(empty($name)) return null;
        return $this->db->get_results("SELECT * FROM $this->dict WHERE name like '$name%' && id < 2000000 ");//@todo
    }

    public function create($name, $description, $parent)
    {
        $item = array('name' => $name,
            'description' => $description,
            'parent' => isset($parent)? $parent->id : null,
            'user' => get_current_user_id()
        );
        $this->db->insert($this->dict, $item, array('%s', '%s', '%d', '%d'));
        $item['id'] = $this->db->insert_id;
        $item['parent_name'] = $parent->name;
        $item['parent_description'] = $parent->description;
        return (Object) $item;
    }

    public function modify($id, $name, $description, $parent)
    { //@todo
//        $item = array('name' => $name,
//            'description' => $description,
//            'parent' => $parent
//        );
//        $this->db->update($this->dict, $item, array('%s', '%s', '%d'));
//        $item['id'] = $this->db->insert_id;
//        return  $item;
    }

    //dictpost
    public function addPost($id, $post)
    {
        if(empty($id)) return null;
        $row = $this->db->get_row("SELECT * FROM $this->post WHERE dict_id = $id and post_id = $post ");
        if(empty($row)) {
            $user = get_current_user_id();
            $item = array('dict_id' => $id, 'post_id' => $post, 'user_id' => $user);
            $this->db->insert($this->post, $item, array('%d', '%d'));
        }
    }


}
