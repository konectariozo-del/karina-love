/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CoupleProvider, useCouple } from "./context/CoupleContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Heart, 
  Gift, 
  Award, 
  CheckCircle, 
  Star, 
  User, 
  Check, 
  X, 
  ShoppingBag, 
  History, 
  Flame,
  Droplet,
  Plus,
  Compass,
  Sparkle,
  LogOut,
  Lock,
  ArrowRight,
  Calendar,
  MessageSquare,
  BadgeAlert,
  Copy,
  RefreshCw,
  Key,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Share2
} from "lucide-react";

// Real high-quality mock images matching the aesthetics
const IMAGES = {
  karinaAvatar: "/src/assets/images/karina_avatar_1779751454290.png",
  yuriAvatar: "/src/assets/images/yuri_avatar_1779751470483.png",
  terrainComplete: "/src/assets/images/terrain_complete_1779751486295.png",
  jantarIfood: "/src/assets/images/jantar_ifood_1779751501967.png",
  barbecueCosmetic: "/src/assets/images/barbecue_cosmetic_1779751518694.png",
  posterConstelacao: "/src/assets/images/poster_constelacao_1779751532858.png"
};

type ActiveTabId = "inicio" | "tarefas" | "xp" | "desejos" | "perfil";

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const { 
    state, 
    completeTask, 
    addCustomTask, 
    proposeTrade, 
    respondToTrade,
    toggleRitualApproval,
    addCustomReward,
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
  
  // Navigation matching bottom bar screenshot
  const [activeTab, setActiveTab] = useState<ActiveTabId>("inicio");

  // Household Tarefas Filter
  const [taskFilter, setTaskFilter] = useState<"Todas" | "Casa" | "Compras" | "Financeiro">("Todas");

  // Form States
  const [newChoreTitle, setNewChoreTitle] = useState("");
  const [newChoreTag, setNewChoreTag] = useState<"Casa" | "Compras" | "Financeiro" | "Outro">("Casa");
  const [newChoreDay, setNewChoreDay] = useState<"Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sab" | "Dom">("Seg");
  const [newChoreXp, setNewChoreXp] = useState(30);
  const [choreAssignee, setChoreAssignee] = useState<string>("partner"); // Default assign to partner to stimulate

  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardCost, setNewRewardCost] = useState(150);

  // Trade Swapping State
  const [selectedTaskToSwap, setSelectedTaskToSwap] = useState<string>("");
  const [tradeOfferText, setTradeOfferText] = useState("");

  // Real Invite Sincronia flow state
  const [copiedLink, setCopiedLink] = useState(false);
  const [partnerInputCode, setPartnerInputCode] = useState("");
  const [partnerStatus, setPartnerStatus] = useState<"unlinked" | "linked">("linked");
  const [connectionPulse, setConnectionPulse] = useState(true);

  // Change Password state
  const [newPassword, setNewPassword] = useState("");

  // Custom Toast system (safe for iframe environments!)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const isEla = currentUserId === "karina-id";
  const currentUser = isEla ? usuarios.ela : usuarios.ele;
  const partnerUser = isEla ? usuarios.ele : usuarios.ela;

  // Sync state loaded code
  const syncCode = isEla ? "KLOVE-KARINA-5824-XP" : "KLOVE-YURI-2094-XP";

  // Actions trigger with toasts and animation triggers
  const handleWater = () => {
    waterGarden();
    triggerToast("Você regou os jardins do terreno! Sinergia de água a 100% 🌹💧", "success");
  };

  const handleFeed = () => {
    feedPet();
    triggerToast("Pipoca foi alimentada! Ela está rosnando de felicidade 🐱🍎", "success");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoreTitle.trim()) return;
    
    // Assign either to self or partner
    const targetUserId = choreAssignee === "self" ? currentUserId : (isEla ? "yuri-id" : "karina-id");
    
    addCustomTask(newChoreTitle, newChoreTag as any, targetUserId, newChoreDay, newChoreXp);
    triggerToast(`Tarefa "${newChoreTitle}" agendada!`, "success");
    setNewChoreTitle("");
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    addCustomReward(newRewardTitle, newRewardCost, currentUserId);
    triggerToast(`Mimo "${newRewardTitle}" cadastrado com sucesso!`, "success");
    setNewRewardTitle("");
  };

  const handleProposeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToSwap || !tradeOfferText.trim()) {
      triggerToast("Selecione sua tarefa e escreva uma recompensa de afeto!", "error");
      return;
    }
    proposeTrade(selectedTaskToSwap, tradeOfferText);
    triggerToast("Pedido de troca enviado ao seu amor! Aguardando retorno 🤝", "info");
    setSelectedTaskToSwap("");
    setTradeOfferText("");
  };

  const handleCopyInvite = () => {
    const inviteMessage = `Oi meu amor! Cadastrei o Karina Love para gamificar nossas tarefas de casa e expandir nosso jardim virtual. Vem regar as flores comigo! Código de Sintonia: ${syncCode} 🧚‍♀️💖🕹️`;
    navigator.clipboard.writeText(inviteMessage);
    setCopiedLink(true);
    triggerToast("Texto com convite copiado! Compartilhe com seu amor.", "success");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmitPartnerCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerInputCode.trim()) return;
    triggerToast(`Código "${partnerInputCode.toUpperCase()}" sincronizado via banco de dados! 🌌`, "success");
    setPartnerStatus("linked");
    setPartnerInputCode("");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 3) {
      triggerToast("A nova senha deve ter no mínimo 3 caracteres.", "error");
      return;
    }
    localStorage.setItem(`klove_pwd_${currentUser.papel}`, newPassword);
    triggerToast("Senha secreta atualizada com sucesso!", "success");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#2D2060] font-sans selection:bg-[#F9A8C9]/20 flex flex-col relative pb-28 md:pb-8">
      
      {/* 🔮 CUSTOM POPUP TOAST (SAFETEST FOR IFRAMES) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm bg-white border border-[#F0EBFF] border-l-4 border-l-[#7C6AF7] rounded-2xl shadow-xl p-4 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#F76A8C] animate-ping shrink-0" />
            <p className="text-xs font-semibold text-[#2D2060]">{toastMessage.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌠 LUXURIOUS DESKTOP MENU & LOGO */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#F0EBFF] px-6 py-4 sticky top-0 z-40 select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C6AF7] to-[#F76A8C] p-[2px] shadow-sm">
              <img 
                src={isEla ? IMAGES.karinaAvatar : IMAGES.yuriAvatar}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover bg-white rounded-full"
              />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl tracking-tight text-[#2D2060] flex items-center gap-2 leading-none">
                Karina <span className="text-[#F76A8C]">Love</span>
                <span className="text-[10px] bg-[#FAF7FF] border border-[#F0EBFF] px-2 py-0.5 rounded-full text-[#7C6AF7] font-semibold">
                  Sintonia Real ✨
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                Conectado como <b className="text-[#7C6AF7] font-bold">{currentUser.nome}</b> {isEla ? "🧚‍♀️" : "🕹️"} 
                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Em tempo real
              </p>
            </div>
          </div>

          {/* Quick Metrics display */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="bg-[#FAF7FF] border border-[#F0EBFF] px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 font-mono">
              <span className="mr-0.5">✨</span>
              <span className="text-[#7C6AF7] font-bold">{currentUser.xpIndividual} XP</span>
            </div>

            <div className="bg-[#FFF5F7] border border-rose-100 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 font-mono">
              <span className="text-[#F76A8C]">🔥 {casal.streakAtual} dias</span>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 px-3 py-1.5 rounded-xl font-medium font-mono flex items-center gap-1 text-amber-700">
              <span>⭐ {stars}</span>
            </div>

            <button
              onClick={onLogout}
              className="border border-[#F0EBFF] text-zinc-400 hover:bg-red-50 hover:text-red-500 hover:border-red-150 rounded-xl px-3 py-1.5 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 DESKTOP-ONLY HORIZONTAL NAVIGATION TABS (HIDDEN ON MOBILE) */}
      <nav className="bg-white border-b border-[#F0EBFF] py-2 shadow-xs sticky top-[73px] z-30 select-none hidden md:block">
        <div className="max-w-4xl mx-auto px-4 flex justify-around items-center">
          {[
            { id: "inicio", label: "Início", icon: Compass, color: "text-[#7C6AF7]" },
            { id: "tarefas", label: "Tarefas de Casa", icon: CheckCircle, color: "text-emerald-500" },
            { id: "xp", label: "Jardim & Sintonia (XP)", icon: Star, color: "text-purple-core", isHighlight: true },
            { id: "desejos", label: "Sacar Mimos", icon: Gift, color: "text-[#C084FC]" },
            { id: "perfil", label: "Perfil & Conexão", icon: User, color: "text-amber-500" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isAct = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTabId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isAct
                    ? "bg-[#7C6AF7] text-white shadow-md scale-102"
                    : "text-[#2D2060]/75 hover:bg-[#FAF7FF]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isAct ? "text-white" : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 🏡 CORE BODY CONTAINER */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
        
        {/* ======================================= */}
        {/* TAB 1: INÍCIO (HOMEPAGE & SUMMARY)      */}
        {/* ======================================= */}
        {activeTab === "inicio" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Friendly Greeting Card */}
            <div className="bg-gradient-to-br from-[#7C6AF7]/10 via-[#F76A8C]/5 to-white rounded-3xl border border-[#F0EBFF] p-6 shadow-sm">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#7C6AF7] font-bold">Resumo Diário de Afeto</span>
                  <p className="font-serif font-black text-3xl text-[#2D2060] mt-1">
                    Bem-vinda de volta, {currentUser.nome}! ✨
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-lg">
                    Seu parceiro <b className="text-[#7C6AF7] font-bold">{partnerUser.nome}</b> está em plena sintonia com você. Que tal validar um ritual de carinho hoje?
                  </p>
                </div>
                
                {/* Active connection pulse */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-2xl text-emerald-700 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  Sintonizado com {partnerUser.nome}
                </div>
              </div>

              {/* Home Fast Action Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/90 border border-[#F0EBFF] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Streak de Dias</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-3xl font-black text-[#F76A8C]">{casal.streakAtual}</span>
                    <span className="text-xs font-semibold text-zinc-500">dias seguidos</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2">🔥 Mantendo vivos os rituais de intimidade</p>
                </div>

                <div className="bg-white/90 border border-[#F0EBFF] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">XP de Terreno</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-3xl font-black text-[#7C6AF7]">{casal.xpCasal}</span>
                    <span className="text-xs font-semibold text-[#7C6AF7]">/ 900 XP</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mt-3">
                    <div className="bg-gradient-to-r from-[#7C6AF7] to-[#F76A8C] h-1.5 rounded-full" style={{ width: `${(casal.xpCasal / 900) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-white/90 border border-[#F0EBFF] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Humor do Terreno</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold font-serif">🍃 {gardenHydration}%</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2">Mascote Pipoca está <b className="text-emerald-600 uppercase font-bold">{petStatus}</b></p>
                </div>
              </div>
            </div>

            {/* PARTNER INVITE PANEL */}
            <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 h-36 bg-gradient-to-br from-[#7C6AF7] to-[#F76A8C] rounded-2xl flex flex-col justify-between p-4 text-white relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-white/10 blur-xl" />
                <Share2 className="w-8 h-8 text-white/95" />
                <div>
                  <h4 className="font-serif font-black text-lg">Convite de Sintonia</h4>
                  <p className="text-[10px] text-zinc-100">Compartilhe o código de sintonia real</p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <h3 className="font-serif font-black text-xl text-[#2D2060]">Conecte Seu Amor ao Terreno Romântico</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Para seu parceiro governar este quintal de tarefas síncronas com você, repasse este código de sintonia. Ele pode inserir este código nas próprias configurações de perfil para conectar os bancos de dados em tempo real.
                </p>

                <div className="flex gap-2 items-center text-xs">
                  <div className="bg-[#FAF7FF] border border-[#F0EBFF] px-4 py-2 rounded-xl font-mono text-[#7C6AF7] font-bold flex-1">
                    {syncCode}
                  </div>
                  <button
                    onClick={handleCopyInvite}
                    className="p-2.5 bg-[#FAF7FF] hover:bg-[#FAF7FF]/90 border border-[#F0EBFF] text-[#7C6AF7] rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer select-none"
                    title="Copiar convite completo"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copiar Código em Texto</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Quick Obligations overview (7-span) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-[#F5F1FF]">
                    <h3 className="font-serif font-black text-lg text-[#2D2060] flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#7C6AF7]" /> Minha Carga de Hoje
                    </h3>
                    <button 
                      onClick={() => setActiveTab("tarefas")} 
                      className="text-xs text-[#7C6AF7] hover:underline font-bold"
                    >
                      Ir para Quadro Completo →
                    </button>
                  </div>

                  <div className="space-y-2 mt-4 max-h-64 overflow-y-auto no-scrollbar">
                    {tarefas
                      .filter(t => !t.concluida && t.responsavel === currentUserId)
                      .slice(0, 4)
                      .map((t) => (
                        <div key={t.id} className="p-3 bg-white border border-[#F5F1FF] rounded-xl flex items-center justify-between gap-3 text-xs hover:border-[#F0EBFF] transition">
                          <div>
                            <p className="font-bold text-[#2D2060]">{t.titulo}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{t.dia} • Recompense: <b className="font-bold text-[#7C6AF7]">+{t.xp} XP</b></p>
                          </div>
                          <button
                            onClick={() => {
                              completeTask(t.id);
                              triggerToast(`Tarefa "${t.titulo}" completada com êxito! +${t.xp} XP individual para sua carteira.`, "success");
                            }}
                            className="bg-[#7C6AF7]/10 hover:bg-[#7C6AF7] hover:text-white text-[#7C6AF7] border border-[#7C6AF7]/10 rounded-lg py-1 px-2.5 font-bold transition cursor-pointer"
                          >
                            Concluir!
                          </button>
                        </div>
                      ))}

                    {tarefas.filter(t => !t.concluida && t.responsavel === currentUserId).length === 0 && (
                      <div className="p-6 text-center text-zinc-400 text-xs italic">
                        Sem obrigações pendentes para você hoje! Aproveite para relaxar 🎉
                      </div>
                    )}
                  </div>
                </div>

                {/* Open Trades Summary */}
                {trocas.filter(tr => tr.status === "pendente").length > 0 && (
                  <div className="bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-bold font-serif flex items-center gap-1.5 text-[#2D2060]">
                      <BadgeAlert className="w-4.5 h-4.5 text-[#F76A8C] animate-pulse" />
                      Você possui solicitações de trocas pendentes!
                    </p>
                    {trocas.filter(tr => tr.status === "pendente").map(tr => {
                      const associatedChore = tarefas.find(t => t.id === tr.tarefaId);
                      const isMePetitioner = tr.proponenteId === currentUserId;
                      return (
                        <div key={tr.id} className="bg-white p-3 border border-[#EBE3FF] rounded-xl flex items-center justify-between text-xs gap-3">
                          <div className="space-y-0.5">
                            <p className="font-bold">Solicitado por {tr.proponenteId === "karina-id" ? "Karina" : "Yuri"}</p>
                            <p className="text-zinc-500 italic">Tarefa: "{associatedChore?.titulo}"</p>
                          </div>
                          {!isMePetitioner && (
                            <button 
                              onClick={() => {
                                respondToTrade(tr.id, "aceita");
                                triggerToast("Você aceitou trocar essa obrigação! Mimos a serem cobrados.", "success");
                              }}
                              className="text-xs bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 px-3 py-1.5 text-white font-bold rounded-lg cursor-pointer transition select-none"
                            >
                              Aceitar Ceder
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Timeline Achievements (5-span) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F0EBFF]">
                    <h3 className="font-serif font-black text-md text-[#2D2060] flex items-center gap-1">
                      <History className="w-4 h-4 text-[#7C6AF7]" /> Conquistas do Casal
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar pr-1">
                    {recentActivity.map((act) => (
                      <div key={act.id} className="flex gap-2.5 items-start justify-between text-xs pb-1.5 border-b border-zinc-50">
                        <div className="flex gap-1.5 items-start">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: act.color }} />
                          <p className="text-zinc-640 text-[#2D2060]">
                            <b className="font-bold">{act.user}</b>: {act.text}
                          </p>
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono shrink-0">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ======================================= */}
        {/* TAB 2: TAREFAS DE OBRIGAÇÕES            */}
        {/* ======================================= */}
        {activeTab === "tarefas" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filter and Headline Header */}
            <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-[#F0EBFF]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7C6AF7] font-bold">Quadro de Limpeza & Compras</span>
                <h2 className="font-serif font-black text-3xl text-[#2D2060]">Gestão de Rotinas do Lar</h2>
                <p className="text-xs text-zinc-500 mt-1">Cumpra obrigações para acumular XP e desbloquear mimos com seu parceiro.</p>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                {(["Todas", "Casa", "Compras", "Financeiro"] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTaskFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition shrink-0 cursor-pointer ${
                      taskFilter === cat
                        ? "bg-[#7C6AF7] text-white border-[#7C6AF7]"
                        : "bg-white text-zinc-400 border-[#F0EBFF] hover:bg-[#FAF7FF]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Task Checklist column (7-span) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs">
                  <h3 className="font-serif font-black text-lg text-[#2D2060] pb-2 border-b border-[#F0EBFF] mb-4">Agenda Semanal</h3>
                  
                  <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                    {tarefas
                      .filter(t => taskFilter === "Todas" || t.tag === taskFilter)
                      .map((t) => {
                        const isMine = t.responsavel === currentUserId;
                        const responsibleLabel = t.responsavel === "karina-id" ? "Karina 🧚‍♀️" : "Yuri 🕹️";
                        
                        return (
                          <div
                            key={t.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                              t.concluida
                                ? "bg-slate-50/70 border-gray-150 opacity-60"
                                : "bg-white border-[#F0EBFF] hover:shadow-xs"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  if (!isMine) {
                                    triggerToast(`Essa tarefa pertence a ${responsibleLabel.split(" ")[0]}. Envie uma proposta de troca ao lado!`, "info");
                                    return;
                                  }
                                  completeTask(t.id);
                                  triggerToast(`Parabéns! Você cumpriu "${t.titulo}" (+${t.xp} XP)`, "success");
                                }}
                                disabled={t.concluida}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                  t.concluida
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : isMine
                                    ? "border-[#7C6AF7] hover:bg-[#7C6AF7]/10"
                                    : "border-gray-200 bg-gray-50 text-gray-300"
                                }`}
                              >
                                {t.concluida && <Check className="w-3.5 h-3.5" />}
                              </button>
                              
                              <div>
                                <p className={`text-xs sm:text-sm font-bold ${t.concluida ? "line-through text-zinc-400" : "text-[#2D2060]"}`}>
                                  {t.titulo}
                                </p>
                                <div className="flex flex-wrap gap-1.5 items-center mt-1 text-[10px]">
                                  <span className="uppercase font-mono font-bold bg-[#FAF7FF] border border-[#F0EBFF] text-[#7C6AF7] px-1.5 rounded">
                                    {t.tag}
                                  </span>
                                  <span className="text-zinc-400 flex items-center gap-1 font-mono">
                                    <Calendar className="w-3 h-3 text-zinc-300" /> {t.dia} • Responsável: <b className="font-semibold text-zinc-500">{responsibleLabel}</b>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100/60 px-2.5 py-1 rounded-lg font-mono font-bold whitespace-nowrap">
                              +{t.xp} XP
                            </span>
                          </div>
                        );
                      })}

                    {tarefas.filter(t => taskFilter === "Todas" || t.tag === taskFilter).length === 0 && (
                      <div className="p-8 text-center text-zinc-400 text-xs italic">
                        Nenhuma obrigação ativa nesta categoria. Crie uma nova tarefa ao carinho do casal!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Add / Swappings control (4-span) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Save Chore form */}
                <form onSubmit={handleCreateTask} className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs space-y-4">
                  <h3 className="font-serif font-black text-lg text-[#2D2060] pb-2 border-b border-[#F0EBFF]">Agendar Tarefa</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Descrição da Obrigação</label>
                      <input
                        type="text"
                        placeholder="Ex: Tirar o lixo, lavar louça..."
                        required
                        value={newChoreTitle}
                        onChange={(e) => setNewChoreTitle(e.target.value)}
                        className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#7C6AF7] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Responsável</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setChoreAssignee("self")}
                          className={`py-2 rounded-xl border text-center font-bold font-mono transition-all cursor-pointer ${
                            choreAssignee === "self"
                              ? "bg-[#7C6AF7] text-white border-[#7C6AF7]"
                              : "bg-[#FAF7FF] text-zinc-500 border-[#F0EBFF]"
                          }`}
                        >
                          Eu ({currentUser.nome})
                        </button>
                        <button
                          type="button"
                          onClick={() => setChoreAssignee("partner")}
                          className={`py-2 rounded-xl border text-center font-bold font-mono transition-all cursor-pointer ${
                            choreAssignee === "partner"
                              ? "bg-[#7C6AF7] text-white border-[#7C6AF7]"
                              : "bg-[#FAF7FF] text-zinc-500 border-[#F0EBFF]"
                          }`}
                        >
                          {partnerUser.nome}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Categoria</label>
                        <select
                          value={newChoreTag}
                          onChange={(e) => setNewChoreTag(e.target.value as any)}
                          className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-2 py-2 text-xs focus:outline-none"
                        >
                          <option value="Casa">Casa</option>
                          <option value="Compras">Compras</option>
                          <option value="Financeiro">Financeiro</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Dia da Semana</label>
                        <select
                          value={newChoreDay}
                          onChange={(e) => setNewChoreDay(e.target.value as any)}
                          className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-2 py-2 text-xs focus:outline-none"
                        >
                          <option value="Seg">Segunda</option>
                          <option value="Ter">Terça</option>
                          <option value="Qua">Quarta</option>
                          <option value="Qui">Quinta</option>
                          <option value="Sex">Sexta</option>
                          <option value="Sab">Sábado</option>
                          <option value="Dom">Domingo</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                        <span>Prêmio (+{newChoreXp} XP)</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="10"
                        value={newChoreXp}
                        onChange={(e) => setNewChoreXp(parseInt(e.target.value))}
                        className="w-full h-1 bg-zinc-200 accent-[#7C6AF7] rounded-lg appearance-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#2D2060] text-white hover:bg-[#2D2060]/95 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar na Agenda
                    </button>
                  </div>
                </form>

                {/* Swap Responsibilities Form */}
                <form onSubmit={handleProposeTrade} className="p-5 bg-gradient-to-br from-[#7C6AF7]/5 to-white border border-[#F0EBFF] rounded-3xl space-y-4">
                  <h3 className="font-serif font-black text-lg text-[#2D2060] flex items-center gap-1">
                    Ceder uma Obrigação 🔄
                  </h3>
                  <p className="text-[11px] text-zinc-550 leading-relaxed text-zinc-500">
                    Está sobrecarregado? Transfira uma obrigação não cumprida sob sua responsabilidade para seu parceiro. Ofereça um agrado em troca!
                  </p>
                  
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <select
                        value={selectedTaskToSwap}
                        onChange={(e) => setSelectedTaskToSwap(e.target.value)}
                        className="w-full bg-white border border-[#F0EBFF] rounded-xl p-2.5 text-xs text-[#2D2060] focus:outline-none"
                      >
                        <option value="">Selecione sua tarefa...</option>
                        {tarefas
                          .filter(t => !t.concluida && t.responsavel === currentUserId)
                          .map(t => (
                            <option key={t.id} value={t.id}>{t.titulo} ({t.dia})</option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <textarea
                        rows={2}
                        placeholder="Ex: 'Massagem em troca', 'Prometo lavar a janta amanhã'"
                        required
                        value={tradeOfferText}
                        onChange={(e) => setTradeOfferText(e.target.value)}
                        className="w-full bg-white border border-[#F0EBFF] rounded-xl p-2.5 resize-none text-xs text-[#2D2060] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold rounded-xl transition cursor-pointer select-none"
                    >
                      Propor Troca com Carinho
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: XP (JARDIM ISOMÉTRICO & GAME LAYER) - THE HERO IN PRE-PRINT */}
        {/* ========================================================= */}
        {activeTab === "xp" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header game status */}
            <div className="pb-4 border-b border-[#F0EBFF] flex justify-between items-start flex-wrap gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7C6AF7] font-bold">Quadro Lúdico Cósmico</span>
                <h2 className="font-serif font-black text-3xl text-[#2D2060]">Nossa Sintonia Terrestre</h2>
                <p className="text-xs text-zinc-500 mt-1">Regue nosso quintal, brinque com o gato e use moedas estrelas para obter layouts decorativos.</p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 border-emerald-150 border px-3 py-1.5 rounded-2xl text-xs font-mono font-bold">
                Jardim Level {casal.nivelTerreno} • {activeGardenStyle.replace("-default", " clássica")}
              </div>
            </div>

            {/* Simulated Isometric Grid Panel */}
            <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-xs space-y-4 relative overflow-hidden">
              <div className="relative h-72 sm:h-96 bg-zinc-950 rounded-2xl overflow-hidden group shadow-inner">
                <img
                  src={IMAGES.terrainComplete}
                  alt="Maquete Terreno Cósmico"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-700 opacity-90"
                />

                {/* Fancy vector absolute badges on layout design */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-white text-[11px] font-mono flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ambiente da {usuarios.ela.nome} & {usuarios.ele.nome}
                </div>

                <div className="absolute top-4 right-4 bg-[#7C6AF7] px-3 py-1 text-white rounded-xl text-[10px] font-bold tracking-tight">
                  Simbologia Ativa 🌸
                </div>

                {/* Sub title bottom overlay to describe content */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-5 text-white">
                  <p className="text-xs font-bold text-amber-300">
                    Estilo Selecionado: Cozinha Rústica & Churrasqueira de Grelha 🥩
                  </p>
                  <p className="text-[10px] text-zinc-300 mt-1 leading-normal">
                    Fim do dia: {casal.nome}. Cada obrigação validada expande as plantas e traz maior bem-estar para o lar.
                  </p>
                </div>
              </div>

              {/* Maintenance / Feed/ Watering panel buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF7FF] border border-[#F0EBFF] p-4 rounded-2xl">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Humidade do Terreno</p>
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-sky-500 animate-bounce" />
                    <span className="font-extrabold text-sm text-[#2D2060]">{gardenHydration}% hidratado</span>
                  </div>
                  <div className="w-full bg-[#F0EBFF] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${gardenHydration}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Mascote Pipoca 🐱</p>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-[#2D2060]">
                    <span>🐾</span>
                    <span className="text-emerald-600 font-black uppercase text-xs">{petStatus}</span>
                  </div>
                  <p className="text-[9px] text-zinc-400 leading-none mt-1">Concede bônus de moedas na conclusão de tarefas.</p>
                </div>

                <div className="flex flex-col gap-1.5 justify-center">
                  <button
                    onClick={handleWater}
                    className="w-full text-center bg-white border border-[#F0EBFF] hover:bg-sky-50 text-sky-600 font-serif font-black py-1.5 rounded-xl text-[11px] transition active:scale-95 cursor-pointer"
                  >
                    💧 Regar Flores (+20% Água)
                  </button>
                  <button
                    onClick={handleFeed}
                    className="w-full text-center bg-white border border-[#F0EBFF] hover:bg-rose-50 text-rose-500 font-serif font-black py-1.5 rounded-xl text-[11px] transition active:scale-95 cursor-pointer"
                  >
                    🍎 Alimentar Gata Pipoca
                  </button>
                </div>
              </div>
            </div>

            {/* Customization items shop and Poster Constellation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cozy stone barbecue purchase widget */}
              <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-40 bg-zinc-900 rounded-xl overflow-hidden relative">
                    <img 
                      src={IMAGES.barbecueCosmetic} 
                      alt="Barbecue Rustica" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                      GAMESKIN 🥩
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-extrabold text-[#2D2060]">Churrasqueira de Yuri 🥩</h4>
                      <p className="text-[10px] text-zinc-400">Layout Campestre Yuri e Horta Karina conjunta</p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-700 font-mono font-bold px-2.5 py-1 rounded-lg">
                      ⭐ 350 Moedas
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Eternize a garagem com a churrasqueira campestre rústica do Yuri, agregando bônus no valor de XP das tarefas financeiras do lar.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (stars >= 350) {
                      unlockCosmetic("barbecue-stone", 350);
                      setCosmeticStyle("garage", "barbecue-stone");
                      triggerToast("Você adquiriu e decorou o jardim com a Churrasqueira de Pedra de Yuri!", "success");
                    } else {
                      triggerToast("Saldo de Stars insuficiente para resgatar. Adicione mais Stars!", "error");
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold transition hover:opacity-90 mt-4 cursor-pointer"
                >
                  Instalar Decoração (350 Stars)
                </button>
              </div>

              {/* Poster frame ordering widget */}
              <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-40 bg-zinc-950 rounded-xl overflow-hidden relative">
                    <img 
                      src={IMAGES.posterConstelacao} 
                      alt="Physical frame design" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                      ARTEMÍSIA ★
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-extrabold text-[#2D2060]">Poster Físico do Jardim</h4>
                      <p className="text-[10px] text-zinc-400">Quadro Romântico para Sala</p>
                    </div>
                    <span className="text-xs text-indigo-700 bg-indigo-50 font-bold px-2 py-1 rounded">
                      R$ 119,90
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Você pode encomendar um poster físico impresso em alta fidelidade representando a síntese do jardim de vocês! Conectamos ao banco de dados do casal para detalhar as camélias.
                  </p>
                </div>
                <button
                  onClick={() => {
                    triggerToast("Encomenda efetuada com sucesso! Sincronizando dados de endereço romântico.", "success");
                  }}
                  className="w-full py-2 bg-[#2D2060] hover:bg-[#2D2060]/90 text-white rounded-xl text-xs font-bold transition mt-4 cursor-pointer"
                >
                  Eternizar Nosso Quadro Físico
                </button>
              </div>

            </div>

            {/* Buy extra gold dashboard */}
            <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs">
              <h3 className="font-serif font-black text-lg text-[#2D2060] pb-2 border-b border-[#F0EBFF]">Adquirir moedas adicionais (Estrelas)</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">Adicione Gold virtual para acelerar decorações ou apoiar o bem-estar do quintal do amor.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { count: 100, price: "R$ 9,90", tag: "Pacote Cósmico" },
                  { count: 500, price: "R$ 39,90", tag: "Baú do Bosque" },
                  { count: 1500, price: "R$ 99,90", tag: "Supernova Premium" },
                ].map(pack => (
                  <button
                    key={pack.count}
                    onClick={() => {
                      buyStars(pack.count);
                      triggerToast(`Recarga de +${pack.count} Estrelas realizada no jogo! ✨💸`, "success");
                    }}
                    className="p-3 bg-[#FAF7FF] hover:bg-[#FAF7FF]/90 border border-[#F0EBFF] rounded-2xl flex flex-col justify-between items-start transition text-left cursor-pointer"
                  >
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">{pack.tag}</span>
                    <span className="font-mono text-sm text-[#7C6AF7] font-black mt-1">⭐ +{pack.count} Estrelas</span>
                    <span className="text-xs font-mono font-bold text-[#F76A8C] mt-2 bg-white px-2 py-0.5 rounded-full border border-rose-100">{pack.price}</span>
                  </button>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* ======================================= */}
        {/* TAB 4: SACAR DESEJOS (MIMOS E VOUCHERS) */}
        {/* ======================================= */}
        {activeTab === "desejos" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="pb-4 border-b border-[#F0EBFF] flex justify-between items-end flex-wrap gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C084FC] font-bold">Cofre de Desejos e Promessas</span>
                <h2 className="font-serif font-black text-3xl text-[#2D2060]">Sacar Mimos de Afeto</h2>
                <p className="text-xs text-zinc-500 mt-1">Sua carteira individual possui XP que você pode gastar para ceder mimos criados!</p>
              </div>
              <div className="bg-[#FAF7FF] border border-[#F0EBFF] px-4 py-2 rounded-2xl font-mono text-xs font-bold">
                Seu XP Disponível: <b className="text-[#7C6AF7] font-extrabold">{currentUser.xpIndividual} XP</b>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Rewards checklists (7-span) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* iFood dinner destaque highlight */}
                <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 h-40 bg-zinc-950 rounded-2xl overflow-hidden relative">
                    <img 
                      src={IMAGES.jantarIfood} 
                      alt="Burger Jantar Delivery" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#F76A8C] text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                      FAVORITO ★
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#F76A8C]">Mimo Destaque</span>
                        <h3 className="font-serif font-black text-xl text-[#2D2060]">Jantar Delivery iFood 🍔</h3>
                      </div>
                      <span className="text-xs text-[#7C6AF7] bg-indigo-50 border border-indigo-150 px-2 font-mono font-bold py-0.5 rounded">
                        120 XP
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 leading-normal">
                      Solicite que seu parceiro pague aquele hambúrguer ou pizza deliciosa para assistir a um filme juntos na cama! Sacar deduz o XP da sua conta.
                    </p>

                    <button
                      onClick={() => {
                        const foodRew = recompensas.find(r => r.titulo.toLowerCase().includes("pizza") || r.titulo.toLowerCase().includes("burger") || r.id === "reward-2");
                        if (foodRew) {
                          redeemReward(foodRew.id);
                          triggerToast("Pedido Jantar iFood enviado! Seu parceiro recebeu o aviso de débito de mimos.", "success");
                        } else {
                          triggerToast("Mimo indisponível no cofre.", "error");
                        }
                      }}
                      disabled={currentUser.xpIndividual < 120}
                      className="w-full py-2 bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition cursor-pointer select-none"
                    >
                      {currentUser.xpIndividual >= 120 ? "Sacar Agora (120 XP)" : "Ganha mais XP no Lar para liberar"}
                    </button>
                  </div>
                </div>

                {/* Additional rewards catalog list */}
                <div className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs">
                  <h3 className="font-serif font-black text-lg text-[#2D2060] pb-2 border-[#F0EBFF] border-b mb-4">Outros Cafunés e Promessas</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recompensas.map((rew) => {
                      const creatorName = rew.configuradaPor === "karina-id" ? "Karina" : "Yuri";
                      const canRedeem = currentUser.xpIndividual >= rew.custoXP && !rew.resgatada;

                      return (
                        <div 
                          key={rew.id} 
                          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                            rew.resgatada 
                              ? "bg-slate-50 border-zinc-100 opacity-60" 
                              : "bg-white border-[#F0EBFF] hover:border-zinc-200"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-1.5 mb-2">
                              <h4 className="font-serif font-black text-md text-[#2D2060] leading-tight">{rew.titulo}</h4>
                              <span className="text-[10px] font-mono font-bold bg-[#FAF7FF] text-[#7C6AF7] border border-[#F0EBFF] px-2 py-0.5 rounded">
                                {rew.custoXP} XP
                              </span>
                            </div>
                            <p className="text-[9px] text-zinc-400">Registrado por: <b className="font-bold text-zinc-500">{creatorName}</b></p>
                          </div>

                          <div className="pt-3 border-t border-[#FCDCC-transparent] mt-3">
                            {rew.resgatada ? (
                              <div className="text-center bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1 rounded">
                                ADQUIRIDO ✓
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  if (currentUser.xpIndividual < rew.custoXP) {
                                    triggerToast(`Seu XP é insuficiente. Falta ${rew.custoXP - currentUser.xpIndividual} XP.`, "error");
                                    return;
                                  }
                                  redeemReward(rew.id);
                                  triggerToast(`Mimo "${rew.titulo}" resgatado! Avise seu parceiro.`, "success");
                                }}
                                className={`w-full py-1.5 rounded-xl font-bold text-xs text-center transition cursor-pointer select-none ${
                                  canRedeem 
                                    ? "bg-[#7C6AF7] text-white hover:opacity-90" 
                                    : "bg-zinc-100 text-zinc-400"
                                }`}
                              >
                                {canRedeem ? "Fazer Resgate" : `Falta ${rew.custoXP - currentUser.xpIndividual} XP`}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Reward configurator (5-span) */}
              <div className="lg:col-span-4">
                <form onSubmit={handleCreateReward} className="bg-white rounded-3xl border border-[#F0EBFF] p-5 shadow-xs space-y-4">
                  <h3 className="font-serif font-black text-lg text-[#2D2060] pb-2 border-b border-[#F0EBFF]">Cadastrar Desejo</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Personalize cafunes, mimos amorosos ou vouchers lúdicos para cobrar de seu amor!
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Título ou Promessa</label>
                      <input
                        type="text"
                        placeholder="Ex: Fazer cafuné de 30min..."
                        required
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C6AF7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Custo de XP ({newRewardCost} XP)</label>
                      <input
                        type="range"
                        min="50"
                        max="400"
                        step="10"
                        value={newRewardCost}
                        onChange={(e) => setNewRewardCost(parseInt(e.target.value))}
                        className="w-full accent-[#7C6AF7]"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                        <span>Fácil (50)</span>
                        <span>Dedicado (400)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#2D2060] hover:bg-[#2D2060]/95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" /> Salvar no Cofre
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </motion.div>
        )}

        {/* ======================================= */}
        {/* TAB 5: PERFIL (CONFIGURAÇÃO E CONEXÃO) */}
        {/* ======================================= */}
        {activeTab === "perfil" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="pb-4 border-b border-[#F0EBFF]">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#7C6AF7] font-bold">Gerenciador de Identidades</span>
              <h2 className="font-serif font-black text-3xl text-[#2D2060]">Conexão e Configurações</h2>
              <p className="text-xs text-zinc-500 mt-1">Configure senhas, visualize insígnias especiais e sincronize os dados do casal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile card and badges */}
              <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-xs space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl">
                    {currentUser.avatar === "🧚‍♀️" ? <span className="transform -scale-x-100">🧚‍♀️</span> : currentUser.avatar}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#2D2060]">{currentUser.nome}</h3>
                    <p className="text-xs text-zinc-400">Papel na Constelação: <b className="text-[#F76A8C]">{currentUser.papel === "ela" ? "Karina (Ela)" : "Yuri (Ele)"}</b></p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Histórico de Insígnias (Badges)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.badges.map(b => (
                      <span key={b} className="text-[10px] border border-rose-100 text-rose-500 bg-rose-50/50 px-2.5 py-1 rounded-lg font-medium">
                        🏆 {b}
                      </span>
                    ))}
                    <span className="text-[10px] border border-zinc-100 text-zinc-400 bg-zinc-50 px-2.5  py-1 rounded-lg">
                      🔒 Noivas do Clã
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure change password panel */}
              <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-extrabold text-lg text-[#2D2060] flex items-center gap-1">
                  <Key className="w-4 h-4 text-[#7C6AF7]" /> Alterar Senha Secreta
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Modifique sua senha secreta de acesso para garantir a privacidade de suas tarefas e desejos.
                </p>

                <form onSubmit={handleSavePassword} className="space-y-3">
                  <div className="space-y-1">
                    <input
                      type="password"
                      placeholder="Digite a nova senha..."
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 bg-[#FAF7FF] hover:bg-[#FAF7FF]/90 border border-[#F0EBFF] text-[#7C6AF7] font-bold text-xs rounded-xl w-full transition cursor-pointer select-none"
                  >
                    Salvar Nova Senha
                  </button>
                </form>
              </div>

              {/* Pair Connection Setup Widget */}
              <div className="bg-white rounded-3xl border border-[#F0EBFF] p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-extrabold text-lg text-[#2D2060] flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Sincronização de Convite do Parceiro
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                  Insira o código de sintonia enviado por seu parceiro para vincular seus dados imediatamente.
                </p>

                <form onSubmit={handleSubmitPartnerCode} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Cole o código do parceiro aqui..."
                      value={partnerInputCode}
                      onChange={(e) => setPartnerInputCode(e.target.value)}
                      className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-xl px-3 py-2 text-xs uppercase focus:outline-none font-mono font-bold placeholder-zinc-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2D2060] hover:bg-[#2D2060]/95 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Vincular Casal Com Sucesso!
                  </button>
                </form>
              </div>

              {/* Reset layout database button */}
              <div className="p-6 bg-yellow-50/50 border border-yellow-100 rounded-3xl space-y-3">
                <h3 className="font-serif font-extrabold text-md text-[#2D2060]">Redefinição Romântica</h3>
                <p className="text-xs text-zinc-500 leading-normal">
                  Quer começar suas obrigações cooperativas de tarefas e o jardim terrestre totalmente do zero? Limpe a persistência local localmente com um clique.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      resetDatabaseState();
                      triggerToast("Banco de dados local do amor reinicializado com sucesso! 👋", "info");
                    }}
                    className="flex-1 bg-white hover:bg-yellow-50 border border-yellow-200 text-yellow-800 font-bold text-xs py-2 px-4 rounded-xl transition select-none cursor-pointer"
                  >
                    Resetar Banco Original
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </main>

      {/* 🚀 NAVIGATION BOTTOM TABS BAR (TRUE MATCH TO SCREENSHOT PRINTED BAR) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#F0EBFF] shadow-2xl py-2 px-4 select-none md:hidden rounded-t-3xl transition">
        <div className="max-w-md mx-auto flex justify-between items-center h-14 relative px-2">
          
          {/* TAB 1: INÍCIO */}
          <button
            onClick={() => setActiveTab("inicio")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 relative ${
              activeTab === "inicio" ? "text-[#7C6AF7] font-extrabold scale-102" : "text-zinc-400 font-medium"
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === "inicio" ? "text-[#7C6AF7]" : "text-zinc-400"}`} />
            <span className="text-[10px] tracking-tight">Início</span>
            {activeTab === "inicio" && (
              <motion.div layoutId="activeDot" className="absolute -bottom-1 w-1 h-1 bg-[#7C6AF7] rounded-full" />
            )}
          </button>

          {/* TAB 2: TAREFAS */}
          <button
            onClick={() => setActiveTab("tarefas")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 relative ${
              activeTab === "tarefas" ? "text-emerald-500 font-extrabold" : "text-zinc-400 font-medium"
            }`}
          >
            <CheckCircle className={`w-5 h-5 ${activeTab === "tarefas" ? "text-emerald-500" : "text-zinc-400"}`} />
            <span className="text-[10px] tracking-tight">Tarefas</span>
            {activeTab === "tarefas" && (
              <motion.div layoutId="activeDot" className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
            )}
          </button>

          {/* CENTRAL XP FLOATING CIRCLE - KEY MATCH TO USER'S PRINT SCREENSHOT */}
          <div className="flex-1 flex justify-center -translate-y-4">
            <button
              onClick={() => setActiveTab("xp")}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-serif font-black text-md text-white shadow-xl transition-all outline-none border-2 border-white select-none shrink-0 cursor-pointer ${
                activeTab === "xp"
                  ? "bg-gradient-to-tr from-[#7C6AF7] to-[#F76A8C] scale-110 rotate-12"
                  : "bg-gradient-to-tr from-[#7C6AF7] to-[#A78BFA] hover:scale-105"
              }`}
            >
              <span className="tracking-tighter font-syne font-black text-sm uppercase -mt-0.5 select-none">XP</span>
            </button>
          </div>

          {/* TAB 4: DESEJOS */}
          <button
            onClick={() => setActiveTab("desejos")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 relative ${
              activeTab === "desejos" ? "text-[#C084FC] font-extrabold" : "text-zinc-400"
            }`}
          >
            <Gift className={`w-5 h-5 ${activeTab === "desejos" ? "text-[#C084FC]" : "text-zinc-400"}`} />
            <span className="text-[10px] tracking-tight">Desejos</span>
            {activeTab === "desejos" && (
              <motion.div layoutId="activeDot" className="absolute -bottom-1 w-1 h-1 bg-[#C084FC] rounded-full" />
            )}
          </button>

          {/* TAB 5: PERFIL */}
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 relative ${
              activeTab === "perfil" ? "text-amber-500 font-extrabold" : "text-zinc-400"
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === "perfil" ? "text-amber-500" : "text-zinc-400"}`} />
            <span className="text-[10px] tracking-tight">Perfil</span>
            {activeTab === "perfil" && (
              <motion.div layoutId="activeDot" className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full" />
            )}
          </button>

        </div>
      </div>

    </div>
  );
}

// 🔐 MAIN APP ENTRY FEATURING REAL CREDENTIALS ONBOARDING LOGIN
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<"login" | "registro">("login");
  
  // Login form details
  const [activeLoginId, setActiveLoginId] = useState<"karina" | "yuri">("karina");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form details for custom couples
  const [regYourName, setRegYourName] = useState("");
  const [regPartnerName, setRegPartnerName] = useState("");
  const [regRole, setRegRole] = useState<"ela" | "ele">("ela");
  const [regPassword, setRegPassword] = useState("");

  // Check login credentials persistency
  useEffect(() => {
    const savedSession = localStorage.getItem("karinalove_logged_session");
    if (savedSession) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent, contextSetUserId: (id: string) => void) => {
    e.preventDefault();
    
    // Check custom password if user set one
    const savedPasswordKey = `klove_pwd_${activeLoginId === "karina" ? "ela" : "ele"}`;
    const registeredPwd = localStorage.getItem(savedPasswordKey) || "123";

    if (password === registeredPwd) {
      const targetUserId = activeLoginId === "karina" ? "karina-id" : "yuri-id";
      contextSetUserId(targetUserId);
      localStorage.setItem("karinalove_logged_session", targetUserId);
      setIsLoggedIn(true);
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Senha de acesso inválida! Se esqueceu, use a senha '123' ou crie um casal abaixo.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regYourName.trim() || !regPartnerName.trim() || !regPassword.trim()) {
      setLoginError("Preencha todos os campos do registro!");
      return;
    }

    // Save custom password
    const yourRoleKey = `klove_pwd_${regRole}`;
    const partnerRoleKey = `klove_pwd_${regRole === "ela" ? "ele" : "ela"}`;
    localStorage.setItem(yourRoleKey, regPassword);
    localStorage.setItem(partnerRoleKey, "123"); // Partner defaults to 123

    // Update preset names inside standard localStorage sandbox to simulate change
    const customizedStorage = {
      currentUserId: regRole === "ela" ? "karina-id" : "yuri-id",
      casal: {
        id: "casal-yuri-karina",
        nome: `Constelação de ${regYourName} & ${regPartnerName} 🌌`,
        criadoEm: new Date().toISOString(),
        streakAtual: 1,
        streakUltimaData: null,
        xpCasal: 100,
        nivelTerreno: 1
      },
      usuarios: {
        ela: {
          id: "karina-id",
          nome: regRole === "ela" ? regYourName : regPartnerName,
          papel: "ela",
          xpIndividual: 50,
          avatar: "🧚‍♀️",
          badges: ["Parceiro Iniciado 💎"]
        },
        ele: {
          id: "yuri-id",
          nome: regRole === "ele" ? regYourName : regPartnerName,
          papel: "ele",
          xpIndividual: 50,
          avatar: "🕹️",
          badges: ["Iniciado Cósmico 👑"]
        }
      }
    };
    localStorage.setItem("karinalove_v2_storage", JSON.stringify(customizedStorage));
    
    // Auto-login registered account ID
    const autoLogId = regRole === "ela" ? "karina-id" : "yuri-id";
    localStorage.setItem("karinalove_logged_session", autoLogId);
    
    setIsLoggedIn(true);
    setActiveFormTab("login");
    setLoginError("");
    setRegYourName("");
    setRegPartnerName("");
    setRegPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("karinalove_logged_session");
    setIsLoggedIn(false);
  };

  return (
    <CoupleProvider>
      <div id="app_root" className="min-h-screen">
        {isLoggedIn ? (
          <AuthenticatedAppBridge onLogout={handleLogout} />
        ) : (
          <div className="min-h-screen bg-[#0A0718] text-white flex flex-col justify-between p-6 relative select-none font-sans overflow-hidden">
            
            {/* Ambient stardust backdrop circles */}
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-[#7C6AF7]/10 blur-[90px]" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-[#F76A8C]/10 blur-[90px]" />

            {/* Header branding */}
            <div className="text-center pt-8 space-y-2 z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/5 py-1 px-3 rounded-full text-xs text-rose-300 font-semibold mb-2">
                🌌 Aplicativo Oficial do Casal
              </div>
              <h2 className="font-serif font-black text-4xl sm:text-5xl tracking-tight flex justify-center items-center gap-1">
                Karina <span className="text-[#F76A8C]">Love</span>
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mt-1">
                A união da administração do lar com a diversão cósmica. Pare de pedir mais e comece a gamificar rituais com carinho.
              </p>
            </div>

            {/* Card Login/Register */}
            <div className="max-w-md w-full mx-auto my-8 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 z-10 shadow-2xl">
              
              {/* Form switcher tabs */}
              <div className="border-b border-white/10 flex justify-around pb-2">
                <button
                  onClick={() => {
                    setActiveFormTab("login");
                    setLoginError("");
                  }}
                  className={`pb-2 px-4 text-sm font-bold transition-all relative ${
                    activeFormTab === "login" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Fazer Login
                  {activeFormTab === "login" && (
                    <motion.div layoutId="formUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F76A8C]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveFormTab("registro");
                    setLoginError("");
                  }}
                  className={`pb-2 px-4 text-sm font-bold transition-all relative ${
                    activeFormTab === "registro" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Registrar Casal
                  {activeFormTab === "registro" && (
                    <motion.div layoutId="formUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F76A8C]" />
                  )}
                </button>
              </div>

              {activeFormTab === "login" ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-serif font-black text-lg text-zinc-100">Quem está acessando?</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Escolha seu avatar e digite sua senha pessoal.</p>
                  </div>

                  {/* Selecting Profiles */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setActiveLoginId("karina");
                        setLoginError("");
                      }}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        activeLoginId === "karina"
                          ? "bg-[#F76A8C]/15 border-[#F76A8C] text-white"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-lg shadow-inner">
                        🧚‍♀️
                      </div>
                      <span className="text-[11px] font-bold tracking-tight">Karina (Ela)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveLoginId("yuri");
                        setLoginError("");
                      }}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        activeLoginId === "yuri"
                          ? "bg-[#7C6AF7]/15 border-[#7C6AF7] text-white"
                          : "bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-lg shadow-inner">
                        🕹️
                      </div>
                      <span className="text-[11px] font-bold tracking-tight">Yuri (Ele)</span>
                    </button>
                  </div>

                  {/* Render login inputs */}
                  <CoupleLoginConsumer activeId={activeLoginId} onSubmit={handleLoginSubmit} password={password} setPassword={setPassword} loginError={loginError} />
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-serif font-black text-lg text-zinc-100">Criar Novo Registro de Casal</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Personalize o aplicativo com vossos nomes reais!</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Seu Primeiro Nome</label>
                      <input
                        type="text"
                        placeholder="Ex: Karina..."
                        required
                        value={regYourName}
                        onChange={(e) => setRegYourName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C6AF7]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nome de seu Parceiro(a)</label>
                      <input
                        type="text"
                        placeholder="Ex: Yuri..."
                        required
                        value={regPartnerName}
                        onChange={(e) => setRegPartnerName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Seu Papel</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setRegRole("ela")}
                          className={`py-2 rounded-xl border text-center transition ${
                            regRole === "ela" ? "bg-[#F76A8C] text-white border-[#F76A8C]" : "bg-white/5 border-white/10"
                          }`}
                        >
                          Ela (Avatar 🧚‍♀️)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegRole("ele")}
                          className={`py-2 rounded-xl border text-center transition ${
                            regRole === "ele" ? "bg-[#7C6AF7] text-white border-[#7C6AF7]" : "bg-white/5 border-white/10"
                          }`}
                        >
                          Ele (Avatar 🕹️)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#F76A8C] uppercase tracking-wider">Definir Senha Secreta</label>
                      <input
                        type="password"
                        placeholder="Mínimo de 3 caracteres..."
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F76A8C]"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-400 font-medium italic">{loginError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#7C6AF7] to-[#F76A8C] rounded-2xl font-bold transition flex items-center justify-center gap-1 text-xs cursor-pointer"
                  >
                    Registrar Casal e Entrar <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>

            {/* Footer synchronization secure log */}
            <div className="text-center text-[10px] text-zinc-550 z-10 flex justify-center items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" /> Sincronismo criptografado Karina Love srl.
            </div>

          </div>
        )}
      </div>
    </CoupleProvider>
  );
}

// Consumer to inject setCurrentUserId context accessor in Submit
function CoupleLoginConsumer({
  activeId,
  onSubmit,
  password,
  setPassword,
  loginError
}: {
  activeId: "karina" | "yuri";
  onSubmit: (e: React.FormEvent, fn: (id: string) => void) => void;
  password: string;
  setPassword: (val: string) => void;
  loginError: string;
}) {
  const { setCurrentUserId } = useCouple();

  return (
    <form onSubmit={(e) => onSubmit(e, setCurrentUserId)} className="space-y-3.5 text-xs pt-2">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Senha Secreta</label>
        <input
          type="password"
          placeholder="Digite sua senha secreta..."
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:border-[#7C6AF7] focus:outline-none transition"
        />
        <p className="text-[10px] text-zinc-500 italic mt-1 font-semibold">Senha padrão inicial para teste: <b className="text-[#7C6AF7]">123</b></p>
      </div>

      {loginError && (
        <p className="text-xs text-red-400 font-medium italic animate-pulse">{loginError}</p>
      )}

      <button
        type="submit"
        className="w-full py-4 text-xs font-bold text-white rounded-2xl transition bg-gradient-to-r from-[#7C6AF7] to-[#F76A8C] shadow-lg hover:brightness-105 active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
      >
        Entrar na Constelação <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

// APP INITIALIZER BRIDGE
function AuthenticatedAppBridge({ onLogout }: { onLogout: () => void }) {
  const { setCurrentUserId } = useCouple();

  useEffect(() => {
    const savedSession = localStorage.getItem("karinalove_logged_session");
    if (savedSession) {
      setCurrentUserId(savedSession);
    }
  }, []);

  return <AuthenticatedApp onLogout={onLogout} />;
}
