import {NextResponse} from 'next/server'
import {createClient} from '@/lib/supabase/server'
import {cookies} from 'next/headers'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map(({name}) => name);

    console.log(
      "Supabase cookie names:",
      cookieNames.filter((name) => name.startsWith("sb-")),
    );


    const supabase = await createClient()
    const {error} =
      await supabase.auth.exchangeCodeForSession(code)
    console.log(">error>", code)
    console.log(">error>", error?.message)
    if (!error) {
      return NextResponse.redirect(
        new URL('/pricing', url.origin)
      )
    }
  }

  return NextResponse.redirect(
    new URL('/auth/sign-in?error=auth', url.origin)
  )
}