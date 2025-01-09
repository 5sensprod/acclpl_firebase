<?php
/*
Plugin Name: Establishments Sync
Description: Synchronisation des établissements avec l'app React
Version: 1.0
*/

require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

// Admin
require_once(plugin_dir_path(__FILE__) . 'admin/admin-pages.php');

// API
require_once(plugin_dir_path(__FILE__) . 'api/services/services.php');
require_once(plugin_dir_path(__FILE__) . 'api/controllers/controllers.php');
require_once(plugin_dir_path(__FILE__) . 'api/routes/routes.php');

register_activation_hook(__FILE__, function () {
    create_establishments_table();
    create_observations_table();
    update_observations_table();
});

add_action('init', function () {
    if (get_option('plugin_installed') !== 'yes') {
        create_establishments_table();
        create_observations_table();
        update_option('plugin_installed', 'yes');
    }
});

function create_establishments_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'establishments';

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id VARCHAR(255) PRIMARY KEY,
        establishment_name VARCHAR(255) NOT NULL,
        normalized_name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        lat DECIMAL(10, 8) NOT NULL,
        lng DECIMAL(11, 8) NOT NULL,
        observation_count INT DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    dbDelta($sql);
}

function create_observations_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'observations';
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id VARCHAR(255) PRIMARY KEY,
        establishment_id VARCHAR(255),
        photo_urls TEXT,
        observation_date DATETIME,
        observation_time TIME,
        notes TEXT,
        observation_types TEXT,
        status enum('pending','approved','rejected') DEFAULT 'pending',
        FOREIGN KEY (establishment_id)
        REFERENCES {$wpdb->prefix}establishments(id)
        ON DELETE CASCADE
    )";
    dbDelta($sql);
}

function update_observations_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'observations';

    // Vérifier si la colonne existe déjà
    $row = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'observation_types'");
    if (empty($row)) {
        $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN observation_types TEXT DEFAULT NULL AFTER notes");
    }
}
