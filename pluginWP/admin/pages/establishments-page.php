<?php
function establishments_map_admin_page()
{
    handle_establishment_actions();
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'pending';
    $establishments = get_filtered_establishments($status_filter);
    $counts = get_pending_counts(); // Ajout de cette ligne
?>
    <div class="wrap">
        <h1>Gestion des établissements</h1>

        <ul class="subsubsub">
            <li>
                <a href="?page=establishments-sync&status=pending"
                    class="<?php echo $status_filter === 'pending' ? 'current' : ''; ?>">
                    En attente (<?php echo $counts->pending_establishments; ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-sync&status=approved"
                    class="<?php echo $status_filter === 'approved' ? 'current' : ''; ?>">
                    Approuvés (<?php echo $counts->approved_establishments; ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-sync&status=rejected"
                    class="<?php echo $status_filter === 'rejected' ? 'current' : ''; ?>">
                    Rejetés (<?php echo $counts->rejected_establishments; ?>)
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
                                        class="button button-primary">Approuver</button>
                                    <button type="submit" name="action" value="reject"
                                        class="button">Rejeter</button>
                                <?php else: ?>
                                    <button type="submit" name="action" value="pending"
                                        class="button">Remettre en attente</button>
                                <?php endif; ?>

                                <a href="?page=establishments-observations&establishment_id=<?php echo esc_attr($establishment->id); ?>"
                                    class="button">Voir les observations</a>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php
}
