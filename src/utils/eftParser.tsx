export interface EveFit {
    shipType: string;
    fitName: string;
    modules: string[];
}

export function parseEft(text: string): EveFit | null {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    // The first line of an EFT fit is always format: [Ship Type, Fit Name]
    const firstLineMatch = lines[0].match(/^\[(.+),\s*(.+)\]$/);
    if (!firstLineMatch) return null;

    const [_, shipType, fitName] = firstLineMatch;
    const modules: string[] = [];

    // Parse the remaining lines, skipping empty lines and drone/ammo counts for now
    for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        
        // Strip off ammo or item quantities (e.g., "Gatling Rail II, Iron Charge S")
        if (line.includes(',')) {
            line = line.split(',')[0].trim();
        }
        // Strip off multiple item multipliers (e.g., "Nanite Repair Paste x10")
        if (line.includes(' x')) {
            line = line.split(' x')[0].trim();
        }

        modules.push(line);
    }

    return {
        shipType,
        fitName,
        modules
    };
}
