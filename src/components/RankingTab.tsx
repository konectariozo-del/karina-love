/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useCouple } from "../context/CoupleContext";
import { Award, ShoppingBag, Sparkles, History, ArrowRight } from "lucide-react";

export default function RankingTab() {
  const {
    state,
    buyStars,
    unlockCosmetic,
    setCosmeticStyle,
    activeGardenStyle,
    activeGarageStyle,
    recentActivity,
  } = useCouple();

  const { currentUserId, usuarios, stars, unlockedDecorations } = state;

  // Compute who is winning for humorous callouts
  const difference = Math.abs(usuarios.ela.xpIndividual - usuarios.ele.xpIndividual);
  const isElaLeading = usuarios.ela.xpIndividual > usuarios.ele.xpIndividual;
  const isDraw = usuarios.ela.xpIndividual === usuarios.ele.xpIndividual;

  const humors = {
    ela: isElaLeading
      ? `Você está brilhando na frente com +${difference} XP! Continue assim! ✨`
      : isDraw
      ? "Sintonia magnética perfeita! Vocês estão em equilíbrio cósmico completo. 🤝"
      : `Yuri está com ${difference} XP na frente. Hora de fazer uma massagem ou regar flores! 🔥`,
    ele: isElaLeading
      ? `Karina está liderando por +${difference} XP! Que tal lavar aquela panela de pressão? 👀`
      : isDraw
      ? "Pontuação idêntica! Cooperação no lar em perfeito alinhamento de estrelas."
      : `Você ultrapassou ela por +${difference} XP! Cuidado, não deixe ela te alcançar! 😉`,
  };

  const activeHumor = currentUserId === "karina-id" ? humors.ela : humors.ele;

  // Star purchase bundles (replaces "V-Bucks" models to avoid cheap corporate feels)
  const starBundles = [
    { count: 500, price: "R$ 4,90", tag: "Fezes de Amor" },
    { count: 1200, price: "R$ 9,90", tag: "Mais Amado ❤️" },
    { count: 2800, price: "R$ 19,90", tag: "Brilho Estelar 💎" },
  ];

  // Terrain cosmetic designs
  const cosmeticsStore = [
    {
      id: "garden-spring",
      name: "Jardim Primavera Encantada 🌸",
      type: "garden" as const,
      cost: 500,
      description: "Flores de cerejeira flutuantes e horta florida para a Karina.",
    },
    {
      id: "garden-winter",
      name: "Jardim Alpes de Inverno ❄️",
      type: "garden" as const,
      cost: 700,
      description: "Neve fina brilhante e pinheiros alpinos brancos.",
    },
    {
      id: "garage-neon",
      name: "Garagem Cyberpunk Neon 🕹️",
      type: "garage" as const,
      cost: 600,
      description: "Luzes laser roxas e arcades neon cintilantes.",
    },
  ];

  return (
    <div className="space-y-6" id="ranking_tab_container">
      
      {/* 🏆 HEAD-TO-HEAD LEADERBOARD */}
      <div className="bg-white p-5 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-4" id="couples_leaderboard">
        <div className="text-center space-y-1">
          <span className="text-[10px] text-[#7C6AF7] font-bold uppercase tracking-widest block">Painel Competitivo-Afetivo</span>
          <h3 className="font-serif font-bold text-2xl text-[#2D2060] flex items-center justify-center gap-1.5">
            <Award className="w-5.5 h-5.5 text-[#7C6AF7]" /> Ranking da Constelação
          </h3>
          <p className="text-xs text-gray">Mapeamento de esforços individuais para tornar a convivência divertida</p>
        </div>

        {/* Humorous alert comment */}
        <div className="p-3 bg-[#FAF7FF] rounded-xl text-center border border-[#F0EBFF]">
          <p className="text-xs font-semibold text-[#7C6AF7] leading-relaxed">{activeHumor}</p>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          
          {/* Ela (Karina) */}
          <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center relative overflow-hidden transition-all ${
            isElaLeading ? "bg-pink-50/40 border-[#F9A8C9]/40 shadow-sm" : "bg-white border-[#F0EBFF]"
          }`}>
            {isElaLeading && (
              <span className="absolute top-2 right-2 text-base" title="Líder Cósmica">👑</span>
            )}
            <div className="w-13 h-13 rounded-full bg-pink-50 border border-[#F9A8C9]/30 flex items-center justify-center text-2xl shadow-xs">
              🧚‍♀️
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#2D2060]">
                {usuarios.ela.nome} (Ela)
              </h4>
              <p className="text-[9px] text-[#F76A8C] font-mono tracking-wider font-bold uppercase mt-0.5 max-w-full truncate px-1">
                {usuarios.ela.badges[0] || "Fada do Lar"}
              </p>
            </div>
            <p className="text-3xl font-syne font-extrabold text-[#2D2060]">
              {usuarios.ela.xpIndividual} <span className="text-xs font-sans text-gray">XP</span>
            </p>
          </div>

          {/* Ele (Yuri) */}
          <div className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-center relative overflow-hidden transition-all relative ${
            !isElaLeading && !isDraw ? "bg-purple-50/40 border-[#A78BFA]/40 shadow-sm" : "bg-white border-[#F0EBFF]"
          }`}>
            {!isElaLeading && !isDraw && (
              <span className="absolute top-2 right-2 text-base" title="Líder Cósmico">👑</span>
            )}
            <div className="w-13 h-13 rounded-full bg-purple-50 border border-[#A78BFA]/30 flex items-center justify-center text-2xl shadow-xs">
              🕹️
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#2D2060]">
                {usuarios.ele.nome} (Ele)
              </h4>
              <p className="text-[9px] text-[#7C6AF7] font-mono tracking-wider font-bold uppercase mt-0.5 max-w-full truncate px-1">
                {usuarios.ele.badges[0] || "Mestre da Louça"}
              </p>
            </div>
            <p className="text-3xl font-syne font-extrabold text-[#2D2060]">
              {usuarios.ele.xpIndividual} <span className="text-xs font-sans text-gray">XP</span>
            </p>
          </div>

        </div>
      </div>

      {/* 📜 HISTÓRICO DE ESFORÇO */}
      <div className="bg-white p-5 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-3.5" id="contribution_log_panel">
        <h3 className="font-serif font-bold text-lg text-[#2D2060] flex items-center gap-2 border-b border-[#FAF7FF] pb-2">
          <History className="w-4.5 h-4.5 text-[#F76A8C]" /> Diário de Conquistas do Casal
        </h3>

        <div className="space-y-3 max-h-[160px] overflow-y-auto no-scrollbar pr-0.5">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex justify-between items-center text-xs pb-2 border-b border-[#FAF7FF] last:border-none">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: act.color }}
                />
                <p className="text-gray-700 font-medium">
                  <b className="font-bold">{act.user}</b> {act.text}
                </p>
              </div>
              <span className="text-[9px] text-gray italic shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🛍️ ESTRELAS DO DESEJO SHOP */}
      <div className="bg-white p-5 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-5" id="stars_store_workspace">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#FAF7FF]/60 pb-3">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2D2060] flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-[#7C6AF7]" /> Loja de Estrelas Karina
            </h3>
            <p className="text-xs text-gray mt-0.5">Apoie o desenvolvedor carinhosamente e sinta satisfação em decorar!</p>
          </div>

          {/* Star Wallet indicator */}
          <div className="bg-[#1C1340] border border-[#7C6AF7]/40 text-yellow-300 px-4 py-2 rounded-xl flex items-center gap-2 self-start">
            <span className="text-xl">⭐️</span>
            <div>
              <p className="text-[8px] text-zinc-300 font-bold tracking-wider uppercase font-mono">Suas Estrelas</p>
              <p className="font-syne font-black text-sm">{stars}</p>
            </div>
          </div>
        </div>

        {/* Recharge Stars packs */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray uppercase tracking-widest">Recarregar Estrelas (Símbolo de Apoio)</h4>
          <div className="grid grid-cols-3 gap-3">
            {starBundles.map((bundle) => (
              <div key={bundle.count} className="p-3 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl text-center flex flex-col justify-between items-center space-y-2 relative">
                <span className="absolute -top-1 right-2 text-[7px] bg-[#F9A8C9]/35 text-[#F76A8C] px-1 py-0.5 rounded font-black uppercase tracking-wide">
                  {bundle.tag}
                </span>

                <div className="pt-2 text-center">
                  <span className="text-2xl block animate-pulse">⭐️</span>
                  <p className="font-syne font-black text-sm text-[#2D2060]">{bundle.count}</p>
                </div>

                <button
                  onClick={() => buyStars(bundle.count)}
                  className="w-full bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold py-1 px-2 rounded-lg text-[10px] transition cursor-pointer select-none"
                >
                  {bundle.price}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Cosmetics List */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray uppercase tracking-widest">Comprar Decorações Cósmicas</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cosmeticsStore.map((item) => {
              const bought = unlockedDecorations.includes(item.id);
              const applied = item.type === "garden" ? activeGardenStyle === item.id : activeGarageStyle === item.id;

              return (
                <div key={item.id} className="p-3.5 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-sm text-[#2D2060]">{item.name}</h5>
                    <p className="text-[10px] font-syne text-[#7C6AF7] font-bold">CUSTO: {item.cost} Estrelas</p>
                    <p className="text-[9px] text-[#2D2060]/70 leading-relaxed">{item.description}</p>
                  </div>

                  {bought ? (
                    <button
                      onClick={() => setCosmeticStyle(item.type, applied ? `${item.type}-default` : item.id)}
                      className={`w-full py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer select-none ${
                        applied
                          ? "bg-stone-800 text-white"
                          : "bg-emerald-55 hover:bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {applied ? "Remover" : "Aplicar"}
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockCosmetic(item.id, item.cost)}
                      className="w-full bg-[#2D2060] text-white hover:bg-[#2D2060]/95 py-1.5 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer select-none"
                    >
                      <span>Desbloquear</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
