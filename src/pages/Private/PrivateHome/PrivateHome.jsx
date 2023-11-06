import React, { useContext } from 'react'
import { Megaphone, Person, Map } from 'react-bootstrap-icons'
import FormWizard from '../../../components/form/wizard'
import SidebarMenu from '../../../components/ui/SidebarMenu'
import ViewHeader from '../../../components/views/ViewHeader'
import ProfileView from '../../../components/views/ProfileView'
import MapView from '../../../components/views/MapView'
import { UserContext } from '../../../context/userContext'

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
  }

  // Extrayez l'icône et le titre de 'headers' basé sur 'activeView'
  const { Icon, title } = headers[activeView] || headers['profile']

  return (
    <>
      <SidebarMenu />
      <div
        className="container shadow-sm pt-5 pb-5 rounded-bottom"
        style={{ maxWidth: '800px' }}
      >
        <ViewHeader icon={Icon} title={title} />
        {contentView}
      </div>
    </>
  )
}
