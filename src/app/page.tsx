import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Provider } from '@supabase/supabase-js'

export default async function Home() {
  const supabase = await createClient()

  // 1. Fetch the authenticated user profile details from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Fetch fits belonging specifically to this authenticated user
  const { data: fits } = user 
    ? await supabase.from('fits').select('*').order('created_at', { ascending: false })
    : { data: [] }

  // Server Action to trigger the Custom OIDC EVE Online Auth Flow
  const handleLogin = async () => {
    'use server'
    const serverSupabase = await createClient()
    
    // Note: Your custom provider identifier in Supabase matches the name you set
    // usually structured as "custom:eveonline" or similar based on your setting string.
    const { data, error } = await serverSupabase.auth.signInWithOAuth({
      provider: 'custom:eveonline' as Provider, 
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        scopes: 'publicData',
      },
    })

    if (error) console.error('Login routing issue:', error.message)
    if (data.url) redirect(data.url)
  }

  // Server Action to clear the cookie and sign out
  const handleLogout = async () => {
    'use server'
    const serverSupabase = await createClient()
    await serverSupabase.auth.signOut()
    revalidatePath('/')
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-500">EVE OUTFITTER</h1>
          <p className="text-slate-400 text-sm">Lightweight fit repository.</p>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              Fly safe, <strong className="text-amber-400">{user.user_metadata.name || 'Capsuleer'}</strong>
            </span>
            <form action={handleLogout}>
              <button className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded transition-colors">
                Log Out
              </button>
            </form>
          </div>
        ) : (
          <form action={handleLogin}>
            <button className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded text-sm transition-colors shadow-lg shadow-amber-900/20">
              Log in with EVE Online
            </button>
          </form>
        )}
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Import Tool Placeholder</h2>
            <p className="text-sm text-slate-400 mb-2">Pasted fits will process here and drop into database storage.</p>
          </div>

          <div className="md:col-span-2 bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Saved Library ({fits?.length || 0})</h2>
            {fits && fits.length > 0 ? (
              <div className="space-y-3">
                {fits.map((fit) => (
                  <div key={fit.id} className="p-3 bg-slate-950 border border-slate-800 rounded">
                    <div className="font-bold text-amber-400">{fit.fit_name}</div>
                    <div className="text-xs text-slate-500 font-mono">{fit.ship_type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-slate-500">No fits recorded in your cloud database profile yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-slate-900/50 border border-slate-800 rounded-lg max-w-xl mx-auto mt-12">
          <p className="text-slate-400 italic text-sm">Please log in using your secure EVE Online credentials to pull your custom fitting configurations.</p>
        </div>
      )}
    </main>
  )
}