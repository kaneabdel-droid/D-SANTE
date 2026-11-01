import { getEchangesCliniquePharma, getBordereauxIpm } from './actions'
import { InteropClient } from './InteropClient'

export default async function InteropPage() {
  const [{ echanges }, { bordereaux }] = await Promise.all([
    getEchangesCliniquePharma(),
    getBordereauxIpm(),
  ])

  return <InteropClient echanges={echanges || []} bordereaux={bordereaux || []} />
}

