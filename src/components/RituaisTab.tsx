/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { Sparkles, Heart, Check, Users } from "lucide-react";

export default function RituaisTab() {
  const { state, toggleRitualApproval } = useCouple();
  const { currentUserId, rituals, users, home } = state;

  const [celebrationRitual, setCelebrationRitual] = useState<string | null>(null);

  const handleToggle = (ritualId: string) => {
    const r = rituals.find((rit) => rit.id === ritualId);
    if (!r) return;

    // Check if the other partner is already confirmed, which means our confirmation will trigger a complete!
    const isUserEla = currentUserId === "karina-id";
    const willComplete = (isUserEla && !r.confirmedByA && r.confirmedByB) || (!isUserEla && !r.confirmedByB && r.confirmedByA);

    toggleRitualApproval(ritualId);

    if (willComplete) {
      setCelebrationRitual(r.title);
      setTimeout(() => {
        setCelebrationRitual(null);
      }, 5000); // 5 sec animation modal
    }
  };

  return (
    <div className="space-y-6" id="rituals_tab_container">
      {/* Intro Header */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <h2 className="font-serif font-bold text-3xl text-[#2D2060]">
          Rituais do Casal
        </h2>
        <p className="text-xs text-gray-500">
          Compromissos afetivos que celebram a cumplicidade. Não são obrigações de casa — são escolhas de amor. 💖
        </p>
      </div>

      {/* Celebration Modal Overlay */}
      {celebrationRitual && (
        <div className="fixed inset-0 bg-[#0A0718]/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl max-w-xs text-center space-y-4 border-2 border-pink-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-400 via-pink-300 to-[#7C6AF7]"></div>
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-9 h-9 text-pink-500 fill-pink-500" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-syne font-extrabold text-lg text-[#2D2060] uppercase tracking-wide">
                COMPLETADO! 💞
              </h3>
              <p className="font-serif font-bold text-lg text-pink-500">{celebrationRitual}</p>
              <p className="text-xs text-gray-400">
                Ambos ganharam <b className="text-pink-500 font-syne">+100 XP</b> e o streak compartilhado pulou para <b className="text-[#7C6AF7]">{home.streak + 1} dias</b>!
              </p>
            </div>

            <button
              onClick={() => setCelebrationRitual(null)}
              className="w-full bg-[#7C6AF7] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#7C6AF7]/90 transition"
            >
              Maravilha! ✨
            </button>
          </div>
        </div>
      )}

      {/* Ritual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rituals.map((ritual) => {
          const isEla = currentUserId === "karina-id";
          const myConfirmation = isEla ? ritual.confirmedByA : ritual.confirmedByB;
          const partnerConfirmation = isEla ? ritual.confirmedByB : ritual.confirmedByA;
          
          const partnerName = isEla ? "Yuri" : "Karina";
          const isComplete = ritual.confirmedByA && ritual.confirmedByB;

          return (
            <div
              key={ritual.id}
              className={`p-5 rounded-3xl border transition relative flex flex-col justify-between ${
                isComplete
                  ? "bg-emerald-50/70 border-emerald-150 shadow-xs"
                  : "bg-white border-[#F0EBFF] hover:border-pink-100"
              }`}
            >
              {isComplete && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1.5 text-xs font-bold leading-none" title="Ritual completo hoje!">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-[#FAF7FF] px-2.5 py-1 rounded-xl border border-gray-100 font-bold text-gray-500 uppercase tracking-widest font-mono">
                    {ritual.dayOfWeek}
                  </span>
                  <span className="text-[10px] text-pink-600 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-500 fill-pink-500" /> +100 XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-xl text-[#2D2060]">
                    {ritual.title}
                  </h4>
                  <p className="text-xs text-gray-500 pb-2">
                    {ritual.description}
                  </p>
                </div>
              </div>

              {/* Approval Row */}
              <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between gap-4 mt-2">
                
                {/* Partner Status Meter */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${partnerConfirmation ? "bg-emerald-500" : "bg-gray-200"}`}></div>
                  <span className="text-[10px] text-gray-400">
                    {partnerName}: <b className={partnerConfirmation ? "text-emerald-600 font-bold" : "text-gray-400 font-normal"}>{partnerConfirmation ? "Pronto" : "Pendente"}</b>
                  </span>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={() => handleToggle(ritual.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                    myConfirmation
                      ? "bg-emerald-500 text-white shadow-xs border border-emerald-500"
                      : "bg-[#FAF7FF] text-[#7C6AF7] border border-[#F0EBFF] hover:bg-[#F0EBFF]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${myConfirmation ? "fill-white text-white" : ""}`} />
                  {myConfirmation ? "Eu Confirmei!" : "Confirmar Minha Parte"}
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
