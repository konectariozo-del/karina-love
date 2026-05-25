/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { Sparkles, Heart, CheckCircle } from "lucide-react";

export default function RituaisTab() {
  const { state, toggleRitualApproval } = useCouple();
  const { currentUserId, rituais, casal } = state;

  const [celebrationRitual, setCelebrationRitual] = useState<string | null>(null);

  const handleToggle = (ritualId: string) => {
    const r = rituais.find((rit) => rit.id === ritualId);
    if (!r) return;

    // Detect if we are completing the ritual with this click
    const isEla = currentUserId === "karina-id";
    const willComplete = (isEla && !r.confirmacaoEla && r.confirmacaoEle) || (!isEla && !r.confirmacaoEle && r.confirmacaoEla);

    toggleRitualApproval(ritualId);

    if (willComplete) {
      setCelebrationRitual(r.titulo);
      setTimeout(() => {
        setCelebrationRitual(null);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6" id="rituals_tab_container">
      
      {/* 💆 INTRO HEADER */}
      <div className="text-center max-w-md mx-auto space-y-2">
        <h2 className="font-serif font-bold text-3xl text-[#2D2060]">
          Rituais de Intimidade
        </h2>
        <p className="text-xs text-gray">
          Compromissos afetivos desenhados para esquentar cansaços e celebrar cumplicidades. Não são tarefas domésticas — são conexões especiais. 💖
        </p>
      </div>

      {/* 💞 CELEBRATION FLOATING LAYOUT MODAL */}
      {celebrationRitual && (
        <div className="fixed inset-0 bg-[#0A0718]/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-[22px] max-w-sm text-center space-y-4 border border-[#F9A8C9]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#F76A8C] to-[#7C6AF7]" />
            
            <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-8 h-8 text-[#F76A8C] fill-[#F76A8C]" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-syne font-extrabold text-base text-[#2D2060] uppercase tracking-wider">
                RITUAL ATIVADO! 💞
              </h3>
              <p className="font-serif font-bold text-lg text-[#F76A8C]">{celebrationRitual}</p>
              <p className="text-xs text-gray leading-relaxed">
                Ambos ganharam <b className="text-[#F76A8C] font-syne">+80 XP individuais</b>. O streak conjunto de vocês pulou para <b className="text-[#7C6AF7] font-syne">{casal.streakAtual + 1} dias!</b>
              </p>
            </div>

            <button
              onClick={() => setCelebrationRitual(null)}
              className="w-full bg-[#7C6AF7] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#7C6AF7]/95 transition select-none"
            >
              Maravilhoso! ✨
            </button>
          </div>
        </div>
      )}

      {/* RITUAL CARDS FLEX LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rituais.map((r) => {
          const isEla = currentUserId === "karina-id";
          const myApproval = isEla ? r.confirmacaoEla : r.confirmacaoEle;
          const partnerApproval = isEla ? r.confirmacaoEle : r.confirmacaoEla;
          
          const partnerName = isEla ? "Yuri" : "Karina";
          const isCompleted = r.confirmacaoEla && r.confirmacaoEle;

          return (
            <div
              key={r.id}
              className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between ${
                isCompleted
                  ? "bg-emerald-50/40 border-emerald-150 shadow-xs"
                  : "bg-white border-[#F0EBFF] hover:border-[#F9A8C9]/35"
              }`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-[#FAF7FF] px-2.5 py-1 rounded-lg border border-[#F0EBFF] font-bold text-gray uppercase tracking-widest">
                    {r.dia} às {r.horario}
                  </span>
                  
                  <span className="text-[10px] text-[#F76A8C] font-semibold flex items-center gap-1 bg-pink-50/50 px-2.5 py-0.5 rounded-full border border-pink-100/35">
                    <Sparkles className="w-3 h-3 text-[#F76A8C] fill-[#F76A8C]" /> +{r.xpBonus} XP duplo
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#2D2060]">
                    {r.titulo}
                  </h3>
                  <p className="text-xs text-gray leading-relaxed">
                    {r.descricao}
                  </p>
                </div>
              </div>

              {/* Action and status row */}
              <div className="pt-4 border-t border-dashed border-[#F0EBFF] flex items-center justify-between gap-4 mt-4">
                
                {/* Partner status display */}
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${partnerApproval ? "bg-emerald-400 animate-pulse" : "bg-gray-light"}`} />
                  <span className="text-[10px] text-gray">
                    {partnerName}: <span className={partnerApproval ? "text-emerald-600 font-bold" : "text-gray"}>{partnerApproval ? "Confirmou ✓" : "Pendente"}</span>
                  </span>
                </div>

                {/* Confirm button */}
                <button
                  onClick={() => handleToggle(r.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                    myApproval
                      ? "bg-emerald-500 text-white shadow-xs border border-emerald-500"
                      : "bg-[#FAF7FF] text-[#7C6AF7] border border-[#F0EBFF] hover:bg-[#F0EBFF]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${myApproval ? "fill-white text-white animate-pulse" : "text-[#7C6AF7]"}`} />
                  {myApproval ? "Feito!" : "Eu fiz!"}
                </button>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
