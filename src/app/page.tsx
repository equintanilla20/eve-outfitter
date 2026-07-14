// src/app/page.tsx
import { auth, signIn, signOut } from "@/auth";
import { sql } from "@/lib/db";
import FitImporter from "@/components/FitImporter";

export default async function Home() {
  const session = await auth();

  // Dynamically pull fits belonging specifically to this authenticated EVE user ID
  const fits = session?.user?.id
    ? await sql`SELECT id, ship_type, fit_name, created_at FROM public.fits WHERE user_id = ${session.user.id} ORDER BY created_at DESC`
    : [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-500">EVE OUTFITTER</h1>
          <p className="text-slate-400 text-sm">Lightweight fit repository.</p>
        </div>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              Fly safe, <strong className="text-amber-400">{session.user?.name}</strong>
            </span>
            <form action={async () => { "use server"; await signOut(); }}>
              <button className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded transition-colors">
                Log Out
              </button>
            </form>
          </div>
        ) : (
          <form action={async () => { "use server"; await signIn("eveonline"); }}>
            <button className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded text-sm transition-colors shadow-lg shadow-amber-900/20">
              Log in with EVE Online
            </button>
          </form>
        )}
      </div>

      {session ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <FitImporter />
          </div>

          <div className="md:col-span-2 bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-lg font-semibold mb-4">Saved Library ({fits.length})</h2>
            {fits.length > 0 ? (
              <div className="space-y-3">
                {fits.map((fit: any) => (
                  <div key={fit.id} className="p-4 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                    <div>
                      <div className="font-bold text-amber-400">{fit.fit_name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{fit.ship_type}</div>
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {new Date(fit.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-slate-500 p-4 bg-slate-950/50 border border-slate-850 border-dashed rounded text-center">
                No ship fits recorded in your cloud database profile yet.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-slate-900/50 border border-slate-800 rounded-lg max-w-xl mx-auto mt-12">
          <p className="text-slate-400 italic text-sm">Please log in using your secure EVE Online credentials to access your library.</p>
        </div>
      )}
    </main>
  );
}