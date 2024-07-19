import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import CustomToggle from './ReportingsView/CustomToggle'
import { motion } from 'framer-motion'

const InfoView = () => {
  const [activeKey, setActiveKey] = useState(null)

  const topics = [
    {
      title: 'Les couleurs',
      content: (
        <div>
          <p>
            La loi impose des restrictions sur la température de couleur des
            éclairages extérieurs afin de réduire les nuisances lumineuses. Il
            est recommandé d'utiliser des éclairages dont la température de
            couleur ne dépasse pas <strong>3000 Kelvin</strong>. Cela permet de
            limiter les émissions de lumière bleue, qui ont un impact négatif
            sur la faune et la flore, ainsi que sur le cycle veille-sommeil des
            humains. En pratique, la couleur doit être similaire à celle de
            l'éclairage public, qui est généralement{' '}
            <strong>jaune à blanc chaud</strong>.
          </p>
          <div
            style={{
              height: '60px',
              background:
                'linear-gradient(to right, #ff9300, #ffffff, #00bfff)',
              margin: '10px 0',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#ffffff',
                fontSize: '13px',
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <span
                style={{ position: 'absolute', left: '0%', color: 'white' }}
              >
                500K
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: '37%',
                  color: 'green',
                  transform: 'translateX(-50%)',
                }}
              >
                3000K
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: '100%',
                  transform: 'translateX(-100%)',
                  color: 'black',
                }}
              >
                8000K
              </span>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '37%',
                top: '50px', // Décale le trait vers le bas pour éviter le chevauchement
                bottom: '0',
                width: '2px',
                background: 'green',
                transform: 'translateX(-50%)',
              }}
            />
          </div>

          <p>
            <a
              href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000041461568"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arrêté de 2018 relatif à la réduction des nuisances lumineuses,
              Article 3
            </a>
          </p>
        </div>
      ),
    },

    {
      title: 'La vitrine',
      content: (
        <div>
          <p>
            Les prescriptions horaires pour l'éclairage des vitrines sont
            strictement définies par la loi pour réduire les nuisances
            lumineuses. L'éclairage des vitrines doit être éteint au plus tard à{' '}
            <strong>1 heure du matin</strong>, ou{' '}
            <strong>une heure après la fermeture</strong>
            de l'établissement si celui-ci ferme plus tard. Cela permet de
            diminuer la pollution lumineuse nocturne et de préserver la qualité
            de vie des riverains.
            <br />
            <br />
            <a
              href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000038748395"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arrêté de 2018 relatif à la réduction des nuisances lumineuses,
              Article 2
            </a>
          </p>
        </div>
      ),
    },
    {
      title: "L'enseigne",
      content: (
        <div>
          <p>
            Les enseignes lumineuses doivent également respecter des
            prescriptions horaires afin de minimiser les nuisances lumineuses.
            Elles doivent être éteintes entre{' '}
            <strong>1 heure et 6 heures du matin</strong>, sauf si l'activité
            signalée se poursuit après 1 heure du matin. Dans ce cas, elles
            doivent être éteintes au plus tard{' '}
            <strong>une heure après la fin de cette activité</strong>. Ces
            mesures visent à réduire l'impact de la lumière artificielle sur
            l'environnement nocturne.
            <br />
            <br />
            <a
              href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000037660989"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arrêté de 2018 relatif à la réduction des nuisances lumineuses,
              Article 4
            </a>
          </p>
        </div>
      ),
    },
    {
      title: 'Le local',
      content: (
        <div>
          <p>
            Les prescriptions horaires de l'éclairage des locaux commerciaux ou
            professionnels sont établies pour limiter les nuisances lumineuses.
            L'éclairage intérieur visible depuis l'extérieur doit être éteint au
            plus tard{' '}
            <strong>une heure après la fin de l'occupation des locaux</strong>{' '}
            et sont allumés à <strong>7 heures du matin</strong> au plus tôt ou
            1 heure avant le début de l'activité si celle-ci s'exerce plus tôt.
            Cette règle contribue à la réduction de la pollution lumineuse et
            aide à préserver l'environnement nocturne.
            <br />
            <br />
            <a
              href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000038748395"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arrêté de 2018 relatif à la réduction des nuisances lumineuses,
              Article 2
            </a>
          </p>
        </div>
      ),
    },
  ]

  return (
    <div>
      <p style={{ color: '#ffffff' }}>
        Le principe fondamental est que les installations d'éclairage ne doivent
        jamais émettre de lumière intrusive excessive dans les logements, quelle
        que soit la source de cette lumière.
        <br />
        <br />
        <a
          href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000041461568"
          target="_blank"
          rel="noopener noreferrer"
        >
          Article 3 de l'Arrêté du 27 décembre 2018 relatif à la prévention des
          nuisances lumineuses
        </a>
      </p>
      <Accordion activeKey={activeKey}>
        {topics.map((topic, index) => (
          <Card key={index} className="mb-3 bg-dark">
            <motion.div
              initial={{ x: -60 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.1 + index * 0.04, duration: 0.15 }}
              className="card-header bg-dark text-light rounded shadow"
            >
              <CustomToggle
                eventKey={`${index}`}
                activeKey={activeKey}
                setActiveKey={setActiveKey}
              >
                <h3>{topic.title}</h3>
              </CustomToggle>
            </motion.div>
            <Accordion.Collapse eventKey={`${index}`}>
              <Card.Body className="bg-dark text-light rounded">
                {topic.content}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </div>
  )
}

export default InfoView
