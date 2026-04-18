import { createFileRoute } from '@tanstack/react-router'
import MnemonicApp from '../components/MnemonicApp'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <MnemonicApp />
}
