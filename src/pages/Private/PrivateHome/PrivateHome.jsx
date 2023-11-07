import React, { useContext } from 'react'
import { Megaphone, Person, Map } from 'react-bootstrap-icons'
import FormWizard from '../../../components/form/wizard'
import SidebarMenu from '../../../components/ui/SidebarMenu'
import ViewHeader from '../../../components/views/ViewHeader'
import ProfileView from '../../../components/views/ProfileView'
import MapView from '../../../components/views/MapView'
import ReportingsView from '../../../components/views/ReportingsView'
import { UserContext } from '../../../context/userContext'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    y: -50, // déplacez le composant vers le haut initialement
  },
  in: {
    opacity: 1,
    y: 0, // animez le composant pour revenir à sa position d'origine
  },
  out: {
    opacity: 0,
    y: 50, // faites glisser le composant vers le bas lorsqu'il sort
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

export default function PrivateHome() {
  const { activeView } = useContext(UserContext)

  // Déclaration de l'objet 'headers'
  const headers = {
    profile: { title: 'Profil', Icon: Person },
    map: { title: 'Carte', Icon: Map },
    announcements: { title: 'Éco-veille', Icon: Megaphone },
  }

  let contentView
  switch (activeView) {
    case 'profile':
      contentView = <ProfileView />
      break
    case 'map':
      contentView = <MapView />
      break
    case 'announcements':
    default:
      contentView = <FormWizard />
      break
    case 'reportings':
      contentView = <ReportingsView />
      break
  }

  // Extrayez l'icône et le titre de 'headers' basé sur 'activeView'
  const { Icon, title } = headers[activeView] || headers['announcements']

  return (
    <>
      <SidebarMenu />
      <div
        className="container shadow-sm pt-5 pb-5 rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <motion.div
          key={activeView}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          <ViewHeader icon={Icon} title={title} />
          {contentView}
        </motion.div>
      </div>
    </>
  )
}
