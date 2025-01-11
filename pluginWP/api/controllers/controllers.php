<?php
class EstablishmentController
{
    private $dbService;

    public function __construct()
    {
        $this->dbService = new DatabaseService();
    }

    public function sync($request)
    {
        $data = $request->get_json_params();
        return $this->dbService->syncEstablishment($data);
    }

    public function getAllWithObservations()
    {
        return $this->dbService->getEstablishmentsWithObservations();
    }

    public function getAllObservations()
    {
        return $this->dbService->getAllObservations();
    }
}

class ObservationController
{
    private $dbService;

    public function __construct()
    {
        $this->dbService = new DatabaseService();
    }

    public function sync($request)
    {
        $data = $request->get_json_params();
        return $this->dbService->syncObservation($data);
    }

    public function handleComments($request)
    {
        $observation_id = $request['id'];

        if ($request->get_method() === 'POST') {
            if (!is_user_logged_in()) {
                return new WP_Error('unauthorized', 'Vous devez être connecté', ['status' => 401]);
            }
            $data = $request->get_json_params();
            $data['observation_id'] = $observation_id;
            return $this->dbService->addObservationComment($data);
        }

        return $this->dbService->getObservationComments($observation_id);
    }

    // Nouvelle méthode pour récupérer toutes les observations
    public function getAllObservations()
    {
        return $this->dbService->getAllObservations();
    }
}


class MediaController
{
    private $mediaService;

    public function __construct()
    {
        $this->mediaService = new MediaService();
    }

    public function upload($request)
    {
        return $this->mediaService->handleUpload($request);
    }

    public function checkPermissions($request)
    {
        return $this->mediaService->validateAuth($request);
    }
}
