'use client'
import Script from 'next/script'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CredentialResponse } from 'google-one-tap'

export default function GoogleSignInButton() {
  const router = useRouter()

  useEffect(() => {
    const generateNonce = async () => {
      const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
      const encoder = new TextEncoder()
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(nonce))
      const hashedNonce = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      return [nonce, hashedNonce]
    }

    generateNonce().then(([nonce, hashedNonce]) => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          })
          if (!error) router.push('/')
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      })

      window.google.accounts.id.renderButton(
        document.getElementById('g_id_signin')!,
        {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
        }
      )
    })
  }, [])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async />
      <div id="g_id_signin" />
    </>
  )
}
