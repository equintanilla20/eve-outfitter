import Link from "next/link";

export default function AuthError() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-lg text-center">
        <h1 className="text-xl font-bold text-red-500 mb-2">Authentication Failed</h1>
        <p className="text-sm text-slate-400 mb-6">
          Supabase was unable to parse your EVE Online capsuleer identity metadata.
        </p>
        <Link href="/" className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded transition-colors text-amber-400 font-medium">
          Return to Hangar
        </Link>
      </div>
    </div>
  )
}