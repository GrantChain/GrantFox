'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import type { CredentialResponse } from 'google-one-tap'
import { useAuth } from '@/components/modules/auth/hooks/auth.hook'

export default function GoogleSignInButton() {
  const { handleGoogleLogin } = useAuth()
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)

  useEffect(() => {
    if (googleScriptLoaded) {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: async (response: CredentialResponse) => {
          await handleGoogleLogin(response.credential)
        },
      })

      // Render google sign in button
      const buttonContainer = document.getElementById("googleSignInButton");
      if (buttonContainer) {
        window.google?.accounts.id.renderButton(
          buttonContainer,
          { 
            type: "standard", 
            shape: "pill",
            theme: "outline",
            text: "signin_with",
            size: "large",
            logo_alignment: "left"
          }
        )
      }
    }
  }, [googleScriptLoaded, handleGoogleLogin])

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={() => setGoogleScriptLoaded(true)}
      />
      
      {}
      <div id="googleSignInButton"></div>
    </>
  )
}