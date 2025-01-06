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
    
    $establishments = get_establishments_with_observations();
    error_log('Establishments data: ' . print_r($establishments, true));
    
    wp_localize_script('establishments-map', 'establishmentsData', array(
        'establishments' => empty($establishments) ? array() : $establishments
    ));
}
add_action('wp_enqueue_scripts', 'establishments_map_enqueue_scripts');

function establishments_map_shortcode() {
    return '<div id="establishments-map" style="height: 500px;"></div>';
}
add_shortcode('establishments_map', 'establishments_map_shortcode');

function establishments_map_add_custom_css() {
    echo '<style>
        .establishment-popup {
            font-family: Arial, sans-serif;
            padding: 10px;
            min-width: 250px;
        }
        .carousel {
            position: relative;
            margin: 10px 0;
        }
        .carousel-container {
            position: relative;
            padding: 0 20px;
        }
        .carousel-item {
            display: none;
            text-align: center;
        }
        .carousel-item.active {
            display: block;
        }
        .carousel-prev, .carousel-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
            z-index: 1000;
        }
        .carousel-prev {
            left: -5px;
        }
        .carousel-next {
            right: -5px;
        }
        .observation-date {
            margin-top: 5px;
            font-size: 0.9em;
            color: #666;
            display: block;
        }
        .observation-notes {
            margin-top: 5px;
            font-style: italic;
            display: block;
        }
        .observation-photos img {
            max-width: 200px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 5px;
        }
    </style>';
}
add_action('wp_head', 'establishments_map_add_custom_css');

register_activation_hook(__FILE__, 'establishments_map_create_js_file');