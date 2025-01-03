<?php
add_action('rest_api_init', function() {
    register_rest_route('establishments/v1', '/establishment', [
        'methods' => 'POST',
        'callback' => 'handle_establishment_sync'
    ]);
    
    register_rest_route('establishments/v1', '/observation', [
        'methods' => 'POST',
        'callback' => 'handle_observation_sync'
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

function handle_observation_sync($request) {
    global $wpdb;
    $data = $request->get_json_params();
    
    return $wpdb->replace(
        $wpdb->prefix . 'observations',
        [
            'id' => $data['id'],
            'establishment_id' => $data['establishmentRef'],
            'photo_urls' => json_encode($data['photoURLs']),
            'observation_date' => $data['date'],
            'observation_time' => $data['time'],
            'notes' => $data['additionalNotes']
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