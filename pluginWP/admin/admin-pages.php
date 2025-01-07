<?php

// Ajout des menus d'administration
add_action('admin_menu', function() {
    add_menu_page(
        'Gestion des établissements',
        'Établissements',
        'manage_options',
        'establishments-sync',
        'establishments_map_admin_page',
        'dashicons-location'
    );
    
    add_submenu_page(
        'establishments-sync',
        'Observations',
        'Observations',
        'manage_options',
        'establishments-observations',
        'establishments_map_observations_page'
    );
});

function establishments_map_admin_page() {
    global $wpdb;
    
    // Traitement des actions
    if (isset($_POST['action']) && isset($_POST['establishment_id'])) {
        $establishment_id = sanitize_text_field($_POST['establishment_id']);
        $action = $_POST['action'];
        
        switch($action) {
            case 'approve':
                $wpdb->update(
                    $wpdb->prefix . 'establishments',
                    ['status' => 'approved'],
                    ['id' => $establishment_id]
                );
                break;
            case 'reject':
                $wpdb->update(
                    $wpdb->prefix . 'establishments',
                    ['status' => 'rejected'],
                    ['id' => $establishment_id]
                );
                break;
            case 'pending':
                $wpdb->update(
                    $wpdb->prefix . 'establishments',
                    ['status' => 'pending'],
                    ['id' => $establishment_id]
                );
                break;
        }
    }
    
    // Récupération des établissements avec filtres
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'pending';
    
    $establishments = $wpdb->get_results($wpdb->prepare("
        SELECT e.*, 
               COUNT(CASE WHEN o.status = 'approved' THEN 1 END) as approved_observations,
               COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_observations
        FROM {$wpdb->prefix}establishments e
        LEFT JOIN {$wpdb->prefix}observations o ON e.id = o.establishment_id
        WHERE e.status = %s
        GROUP BY e.id
        ORDER BY e.establishment_name",
        $status_filter
    ));
    
    ?>
    <div class="wrap">
        <h1>Gestion des établissements</h1>
        
        <ul class="subsubsub">
            <li>
                <a href="?page=establishments-sync&status=pending" 
                   class="<?php echo $status_filter === 'pending' ? 'current' : ''; ?>">
                    En attente (<?php echo count(array_filter($establishments, fn($e) => $e->status === 'pending')); ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-sync&status=approved" 
                   class="<?php echo $status_filter === 'approved' ? 'current' : ''; ?>">
                    Approuvés (<?php echo count(array_filter($establishments, fn($e) => $e->status === 'approved')); ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-sync&status=rejected" 
                   class="<?php echo $status_filter === 'rejected' ? 'current' : ''; ?>">
                    Rejetés (<?php echo count(array_filter($establishments, fn($e) => $e->status === 'rejected')); ?>)
                </a>
            </li>
        </ul>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Adresse</th>
                    <th>Observations approuvées</th>
                    <th>Observations en attente</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($establishments as $establishment): ?>
                <tr>
                    <td><?php echo esc_html($establishment->establishment_name); ?></td>
                    <td><?php echo esc_html($establishment->address); ?></td>
                    <td><?php echo esc_html($establishment->approved_observations); ?></td>
                    <td><?php echo esc_html($establishment->pending_observations); ?></td>
                    <td>
                        <form method="post" style="display:inline">
                            <input type="hidden" name="establishment_id" 
                                   value="<?php echo esc_attr($establishment->id); ?>">
                            
                            <?php if ($establishment->status === 'pending'): ?>
                                <button type="submit" name="action" value="approve" 
                                        class="button button-primary">
                                    Approuver
                                </button>
                                <button type="submit" name="action" value="reject" 
                                        class="button">
                                    Rejeter
                                </button>
                            <?php else: ?>
                                <button type="submit" name="action" value="pending" 
                                        class="button">
                                    Remettre en attente
                                </button>
                            <?php endif; ?>
                            
                            <a href="?page=establishments-observations&establishment_id=<?php echo esc_attr($establishment->id); ?>" 
                               class="button">
                                Voir les observations
                            </a>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

function establishments_map_observations_page() {
    global $wpdb;
    
    // Traitement des actions
    if (isset($_POST['action']) && isset($_POST['observation_id'])) {
        $observation_id = sanitize_text_field($_POST['observation_id']);
        $action = $_POST['action'];
        
        switch($action) {
            case 'approve':
                $wpdb->update(
                    $wpdb->prefix . 'observations',
                    ['status' => 'approved'],
                    ['id' => $observation_id]
                );
                break;
            case 'reject':
                $wpdb->update(
                    $wpdb->prefix . 'observations',
                    ['status' => 'rejected'],
                    ['id' => $observation_id]
                );
                break;
            case 'pending':
                $wpdb->update(
                    $wpdb->prefix . 'observations',
                    ['status' => 'pending'],
                    ['id' => $observation_id]
                );
                break;
        }
        
        // Mise à jour du compteur d'observations approuvées
        $establishment_id = $wpdb->get_var($wpdb->prepare(
            "SELECT establishment_id FROM {$wpdb->prefix}observations WHERE id = %s",
            $observation_id
        ));
        
        if ($establishment_id) {
            $approved_count = $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}observations 
                WHERE establishment_id = %s AND status = 'approved'",
                $establishment_id
            ));
            
            $wpdb->update(
                $wpdb->prefix . 'establishments',
                ['observation_count' => $approved_count],
                ['id' => $establishment_id]
            );
        }
    }
    
    $establishment_id = isset($_GET['establishment_id']) ? $_GET['establishment_id'] : null;
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'pending';
    
    // Construction de la requête
    $query = "
        SELECT o.*, e.establishment_name
        FROM {$wpdb->prefix}observations o
        JOIN {$wpdb->prefix}establishments e ON o.establishment_id = e.id
        WHERE o.status = %s";
    
    $query_params = [$status_filter];
    
    if ($establishment_id) {
        $query .= " AND o.establishment_id = %s";
        $query_params[] = $establishment_id;
    }
    
    $query .= " ORDER BY o.observation_date DESC, o.observation_time DESC";
    
    $observations = $wpdb->get_results($wpdb->prepare($query, $query_params));
    
    // Si on filtre par établissement, récupérer son nom
    $establishment_name = '';
    if ($establishment_id) {
        $establishment_name = $wpdb->get_var($wpdb->prepare(
            "SELECT establishment_name FROM {$wpdb->prefix}establishments WHERE id = %s",
            $establishment_id
        ));
    }
    
    ?>
    <div class="wrap">
        <h1>
            Gestion des observations
            <?php if ($establishment_name): ?>
                pour <?php echo esc_html($establishment_name); ?>
            <?php endif; ?>
        </h1>
        
        <ul class="subsubsub">
            <li>
                <a href="?page=establishments-observations<?php echo $establishment_id ? '&establishment_id=' . esc_attr($establishment_id) : ''; ?>&status=pending" 
                   class="<?php echo $status_filter === 'pending' ? 'current' : ''; ?>">
                    En attente
                </a> |
            </li>
            <li>
                <a href="?page=establishments-observations<?php echo $establishment_id ? '&establishment_id=' . esc_attr($establishment_id) : ''; ?>&status=approved" 
                   class="<?php echo $status_filter === 'approved' ? 'current' : ''; ?>">
                    Approuvées
                </a> |
            </li>
            <li>
                <a href="?page=establishments-observations<?php echo $establishment_id ? '&establishment_id=' . esc_attr($establishment_id) : ''; ?>&status=rejected" 
                   class="<?php echo $status_filter === 'rejected' ? 'current' : ''; ?>">
                    Rejetées
                </a>
            </li>
        </ul>
        
        <?php if ($establishment_id): ?>
            <p>
                <a href="?page=establishments-sync" class="button">
                    ← Retour aux établissements
                </a>
            </p>
        <?php endif; ?>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Établissement</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Photos</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($observations as $observation): ?>
                <tr>
                    <td><?php echo esc_html($observation->establishment_name); ?></td>
                    <td>
                        <?php 
                        echo esc_html(date('d/m/Y', strtotime($observation->observation_date)));
                        echo '<br>';
                        echo esc_html(date('H:i', strtotime($observation->observation_time)));
                        ?>
                    </td>
                    <td><?php echo esc_html($observation->notes); ?></td>
                    <td>
                        <?php 
                        $photos = json_decode($observation->photo_urls);
                        if ($photos) {
                            foreach ($photos as $photo): ?>
                                <a href="<?php echo esc_url($photo); ?>" target="_blank">
                                    <img src="<?php echo esc_url($photo); ?>" 
                                         style="max-width: 100px; height: auto; margin: 5px;">
                                </a>
                            <?php endforeach;
                        }
                        ?>
                    </td>
                    <td>
                        <form method="post" style="display:inline">
                            <input type="hidden" name="observation_id" 
                                   value="<?php echo esc_attr($observation->id); ?>">
                            
                            <?php if ($observation->status === 'pending'): ?>
                                <button type="submit" name="action" value="approve" 
                                        class="button button-primary">
                                    Approuver
                                </button>
                                <button type="submit" name="action" value="reject" 
                                        class="button">
                                    Rejeter
                                </button>
                            <?php else: ?>
                                <button type="submit" name="action" value="pending" 
                                        class="button">
                                    Remettre en attente
                                </button>
                            <?php endif; ?>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}