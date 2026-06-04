import { createContext, useContext } from 'react'

export const ALL_FEATURES = ['spark', 'grounding', 'kind_words', 'space', 'figure_it_out', 'settle']

export const FEATURE_META = [
  { id: 'spark',         label: 'Daily spark',         desc: 'A tiny act to keep you curious each morning.' },
  { id: 'grounding',     label: 'Grounding',            desc: 'A sensory pause to reset whenever you need it.' },
  { id: 'kind_words',    label: 'Kind words',           desc: 'A jar of kind words to revisit when you need a lift.' },
  { id: 'space',         label: 'Your space',           desc: 'Park thoughts and release what weighs on you.' },
  { id: 'figure_it_out', label: "Let's figure it out",  desc: 'An AI thinking partner for hard moments.' },
  { id: 'settle',        label: 'Settle',               desc: 'Breathing exercises and mindful pause moments.' },
]

// Default: all features on (used before DB loads and for new users)
const FeaturesContext = createContext({
  features: ALL_FEATURES,   // string[] of enabled feature ids
  refresh:  () => {},       // re-reads from DB — call after toggling
})

export function useFeatures() { return useContext(FeaturesContext) }
export default FeaturesContext
