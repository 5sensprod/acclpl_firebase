<?php
require_once(plugin_dir_path(__FILE__) . 'pages/establishments-page.php');
require_once(plugin_dir_path(__FILE__) . 'pages/observations-page.php');
require_once(plugin_dir_path(__FILE__) . 'functions/establishments-functions.php');
require_once(plugin_dir_path(__FILE__) . 'functions/observations-functions.php');

// Fonction pour compter les nouveaux signalements
function get_pending_counts()
{
    global $wpdb;

    $counts = $wpdb->get_row("
        SELECT 
            (SELECT COUNT(*) FROM {$wpdb->prefix}establishments WHERE status = 'pending') as pending_establishments,
            (SELECT COUNT(*) FROM {$wpdb->prefix}establishments WHERE status = 'approved') as approved_establishments,
            (SELECT COUNT(*) FROM {$wpdb->prefix}establishments WHERE status = 'rejected') as rejected_establishments,
            (SELECT COUNT(*) FROM {$wpdb->prefix}observations WHERE status = 'pending') as pending_observations,
            (SELECT COUNT(*) FROM {$wpdb->prefix}observations WHERE status = 'approved') as approved_observations,
            (SELECT COUNT(*) FROM {$wpdb->prefix}observations WHERE status = 'rejected') as rejected_observations
    ");

    return $counts;
}

// Ajout des menus d'administration
add_action('admin_menu', function () {
    $counts = get_pending_counts();

    $menu_title = 'Établissements';
    if ($counts->pending_establishments > 0) {
        $menu_title .= " <span class='update-plugins count-{$counts->pending_establishments}'><span class='update-count'>" . number_format_i18n($counts->pending_establishments) . "</span></span>";
    }

    $submenu_title = 'Observations';
    if ($counts->pending_observations > 0) {
        $submenu_title .= " <span class='update-plugins count-{$counts->pending_observations}'><span class='update-count'>" . number_format_i18n($counts->pending_observations) . "</span></span>";
    }

    add_menu_page(
        'Gestion des établissements',
        $menu_title,
        'manage_options',
        'establishments-sync',
        'establishments_map_admin_page',
        'dashicons-location'
    );

    add_submenu_page(
        'establishments-sync',
        'Gestion des Observations',
        $submenu_title,
        'manage_options',
        'establishments-observations',
        'establishments_map_observations_page'
    );
});

// Chargement des scripts
add_action('admin_enqueue_scripts', function ($hook) {
    if (strpos($hook, 'establishments-observations') === false) {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_script(
        'photo-manager',
        plugins_url('js/photo-manager.js', __FILE__),
        array('jquery', 'media-upload'),
        '1.0',
        true
    );

    wp_localize_script('photo-manager', 'photoManagerParams', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('update_observation_photo')
    ));
});

// Gestionnaire AJAX
add_action('wp_ajax_update_observation_photo', 'handle_update_observation_photo');
