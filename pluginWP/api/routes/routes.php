<?php
add_action('rest_api_init', function () {
    $establishmentController = new EstablishmentController();
    $observationController = new ObservationController();
    $mediaController = new MediaController();

    register_rest_route('establishments/v1', '/establishment', [
        'methods' => 'POST',
        'callback' => [$establishmentController, 'sync']
    ]);

    register_rest_route('establishments/v1', '/observation', [
        'methods' => 'POST',
        'callback' => [$observationController, 'sync']
    ]);

    register_rest_route('establishments/v1', '/media', [
        'methods' => 'POST',
        'callback' => [$mediaController, 'upload'],
        'permission_callback' => [$mediaController, 'checkPermissions']
    ]);

    register_rest_route('establishments/v1', '/establishments', [
        'methods' => 'GET',
        'callback' => [$establishmentController, 'getAllWithObservations'],
        'permission_callback' => '__return_true'
    ]);
});
