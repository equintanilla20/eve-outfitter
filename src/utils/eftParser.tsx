export interface EveFit {
    shipType: string;
    fitName: string;
    modules: string[];
}

export function parseEft(text: string): EveFit | null {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    const firstLineMatch = lines[0].match(/^\[(.+),\s*(.+)\]$/);
    if (!firstLineMatch) return null;

    const [_, shipType, fitName] = firstLineMatch;
    const modules: string[] = [];

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.includes(',')) {
            line = line.split(',')[0].trim();
        }
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
