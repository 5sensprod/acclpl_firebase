<?php
function establishments_map_comments_page()
{
    handle_comment_actions();
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'pending';
    $comments = get_filtered_comments($status_filter);
    $counts = get_pending_counts();
?>
    <div class="wrap">
        <h1>Modération des commentaires</h1>

        <ul class="subsubsub">
            <li>
                <a href="?page=establishments-comments&status=pending"
                    class="<?php echo $status_filter === 'pending' ? 'current' : ''; ?>">
                    En attente (<?php echo (int)$counts->pending_comments; ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-comments&status=approved"
                    class="<?php echo $status_filter === 'approved' ? 'current' : ''; ?>">
                    Approuvés (<?php echo (int)$counts->approved_comments; ?>)
                </a> |
            </li>
            <li>
                <a href="?page=establishments-comments&status=rejected"
                    class="<?php echo $status_filter === 'rejected' ? 'current' : ''; ?>">
                    Rejetés (<?php echo (int)$counts->rejected_comments; ?>)
                </a>
            </li>
        </ul>

        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Utilisateur</th>
                    <th>Commentaire</th>
                    <th>Établissement</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($comments as $comment): ?>
                    <tr>
                        <td><?php echo esc_html($comment->display_name); ?></td>
                        <td><?php echo esc_html($comment->comment); ?></td>
                        <td><?php echo esc_html($comment->establishment_name); ?></td>
                        <td><?php echo esc_html($comment->created_at); ?></td>
                        <td>
                            <form method="post" style="display:inline">
                                <input type="hidden" name="comment_id"
                                    value="<?php echo esc_attr($comment->id); ?>">

                                <?php if ($comment->status === 'pending'): ?>
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
    </div>
<?php
}
