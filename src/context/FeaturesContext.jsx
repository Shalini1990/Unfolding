import { createContext, useContext } from 'react'

export const ALL_FEATURES = ['spark', 'evening', 'space', 'settle', 'figure_it_out']

export const FEATURE_META = [
  { id: 'spark',         label: 'Daily spark',         desc: 'A tiny act to keep you curious each morning.' },
  { id: 'evening',       label: 'Evening reflection',  desc: 'Three prompts to close your day well.' },
  { id: 'space',         label: 'Your space',          desc: 'Park thoughts and release what weighs on you.' },
  { id: 'settle',        label: 'Settle',              desc: 'Breathing exercises and mindful pause moments.' },
  { id: 'figure_it_out', label: "Let's figure it out", desc: 'An AI thinking partner for hard moments.' },
]

// Default: all features on (used before DB loads and for new users)
const FeaturesContext = createContext({
  features: ALL_FEATURES,   // string[] of enabled feature ids
  refresh:  () => {},       // re-reads from DB — call after toggling
})

export function useFeatures() { return useContext(FeaturesContext) }
export default FeaturesContext
