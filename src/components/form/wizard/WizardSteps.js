import { Step1Component, Step2Component } from './StepComponents'

const wizardSteps = [
  {
    id: 1,
    label: 'Étape 1',
    component: Step1Component,
    props: {},
  },
  {
    id: 2,
    label: 'Étape 2',
    component: Step2Component,
    props: {},
  },
  // ... ajoutez d'autres étapes si nécessaire
]

export default wizardSteps
