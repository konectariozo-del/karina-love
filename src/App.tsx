/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CoupleProvider, useCouple } from "./context/CoupleContext";
import HomeTab from "./components/HomeTab";
import RituaisTab from "./components/RituaisTab";
import RecompensasTab from "./components/RecompensasTab";
import RankingTab from "./components/RankingTab";
import { Sparkles, Heart, Compass, Gift, Award, CheckCircle, RefreshCw, Star } from "lucide-react";

type ActiveTab = "home" | "rituals" | "rewards" | "ranking";

function AuthenticatedApp() {
  const { state, toggleActor } = useCouple();
  const { currentUserId, usuarios, stars } = state;
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const skipOnboarding = localStorage.getItem("karinalove_onboarded_v2");
    if (skipOnboarding === "true") {
      setOnboarded(true);
    }
  }, []);

  const actor = currentUserId === "karina-id" ? usuarios.ela : usuarios.ele;
  const partner = currentUserId === "karina-id" ? usuarios.ele : usuarios.ela;

  const handleFinishOnboarding = (roleId: "karina-id" | "yuri-id") => {
    // If the chosen role doesn't match current state, toggle actor
    if (currentUserId !== roleId) {
      toggleActor();
    }
    setOnboarded(true);
    localStorage.setItem("karinalove_onboarded_v2", "true");
  };

  // If onboarding is not completed, show the beautiful brand story screen (PASSO 5)
  if (!onboarded) {
    return (
      <div className="min-h-screen bg-[#FAF7FF] flex flex-col justify-between p-6 font-sans antialiased max-w-md mx-auto" id="onboarding_screen">
        
        {/* Storytelling Header */}
        <div className="space-y-4 pt-10 text-center">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <span className="text-xl text-[#7C6AF7] animate-pulse">✦</span>
            <span className="font-serif font-black text-3xl tracking-tight text-[#2D2060]">
              Karina <span className="text-[#F76A8C]">Love</span>
            </span>
            <span className="text-xl text-[#F76A8C] animate-pulse">✦</span>
          </div>
          
          <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
            Sua Constelação Particular 🌌
          </p>
        </div>

        {/* Narrative */}
        <div className="bg-white p-6 rounded-[22px] border border-[#F0EBFF] shadow-sm space-y-4 text-center">
          <p className="text-xs text-[#2D2060] font-serif italic text-lg leading-relaxed">
            "Você sabia que Karina é uma constelação real que brilha no hemisfério sul? Este app foi criado em homenagem à esposa do criador e como ponto de encontro afetivo para o casal organizar a vida de forma divertida."
          </p>
          <div className="text-xs text-gray space-y-1.5 leading-relaxed">
            <p>💖 Pare de cobrar tarefas de forma chata.</p>
            <p>⚔️ Transforme a rotina doméstica em um jogo justo.</p>
            <p>🎁 Complete obrigações para resgatar mimos merecidos.</p>
          </div>
        </div>

        {/* Question Panel (PASSO 5) */}
        <div className="space-y-4 pb-8">
          <h3 className="font-serif font-bold text-center text-xl text-[#2D2060]">
            Quem está acessando o aplicativo neste dispositivo?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Choose Karina */}
            <button
              onClick={() => handleFinishOnboarding("karina-id")}
              className="p-5 rounded-[20px] bg-white border border-[#F9A8C9]/40 hover:border-[#F76A8C] text-center space-y-2 transition-all hover:scale-[1.02] shadow-xs active:scale-95 text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-2xl mx-auto shadow-xs">
                🧚‍♀️
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2D2060] text-base">Karina</h4>
                <p className="text-[10px] text-gray mt-0.5 font-medium">Ela / Organizadora do Jardim</p>
              </div>
            </button>

            {/* Choose Yuri */}
            <button
              onClick={() => handleFinishOnboarding("yuri-id")}
              className="p-5 rounded-[20px] bg-white border border-[#A78BFA]/40 hover:border-[#7C6AF7] text-center space-y-2 transition-all hover:scale-[1.02] shadow-xs active:scale-95 text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl mx-auto shadow-xs">
                🕹️
              </div>
              <div>
                <h4 className="font-serif font-bold text-[#2D2060] text-base">Yuri</h4>
                <p className="text-[10px] text-gray mt-0.5 font-medium">Ele / Guardião da Garagem prescrita</p>
              </div>
            </button>

          </div>

          <p className="text-center text-[9px] text-gray italic">
            Ambos os parceiros podem jogar confortavelmente alternando a simulação a qualquer momento.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7FF] flex flex-col items-center justify-start pb-28 font-sans antialiased">
      
      {/* 👤 TOP ACTOR DEVICE SIMULATOR CONTROL BAR */}
      <div className="w-full bg-[#1C1340] text-white py-3 px-4 shadow-md sticky top-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-xs text-indigo-150">
            Estás no <b className="text-[#F9A8C9]">Modo Simulador de Casal</b>. Alterne o ator para testar como se estivessem em 2 celulares!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-[11px] text-zinc-300">
            Logado como: <b className="text-[#FAF7FF] text-xs font-serif font-black">{actor.nome}</b> ({actor.papel === "ela" ? "Ela 🧚‍♀️" : "Ele 🕹️"})
          </p>
          <button
            onClick={toggleActor}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/85 text-white font-bold text-[10px] py-1 px-3 rounded-full flex items-center gap-1 transition-all border border-purple-light/20 shadow-xs cursor-pointer select-none"
            title="Simular cliques do parceiro"
          >
            <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
            Controlar {partner.nome}
          </button>
        </div>
      </div>

      {/* CORE FRAME CONTAINER */}
      <main className="w-full max-w-md mt-4 px-4 space-y-5">
        
        {/* LOGO & HERO CALLS */}
        <div className="text-center pt-2 space-y-1">
          <div className="flex justify-center items-center gap-1">
            <span className="text-xl text-[#7C6AF7]">✦</span>
            <h1 className="font-serif font-black text-3xl text-[#2D2060] tracking-tight flex items-center gap-1">
              Karina <span className="text-[#F76A8C]">Love</span>
            </h1>
            <span className="text-xl text-[#F76A8C]">✦</span>
          </div>
          <p className="text-[11px] text-gray italic">
            "Sintonia no lar e risadas em conjunto" — Yuri e Karina
          </p>
        </div>

        {/* ACTIVE MAIN VIEWS SCENE */}
        <div className="transition-all duration-300">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "rituals" && <RituaisTab />}
          {activeTab === "rewards" && <RecompensasTab />}
          {activeTab === "ranking" && <RankingTab />}
        </div>

      </main>

      {/* 🧭 FLOATING NAVIGATION TAB BAR (PASSO 4 — 🏠 Início, ❤️ Rituais, 🎁 Mimos, 🏆 Ranking) */}
      <nav className="fixed bottom-4 inset-x-4 max-w-sm mx-auto bg-white/95 backdrop-blur-md border border-[#F0EBFF] px-2 py-2 rounded-[22px] flex items-center justify-around shadow-lg z-30">
        
        {/* Tab 1: Início */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1.5 transition px-3 py-1.5 rounded-xl flex-1 cursor-pointer select-none ${
            activeTab === "home" ? "text-[#7C6AF7] font-semibold" : "text-gray hover:text-zinc-650"
          }`}
        >
          <Compass className={`w-4.5 h-4.5 ${activeTab === "home" ? "stroke-[2.5px]" : "stroke-1.5"}`} />
          <span className="text-[10px] leading-none font-bold">Início</span>
        </button>

        {/* Tab 2: Rituais */}
        <button
          onClick={() => setActiveTab("rituals")}
          className={`flex flex-col items-center gap-1.5 transition px-3 py-1.5 rounded-xl flex-1 cursor-pointer select-none ${
            activeTab === "rituals" ? "text-[#F76A8C] font-semibold" : "text-gray hover:text-zinc-650"
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${activeTab === "rituals" ? "stroke-[2.5px] fill-pink-50" : "stroke-1.5"}`} />
          <span className="text-[10px] leading-none font-bold">Rituais</span>
        </button>

        {/* Tab 3: Mimos */}
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center gap-1.5 transition px-3 py-1.5 rounded-xl flex-1 cursor-pointer select-none ${
            activeTab === "rewards" ? "text-[#7C6AF7] font-semibold" : "text-gray hover:text-zinc-650"
          }`}
        >
          <Gift className={`w-4.5 h-4.5 ${activeTab === "rewards" ? "stroke-[2.5px]" : "stroke-1.5"}`} />
          <span className="text-[10px] leading-none font-bold font-syne">Mimos</span>
        </button>

        {/* Tab 4: Ranking */}
        <button
          onClick={() => setActiveTab("ranking")}
          className={`flex flex-col items-center gap-1.5 transition px-3 py-1.5 rounded-xl flex-1 cursor-pointer select-none ${
            activeTab === "ranking" ? "text-[#7C6AF7] font-semibold" : "text-gray hover:text-zinc-650"
          }`}
        >
          <Award className={`w-4.5 h-4.5 ${activeTab === "ranking" ? "stroke-[2.5px]" : "stroke-1.5"}`} />
          <span className="text-[10px] leading-none font-bold">Ranking</span>
        </button>

      </nav>

    </div>
  );
}

export default function App() {
  return (
    <CoupleProvider>
      <AuthenticatedApp />
    </CoupleProvider>
  );
}
