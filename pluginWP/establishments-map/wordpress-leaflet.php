<?php
/*
Plugin Name: Establishments Map
Description: Affiche les établissements sur une carte Leaflet
Version: 1.0
*/

// Enregistrement des assets
function establishments_map_enqueue_scripts() {
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
    wp_enqueue_script('leaflet-js', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', array(), null, true);
    wp_enqueue_script('establishments-map', plugin_dir_url(__FILE__) . 'js/map.js', array('leaflet-js'), '1.0', true);
    wp_localize_script('establishments-map', 'establishmentsData', array(
        'establishments' => get_establishments()
    ));
}
add_action('wp_enqueue_scripts', 'establishments_map_enqueue_scripts');

// Shortcode pour afficher la carte
function establishments_map_shortcode() {
    return '<div id="establishments-map" style="height: 500px;"></div>';
}
add_shortcode('establishments_map', 'establishments_map_shortcode');

// Création du dossier js s'il n'existe pas
function establishments_map_create_js_folder() {
    $js_dir = plugin_dir_path(__FILE__) . 'js';
    if (!file_exists($js_dir)) {
        mkdir($js_dir, 0755, true);
    }
}
register_activation_hook(__FILE__, 'establishments_map_create_js_folder');

// Création du fichier map.js lors de l'activation
function establishments_map_create_js_file() {
    $js_content = <<<EOT
document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('establishments-map').setView([46.603354, 1.888334], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const establishments = establishmentsData.establishments;
    
    establishments.forEach(establishment => {
        const marker = L.marker([
            parseFloat(establishment.lat), 
            parseFloat(establishment.lng)
        ]).addTo(map);
        
        marker.bindPopup(`
            <strong>${establishment.establishment_name}</strong><br>
            ${establishment.address}<br>
            Observations: ${establishment.observation_count}
        `);
    });
});
EOT;

    $js_file = plugin_dir_path(__FILE__) . 'js/map.js';
    file_put_contents($js_file, $js_content);
}
register_activation_hook(__FILE__, 'establishments_map_create_js_file');
