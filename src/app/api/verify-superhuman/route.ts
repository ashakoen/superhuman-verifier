import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const body = await request.json()
  const { timestamp, verificationTime } = body

  // Implement additional checks here, such as:
  // - Rate limiting
  // - IP-based checks
  // - Browser fingerprinting
  // - Challenge-response mechanism

  // Check if the verification was completed within an acceptable time range
  const now = Date.now()
  const acceptableStartTime = now - verificationTime - 1000 // Allow 1 second of leeway
  const acceptableEndTime = now + 1000 // Allow 1 second of leeway

  if (timestamp < acceptableStartTime || timestamp > acceptableEndTime) {
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 400 })
  }

  // Generate a JWT token
  const token = sign({ verified: true, timestamp, verificationTime }, JWT_SECRET, { expiresIn: '1h' })

  return NextResponse.json({ success: true, token })
}
