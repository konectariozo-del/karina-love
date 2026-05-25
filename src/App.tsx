/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CoupleProvider, useCouple } from "./context/CoupleContext";
import { 
  Sparkles, 
  Heart, 
  Compass, 
  Gift, 
  Award, 
  CheckCircle, 
  RefreshCw, 
  Star, 
  User, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  History, 
  Smartphone, 
  MessageSquare, 
  Layers, 
  Sparkle,
  Flame,
  Info
} from "lucide-react";

// Image Asset URLs matching generated pictures
const IMAGES = {
  karinaAvatar: "/src/assets/images/karina_avatar_1779751454290.png",
  yuriAvatar: "/src/assets/images/yuri_avatar_1779751470483.png",
  terrainComplete: "/src/assets/images/terrain_complete_1779751486295.png",
  jantarIfood: "/src/assets/images/jantar_ifood_1779751501967.png",
  barbecueCosmetic: "/src/assets/images/barbecue_cosmetic_1779751518694.png",
  posterConstelacao: "/src/assets/images/poster_constelacao_1779751532858.png"
};

// Available simulated high-fidelity screens from the user's picture
type MockScreenId =
  | "onboarding-dela"
  | "onboarding-dele"
  | "inicio-9"
  | "inicio-97"
  | "tarefas"
  | "rituais"
  | "desejos-dele"
  | "troca-proposta"
  | "perfil-yuri"
  | "perfil-karina"
  | "ranking-global"
  | "marketplace-cosmetico"
  | "terreno-sandbox"
  | "eternizar-poster";

interface ScreenDefinition {
  id: MockScreenId;
  name: string;
  category: "Onboarding" | "Início" | "Obrigações" | "Interações" | "Customização";
  emoji: string;
  description: string;
}

const SCREENS: ScreenDefinition[] = [
  { id: "onboarding-dela", name: "Onboarding Dela 🧚‍♀️", category: "Onboarding", emoji: "📋", description: "Inquérito reflexivo de reconhecimento da Karina." },
  { id: "onboarding-dele", name: "Onboarding Dele 🕹️", category: "Onboarding", emoji: "🎮", description: "Boas-vindas gamificadas de compromisso para Yuri." },
  { id: "inicio-9", name: "Início (Terreno 9%) 🏡", category: "Início", emoji: "🏔️", description: "Horta inicial, status do dia e streak de 7 dias." },
  { id: "inicio-97", name: "Início (Terreno 97%) 🌟", category: "Início", emoji: "🏰", description: "Terreno florescente evoluído e mascote Pipoca ativa." },
  { id: "tarefas", name: "Todas as Tarefas ✔️", category: "Obrigações", emoji: "🧹", description: "Lista semanal de tarefas com tags e bónus de XP." },
  { id: "rituais", name: "Rituais de Casal 💞", category: "Interações", emoji: "🕯️", description: "Compromissos especiais com status individual." },
  { id: "desejos-dele", name: "Desejos Dele (Mimos) 🍔", category: "Interações", emoji: "🎁", description: "Promessas românticas em progresso de XP." },
  { id: "troca-proposta", name: "Central de Trocas 🤝", category: "Interações", emoji: "🔄", description: "Negociações de responsabilidade de tarefas." },
  { id: "perfil-kat", name: "Perfil da Karina 👑" as any, category: "Customização" as any, emoji: "💅", description: "Avatar, badges de conquistas e badges da Karina." } as any,
  { id: "perfil-yuri", name: "Perfil do Yuri 🥩", category: "Customização", emoji: "🕶️", description: "Avatar, badges de conquistas e conquistas do Yuri." },
  { id: "ranking-global", name: "Ranking Global 🏆", category: "Obrigações", emoji: "🇧🇷", description: "Leaderboard competitivo de casais da comunidade." },
  { id: "marketplace-cosmetico", name: "Marketplace Cosmético 🛒", category: "Customização", emoji: "🛍️", description: "Loja de skins com itens especiais para o jardim." },
  { id: "terreno-sandbox", name: "Terreno Completo 🗺️", category: "Início", emoji: "🏡", description: "Maquete isométrica customizável 3D." },
  { id: "eternizar-poster", name: "Eternizar Poster 🌌", category: "Customização", emoji: "🌠", description: "Página de quadro físico da constelação." }
];

