<?php // Template pour le tableau des observations 
?>
<table class="wp-list-table widefat fixed striped">
    <thead>
        <tr>
            <th>Établissement</th>
            <th>Date</th>
            <th>Types d'observation</th>
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
                <td>
                    <?php
                    $types = json_decode($observation->observation_types);
                    if ($types) {
                        echo '<ul class="observation-types-list">';
                        foreach ($types as $type) {
                            echo '<li>' . esc_html(translate_observation_type($type)) . '</li>';
                        }
                        echo '</ul>';
                    }
                    ?>
                </td>
                <td>
                    <form method="post" class="edit-notes-form">
                        <input type="hidden" name="action" value="edit_notes">
                        <input type="hidden" name="observation_id" value="<?php echo esc_attr($observation->id); ?>">
                        <textarea name="notes" rows="3" class="width-100"><?php echo esc_textarea($observation->notes); ?></textarea>
                        <button type="submit" class="button button-small">Enregistrer</button>
                    </form>
                </td>
                <td>
                    <?php
                    $photos = json_decode($observation->photo_urls);
                    if ($photos) {
                        foreach ($photos as $photo): ?>
                            <div class="observation-photo" style="margin-bottom: 10px;">
                                <a href="<?php echo esc_url($photo); ?>" target="_blank">
                                    <img src="<?php echo esc_url($photo); ?>"
                                        style="max-width: 100px; height: auto; display: block; margin-bottom: 5px;">
                                </a>
                                <button type="button"
                                    class="button button-small change-photo-button"
                                    data-observation-id="<?php echo esc_attr($observation->id); ?>"
                                    data-current-url="<?php echo esc_url($photo); ?>">
                                    Changer la photo
                                </button>
                            </div>
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
                                class="button button-primary">Approuver</button>
                            <button type="submit" name="action" value="reject"
                                class="button">Rejeter</button>
                        <?php else: ?>
                            <button type="submit" name="action" value="pending"
                                class="button">Remettre en attente</button>
                        <?php endif; ?>
                    </form>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>