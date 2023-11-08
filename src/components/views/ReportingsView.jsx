import React from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
const ReportingsView = () => {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Cliquez-moi pour voir les détails !
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            Voici des détails cachés qui apparaissent en cliquant sur le bouton.
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="1">
            Cliquez-moi pour voir plus de détails !
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Encore plus de détails ici.</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

export default ReportingsView
