import React, { useContext } from 'react'
import {
  Megaphone,
  Person,
  Map,
  CardHeading,
  FileText,
} from 'react-bootstrap-icons'
import FormWizard from '../../../components/form/wizard'
import SidebarMenu from '../../../components/ui/SidebarMenu'
import ViewHeader from '../../../components/views/ViewHeader'
import ProfileView from '../../../components/views/ProfileView/'
import MapView from '../../../components/views/MapView'
import ReportingsView from '../../../components/views/ReportingsView/'
import InfoView from '../../../components/views/InfoView'
import { UserContext } from '../../../context/userContext'
import { motion } from 'framer-motion'
import { FormWizardProvider } from '../../../components/form/context/FormWizardContext'

const pageVariants = {
  initial: {
    opacity: 0,
    y: -50,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: 50,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

export default function PrivateHome() {
  const { activeView } = useContext(UserContext)

  const headers = {
    profile: { title: 'Profil', Icon: Person },
    map: { title: 'Mes signalements', Icon: Map },
    announcements: { title: 'Éco-veille', Icon: Megaphone },
    reportings: { title: 'Mes signalements', Icon: CardHeading },
    info: { title: 'Que dit la Loi', Icon: FileText },
  }

  let contentView
  switch (activeView) {
    case 'profile':
    default:
      contentView = <ProfileView />
      break
    case 'map':
      contentView = <MapView />
      break
    case 'reportings':
      contentView = <ReportingsView />
      break
    case 'announcements':
      contentView = <FormWizard />
      break
    case 'info':
      contentView = <InfoView />
      break
  }

  const { Icon, title } = headers[activeView] || headers['announcements']

  return (
    <>
      <SidebarMenu />
      <div
        className="container shadow-sm pt-5 pb-5 rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <FormWizardProvider>
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
        </FormWizardProvider>
      </div>
    </>
  )
}