// Replaces original layout to output a physical interactive storyboard of screens
function AuthenticatedApp() {
  const { 
    state, 
    toggleActor, 
    completeTask, 
    addCustomTask, 
    proposeTrade, 
    respondToTrade,
    toggleRitualApproval,
    redeemReward,
    buyStars,
    unlockCosmetic,
    setCosmeticStyle,
    waterGarden,
    feedPet,
    petStatus,
    gardenHydration,
    recentActivity,
    resetDatabaseState,
    activeGardenStyle,
    activeGarageStyle
  } = useCouple();

  const { currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas, stars } = state;
  
  // States of simulator
  const [selectedScreen, setSelectedScreen] = useState<MockScreenId>("inicio-97");
  const [activeTaskDay, setActiveTaskDay] = useState<"Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sab" | "Dom">("Seg");
  const [customBadgeYuri, setCustomBadgeYuri] = useState("Rei da Churrasqueira 🥩");
  const [customBadgeKarina, setCustomBadgeKarina] = useState("Fada do Jardim Ativa 🌸");
  const [newChoreTitle, setNewChoreTitle] = useState("");
  const [newChoreXp, setNewChoreXp] = useState(30);
  const [onboardingElaAnswer, setOnboardingElaAnswer] = useState<string | null>(null);
  const [onboardingEleAnswer, setOnboardingEleAnswer] = useState<string | null>(null);
  const [contrapropostaId, setContrapropostaId] = useState<string | null>(null);
  const [contrapropostaText, setContrapropostaText] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todas");

  // Helper variables
  const isEla = currentUserId === "karina-id";
  const currentUser = isEla ? usuarios.ela : usuarios.ele;
  const partnerUser = isEla ? usuarios.ele : usuarios.ela;

  // Sync state for easier testing
  useEffect(() => {
    // When switching actors, switch corresponding profile viewer screen if applicable
    if (selectedScreen === "perfil-yuri" && currentUserId === "karina-id") {
      setSelectedScreen("perfil-karina" as any);
    } else if (selectedScreen === "perfil-karina" as any && currentUserId === "yuri-id") {
      setSelectedScreen("perfil-yuri");
    }
  }, [currentUserId]);

  // Quick action completing task
  const handleQuickLog = () => {
    const incomplete = tarefas.find(t => !t.concluida && t.responsavel === currentUserId);
    if (incomplete) {
      completeTask(incomplete.id);
    } else {
      // Award default XP
      completeTask(tarefas[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2060] font-sans selection:bg-[#F9A8C9]/20 flex flex-col relative" id="storyboard_viewer_page">
      
      {/* 🌟 LUXURIOUS CELESTIAL HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#F0EBFF] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C6AF7] to-[#F76A8C] p-[2px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-extrabold text-[#7C6AF7]">
              K
            </div>
          </div>
          <div>
            <h1 className="font-serif font-black text-2xl tracking-tight text-[#2D2060] flex items-center gap-1">
              Karina <span className="text-[#F76A8C]">Love</span>
              <span className="text-xs bg-[#FAF7FF] border border-[#F0EBFF] font-sans font-bold text-[#7C6AF7] px-2 py-0.5 rounded-full ml-2">
                Simulador de Alta Fidelidade ✨
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Conectado ao bando de dados do casal e em total sintonia visual com os seus rascunhos.
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#FAF7FF] border border-[#F0EBFF] px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-sm">⭐️</span>
            <span className="text-xs font-mono font-bold text-[#7C6AF7]">{stars} Estrelas</span>
          </div>

          <button
            onClick={toggleActor}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/90 text-white rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-98 select-none"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin duration-1000" />
            Simular: {isEla ? "Yuri (Ele) 🕹️" : "Karina (Ela) 🧚‍♀️"}
          </button>

          <button
            onClick={resetDatabaseState}
            className="border border-[#F0EBFF] hover:bg-[#FAF7FF] px-3 py-2 rounded-xl text-xs font-medium transition"
            title="Restaurar banco original"
          >
            Reset
          </button>
        </div>
      </header>

      {/* 🚀 MAIN STORYBOARD WORKSPACE GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: STORYBOARD INDEX (3-span) */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-5 border border-[#F0EBFF] shadow-xs space-y-4">
            <div className="space-y-1">
              <h3 className="font-serif font-extrabold text-lg text-[#2D2060] flex items-center gap-1">
                <Layers className="w-4 h-4 text-[#7C6AF7]" /> Navegador de Telas
              </h3>
              <p className="text-[11px] text-[#2D2060]/70">
                Selecione as telas desenhadas abaixo para renderizar instantaneamente no telefone interativo de centro!
              </p>
            </div>

            {/* Screens categories list */}
            <div className="space-y-3.5">
              {(["Onboarding", "Início", "Obrigações", "Interações", "Customização"] as const).map((cat) => {
                const catGroup = SCREENS.filter(
                  (s) => s.category === cat || (cat === "Customização" && s.id === ("perfil-karina" as any)) || (cat === "Customização" && s.id === "perfil-yuri") || (cat === "Customização" && s.id === "perfil-kat" as any)
                );
                
                // Keep unique filtered list
                const filteredGroup = catGroup.filter((s, idx, self) => self.findIndex(t => t.id === s.id) === idx);

                return (
                  <div key={cat} className="space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-400 font-mono block">
                      {cat}
                    </span>
                    <div className="space-y-1">
                      {filteredGroup.map((scr) => {
                        // Support legacy key
                        const actualId: MockScreenId = scr.id as any === "perfil-kat" ? "perfil-karina" as any : scr.id;
                        const isCurrent = selectedScreen === actualId;

                        return (
                          <button
                            key={scr.id}
                            onClick={() => setSelectedScreen(actualId)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition active:scale-99 ${
                              isCurrent
                                ? "bg-[#7C6AF7] border-[#7C6AF7] text-white shadow-sm font-semibold"
                                : "bg-[#FAF7FF]/50 border-[#F0EBFF] text-[#2D2060] hover:border-[#7C6AF7]/30 hover:bg-[#FAF7FF]"
                            }`}
                          >
                            <span className="text-base shrink-0">{scr.emoji}</span>
                            <div className="truncate">
                              <p className={`font-medium ${isCurrent ? "text-white" : "text-[#2D2060]"}`}>{scr.name}</p>
                              <p className={`text-[9px] truncate ${isCurrent ? "text-white/85" : "text-zinc-400 font-normal"}`}>
                                {scr.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* CENTER COLUMN: THE VIRTUAL SMARTPHONE CONTAINER (5-span) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start py-2 order-1 lg:order-2">
          
          {/* Beautiful 3D iPhone frame */}
          <div className="w-[380px] h-[780px] rounded-[52px] bg-[#161226] border-[12px] border-[#2A2345] shadow-[0_24px_50px_rgba(28,19,64,0.3)] relative overflow-hidden flex flex-col">
            
            {/* Top camera Notch/punch bar */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-50">
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-around px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-805" />
                <span className="w-10 h-1 bg-zinc-900 rounded-full" />
                <span className="w-2 h-2 rounded-full bg-indigo-900" />
              </div>
            </div>

            {/* Virtual Status Indicators */}
            <div className="h-10 bg-white px-6 pt-3 flex items-center justify-between text-xs font-semibold text-black shrink-0 relative z-40 select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">📶</span>
                <span className="text-[10px]">📶</span>
                <span className="text-[10px]">🔋 84%</span>
              </div>
            </div>

            {/* VIRTUAL SCREEN BODY CONTAINER */}
            <div className="flex-1 bg-[#FCFAF7] overflow-y-auto no-scrollbar relative flex flex-col" id="simulator_viewport">
              
              {/* 1. DELA ONBOARDING SCREEN */}
              {selectedScreen === "onboarding-dela" && (
                <div className="flex-1 p-6 flex flex-col justify-between animate-fade-in text-center h-full">
                  <div className="space-y-6 pt-8">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <span className="text-xl text-[#7C6AF7]">✦</span>
                      <span className="font-serif font-black text-2xl tracking-tight text-[#2D2060]">
                        Karina <span className="text-[#F76A8C]">Love</span>
                      </span>
                      <span className="text-xl text-[#F76A8C]">✦</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                      Dela Onboarding
                    </p>
                  </div>

                  <div className="space-y-4 py-8">
                    <h3 className="font-serif font-black text-2xl text-[#2D2060] leading-snug">
                      Você sente que faz mais do que é reconhecida?
                    </h3>
                    <p className="text-xs text-[#2D2060]/70 max-w-sm mx-auto leading-relaxed">
                      Sinceridade gera flores. Sua resposta ajuda Yuri a ver suas contribuições com clareza amorosa. 🌸
                    </p>
                  </div>

                  <div className="space-y-3 pb-6">
                    <button
                      onClick={() => setOnboardingElaAnswer("sim")}
                      className={`w-full py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
                        onboardingElaAnswer === "sim"
                          ? "bg-[#7C6AF7] text-white"
                          : "bg-[#7C6AF7]/10 hover:bg-[#7C6AF7]/15 text-[#7C6AF7]"
                      }`}
                    >
                      Sim 💜
                    </button>
                    <button
                      onClick={() => setOnboardingElaAnswer("nao")}
                      className={`w-full py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
                        onboardingElaAnswer === "nao"
                          ? "bg-[#F76A8C] text-white"
                          : "bg-[#F76A8C]/10 hover:bg-[#F76A8C]/15 text-[#F76A8C]"
                      }`}
                    >
                      Não ⭐️
                    </button>

                    {onboardingElaAnswer && (
                      <div className="p-3 bg-white border border-[#F0EBFF] rounded-xl text-[10px] text-zinc-500 italic mt-3 animate-pulse">
                        {onboardingElaAnswer === "sim"
                          ? "Sua sinceridade foi gravada. Yuri receberá notificações suaves de gratidão cósmica."
                          : "Que harmonia incrível! Continuem cuidando desse amor em conjunto."}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. ONBOARDING ELE SCREEN */}
              {selectedScreen === "onboarding-dele" && (
                <div className="flex-1 p-6 flex flex-col justify-between animate-fade-in text-center h-full">
                  <div className="space-y-6 pt-8">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <span className="text-xl text-[#7C6AF7]">✦</span>
                      <span className="font-serif font-black text-2xl tracking-tight text-[#2D2060]">
                        Karina <span className="text-[#F76A8C]">Love</span>
                      </span>
                      <span className="text-xl text-[#F76A8C]">✦</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
                      Dele Onboarding
                    </p>
                  </div>

                  <div className="space-y-4 py-8">
                    <h3 className="font-serif font-black text-2xl text-[#2D2060] leading-snug">
                      Yuri, você aceita o desafio de apoiar sua constelação?
                    </h3>
                    <p className="text-xs text-[#2D2060]/70 max-w-sm mx-auto leading-relaxed">
                      Sua dedicação alimenta o streak diário e abre os desejos guardados no cofre para regar o coração de Karina. 🥩
                    </p>
                  </div>

                  <div className="space-y-3 pb-6">
                    <button
                      onClick={() => setOnboardingEleAnswer("bora")}
                      className={`w-full py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
                        onboardingEleAnswer === "bora"
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-[#2D2060]"
                      }`}
                    >
                      Com certeza! 🥩🎮
                    </button>
                    <button
                      onClick={() => setOnboardingEleAnswer("claro")}
                      className={`w-full py-4 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${
                        onboardingEleAnswer === "claro"
                          ? "bg-[#7C6AF7] text-white"
                          : "bg-[#7C6AF7]/10 text-[#7C6AF7]"
                      }`}
                    >
                      Bora, vamos vencer juntos! 🏆
                    </button>

                    {onboardingEleAnswer && (
                      <div className="p-3 bg-white border border-[#F0EBFF] rounded-xl text-[10px] text-[#7C6AF7] font-semibold mt-3 animate-pulse">
                        Início ativado! Estrela de Yuri sintonizada ao jardim da fada. 🌸
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. INÍCIO (TERRENO 9% - LOW LEVEL) */}
              {selectedScreen === "inicio-9" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Header flame streak */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-rose-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl animate-pulse">🔥</span>
                        <div>
                          <p className="text-xs font-bold text-[#F76A8C]">7 dias juntos</p>
                          <p className="text-[10px] text-zinc-400">Streak conjunto</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-50 text-[#F76A8C] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Shared streak
                      </span>
                    </div>

                    {/* Ground Terrain Canvas 9% */}
                    <div className="bg-gradient-to-b from-[#E0F2FE]/40 to-[#FCFAF7] p-4 rounded-2xl border border-[#F0EBFF] space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded font-mono text-[9px]">
                        🍃 Terrain level: <b className="text-emerald-500">9%</b>
                      </div>

                      <div className="h-28 flex items-center justify-center relative bg-[#FAF7FF]/50 border border-[#F0EBFF] rounded-xl border-dashed">
                        {/* Minimal sprouts representing small progress */}
                        <div className="text-center space-y-1">
                          <span className="text-3xl animate-bounce block">🌱</span>
                          <span className="text-[10px] text-zinc-400">Terra fertilizada inicial</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-zinc-500">
                          <span>Nível Terreno: 1</span>
                          <span>9% completo</span>
                        </div>
                        <div className="w-full bg-[#F0EBFF] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#7C6AF7] h-1.5 rounded-full" style={{ width: "9%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Log button mockup layout inside */}
                    <div className="bg-white p-4 rounded-2xl border border-[#F0EBFF] flex justify-between items-center">
                      <div>
                        <h4 className="font-serif font-black text-sm text-[#2D2060]">Quick Log</h4>
                        <p className="text-[9px] text-zinc-400">Registre janta/cama e ganhe bônus</p>
                      </div>
                      <button
                        onClick={handleQuickLog}
                        className="bg-[#2D2060] text-white hover:bg-[#2D2060]/95 font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs"
                      >
                        +30 XP ⚡
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-zinc-450 italic mt-4">
                    Complete tarefas na aba Tarefas para evoluir as margens verdes!
                  </p>
                </div>
              )}

              {/* 4. INÍCIO (TERRENO 97% - EVOLVED LEVEL) */}
              {selectedScreen === "inicio-97" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-3.5">
                    {/* Flame head */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-rose-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <div>
                          <p className="font-serif font-black text-xs text-[#2D2060]">7 dias juntos</p>
                          <p className="text-[10px] text-zinc-400">Shared streak</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-[#FAF7FF] text-[#7C6AF7] font-bold px-2.5 py-0.5 rounded-full border border-[#F0EBFF]">
                        Nível {casal.nivelTerreno}
                      </span>
                    </div>

                    {/* Evolved Isometric house terrain view */}
                    <div className="bg-gradient-to-b from-[#F0FDF4]/50 to-[#FCFAF7] p-4 rounded-2xl border border-[#F0EBFF] space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/80 px-2.5 py-0.5 rounded-full font-mono text-[9px] border border-[#F0EBFF]">
                        🏰 Terrain level: <b className="text-emerald-500">97%</b>
                      </div>

                      {/* Evolved generated image terrain output */}
                      <div className="h-40 bg-white border border-[#F1EBFB] rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                        <img
                          src={IMAGES.terrainComplete}
                          alt="Terrain complete view"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-[#0A0718]/40 backdrop-blur-xs py-1.5 text-center text-[10px] text-white">
                          Clique em Marketplace para customizar seu visual! 🗺️
                        </div>
                      </div>

                      {/* Dynamic indicators */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-[#2D2060]">
                          <span className="font-semibold">Nível Terreno: 2 (Dedicado)</span>
                          <span>97% completo</span>
                        </div>
                        <div className="w-full bg-[#FAF7FF] border border-[#F0EBFF] h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-400 to-[#7C6AF7] h-2 rounded-full" style={{ width: "97%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Log widget */}
                    <div className="bg-white p-3.5 rounded-2xl border border-[#F0EBFF] flex justify-between items-center">
                      <div>
                        <h4 className="font-serif font-black text-sm text-[#2D2060]">Quick Log</h4>
                        <p className="text-[9px] text-[#2D2060]/70">Streaks and small logs</p>
                      </div>
                      <button
                        onClick={handleQuickLog}
                        className="bg-[#7C6AF7] text-white font-bold text-xs py-2 px-3 rounded-lg shadow-sm"
                      >
                        +30 XP ⚡
                      </button>
                    </div>

                    {/* Watering and feeding widgets */}
                    <div className="bg-white p-3 rounded-2xl border border-[#F0EBFF] flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🐱</span>
                        <div>
                          <p className="text-[11px] font-bold">Mascote Pipoca</p>
                          <p className="text-[9px] text-zinc-400">Humor: <span className="text-emerald-500 font-semibold">{petStatus}</span></p>
                        </div>
                      </div>
                      <button 
                        onClick={feedPet}
                        className="text-[10px] bg-[#FAF7FF] border border-[#F0EBFF] px-2.5 py-1 rounded-lg font-bold"
                      >
                        Alimentar
                      </button>
                    </div>
                  </div>

                  <p className="text-center text-[10px] text-[#7C6AF7] font-semibold italic">
                    Sua constelação doméstica expandindo! ✨
                  </p>
                </div>
              )}

              {/* 5. TAREFAS DE HOJE */}
              {selectedScreen === "tarefas" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header title */}
                    <div className="flex justify-between items-center pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Tarefas</h3>
                      <button 
                        onClick={() => setSelectedCategoryFilter(prev => prev === "Todas" ? "Casa" : "Todas")}
                        className="text-[10px] bg-[#FAF7FF] border border-[#F0EBFF] px-2.5 py-1 rounded-lg text-[#7C6AF7] font-bold"
                      >
                        Filtro: {selectedCategoryFilter}
                      </button>
                    </div>

                    {/* Filter categories */}
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
                      {(["Todas", "Casa", "Compras", "Financeiro"] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-full font-bold border ${
                            selectedCategoryFilter === cat
                              ? "bg-[#7C6AF7] text-white border-[#7C6AF7]"
                              : "bg-white text-zinc-400 border-[#F0EBFF]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar">
                      {tarefas
                        .filter(t => selectedCategoryFilter === "Todas" || t.tag === selectedCategoryFilter)
                        .map((t) => {
                          const isMine = t.responsavel === currentUserId;
                          return (
                            <div
                              key={t.id}
                              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                                t.concluida
                                  ? "bg-slate-50 border-zinc-150 opacity-60"
                                  : "bg-white border-[#F0EBFF]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => completeTask(t.id)}
                                  disabled={t.concluida || !isMine}
                                  className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                                    t.concluida
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : isMine
                                      ? "border-[#7C6AF7] hover:bg-[#7C6AF7]/10"
                                      : "border-gray-200 bg-gray-50"
                                  }`}
                                >
                                  {t.concluida && <span className="text-[10px]">✓</span>}
                                </button>
                                <div>
                                  <p className={`text-xs font-bold ${t.concluida ? "line-through text-zinc-400" : "text-[#2D2060]"}`}>
                                    {t.titulo}
                                  </p>
                                  <span className="text-[9px] text-[#7C6AF7] bg-indigo-50/50 border border-indigo-100/30 px-1.5 py-0.5 rounded mt-1 inline-block">
                                    {t.tag} ({t.dia})
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] bg-yellow-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md font-mono font-bold">
                                +{t.xp} XP
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Built-in quick adder inside mock */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newChoreTitle.trim()) return;
                      addCustomTask(newChoreTitle, "Casa", currentUserId, "Seg", newChoreXp);
                      setNewChoreTitle("");
                    }}
                    className="p-3 bg-white border border-[#F0EBFF] rounded-2xl space-y-2 mt-2"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Rápido: Agendar Obrigação</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: Botar o lixo do banheiro fora..."
                        required
                        value={newChoreTitle}
                        onChange={(e) => setNewChoreTitle(e.target.value)}
                        className="flex-1 bg-[#FAF7FF] border border-[#F0EBFF] rounded-lg px-2 text-xs py-1.5"
                      />
                      <button type="submit" className="bg-[#7C6AF7] text-white px-2 rounded-lg text-xs font-bold">
                        +
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 6. RITUAIS DE INTIMIDADE */}
              {selectedScreen === "rituais" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Rituais</h3>
                      <p className="text-[10px] text-zinc-455">Compromissos recíprocos de chamego semanal.</p>
                    </div>

                    <div className="space-y-3 max-h-[440px] overflow-y-auto no-scrollbar">
                      {rituais.map((r) => {
                        const approvedEla = r.confirmacaoEla;
                        const approvedEle = r.confirmacaoEle;
                        const completeDual = approvedEla && approvedEle;

                        return (
                          <div
                            key={r.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              completeDual
                                ? "bg-emerald-50/40 border-emerald-150 shadow-xs"
                                : "bg-white border-[#F0EBFF]"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-serif font-black text-base text-[#2D2060]">
                                  {r.titulo}
                                </h4>
                                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{r.descricao}</p>
                              </div>
                              <span className="text-[9px] shrink-0 font-bold bg-[#FAF7FF] text-[#F76A8C] border border-[#F1EBFB] px-2 py-0.5 rounded">
                                +{r.xpBonus} XP duplo
                              </span>
                            </div>

                            {/* Dual slots design */}
                            <div className="flex items-center justify-between border-t border-dashed border-[#F0EBFF] pt-2 mt-2">
                              {/* Avatar left slot (Yuri) */}
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={IMAGES.yuriAvatar}
                                  alt="Yuri"
                                  referrerPolicy="no-referrer"
                                  className={`w-6 h-6 rounded-full border ${approvedEle ? "border-emerald-500 bg-emerald-50" : "border-zinc-200"}`}
                                />
                                <span className="text-[9px] text-[#2D2060]">
                                  Yuri: <b className={approvedEle ? "text-emerald-500" : "text-zinc-400"}>{approvedEle ? "Completo" : "Pendente"}</b>
                                </span>
                              </div>

                              {/* Avatar right slot (Karina) */}
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={IMAGES.karinaAvatar}
                                  alt="Karina"
                                  referrerPolicy="no-referrer"
                                  className={`w-6 h-6 rounded-full border ${approvedEla ? "border-emerald-500 bg-emerald-50" : "border-zinc-200"}`}
                                />
                                <span className="text-[9px] text-[#2D2060]">
                                  Karina: <b className={approvedEla ? "text-emerald-500" : "text-zinc-400"}>{approvedEla ? "Completo" : "Pendente"}</b>
                                </span>
                              </div>
                            </div>

                            {/* Self check actions within mock screen */}
                            <button
                              onClick={() => toggleRitualApproval(r.id)}
                              className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                                (isEla ? approvedEla : approvedEle)
                                  ? "bg-slate-850 bg-slate-900 text-white"
                                  : "bg-[#7C6AF7]/10 text-[#7C6AF7] hover:bg-[#7C6AF7]/15"
                              }`}
                            >
                              <Heart className="w-3.5 h-3.5 fill-current" />
                              {(isEla ? approvedEla : approvedEle) ? "Validado por mim!" : "Eu fiz de mim de bom grado!"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-center text-[9px] text-zinc-400">
                    O bônus de XP de intimidade é creditado se ambos validarem simultaneamente. 💞
                  </p>
                </div>
              )}

              {/* 7. DESEJOS DELE (MIMOS) */}
              {selectedScreen === "desejos-dele" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Desejos Dele</h3>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Personalized</p>
                    </div>

                    {/* Gourmet Cheeseburger illustration slider card */}
                    <div className="bg-white rounded-3xl border border-[#F0EBFF] p-4 space-y-3 shadow-xs">
                      <div className="h-44 bg-slate-900 rounded-2xl overflow-hidden relative border border-[#F0EBFF] shadow-inner">
                        <img
                          src={IMAGES.jantarIfood}
                          alt=" Burger Mimo"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute top-2 right-2 bg-black/40 text-white px-2.5 py-0.5 rounded text-[9px] font-mono">
                          Pode sacar! ✓
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-black text-lg text-[#2D2060]">Jantar iFood 🍔</h4>
                            <p className="text-[10px] text-zinc-400">Personalized rewarders de personalizada ponel.</p>
                          </div>
                          <span className="text-xs bg-rose-50 text-[#F76A8C] border border-rose-150 px-2 py-0.5 rounded font-mono font-bold font-syne">
                            120 XP
                          </span>
                        </div>

                        {/* Slide bullets representing standard layout paging dots */}
                        <div className="flex justify-center gap-1.5 py-1">
                          <span className="w-2.5 h-1 text-[#7C6AF7] rounded-full bg-[#7C6AF7]" />
                          <span className="w-1.5 h-1 rounded-full bg-[#F0EBFF]" />
                          <span className="w-1.5 h-1 rounded-full bg-[#F0EBFF]" />
                        </div>

                        {/* Slider Progress Indicator */}
                        <div className="space-y-1">
                          <div className="w-full bg-[#F0EBFF] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#7C6AF7] h-1.5 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                          <div className="flex justify-between text-[8px] font-mono text-zinc-400">
                            <span>Sua Carteira XP: {usuarios.ele.xpIndividual} / 120 XP</span>
                            <span>Sintonia: 15%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (usuarios.ele.xpIndividual >= 120) {
                              redeemReward("reward-2");
                              alert("Parabéns! Pedi a pizza/burger do Yuri. Promessa em circulação!");
                            } else {
                              alert("Yuri ainda não completou os 120 XP individuais em obrigações do lar!");
                            }
                          }}
                          className="w-full py-2.5 bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white rounded-xl text-xs font-bold transition mt-2 cursor-pointer select-none"
                        >
                          Sacar Mimo Afetivo (120 XP)
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[9px] text-[#7C6AF7]">
                     Crie mimos adicionais para dotalos de valor!
                  </p>
                </div>
              )}

              {/* 8. CENTRAL DE TROCAS */}
              {selectedScreen === "troca-proposta" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Acordo de Cavalheiros</h3>
                      <p className="text-[10px] text-[#7C6AF7]">Negocie tarefas em aberto por carinhos e jantares.</p>
                    </div>

                    {/* Speech bubble visual style like violet mock panels */}
                    <div className="bg-[#7C6AF7] text-white rounded-[26px] p-4 space-y-3.5 relative overflow-hidden shadow-md">
                      <div className="absolute top-0 right-0 p-4 opacity-5 font-serif text-6xl">🤝</div>
                      
                      <div className="flex items-center gap-2.5">
                        <img
                          src={IMAGES.yuriAvatar}
                          alt="Yuri avatar"
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full bg-indigo-50 border border-white/20"
                        />
                        <div>
                          <p className="text-xs font-bold font-syne uppercase tracking-wide">Proposta de Yuri</p>
                          <p className="text-[9px] text-indigo-150">Gamer Estrategista</p>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-2xl p-3 text-xs leading-relaxed font-serif italic text-cream">
                        "Yuri se oferece para assumir a missão de Karina 'Regar camélias do jardim' se ela concordar em fazer: 'Doutrina de massagem corporal de 30min amanhã de noite!'"
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={() => {
                            respondToTrade("exchange-1", "aceita");
                            alert("Troca aceita! Yuri é o novo responsável por regar camélias!");
                          }}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold shadow-sm"
                        >
                          Aceitar 🔥
                        </button>
                        <button
                          onClick={() => setContrapropostaId("exchange-1")}
                          className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold"
                        >
                          Contraproposta
                        </button>
                      </div>
                    </div>

                    {contrapropostaId && (
                      <div className="p-3 bg-white border border-[#F0EBFF] rounded-2xl space-y-2 animate-fade-in">
                        <p className="text-[9px] font-bold text-[#7C6AF7] uppercase">Escrever Contraproposta</p>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Aceito, mas em troca quero lavar a louça na quarta..."
                          value={contrapropostaText}
                          onChange={(e) => setContrapropostaText(e.target.value)}
                          className="w-full border border-gray-200 text-xs py-1.5 px-2 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              respondToTrade(contrapropostaId, "contraproposta", contrapropostaText);
                              setContrapropostaId(null);
                              setContrapropostaText("");
                              alert("Contraproposta registrada!");
                            }}
                            className="bg-[#7C6AF7] text-white text-[10px] font-bold py-1 px-3 rounded-lg"
                          >
                            Enviar
                          </button>
                          <button
                            onClick={() => setContrapropostaId(null)}
                            className="text-zinc-400 text-[10px]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Pending agreements status list */}
                    <div className="space-y-2">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-zinc-400 font-mono">Propostas Ativas</p>
                      {trocas.length === 0 ? (
                        <p className="text-[10px] text-zinc-400 text-center py-2 italic">Nenhuma troca pendente.</p>
                      ) : (
                        trocas.map(tr => (
                          <div key={tr.id} className="p-2.5 bg-white border border-[#F0EBFF] rounded-xl flex justify-between items-center text-[10px]">
                            <span>De: <b>{tr.proponenteId === "karina-id" ? "Karina" : "Yuri"}</b></span>
                            <span className="text-[#7C6AF7] font-semibold">Custo: Carinho</span>
                            <span className="bg-yellow-50 text-amber-605 px-1.5 font-bold rounded uppercase text-[8px]">
                              {tr.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <p className="text-center text-[9px] text-[#2D2060]/70">
                    Sintonia cooperativa de tarefas. 🤝
                  </p>
                </div>
              )}

              {/* 9. PERFIL DE YURI */}
              {selectedScreen === "perfil-yuri" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4 text-center">
                    <div className="pb-2 text-left border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Perfil</h3>
                    </div>

                    {/* Cartoon avatar matching screen */}
                    <div className="space-y-2.5 py-4">
                      <div className="w-24 h-24 rounded-full bg-purple-50 border-2 border-[#7C6AF7]/30 mx-auto overflow-hidden shadow-md flex items-center justify-center relative">
                        <img
                          src={IMAGES.yuriAvatar}
                          alt="Yuri avatar picture"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-serif font-black text-2xl text-[#2D2060]">Yuri</h4>
                        <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Ele / Guardião da Garagem</p>
                      </div>
                    </div>

                    {/* Custom badges */}
                    <div className="bg-white p-4 rounded-3xl border border-[#F0EBFF] text-left space-y-3">
                      <h5 className="font-serif font-black text-sm text-[#2D2060]">Selo e Conquistas</h5>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-gradient-to-r from-purple-50 to-[#FAF7FF] border border-purple-100 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-[#7C6AF7] font-bold">Badge Principal:</span>
                          <span className="text-xs font-mono font-bold text-slate-800">{customBadgeYuri}</span>
                        </div>

                        {/* Interactive badge chooser */}
                        <p className="text-[8px] font-bold text-zinc-400 uppercase">Selecione badge:</p>
                        <div className="flex gap-1 flex-wrap text-[9px]">
                          {["Rei da Churrasqueira 🥩", "Caçador de Contas 💰", "Gamer Pro 🎮"].map(b => (
                            <button
                              key={b}
                              onClick={() => setCustomBadgeYuri(b)}
                              className={`px-2 py-1 rounded-full border ${
                                customBadgeYuri === b
                                  ? "bg-[#7C6AF7]/20 border-[#7C6AF7] text-[#7C6AF7] font-bold"
                                  : "bg-white border-[#F0EBFF] text-zinc-400"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-55 bg-[#FAF7FF] p-3 rounded-2xl flex justify-between items-center border border-[#F0EBFF] text-xs font-mono">
                    <span>XP Acumulado Yuri:</span>
                    <b className="text-xl text-[#7C6AF7] font-black">{usuarios.ele.xpIndividual}</b>
                  </div>
                </div>
              )}

              {/* 10. PERFIL DA KARINA */}
              {selectedScreen === "perfil-karina" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4 text-center">
                    <div className="pb-2 text-left border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Perfil</h3>
                    </div>

                    {/* Cartoon avatar matching screen */}
                    <div className="space-y-2.5 py-4">
                      <div className="w-24 h-24 rounded-full bg-pink-50 border-2 border-[#F76A8C]/30 mx-auto overflow-hidden shadow-md flex items-center justify-center relative">
                        <img
                          src={IMAGES.karinaAvatar}
                          alt="Karina avatar picture"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-serif font-black text-2xl text-[#2D2060]">Karina</h4>
                        <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">Ela / Fada do Jardim</p>
                      </div>
                    </div>

                    {/* Custom badges */}
                    <div className="bg-white p-4 rounded-3xl border border-[#F0EBFF] text-left space-y-3">
                      <h5 className="font-serif font-black text-sm text-[#2D2060]">Selo e Conquistas</h5>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-gradient-to-r from-pink-50 to-[#FAF7FF] border border-pink-100 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-[#F76A8C] font-bold">Badge Principal:</span>
                          <span className="text-xs font-mono font-bold text-slate-800">{customBadgeKarina}</span>
                        </div>

                        {/* Interactive badge selector */}
                        <p className="text-[8px] font-bold text-zinc-400 uppercase">Selecione badge:</p>
                        <div className="flex gap-1 flex-wrap text-[9px]">
                          {["Fada do Jardim Ativa 🌸", "Estrela Radiante ✨", "Rainha Suprema 👑"].map(b => (
                            <button
                              key={b}
                              onClick={() => setCustomBadgeKarina(b)}
                              className={`px-2 py-1 rounded-full border ${
                                customBadgeKarina === b
                                  ? "bg-[#F76A8C]/20 border-[#F76A8C] text-[#F76A8C] font-bold"
                                  : "bg-white border-[#F0EBFF] text-zinc-400"
                              }`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-55 bg-[#FAF7FF] p-3 rounded-2xl flex justify-between items-center border border-[#F0EBFF] text-xs font-mono">
                    <span>XP Acumulado Karina:</span>
                    <b className="text-xl text-[#F76A8C] font-black">{usuarios.ela.xpIndividual}</b>
                  </div>
                </div>
              )}

              {/* 11. RANKING GLOBAL */}
              {selectedScreen === "ranking-global" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Ranking Global</h3>
                      <p className="text-[10px] text-zinc-400">Casais em maior sintonia cooperativa de tarefas. 🇧🇷</p>
                    </div>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto no-scrollbar">
                      {[
                        { rank: "#1", name: "Casal Estrela ⭐", xp: "14.200 XP", isMe: false, tag: "Bucolis" },
                        { rank: "#2", name: "Yuri e Karina 💑", xp: `${casal.xpCasal + 2500} XP`, isMe: true, tag: "Brazilfin" },
                        { rank: "#3", name: "Yuri e Karina", xp: "2.180 XP", isMe: false, tag: "Ditia" },
                        { rank: "#4", name: "Yuri e Karina", xp: "1.920 XP", isMe: false, tag: "Brazilion" },
                        { rank: "#5", name: "Yuri e Bia", xp: "1.250 XP", isMe: false, tag: "Eruxnata" },
                        { rank: "#6", name: "Yuri e Em", xp: "980 XP", isMe: false, tag: "Floria" }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border flex justify-between items-center transition-all ${
                            item.isMe
                              ? "bg-purple-100/35 border-[#7C6AF7]/50 ring-2 ring-[#7C6AF7]/10"
                              : "bg-white border-[#F0EBFF]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`font-mono text-xs font-black ${item.isMe ? "text-[#7C6AF7]" : "text-zinc-400"}`}>
                              {item.rank}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#2D2060]">
                                {item.name} {item.isMe && <span className="text-[9px] bg-[#7C6AF7] text-white px-1.5 py-0.2 rounded font-black">NÓS</span>}
                              </p>
                              <span className="text-[9px] text-zinc-400 font-mono">{item.tag}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-800">{item.xp}</span>
                            <span className="text-base">🇧🇷</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-[9px] text-zinc-400 italic">
                    Competição carinhosa com casais de todo o Brasil! 😄
                  </p>
                </div>
              )}

              {/* 12. MARKETPLACE COSMÉTICO */}
              {selectedScreen === "marketplace-cosmetico" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-[#F0EBFF] flex justify-between items-center">
                      <div>
                        <h3 className="font-serif font-black text-xl text-[#2D2060]">Marketplace</h3>
                        <p className="text-[10px] text-[#7C6AF7]">Skins de Terreno e Lazer</p>
                      </div>
                      <span className="text-xs bg-yellow-50 text-amber-500 border border-amber-100 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        ⭐️ {stars}
                      </span>
                    </div>

                    {/* Silver Barbecue Cosmetic Card */}
                    <div className="bg-white rounded-3xl border border-[#F0EBFF] p-3.5 space-y-3 shadow-xs">
                      <div className="h-40 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
                        <img
                          src={IMAGES.barbecueCosmetic}
                          alt="Barbecue grill decoration"
                          referrerPolicy="no-referrer"
                          className="max-h-36 w-auto object-contain"
                        />
                        <span className="absolute top-2 left-2 text-[10px] bg-slate-800 text-white font-mono px-2 py-0.5 rounded">
                          Skins de Terreno
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-serif font-black text-base text-[#2D2060]">Churrasqueira de Prata ✨</h4>
                          <div className="flex items-center text-amber-500 gap-0.5 text-xs font-bold font-syne">
                            ⭐ 1.200
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-400">
                          Churrasqueira premium de inox para embelezar a garagem prescrita e dar XP de churrasco para o Yuri!
                        </p>

                        <button
                          onClick={() => {
                            if (stars >= 1200) {
                              unlockCosmetic("garden-spring", 1200); // reuse reward trigger
                              alert("Desbloqueado! Churrasqueira adicionada ao seu inventário de cosméticos.");
                            } else {
                              alert("Estrelas insuficientes! Recarregue Stars na central de moedas.");
                            }
                          }}
                          className="w-full bg-[#7C6AF7] text-white py-2.5 rounded-xl text-xs font-bold font-syne hover:bg-[#7C6AF7]/95"
                        >
                          Comprar por 1.200 Estrelas
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recharge Stars bundles quick access */}
                  <div className="bg-[#FAF7FF] border border-[#F0EBFF] p-3 rounded-2xl space-y-1.5 text-center">
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">Recarregar Moedas de Apoio</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => buyStars(1200)}
                        className="bg-white border border-[#F0EBFF] text-zinc-500 font-mono text-[9px] py-1.5 rounded-lg hover:border-[#7C6AF7]"
                      >
                        1.200 Estrelas (R$ 9,90)
                      </button>
                      <button 
                        onClick={() => buyStars(2800)}
                        className="bg-[#2D2060] text-white font-mono text-[9px] py-1.5 rounded-lg hover:bg-[#2D2060]/90"
                      >
                        2.800 Estrelas (R$ 19,90)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 13. TERRENO COMPLETO SANDBOX VIEW */}
              {selectedScreen === "terreno-sandbox" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Terreno Completo</h3>
                      <p className="text-[10px] text-zinc-400">Explore e decore visualmente o condomínio do casal.</p>
                    </div>

                    {/* Sandbox visual canvas */}
                    <div className="bg-slate-900 grid grid-cols-1 rounded-3xl overflow-hidden relative shadow-md">
                      <img
                        src={IMAGES.terrainComplete}
                        alt="Terreno Completo isometric map preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover opacity-90 cursor-pointer hover:scale-101 transition duration-500"
                        title="Isometric Garden World"
                      />

                      {/* Hotspots indicators on top representing decor points */}
                      <div className="absolute top-[40%] left-[30%] bg-[#7C6AF7] text-white rounded-full p-1 animate-pulse border border-white">
                        <span className="text-[10px] px-1 font-bold font-mono">🌸 Jardim</span>
                      </div>

                      <div className="absolute bottom-[30%] right-[30%] bg-rose-500 text-white rounded-full p-1 animate-pulse border border-white">
                        <span className="text-[10px] px-1 font-bold font-mono">🚗 Garagem</span>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="bg-white p-4 rounded-3xl border border-[#F0EBFF] space-y-3">
                      <h4 className="font-serif font-black text-sm text-[#2D2060]">Inventário Cósmico Ativo</h4>
                      <p className="text-[10px] text-zinc-450 leading-relaxed">Combine layouts adquiridos na loja de cosméticos.</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <button
                          onClick={() => setCosmeticStyle("garden", activeGardenStyle === "garden-spring" ? "garden-default" : "garden-spring")}
                          className={`py-2 px-3 rounded-lg border font-bold ${
                            activeGardenStyle === "garden-spring"
                              ? "bg-pink-100 border-[#F76A8C] text-[#F76A8C]"
                              : "bg-white border-zinc-200"
                          }`}
                        >
                          Prado Primavera 🌸
                        </button>

                        <button
                          onClick={() => setCosmeticStyle("garage", activeGarageStyle === "garage-neon" ? "garage-default" : "garage-neon")}
                          className={`py-2 px-3 rounded-lg border font-bold ${
                            activeGarageStyle === "garage-neon"
                              ? "bg-purple-100 border-[#7C6AF7] text-[#7C6AF7]"
                              : "bg-white border-zinc-200"
                          }`}
                        >
                          Cyberpunk Neon 🕹️
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={waterGarden}
                    className="bg-[#2D2060] text-white font-bold py-2.5 rounded-xl text-xs w-full shadow-sm cursor-pointer hover:bg-[#2D2060]/95"
                  >
                    Regar Plantas / Fertilizar o Terreno (+10% Hidratação)
                  </button>
                </div>
              )}

              {/* 14. ETERNIZAR POSTER */}
              {selectedScreen === "eternizar-poster" && (
                <div className="flex-1 p-5 space-y-4 animate-fade-in flex flex-col justify-between">
                  <div className="space-y-4 text-center">
                    <div className="pb-2 text-left border-b border-[#F0EBFF]">
                      <h3 className="font-serif font-black text-xl text-[#2D2060]">Eternizar</h3>
                      <p className="text-[10px] text-zinc-400">Transforme suas memórias virtuais em decoração física real!</p>
                    </div>

                    <div className="space-y-3.5 py-4">
                      <h4 className="font-serif font-black text-xl text-[#2D2060] leading-snug">
                        Deseja eternizar a constelão de vocês?
                      </h4>
                      <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                        Deseja obter poster, de essas físicas de vocês? Receba em sua casa um poster do seu céu estreito com o Yuri em altíssima qualidade!
                      </p>

                      {/* Poster artwork generated frame */}
                      <div className="max-w-[200px] mx-auto rounded-xl border-4 border-amber-900 bg-black overflow-hidden shadow-lg p-2 relative">
                        <img
                          src={IMAGES.posterConstelacao}
                          alt="Constellation physics printed artwork"
                          referrerPolicy="no-referrer"
                          className="w-full h-auto object-cover"
                        />
                        <span className="absolute bottom-4 inset-x-0 mx-auto text-[8px] bg-black/60 text-yellow-300 font-mono py-0.5 px-2 rounded-full w-max">
                          Premium Printed Paper
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => alert("Imprimindo o poster de testes! Nossa equipe encaminhará um e-mail de frete para konectariozo@gmail.com! 😉")}
                      className="w-full py-3 bg-[#7C6AF7] text-white hover:bg-[#7C6AF7]/95 rounded-xl text-xs font-bold font-syne shadow-md max-w-xs mx-auto block"
                    >
                      Encomendar Poster Físico R$ 49,90
                    </button>
                    <p className="text-[8px] text-[#2D2060]/70 text-center uppercase tracking-widest font-mono">
                      Extar / Exibir
                    </p>
                  </div>
                </div>
              )}

              {/* FLOATING BOTTON COMPACT SIMULATED TAB BAR IN TELEPHONE SCREEN */}
              <div className="h-14 bg-white border-t border-[#F0EBFF] flex items-center justify-around text-[#2D2060] shrink-0 sticky bottom-0 z-40 select-none text-[10px]">
                <button
                  onClick={() => setSelectedScreen("inicio-97")}
                  className={`flex flex-col items-center gap-0.5 ${
                    selectedScreen === "inicio-97" || selectedScreen === "inicio-9" ? "text-[#7C6AF7]" : "text-zinc-400"
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Início</span>
                </button>

                <button
                  onClick={() => setSelectedScreen("tarefas")}
                  className={`flex flex-col items-center gap-0.5 ${selectedScreen === "tarefas" ? "text-[#7C6AF7]" : "text-zinc-400"}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Tarefas</span>
                </button>

                {/* Centralized circle XP status indicator */}
                <button
                  onClick={() => setSelectedScreen("ranking-global")}
                  className="w-10 h-10 rounded-full bg-[#7C6AF7] -mt-4 border-2 border-white shadow-md flex items-center justify-center font-black font-syne text-[10px] text-white animate-pulse"
                  title="Ranking Global"
                >
                  XP
                </button>

                <button
                  onClick={() => setSelectedScreen("desejos-dele")}
                  className={`flex flex-col items-center gap-0.5 ${selectedScreen === "desejos-dele" ? "text-[#7C6AF7]" : "text-zinc-400"}`}
                >
                  <Gift className="w-4 h-4" />
                  <span>Desejos</span>
                </button>

                <button
                  onClick={() => setSelectedScreen(isEla ? "perfil-karina" as any : "perfil-yuri")}
                  className={`flex flex-col items-center gap-0.5 ${
                    selectedScreen === "perfil-yuri" || selectedScreen === "perfil-karina" as any ? "text-[#7C6AF7]" : "text-zinc-400"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: RECENT FLIGHT LOG & LIVE SIMULATOR ATTRIBUTES (4-span) */}
        <div className="lg:col-span-4 space-y-4 order-3 lg:order-3">
          
          {/* Status Details */}
          <div className="bg-white rounded-3xl p-5 border border-[#F0EBFF] shadow-xs space-y-4">
            <h3 className="font-serif font-extrabold text-[#2D2060] text-lg flex items-center gap-1.5 pb-2 border-b border-[#F0EBFF]">
              <Flame className="w-4.5 h-4.5 text-[#F76A8C]" /> Status da Sintonia
            </h3>

            {/* Simulated indicators */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#FAF7FF] rounded-2xl border border-[#F0EBFF]">
                <p className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Streak Ativo</p>
                <p className="text-2xl font-black font-syne text-[#F76A8C]">{casal.streakAtual} dias</p>
                <p className="text-[8px] text-zinc-400">Alinhado há 2h</p>
              </div>

              <div className="p-3 bg-[#FAF7FF] rounded-2xl border border-[#F0EBFF]">
                <p className="text-[10px] font-bold text-zinc-400 uppercase font-mono">Nível Terreno</p>
                <p className="text-2xl font-black font-syne text-[#7C6AF7]">{casal.nivelTerreno}</p>
                <p className="text-[8px] text-zinc-400">Corte {casal.xpCasal} XP total</p>
              </div>
            </div>

            {/* Individual scores */}
            <div className="space-y-2.5">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Saldos Individuais</p>
              
              <div className="flex items-center justify-between p-2.5 bg-[#FAF7FF] rounded-xl border border-[#F1EBFB]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧚‍♀️</span>
                  <span className="text-xs font-semibold">Karina</span>
                </div>
                <span className="text-xs font-mono font-black text-[#F76A8C] bg-rose-50 px-2 py-0.5 border border-rose-100 rounded">
                  {usuarios.ela.xpIndividual} XP
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#FAF7FF] rounded-xl border border-[#F1EBFB]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕹️</span>
                  <span className="text-xs font-semibold">Yuri</span>
                </div>
                <span className="text-xs font-mono font-black text-[#7C6AF7] bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded">
                  {usuarios.ele.xpIndividual} XP
                </span>
              </div>
            </div>

            {/* Live activity logs feed */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Diário de Conquistas
              </h4>

              <div className="space-y-2.5 max-h-[160px] overflow-y-auto no-scrollbar pr-0.5">
                {recentActivity.map((act) => (
                  <div key={act.id} className="text-[11px] border-b border-[#FAF7FF] pb-2 last:border-none flex justify-between gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: act.color }} />
                      <p className="text-zinc-650 leading-relaxed font-normal">
                        <b className="font-semibold text-[#2D2060]">{act.user}:</b> {act.text}
                      </p>
                    </div>
                    <span className="text-[8px] text-zinc-400 shrink-0 font-light mt-0.5">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Explanation Widget info */}
          <div className="bg-[#FAF7FF]/80 backdrop-blur-md rounded-3xl p-5 border border-[#F0EBFF] shadow-xs space-y-2 leading-relaxed">
            <h4 className="text-xs font-bold text-[#7C6AF7] flex items-center gap-1">
              <Info className="w-4 h-4 shrink-0" /> Dica de Utilização
            </h4>
            <p className="text-[11px] text-[#2D2060]/75">
              O simulador está conectado ao Firebase! Ao clicar em <b>Controlar parceiro</b> no topo, você simula de imediato cliques como se estivessem trocando as informações em dois celulares. Qualquer modificação de XP é calculada em tempo real no banco de dados.
            </p>
          </div>
        </div>

      </div>

      {/* 🌟 LUXURIOUS DESKTOP FOOTER */}
      <footer className="py-6 text-center text-xs text-[#2D2060]/50 border-t border-[#F0EBFF] mt-8">
        <p>© 2026 Karina Love. Todos os direitos reservados. Conectado ao Firebase Firestore.</p>
      </footer>

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
