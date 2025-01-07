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
