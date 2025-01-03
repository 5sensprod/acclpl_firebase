<?php
/*
Plugin Name: Establishments Sync
Description: Synchronisation des établissements avec l'app React
Version: 1.0
*/

// Création de la table
function create_establishments_table() {
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
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'create_establishments_table');

// API Endpoints
require_once(plugin_dir_path(__FILE__) . 'api.php');