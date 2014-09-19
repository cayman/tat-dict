<?php

/**
 * Created by IntelliJ IDEA.
 * User: zakirov
 * Date: 25.08.2014
 * Time: 16:03
 */
class TatDict
{
    private $db, $dict, $post;

    function __construct()
    {
        global $wpdb;
        $wpdb->enable_nulls = true;
        $this->db = $wpdb;
        $this->dict = $wpdb->prefix . 'dict_tatrus';
        $this->post = $wpdb->prefix . 'dict_post';

    }

    public function get($id)
    {
        return $this->db->get_row($this->db->prepare("
            SELECT * FROM $this->dict WHERE id = %d ", $id));
    }

    public function find($id)
    {
        return $this->db->get_row($this->db->prepare("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->dict dic
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dic.id = %d ", $id));
    }

    public function findByName($name)
    {
        return $this->db->get_row($this->db->prepare("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->dict dic
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dic.name = %s ", $name));
    }

    public function findByPost($postId,$userId)
    {
        return $this->db->get_results($this->db->prepare("
            SELECT dic.id, dic.name, dic.description, dic.parent, dic.user,
                   dic0.name as parent_name, dic0.description as parent_description
            FROM $this->post dp
            INNER JOIN $this->dict dic ON dic.id = dp.dict_id
            LEFT JOIN $this->dict dic0 ON dic0.id = dic.parent
            WHERE dp.post_id = %d ", $postId));
    }

    public function findLike($name)
    {
        return $this->db->get_results($this->db->prepare("
            SELECT * FROM $this->dict
            WHERE name like %s && id < %d ", $name . '%', 2000000)); //@todo
    }

    public function create($name, $description, $parentId, $userId)
    {
        $item = array('name' => $name,
            'description' => $description,
            'parent' => $parentId > 0 ? $parentId : null,
            'user' => $userId
        );

        return $this->db->insert($this->dict, $item,
            $parentId > 0 ? array('%s', '%s', '%d', '%d') : array('%s', '%s', null, '%d'));

    }

    public function modify($id, $description, $parentId, $userId)
    {
        $fields = array(
            'description' => $description,
            'parent' => $parentId > 0 ? $parentId : null,
            'user' => $userId
        );
        return $this->db->update($this->dict, $fields, array('id' => $id),
            $parentId > 0 ? array('%s', '%d', '%d') : array('%s', null, '%d'), array('%d'));

    }


    //dictpost
    public function getPost($id, $postId, $userId)
    {
        return $this->db->get_row($this->db->prepare("
            SELECT * FROM $this->post
            WHERE dict_id = %d and post_id = %d and user_id = %d", $id, $postId, $userId));
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


    public function lastError()
    {
        return $this->db->last_error;
    }


    public function insertId()
    {
        return $this->db->insert_id;
    }

}
