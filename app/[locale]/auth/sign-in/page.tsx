'use client'
import StandardPageLayout from "@/components/layout/StandardPageLayout";
import {useState} from 'react'
import {createClient} from '@/lib/supabase/client'

export default function SignInPage() {


  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)

    try {
      const supabase = createClient()

      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(error.name)
        console.error(error.status)
        console.error(error.message)
        alert(error.message)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <StandardPageLayout locale={'en'}>
      <main className="flex min-h-80 items-center justify-center">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="rounded-lg border px-6 py-3"
        >
          {loading ? 'Redirecting...' : 'Continue with Google'}
        </button>
      </main>
    </StandardPageLayout>
  )
}