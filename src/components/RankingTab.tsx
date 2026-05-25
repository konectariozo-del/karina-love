/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useCouple } from "../context/CoupleContext";
import { Award, ShoppingBag, Radio, Sparkles, Flame, History, Compass, ArrowRight } from "lucide-react";

export default function RankingTab() {
  const {
    state,
    buyStars,
    unlockCosmetic,
    unlockedCosmetics,
    setCosmeticStyle,
    activeGardenStyle,
    activeGarageStyle,
    recentActivity,
  } = useCouple();

  const { currentUserId, users, stars } = state;

  // Compute who is winning for humorous callouts
  const difference = Math.abs(users.ela.xp - users.ele.xp);
  const isElaLeading = users.ela.xp > users.ele.xp;
  const isDraw = users.ela.xp === users.ele.xp;

  const humors = {
    ela: isElaLeading
      ? "Você está liderando a constelação por " + difference + " XP! Brilhe alto! ✨"
      : isDraw
      ? "Empate perfeito! Conexão cósmica em equilíbrio total. 🤝"
      : "Yuri está com " + difference + " XP na sua frente. Vamos recuperar? 🔥",
    ele: isElaLeading
      ? "Ela tá te deixando pra trás por " + difference + " XP! Cadê a garra do guerreiro? 👀"
      : isDraw
      ? "Vocês dois estão empatados! Dividindo o fardo e as vitórias."
      : "Você ultrapassou ela por " + difference + " XP! Não deixa ela te alcançar! 😉",
  };

  const activeHumor = currentUserId === "karina-id" ? humors.ela : humors.ele;

  // Star purchase bundles
  const starBundles = [
    { count: 500, price: "R$ 4,90", tag: "Iniciante" },
    { count: 1200, price: "R$ 9,90", tag: "Mais Vendido 🔥" },
    { count: 2800, price: "R$ 19,90", tag: "Melhor Valor 💎" },
  ];

  // Terrain cosmetic designs
  const cosmeticsStore = [
    {
      id: "garden-spring",
      name: "Jardim Primavera Encantada 🌸",
      type: "garden" as const,
      cost: 500,
      description: "Flores de cerejeira brilhantes e gramado de camélia para a Karina.",
    },
    {
      id: "garden-winter",
      name: "Jardim Alpes de Inverno ❄️",
      type: "garden" as const,
      cost: 700,
      description: "Neve fina interativa e pinheiros alpinos decorativos.",
    },
    {
      id: "garage-neon",
      name: "Garagem Cyberpunk Neon 🕹️",
      type: "garage" as const,
      cost: 600,
      description: "Luzes de neon roxas, arcades retrô brilhantes e grafites.",
    },
  ];

  return (
    <div className="space-y-6" id="ranking_tab_container">
      
      {/* Humorous Scoreboard Cards */}
      <div className="bg-white p-6 rounded-3xl border border-[#F0EBFF] shadow-sm space-y-4" id="couples_leaderboard">
        <div className="text-center">
          <h3 className="font-serif font-bold text-2xl text-[#2D2060] flex items-center justify-center gap-1.5">
            <Award className="w-6 h-6 text-[#7C6AF7]" /> Ranking da Constelação
          </h3>
          <p className="text-xs text-gray-500 mt-1">Comparação de pontuação doméstica instantânea</p>
        </div>

        {/* Humorous alert comment */}
        <div className="p-3 bg-[#FAF7FF] rounded-2xl text-center border border-[#F0EBFF]">
          <p className="text-xs font-semibold text-[#7C6AF7]">{activeHumor}</p>
        </div>

        {/* Head-to-Head Cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          
          {/* Dela */}
          <div className={`p-4 rounded-2.5xl border flex flex-col items-center gap-2 text-center relative overflow-hidden ${
            isElaLeading ? "bg-pink-50/50 border-pink-200 shadow-sm" : "bg-white border-gray-100"
          }`}>
            {isElaLeading && (
              <span className="absolute top-2 right-2 text-lg" title="Líder Cósmico">👑</span>
            )}
            <div className="w-14 h-14 rounded-full bg-pink-100 border-2 border-pink-400 flex items-center justify-center text-3xl">
              🧚‍♀️
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#2D2060]">
                {users.ela.displayName}
              </h4>
              <span className="text-[9px] bg-pink-50 border border-pink-100 text-pink-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block mt-0.5">
                {users.ela.badge}
              </span>
            </div>
            <p className="text-3xl font-syne font-extrabold text-[#2D2060] mt-1">
              {users.ela.xp} <span className="text-xs font-sans text-gray-400">XP</span>
            </p>
          </div>

          {/* Ele */}
          <div className={`p-4 rounded-2.5xl border flex flex-col items-center gap-2 text-center relative overflow-hidden ${
            !isElaLeading && !isDraw ? "bg-purple-50/50 border-purple-200 shadow-sm" : "bg-white border-gray-100"
          }`}>
            {!isElaLeading && !isDraw && (
              <span className="absolute top-2 right-2 text-lg" title="Líder Cósmico">👑</span>
            )}
            <div className="w-14 h-14 rounded-full bg-purple-100 border-2 border-[#7C6AF7] flex items-center justify-center text-3xl">
              🕹️
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#2D2060]">
                {users.ele.displayName}
              </h4>
              <span className="text-[9px] bg-[#FAF7FF] border border-[#F0EBFF] text-[#7C6AF7] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block mt-0.5">
                {users.ele.badge}
              </span>
            </div>
            <p className="text-3xl font-syne font-extrabold text-[#2D2060] mt-1">
              {users.ele.xp} <span className="text-xs font-sans text-gray-400">XP</span>
            </p>
          </div>

        </div>
      </div>

      {/* RECENT CONTRIBUTION HISTORY (VISIBILITY FOR INVISIBLE EFFORT) */}
      <div className="bg-white p-6 rounded-3xl border border-[#F0EBFF] shadow-sm space-y-4" id="contribution_log_panel">
        <h3 className="font-serif font-bold text-xl text-[#2D2060] flex items-center gap-1.5 border-b border-[#FAF7FF] pb-2">
          <History className="w-5 h-5 text-pink-500" /> Histórico de Esforço Mutuo
        </h3>

        <div className="space-y-3.5 max-h-[180px] overflow-y-auto no-scrollbar pr-1">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex justify-between items-center text-xs pb-2 border-b border-[#FAF7FF] last:border-none">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: act.color }}
                />
                <p className="text-gray-700">
                  <b className="font-bold">{act.user}</b> {act.text}
                </p>
              </div>
              <span className="text-[9px] text-gray-400 italic shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ESTRELAS KARINA MARKETPLACE (Model Fortnite) */}
      <div className="bg-white p-6 rounded-3xl border border-[#F0EBFF] shadow-sm space-y-6" id="cosmetics_stars_store">
        
        {/* Marketplace Title Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#FAF7FF] pb-4">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#2D2060] flex items-center gap-1.5">
              <ShoppingBag className="w-6 h-6 text-[#7C6AF7]" /> Loja de Estrelas Karina
            </h3>
            <p className="text-xs text-gray-450">Desbloqueie upgrades cosméticos para customizar o terreno do casal.</p>
          </div>
          
          <div className="bg-slate-900 border border-slate-750 text-yellow-400 px-4.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-sm">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest font-mono">Suas Estrelas</p>
              <p className="font-syne font-black text-md leading-none">{stars} <span className="text-[10px] text-gray-300 font-sans font-medium">Estrelas</span></p>
            </div>
          </div>
        </div>

        {/* 1. Bundles options to acquire Stars */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-[#2D2060] uppercase tracking-wider">Passo 1: Recarregar Estrelas (V-bucks Model)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {starBundles.map((bundle) => (
              <div key={bundle.count} className="p-4 bg-yellow-50/40 border border-yellow-200/60 rounded-2xl text-center space-y-2 relative flex flex-col justify-between items-center">
                <span className="absolute top-2 right-2 text-[8px] bg-yellow-400/20 text-yellow-600 px-1.5 py-0.5 rounded font-bold uppercase">
                  {bundle.tag}
                </span>
                
                <div className="pt-2">
                  <span className="text-3xl block">⭐</span>
                  <p className="font-syne font-black text-lg text-[#2D2060]">{bundle.count} Estrelas</p>
                </div>

                <button
                  type="button"
                  onClick={() => buyStars(bundle.count)}
                  className="w-full bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold py-1.5 rounded-xl text-xs transition"
                >
                  Moeda {bundle.price}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Terrain upgrade store (Cosméticos) */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold text-[#2D2060] uppercase tracking-wider">Passo 2: Comprar Customizações Sazonais</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cosmeticsStore.map((item) => {
              const isUnlocked = unlockedCosmetics.includes(item.id);
              const isApplied = item.type === "garden" ? activeGardenStyle === item.id : activeGarageStyle === item.id;
              
              return (
                <div key={item.id} className="p-4 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-[#2D2060] text-sm">
                      {item.name}
                    </h5>
                    <p className="text-xs text-gray-500 font-mono">
                      Custo: <b className="text-[#7C6AF7]">{item.cost} Estrelas</b>
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight">
                      {item.description}
                    </p>
                  </div>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => setCosmeticStyle(item.type, isApplied ? (item.type === "garden" ? "garden-default" : "garage-default") : item.id)}
                      className={`w-full text-xs font-bold py-1.5 rounded-xl transition ${
                        isApplied
                          ? "bg-slate-800 text-white"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100/60"
                      }`}
                    >
                      {isApplied ? "Remover Estilo" : "Aplicar Decoração"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => unlockCosmetic(item.id, item.cost)}
                      className="w-full bg-[#2D2060] text-white hover:bg-[#2D2060]/90 text-xs font-bold py-1.5 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      <span>Desbloquear</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
