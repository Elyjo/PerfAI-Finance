import CTASection from '@/components/landing/CTASection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import Footer from '@/components/landing/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'

export default function Home() {
  return <main className="bg-[#020617]"><Hero /><ProblemSection /><FeaturesSection /><SolutionSection /><HowItWorks /><CTASection /><Footer /></main>
}
