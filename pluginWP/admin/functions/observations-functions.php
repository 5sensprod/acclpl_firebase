<?php
function handle_observation_actions()
{
    if (!isset($_POST['action']) || !isset($_POST['observation_id'])) {
        return;
    }

    global $wpdb;
    $observation_id = sanitize_text_field($_POST['observation_id']);
    $action = $_POST['action'];

    if ($action === 'edit_notes') {
        $new_notes = sanitize_textarea_field($_POST['notes']);
        $wpdb->update(
            $wpdb->prefix . 'observations',
            ['notes' => $new_notes],
            ['id' => $observation_id]
        );
        return;
    }

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
        update_observation_status($observation_id, $status);
    }
}

function update_observation_status($observation_id, $status)
{
    global $wpdb;

    $wpdb->update(
        $wpdb->prefix . 'observations',
        ['status' => $status],
        ['id' => $observation_id]
    );

    update_establishment_observation_count($observation_id);
}

function update_establishment_observation_count($observation_id)
{
    global $wpdb;

    $establishment_id = $wpdb->get_var($wpdb->prepare(
        "SELECT establishment_id FROM {$wpdb->prefix}observations WHERE id = %s",
        $observation_id
    ));

    if ($establishment_id) {
        $approved_count = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}observations 
            WHERE establishment_id = %s AND status = 'approved'",
            $establishment_id
        ));

        $wpdb->update(
            $wpdb->prefix . 'establishments',
            ['observation_count' => $approved_count],
            ['id' => $establishment_id]
        );
    }
}

function handle_update_observation_photo()
{
    check_ajax_referer('update_observation_photo');

    global $wpdb;
    $observation_id = sanitize_text_field($_POST['observation_id']);
    $old_url = $_POST['old_url'];
    $new_url = $_POST['new_url'];

    $observation = $wpdb->get_row($wpdb->prepare(
        "SELECT photo_urls FROM {$wpdb->prefix}observations WHERE id = %s",
        $observation_id
    ));

    $photos = json_decode($observation->photo_urls);
    $photos = array_map(function ($url) use ($old_url, $new_url) {
        return $url === $old_url ? $new_url : $url;
    }, $photos);

    $wpdb->update(
        $wpdb->prefix . 'observations',
        ['photo_urls' => json_encode($photos)],
        ['id' => $observation_id]
    );

    wp_send_json_success();
}
