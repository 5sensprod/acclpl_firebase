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

    register_rest_route('establishments/v1', '/media', [
        'methods' => 'POST',
        'callback' => 'handle_media_upload',
        'permission_callback' => function($request) {
            // Récupérer les headers d'authentification
            $auth_header = $request->get_header('authorization');
            if (!$auth_header || strpos($auth_header, 'Basic ') !== 0) {
                return false;
            }
            
            // Décoder les identifiants
            $auth = base64_decode(substr($auth_header, 6));
            list($username, $password) = explode(':', $auth);
            
            // Authentifier l'utilisateur
            $user = wp_authenticate($username, $password);
            if (is_wp_error($user)) {
                return false;
            }
            
            // Vérifier les droits d'upload
            return user_can($user, 'upload_files');
        }
    ]);
});

function handle_media_upload($request) {
    error_log('--- DÉBUT MEDIA UPLOAD ---');
    error_log('Headers: ' . print_r($request->get_headers(), true));
    error_log('Params: ' . print_r($request->get_params(), true));
    
    $file_url = $request->get_param('file_url');
    error_log('File URL: ' . $file_url);
    
    $tmp = download_url($file_url);
    if (is_wp_error($tmp)) {
        error_log('Download error: ' . $tmp->get_error_message());
        return new WP_Error('upload_error', $tmp->get_error_message());
    }
    
    $file_array = [
        'name' => basename($file_url) . '.jpg',
        'tmp_name' => $tmp,
        'type' => 'image/jpeg'
    ];
    error_log('File array: ' . print_r($file_array, true));
    
    $attachment_id = media_handle_sideload($file_array, 0);
    if (is_wp_error($attachment_id)) {
        error_log('Upload error: ' . $attachment_id->get_error_message());
    }
    
    error_log('--- FIN MEDIA UPLOAD ---');
    
    return wp_get_attachment_url($attachment_id);
}

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