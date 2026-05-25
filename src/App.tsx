/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CoupleProvider, useCouple } from "./context/CoupleContext";
import HomeTab from "./components/HomeTab";
import RituaisTab from "./components/RituaisTab";
import RecompensasTab from "./components/RecompensasTab";
import RankingTab from "./components/RankingTab";
import { Sparkles, Heart, Compass, Gift, Award, HelpCircle, RefreshCw } from "lucide-react";

type ActiveTab = "home" | "rituals" | "rewards" | "ranking";

function AuthenticatedApp() {
  const { state, toggleActor } = useCouple();
  const { currentUserId, users, stars } = state;
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  const actor = currentUserId === "karina-id" ? users.ela : users.ele;
  const partner = currentUserId === "karina-id" ? users.ele : users.ela;

  return (
    <div className="min-h-screen bg-[#FAF7FF] flex flex-col items-center justify-start pb-24 font-sans antialiased">
      
      {/* 👤 TOP PARTNER SIMULATOR CONTROL BAR */}
      <div className="w-full bg-[#1C1340] text-white py-3 px-4 shadow-md sticky top-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-xs text-indigo-200">
            Você está jogando no <b className="text-pink-300">Modo Simulador de Casal</b>. Alterne o ator para testar o fluxo em tempo real!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs text-indigo-150">
            Logado como: <b className="text-white text-sm font-bold font-serif">{actor.displayName}</b> ({actor.role === "ela" ? "Ela 💖" : "Ele ⚡"})
          </p>
          <button
            onClick={toggleActor}
            className="bg-purple-core hover:bg-purple-core/80 text-white font-bold text-xs py-1.5 px-3 rounded-full flex items-center gap-1 transition-all border border-purple-light/20 shadow-sm duration-150"
            title="Clique para alternar e simular o outro dispositivo"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simular {partner.displayName}
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER PLATFORM */}
      <main className="w-full max-w-lg mt-4 px-4 space-y-6">
        
        {/* LOGO & HERO HEADING BRAND */}
        <div className="text-center pt-2 space-y-1">
          <div className="flex justify-center items-center gap-1">
            <span className="text-2xl text-purple-core">✦</span>
            <h1 className="font-serif font-black text-4xl text-dark-text tracking-tight flex items-center gap-1">
              Karina <span className="text-pink-core">Love</span>
            </h1>
            <span className="text-2xl text-pink-core">✦</span>
          </div>
          <p className="text-xs text-gray-400 italic">
            "Pare de pedir. Comece a gamificar." — Yuri & Karina
          </p>
        </div>

        {/* ACTIVE TABS SCREEN ROUTER */}
        <div className="transition-all duration-300">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "rituals" && <RituaisTab />}
          {activeTab === "rewards" && <RecompensasTab />}
          {activeTab === "ranking" && <RankingTab />}
        </div>

      </main>

      {/* 🧭 BOTTOM FLOATING TAB NAVIGATION BAR */}
      <nav className="fixed bottom-4 inset-x-4 max-w-sm mx-auto bg-white/95 backdrop-blur-md border border-[#F0EBFF] px-3.5 py-3 rounded-3xl flex items-center justify-between shadow-lg z-30">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 transition p-2 rounded-2xl flex-1 ${
            activeTab === "home" ? "text-purple-core font-extrabold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === "home" ? "stroke-2" : "stroke-1"}`} />
          <span className="text-[10px] leading-none">Início</span>
        </button>

        {/* Tab 2: Rituais */}
        <button
          onClick={() => setActiveTab("rituals")}
          className={`flex flex-col items-center gap-1 transition p-2 rounded-2xl flex-1 ${
            activeTab === "rituals" ? "text-pink-core font-extrabold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === "rituals" ? "stroke-2 fill-pink-50" : "stroke-1"}`} />
          <span className="text-[10px] leading-none">Rituais</span>
        </button>

        {/* Tab 3: Recompensas */}
        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex flex-col items-center gap-1 transition p-2 rounded-2xl flex-1 ${
            activeTab === "rewards" ? "text-purple-core font-extrabold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Gift className={`w-5 h-5 ${activeTab === "rewards" ? "stroke-2" : "stroke-1"}`} />
          <span className="text-[10px] leading-none">Mimos</span>
        </button>

        {/* Tab 4: Ranking */}
        <button
          onClick={() => setActiveTab("ranking")}
          className={`flex flex-col items-center gap-1 transition p-2 rounded-2xl flex-1 ${
            activeTab === "ranking" ? "text-purple-core font-extrabold" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Award className={`w-5 h-5 ${activeTab === "ranking" ? "stroke-2" : "stroke-1"}`} />
          <span className="text-[10px] leading-none">Ranking</span>
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
