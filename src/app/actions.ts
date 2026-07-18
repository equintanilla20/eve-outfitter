"use server";

import { sql } from "@/lib/db";

export async function importEftFitAction(currentUserId: string, eftText: string) {
    if (!eftText || !eftText.trim()) return { success: false, error: "Empty fit string" };

    // EFT headers: [Ship Type, Fit Name]
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
        await sql`
            INSERT INTO public.fits (user_id, ship_type, fit_name, eft_text)
            VALUES (${currentUserId}, ${shipType}, ${fitName}, ${eftText})
        `;
        return { success: true };
    } catch (error) {
        console.error("Database storage failed:", error);
        return { success: false, error: "Database write error" };
    }
}