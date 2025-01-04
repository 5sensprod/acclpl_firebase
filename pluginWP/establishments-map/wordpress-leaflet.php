<?php
/*
Plugin Name: Establishments Map
Description: Affiche les établissements sur une carte Leaflet
Version: 1.0
*/

function establishments_map_enqueue_scripts() {
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', array(), null, true);
    wp_enqueue_script('establishments-map', plugin_dir_url(__FILE__) . 'js/map.js', array('leaflet-js'), '1.0', true);
    wp_localize_script('establishments-map', 'establishmentsData', array(
        'establishments' => get_establishments_with_observations()
    ));
}
add_action('wp_enqueue_scripts', 'establishments_map_enqueue_scripts');

function establishments_map_shortcode() {
    return '<div id="establishments-map" style="height: 500px;"></div>';
}
add_shortcode('establishments_map', 'establishments_map_shortcode');

function get_establishments_with_observations() {
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
    ", ARRAY_A);
    
    error_log('SQL Query: ' . $wpdb->last_query);
    error_log('Results: ' . print_r($results, true));
    
    return $results;
}

function establishments_map_add_custom_css() {
    echo '<style>
        .establishment-popup {
            font-family: Arial, sans-serif;
            padding: 10px;
        }
        .observation-photos {
            margin-top: 10px;
            text-align: center;
        }
        .observation-photos img {
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .observation-photos img:hover {
            transform: scale(1.05);
        }
    </style>';
}
add_action('wp_head', 'establishments_map_add_custom_css');

register_activation_hook(__FILE__, 'establishments_map_create_js_file');