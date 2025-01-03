<?php
add_action('rest_api_init', function() {
    register_rest_route('establishments/v1', '/sync', [
        'methods' => 'POST',
        'callback' => 'handle_establishment_sync',
        'permission_callback' => function() {
            // Autoriser les requêtes avec Basic Auth
            return true;
        }
    ]);
});
function handle_establishment_sync($request) {
    global $wpdb;
    $data = $request->get_json_params();
    
    return $wpdb->replace(
        $wpdb->prefix . 'establishments',
        [
            'id' => $data['id'],
            'establishment_name' => $data['establishmentName'],
            'normalized_name' => $data['normalizedEstablishmentName'],
            'address' => $data['address'],
            'lat' => $data['coordinates']['latitude'],
            'lng' => $data['coordinates']['longitude'],
            'observation_count' => $data['observationCount']
        ]
    );
}

function get_establishments() {
    global $wpdb;
    return $wpdb->get_results(
        "SELECT * FROM {$wpdb->prefix}establishments",
        ARRAY_A
    );
}