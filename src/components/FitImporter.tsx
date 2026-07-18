"use client";

import { useState } from "react";
import { importEftFitAction } from "@/app/actions";

interface FitImporterProps {
    currentUserId: string;
}

export default function FitImporter({ currentUserId }: FitImporterProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 transition-all">
            {!isOpen ? (
                <div className="text-center py-2">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-5 rounded text-xs transition-colors shadow-md shadow-amber-900/10 w-full md:w-auto"
                    >
                        + Add New Fit
                    </button>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-amber-500">Import EFT Fit</h2>
                            <p className="text-[11px] text-slate-400">Paste an EFT block exported from game or Pyfa.</p>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
                        >
                            Cancel
                        </button>
                    </div>
                    
                    <form 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const eftText = formData.get("eftText") as string;
                            
                            // Call our isolated Server Action
                            const result = await importEftFitAction(currentUserId, eftText);
                            
                            if (result?.success) {
                                setIsOpen(false);
                                window.location.reload();
                            }
                        }} 
                        className="flex flex-col gap-3"
                    >
                        <textarea
                            name="eftText"
                            rows={6}
                            placeholder={`[Punisher, Amarr Starter]\nSmall Armor Repairer I\nHeat Sink I\n...`}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            required
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded text-xs transition-colors self-end"
                        >
                            Save to Cloud Library
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}