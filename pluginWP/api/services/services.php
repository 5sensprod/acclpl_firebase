<?php
class DatabaseService
{
    private $wpdb;

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public function syncEstablishment($data)
    {
        return $this->wpdb->replace(
            $this->wpdb->prefix . 'establishments',
            [
                'id' => $data['id'],
                'establishment_name' => $data['establishmentName'],
                'normalized_name' => $data['normalizedEstablishmentName'],
                'address' => $data['address'],
                'lat' => $data['coordinates']['latitude'],
                'lng' => $data['coordinates']['longitude'],
                'observation_count' => $data['observationCount'],
                'status' => 'pending'
            ]
        );
    }

    public function syncObservation($data)
    {
        $photoURLs = array_map(function ($url) {
            return stripslashes(trim($url, '"'));
        }, $data['photoURLs']);

        $this->wpdb->replace(
            $this->wpdb->prefix . 'observations',
            [
                'id' => $data['id'],
                'establishment_id' => $data['establishmentRef'],
                'photo_urls' => json_encode($photoURLs),
                'observation_date' => $data['date'],
                'observation_time' => $data['time'],
                'notes' => $data['additionalNotes']
            ]
        );

        $count = $this->wpdb->get_var($this->wpdb->prepare(
            "SELECT COUNT(*) FROM {$this->wpdb->prefix}observations WHERE establishment_id = %s",
            $data['establishmentRef']
        ));

        return $this->wpdb->update(
            $this->wpdb->prefix . 'establishments',
            ['observation_count' => $count],
            ['id' => $data['establishmentRef']]
        );
    }

    public function getEstablishmentsWithObservations()
    {
        return $this->wpdb->get_results("
            SELECT 
                e.*,
                o.photo_urls,
                o.observation_date,
                o.observation_time,
                o.notes
            FROM {$this->wpdb->prefix}establishments e
            LEFT JOIN {$this->wpdb->prefix}observations o 
            ON e.id = o.establishment_id
            WHERE e.status = 'approved' 
            AND (o.status = 'approved' OR o.status IS NULL)
        ", ARRAY_A);
    }
}

class MediaService
{
    private $wpdb;

    public function __construct()
    {
        global $wpdb;
        $this->wpdb = $wpdb;
    }

    public function handleUpload($request)
    {
        $file_url = $request->get_param('file_url');
        $establishment_ref = $request->get_param('establishment_ref');

        $establishment_name = $this->wpdb->get_var($this->wpdb->prepare(
            "SELECT establishment_name FROM {$this->wpdb->prefix}establishments WHERE id = %s",
            $establishment_ref
        ));

        $random_id = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyz'), 0, 6);
        $timestamp = date('Ymd_His');
        $filename = sprintf(
            '%s_%s_%s.jpg',
            sanitize_title($establishment_name),
            $random_id,
            $timestamp
        );

        $tmp = download_url($file_url);
        if (is_wp_error($tmp)) {
            return new WP_Error('upload_error', $tmp->get_error_message());
        }

        $file_array = [
            'name' => $filename,
            'tmp_name' => $tmp,
            'type' => 'image/jpeg'
        ];

        $attachment_id = media_handle_sideload($file_array, 0);
        return wp_get_attachment_url($attachment_id);
    }

    public function validateAuth($request)
    {
        $auth_header = $request->get_header('authorization');
        if (!$auth_header || strpos($auth_header, 'Basic ') !== 0) {
            return false;
        }

        $auth = base64_decode(substr($auth_header, 6));
        list($username, $password) = explode(':', $auth);

        $user = wp_authenticate($username, $password);
        if (is_wp_error($user)) {
            return false;
        }

        return user_can($user, 'upload_files');
    }
}
