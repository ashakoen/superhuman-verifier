'use client'

import { SuperhumanVerifier } from '@/components/SuperhumanVerifier'

export default function Home() {
  const handleVerificationComplete = (token: string) => {
    console.log('Verification complete:', token)
    // Handle the verification token (e.g., send it to your server)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Superhuman Verifier Demo</h1>
      <SuperhumanVerifier
        onVerificationComplete={handleVerificationComplete}
        size={200}
        colors={{
          background: 'bg-gray-800',
          ring: 'bg-gray-700',
          progress: 'bg-blue-500',
          dot: 'bg-blue-500',
        }}
        texts={{
          title: 'Prove Your Humanity',
          instruction: 'Press and hold until I say when...',
          verified: 'You\'re an Exceptional Human!',
        }}
        timeRange={{ min: 2, max: 5 }}
      />
    </main>
  )
}
