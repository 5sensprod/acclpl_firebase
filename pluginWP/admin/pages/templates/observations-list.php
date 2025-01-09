<?php
// Template pour la liste des observations
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

    <?php include(plugin_dir_path(__FILE__) . 'observations-table.php'); ?>
</div>