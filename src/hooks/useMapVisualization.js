import { useState } from 'react'

function useMapVisualization() {
  const [showMap, setShowMap] = useState(false)

  const handleVisualizeClick = () => {
    setShowMap((prevState) => !prevState)
  }

  return {
    showMap,
    handleVisualizeClick,
  }
}

export default useMapVisualization
