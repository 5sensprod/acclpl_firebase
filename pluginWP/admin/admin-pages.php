<?php
require_once(plugin_dir_path(__FILE__) . 'pages/establishments-page.php');
require_once(plugin_dir_path(__FILE__) . 'pages/observations-page.php');
require_once(plugin_dir_path(__FILE__) . 'pages/comments-page.php');
require_once(plugin_dir_path(__FILE__) . 'functions/establishments-functions.php');
require_once(plugin_dir_path(__FILE__) . 'functions/observations-functions.php');
require_once(plugin_dir_path(__FILE__) . 'functions/comments-functions.php');

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

    // Menu principal Établissements
    $menu_title = 'Établissements';
    if ($counts->pending_establishments > 0) {
        $menu_title .= " <span class='update-plugins count-{$counts->pending_establishments}'><span class='update-count'>" . number_format_i18n($counts->pending_establishments) . "</span></span>";
    }

    // Sous-menu Observations
    $observations_title = 'Observations';
    if ($counts->pending_observations > 0) {
        $observations_title .= " <span class='update-plugins count-{$counts->pending_observations}'><span class='update-count'>" . number_format_i18n($counts->pending_observations) . "</span></span>";
    }

    // Nouveau sous-menu Commentaires
    $comments_title = 'Commentaires';
    if ($counts->pending_comments > 0) {
        $comments_title .= " <span class='update-plugins count-{$counts->pending_comments}'><span class='update-count'>" . number_format_i18n($counts->pending_comments) . "</span></span>";
    }

    // Menu principal
    add_menu_page(
        'Gestion des établissements',    // Titre de la page
        $menu_title,                     // Titre du menu
        'manage_options',                // Capacité requise
        'establishments-sync',           // Slug du menu
        'establishments_map_admin_page', // Fonction de callback
        'dashicons-location'            // Icône
    );

    // Sous-menu Observations
    add_submenu_page(
        'establishments-sync',              // Slug du menu parent
        'Gestion des Observations',         // Titre de la page
        $observations_title,                // Titre dans le menu
        'manage_options',                   // Capacité requise
        'establishments-observations',       // Slug du sous-menu
        'establishments_map_observations_page' // Fonction de callback
    );

    // Sous-menu Commentaires
    add_submenu_page(
        'establishments-sync',              // Slug du menu parent
        'Modération des Commentaires',      // Titre de la page
        $comments_title,                    // Titre dans le menu
        'manage_options',                   // Capacité requise
        'establishments-comments',          // Slug du sous-menu
        'establishments_map_comments_page'  // Fonction de callback
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
