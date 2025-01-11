<?php
function handle_comment_actions()
{
    if (!isset($_POST['action']) || !isset($_POST['comment_id'])) {
        return;
    }

    global $wpdb;
    $comment_id = sanitize_text_field($_POST['comment_id']);
    $action = $_POST['action'];
    $status = '';

    switch ($action) {
        case 'approve':
            $status = 'approved';
            break;
        case 'reject':
            $status = 'rejected';
            break;
        case 'pending':
            $status = 'pending';
            break;
    }

    if ($status) {
        $wpdb->update(
            $wpdb->prefix . 'observation_comments',
            ['status' => $status],
            ['id' => $comment_id]
        );
    }
}

function get_filtered_comments($status)
{
    global $wpdb;

    return $wpdb->get_results($wpdb->prepare(
        "SELECT c.*, u.display_name, e.establishment_name 
         FROM {$wpdb->prefix}observation_comments c
         JOIN {$wpdb->prefix}users u ON c.user_id = u.ID
         JOIN {$wpdb->prefix}observations o ON c.observation_id = o.id
         JOIN {$wpdb->prefix}establishments e ON o.establishment_id = e.id
         WHERE c.status = %s
         ORDER BY c.created_at DESC",
        $status
    ));
}
