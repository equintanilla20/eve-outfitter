'use client';

import { useState, useEffect } from 'react';
import { parseEft, EveFit } from '@/utils/eftParser';

export default function Home() {
    const [rawText, setRawText] = useState('');
    const [library, setLibrary] = useState<EveFit[]>([]);

    // Load saved fits from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('eve_fits');
        if (saved) setLibrary(JSON.parse(saved));
    }, []);

    const handleImport = () => {
        const parsed = parseEft(rawText);
        if (!parsed) {
            alert('Invalid EFT format. Make sure it includes the bracketed [Ship, Name] header!');
            return;
        }

        const updatedLibrary = [...library, parsed];
        setLibrary(updatedLibrary);
        localStorage.setItem('eve_fits', JSON.stringify(updatedLibrary));
        setRawText(''); // Clear input
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 tracking-tight text-amber-500">EVE OUTFITTER</h1>
                <p className="text-slate-400 mb-8">A lightweight EVE Online fitting archive.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Import Input */}
                    <div className="md:col-span-1 bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h2 className="text-lg font-semibold mb-4">Import New Fit</h2>
                        <textarea
                            className="w-full h-64 bg-slate-950 border border-slate-800 rounded p-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                            placeholder="Paste EFT text from clipboard here..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                        <button
                            onClick={handleImport}
                            className="mt-4 w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded transition-colors text-sm"
                        >
                            Add to Library
                        </button>
                    </div>

                    {/* Right Column: Library Display */}
                    <div className="md:col-span-2 bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h2 className="text-lg font-semibold mb-4">Your Library ({library.length})</h2>
                        {library.length === 0 ? (
                            <p className="text-slate-500 text-sm italic">No fits saved yet. Paste one on the left!</p>
                        ) : (
                            <div className="space-y-4">
                                {library.map((fit, index) => (
                                    <div key={index} className="bg-slate-950 p-4 rounded border border-slate-800">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-amber-400 font-bold">{fit.fitName}</h3>
                                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">{fit.shipType}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">
                                            {fit.modules.join(' • ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
