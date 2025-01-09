<?php
function establishments_map_observations_page()
{
    handle_observation_actions();

    global $wpdb;
    $establishment_id = isset($_GET['establishment_id']) ? $_GET['establishment_id'] : null;
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'pending';

    // Construction de la requête
    $query = "
        SELECT o.*, e.establishment_name
        FROM {$wpdb->prefix}observations o
        JOIN {$wpdb->prefix}establishments e ON o.establishment_id = e.id
        WHERE o.status = %s";

    $query_params = [$status_filter];

    if ($establishment_id) {
        $query .= " AND o.establishment_id = %s";
        $query_params[] = $establishment_id;
    }

    $query .= " ORDER BY o.observation_date DESC, o.observation_time DESC";
    $observations = $wpdb->get_results($wpdb->prepare($query, $query_params));

    $establishment_name = '';
    if ($establishment_id) {
        $establishment_name = $wpdb->get_var($wpdb->prepare(
            "SELECT establishment_name FROM {$wpdb->prefix}establishments WHERE id = %s",
            $establishment_id
        ));
    }

    include(plugin_dir_path(__FILE__) . 'templates/observations-list.php');
}
