<?php
function handle_establishment_actions()
{
    if (!isset($_POST['action']) || !isset($_POST['establishment_id'])) {
        return;
    }

    global $wpdb;
    $establishment_id = sanitize_text_field($_POST['establishment_id']);
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
            $wpdb->prefix . 'establishments',
            ['status' => $status],
            ['id' => $establishment_id]
        );
    }
}

function get_filtered_establishments($status)
{
    global $wpdb;

    return $wpdb->get_results($wpdb->prepare(
        "
        SELECT e.*, 
               COUNT(CASE WHEN o.status = 'approved' THEN 1 END) as approved_observations,
               COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_observations
        FROM {$wpdb->prefix}establishments e
        LEFT JOIN {$wpdb->prefix}observations o ON e.id = o.establishment_id
        WHERE e.status = %s
        GROUP BY e.id
        ORDER BY e.establishment_name",
        $status
    ));
}
