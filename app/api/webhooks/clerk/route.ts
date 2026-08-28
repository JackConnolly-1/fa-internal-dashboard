import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { getMemberByEmail, updateMemberClerkId } from '@/lib/airtable'

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

// Verify Clerk webhook signature
function verifyClerkSignature(payload: string, header: string) {
  if (!WEBHOOK_SECRET) {
    console.warn('[CLERK_WEBHOOK] No CLERK_WEBHOOK_SECRET set, skipping verification')
    return true
  }

  const [t, v1] = (header || '').split(',')
  if (!t || !v1) return false

  const signedPayload = `${t}.${payload}`
  const hmac = createHmac('sha256', WEBHOOK_SECRET)
  hmac.update(signedPayload)
  const digest = hmac.digest('hex')

  return v1 === digest
}

export async function POST(request: Request) {
  const headersList = await headers()
  const payload = await request.text()
  const svixSignature = headersList.get('svix-signature')

  // Verify webhook signature
  if (!verifyClerkSignature(payload, svixSignature || '')) {
    console.error('[CLERK_WEBHOOK] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(payload)
  const eventType = body.type

  console.log(`[CLERK_WEBHOOK] Received event: ${eventType}`, { userId: body.data?.id })

  // Handle user.created event
  if (eventType === 'user.created') {
    const user = body.data
    const email = user.email_addresses?.[0]?.email_address

    if (!email) {
      console.warn('[CLERK_WEBHOOK] No email found for new user')
      return NextResponse.json({ received: true })
    }

    try {
      // Look up member by email in Airtable
      const member = await getMemberByEmail(email)

      if (member) {
        // Sync Clerk User ID to Airtable
        const updated = await updateMemberClerkId(member.id, user.id)
        console.log(
          `[CLERK_WEBHOOK] ${updated ? 'Updated' : 'Failed to update'} Airtable member ${member.id} with Clerk ID ${user.id}`
        )
      } else {
        console.log(`[CLERK_WEBHOOK] No Airtable member found for email ${email}`)
        // In production, you might create a new pending member record
      }
    } catch (error) {
      console.error('[CLERK_WEBHOOK] Error syncing with Airtable:', error)
    }
  }

  // Handle user.updated event
  if (eventType === 'user.updated') {
    const user = body.data
    const email = user.email_addresses?.[0]?.email_address

    if (email) {
      try {
        const member = await getMemberByEmail(email)
        if (member && !member.clerkUserId) {
          await updateMemberClerkId(member.id, user.id)
        }
      } catch (error) {
        console.error('[CLERK_WEBHOOK] Error updating user:', error)
      }
    }
  }

  // Handle user.deleted event
  if (eventType === 'user.deleted') {
    const user = body.data
    console.log(`[CLERK_WEBHOOK] User deleted: ${user.id}`)
    // In production, you might mark the member as inactive in Airtable
  }

  return NextResponse.json({ received: true })
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
