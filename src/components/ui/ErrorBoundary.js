import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état avec le fait qu'une erreur s'est produite
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également enregistrer l'erreur dans un service de reporting d'erreurs
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle interface utilisateur de repli
      return <h1>Quelque chose s'est mal passé.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
