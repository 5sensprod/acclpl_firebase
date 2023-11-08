import {
  Step1Component,
  Step2Component,
  Step3Component,
  Step4Component,
} from '../ui/StepComponents'

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
  {
    id: 3,
    label: 'Étape 3',
    component: Step3Component,
    props: {},
  },
  {
    id: 4,
    label: 'Étape 4',
    component: Step4Component,
    props: {},
  },
]

export default wizardSteps
