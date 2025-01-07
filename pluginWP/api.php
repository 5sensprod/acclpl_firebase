<?php
add_action('rest_api_init', function () {
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
        'permission_callback' => function ($request) {
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

    // Nouvelle route GET
    register_rest_route('establishments/v1', '/establishments', [
        'methods' => 'GET',
        'callback' => 'get_establishments_with_observations',
        'permission_callback' => '__return_true'
    ]);
});

function get_establishments_with_observations()
{
    global $wpdb;
    $results = $wpdb->get_results("
        SELECT 
            e.*,
            o.photo_urls,
            o.observation_date,
            o.observation_time,
            o.notes
        FROM {$wpdb->prefix}establishments e
        LEFT JOIN {$wpdb->prefix}observations o 
        ON e.id = o.establishment_id
        WHERE e.status = 'approved' 
        AND (o.status = 'approved' OR o.status IS NULL)
    ", ARRAY_A);

    return $results;
}

function handle_media_upload($request)
{
    global $wpdb;
    $file_url = $request->get_param('file_url');
    $establishment_ref = $request->get_param('establishment_ref');

    // Récupère le nom de l'établissement
    $establishment_name = $wpdb->get_var($wpdb->prepare(
        "SELECT establishment_name FROM {$wpdb->prefix}establishments WHERE id = %s",
        $establishment_ref
    ));

    // Génère un nom de fichier propre
    $random_id = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'), 0, 6);
    $timestamp = date('Ymd_His');
    $filename = sprintf(
        '%s_%s_%s.jpg',
        sanitize_title($establishment_name),
        $random_id,
        $timestamp
    );

    $tmp = download_url($file_url);
    if (is_wp_error($tmp)) {
        return new WP_Error('upload_error', $tmp->get_error_message());
    }

    $file_array = [
        'name' => $filename,
        'tmp_name' => $tmp,
        'type' => 'image/jpeg'
    ];

    $attachment_id = media_handle_sideload($file_array, 0);
    return wp_get_attachment_url($attachment_id);
}

function handle_establishment_sync($request)
{
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
            'observation_count' => $data['observationCount'],
            'status' => 'pending' // Statut par défaut
        ]
    );
}

function handle_observation_sync($request)
{
    global $wpdb;
    $data = $request->get_json_params();

    $photoURLs = array_map(function ($url) {
        return stripslashes(trim($url, '"')); // Nettoie les slashes et guillemets
    }, $data['photoURLs']);

    $wpdb->replace(
        $wpdb->prefix . 'observations',
        [
            'id' => $data['id'],
            'establishment_id' => $data['establishmentRef'],
            'photo_urls' => json_encode($photoURLs), // Simplification du json_encode
            'observation_date' => $data['date'],
            'observation_time' => $data['time'],
            'notes' => $data['additionalNotes']
        ]
    );

    // Garde le comptage et la mise à jour
    $count = $wpdb->get_var($wpdb->prepare(
        "SELECT COUNT(*) FROM {$wpdb->prefix}observations WHERE establishment_id = %s",
        $data['establishmentRef']
    ));

    return $wpdb->update(
        $wpdb->prefix . 'establishments',
        ['observation_count' => $count],
        ['id' => $data['establishmentRef']]
    );
}
function get_establishments()
{
    global $wpdb;
    return $wpdb->get_results(
        "SELECT * FROM {$wpdb->prefix}establishments",
        ARRAY_A
    );
}
