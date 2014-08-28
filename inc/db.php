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
        $wpdb->enable_nulls = true;
        $this->db = $wpdb;
        $this->dict = $wpdb->prefix . 'dict_tatrus';
        $this->post = $wpdb->prefix . 'dict_post';

    }

    public function get($id){
        if(empty($id)) return null;
        return $this->db->get_row("SELECT * FROM $this->dict WHERE id = $id ");
    }

    public function find($id){
        if(empty($id)) return null;
        return $this->db->get_row("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->dict dic
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dic.id = $id ");
    }

    public function findByName($name){
        if(empty($name)) return null;
        return $this->db->get_row("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->dict dic
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dic.name = '$name' ");
    }

    public function findByPost($postId){
        if(empty($postId)) return null;
        return $this->db->get_results("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->post dp
            INNER JOIN $this->dict dic ON dic.id = dp.dict_id
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dp.post_id = $postId ");
    }

    public function findLike($name){
        if(empty($name)) return null;
        return $this->db->get_results("SELECT * FROM $this->dict WHERE name like '$name%' ");//@todo
    }

    public function create($name, $description, $parentId, $userId)
    {
        $item = array('name' => $name,
            'description' => $description,
            'parent' =>  $parentId > 0 ? $parentId : null,
            'user' => $userId
        );

        return $this->db->insert($this->dict, $item,
            $parentId>0 ? array('%s', '%s', '%d', '%d') : array( '%s', '%s', null, '%d' ));

    }

    public function modify($id, $description, $parentId, $userId)
    {
        $fields = array(
            'description' => $description,
            'parent' => $parentId > 0 ? $parentId : null,
            'user' => $userId
        );
        return $this->db->update($this->dict, $fields, array( 'id' => $id ),
            $parentId>0 ? array('%s', '%d', '%d') : array( '%s', null, '%d' ) , array('%d'));

    }

    //dictpost
    public function getPost($id, $postId, $userId)
    {
        return $this->db->get_row("SELECT * FROM $this->post WHERE dict_id = $id and post_id = $postId and user_id = $userId");
    }

    public function addPost($id, $post, $userId)
    {
        $item = array('dict_id' => $id, 'post_id' => $post, 'user_id' => $userId);
        return $this->db->insert($this->post, $item, array('%d', '%d', '%d'));
    }

    public function deletePost($id, $post, $userId)
    {
        $item = array('dict_id' => $id, 'post_id' => $post, 'user_id' => $userId);
        return $this->db->delete($this->post, $item, array('%d', '%d', '%d'));
    }


    public function lastError(){
        return $this->db->last_error;
    }


    public function insertId(){
        return $this->db->insert_id;
    }

}
