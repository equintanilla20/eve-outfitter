// src/components/FitImporter.tsx
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function FitImporter() {
  const session = await auth();
  
  // Guard clause: Don't render the action tool if the player isn't logged in
  if (!session?.user?.id) return null;

  async function importEftFit(formData: FormData) {
    "use server";
    
    const eftText = formData.get("eftText") as string;
    if (!eftText || !eftText.trim()) return;

    // Simple parser for EFT headers. 
    // Format is usually: [Ship Type, Fit Name]
    const firstLine = eftText.split("\n")[0].trim();
    let shipType = "Unknown Ship";
    let fitName = "Unnamed Fit";

    if (firstLine.startsWith("[") && firstLine.endsWith("]")) {
      const headerContent = firstLine.slice(1, -1);
      const parts = headerContent.split(",");
      if (parts.length >= 2) {
        shipType = parts[0].trim();
        fitName = parts.slice(1).join(",").trim();
      } else {
        shipType = parts[0].trim();
      }
    }

    try {
      // Direct raw query execution straight down to Supabase!
      await sql`
        INSERT INTO public.fits (user_id, ship_type, fit_name, eft_text)
        VALUES (${session.user.id!}, ${shipType}, ${fitName}, ${eftText})
      `;
      
      // Instantly updates the server-rendered library on your dashboard
      revalidatePath("/");
    } catch (error) {
      console.error("Database storage failed:", error);
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold mb-2">Import EFT Fit</h2>
      <p className="text-xs text-slate-400 mb-4">Paste an EFT block exported from game or Pyfa.</p>
      
      <form action={importEftFit} className="flex flex-col gap-3">
        <textarea
          name="eftText"
          rows={8}
          placeholder={`[Punisher, Amarr Starter]\nSmall Armor Repairer I\nHeat Sink I\n...`}
          className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          required
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded text-xs transition-colors self-end"
        >
          Save to Cloud Library
        </button>
      </form>
    </div>
  );
}