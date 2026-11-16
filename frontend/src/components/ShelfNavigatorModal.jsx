import React from 'react';

export default function ShelfNavigatorModal({ isOpen, onClose, targetLocation }) {
  if (!isOpen) return null;

  const aisles = [
    {
      id: 'Aisle 1',
      name: 'Aisle 1: Tech & Mathematics',
      sections: 'Computer Science, IT, Engineering Maths',
      racks: ['Rack A', 'Rack B', 'Rack C', 'Rack D', 'Rack P (Pre-Owned)'],
      color: 'indigo'
    },
    {
      id: 'Aisle 2',
      name: 'Aisle 2: Core Engineering',
      sections: 'Mechanical, Electrical, Electronics, Civil',
      racks: ['Rack A', 'Rack B', 'Rack C'],
      color: 'sky'
    },
    {
      id: 'Aisle 3',
      name: 'Aisle 3: Literature & Self-Help',
      sections: 'Novels, Competitive Exams, General Knowledge',
      racks: ['Rack A', 'Rack B'],
      color: 'amber'
    }
  ];

  const targetAisle = targetLocation?.aisle || targetLocation?.aisle_no;
  const targetRack = targetLocation?.rack_id || targetLocation?.rack;
  const targetShelf = targetLocation?.shelf_level || targetLocation?.shelf;
  const bookTitle = targetLocation?.title;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Physical Store Shelf & Rack Navigator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid in-store indoor positioning coordinates for cashiers & walk-in students.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-base p-1">
            ✕
          </button>
        </div>

        {/* Target Book Breadcrumb Banner */}
        {targetLocation && (
          <div className="my-4 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                Target Book Coordinates:
              </span>
              <span className="font-display font-bold text-sm text-slate-900 block mt-0.5">
                {bookTitle ? `"${bookTitle}"` : 'Book Position'}
              </span>
              <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-indigo-900">
                <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                  {targetAisle}
                </span>
                <span>➔</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                  {targetRack}
                </span>
                <span>➔</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs text-emerald-700">
                  {targetShelf}
                </span>
              </div>
            </div>
            <span className="animate-pulse bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              📍 Located
            </span>
          </div>
        )}

        {/* 2D Interactive Store Layout Floor Map */}
        <div className="space-y-4 my-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
            <span>Store Floor Grid (Cash Counter ➔ Entrance)</span>
            <span className="text-slate-400">Total Aisles: 3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aisles.map((aisle) => {
              const isMatchAisle = targetAisle && targetAisle.includes(aisle.id);

              return (
                <div
                  key={aisle.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    isMatchAisle
                      ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{aisle.id}</span>
                    {isMatchAisle && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">{aisle.sections}</p>

                  {/* Racks Stack */}
                  <div className="space-y-2">
                    {aisle.racks.map((rack) => {
                      const isMatchRack = isMatchAisle && targetRack && rack.includes(targetRack.replace('Rack-', 'Rack ').trim());

                      return (
                        <div
                          key={rack}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between border transition ${
                            isMatchRack
                              ? 'bg-emerald-600 text-white font-bold shadow-sm border-emerald-700 ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{rack}</span>
                          {isMatchRack ? (
                            <span className="text-[10px] bg-white text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                              {targetShelf}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">3 Tiers</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Tip: Cashiers can find any book in under 5 seconds using shelf coordinates.
          </span>
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
          >
            Close Map
          </button>
        </div>

      </div>
    </div>
  );
}
