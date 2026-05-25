/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { DiaSemana, CategoriaTarefa, TarefaState } from "../types";
import {
  Sparkles,
  Droplet,
  Heart,
  Plus,
  Compass,
  CheckCircle,
  User,
  Coffee,
  AlertCircle,
  TrendingUp,
  RotateCcw
} from "lucide-react";

export default function HomeTab() {
  const {
    state,
    completeTask,
    addCustomTask,
    waterGarden,
    feedPet,
    petStatus,
    gardenHydration,
    activeGardenStyle,
    activeGarageStyle,
    resetDatabaseState,
  } = useCouple();

  const { currentUserId, casal, usuarios, tarefas, rituais } = state;
  const activeUser = currentUserId === "karina-id" ? usuarios.ela : usuarios.ele;
  const partnerUser = currentUserId === "karina-id" ? usuarios.ele : usuarios.ela;

  const [selectedDia, setSelectedDia] = useState<DiaSemana>("Seg");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<CategoriaTarefa>("Casa");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("karina-id");
  const [newTaskXp, setNewTaskXp] = useState<number>(30);

  // Filter tasks for the selected weekday
  const dailyTasks = tarefas.filter((t) => t.dia === selectedDia);

  const dias: { key: DiaSemana; label: string }[] = [
    { key: "Seg", label: "Seg" },
    { key: "Ter", label: "Ter" },
    { key: "Qua", label: "Qua" },
    { key: "Qui", label: "Qui" },
    { key: "Sex", label: "Sex" },
    { key: "Sab", label: "Sáb" },
    { key: "Dom", label: "Dom" },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addCustomTask(
      newTaskTitle,
      newTaskCategory,
      newTaskAssignee,
      selectedDia,
      newTaskXp
    );
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  // Find high priority "Destaque do Dia" task (first incomplete task for the select weekday, or any uncompleted task)
  const heroTask = tarefas.find(t => !t.concluida && t.responsavel === currentUserId) || tarefas.find(t => !t.concluida);

  // Compute terrain levels
  const getTerrainDetails = (level: number) => {
    switch (level) {
      case 1:
        return {
          title: "Semente de Estrelas 🌱",
          description: "Vocês estão no Nível 1 — O amor está semeando raízes na terra fértil.",
          colorClass: "bg-amber-50/50 border-amber-100",
        };
      case 2:
        return {
          title: "Florescer Inicial 🌸",
          description: "Nível 2 — A horta começou a brotar e as decorações do terreno brotam!",
          colorClass: "bg-emerald-50/50 border-emerald-100",
        };
      case 3:
        return {
          title: "Constelação Vigorosa 🌌",
          description: "Nível 3 — A garagem de jogos e a estufa perfumada expandiram.",
          colorClass: "bg-indigo-50/50 border-indigo-100",
        };
      case 4:
        return {
          title: "Parque das Camélias 🎡",
          description: "Nível 4 — Area de churrasco premium ativa e o pet Pipoca está no auge!",
          colorClass: "bg-purple-50/50 border-purple-100",
        };
      default:
        return {
          title: "Castelo de Sonhos Cósmicos 🏰✨",
          description: "Nível 5 — Área premium de lazer desbloqueada! Vocês alcançaram a harmonia plena.",
          colorClass: "bg-pink-50/50 border-pink-100",
        };
    }
  };

  const terrainInfo = getTerrainDetails(casal.nivelTerreno);

  return (
    <div className="space-y-6" id="home_tab_container">
      
      {/* 🏡 EMOTIONAL HEADER & STREAK (PASSO 3 — Clean & Elegant) */}
      <div className="bg-white p-5 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-4" id="emotional_header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F9A8C9]/35 flex items-center justify-center animate-pulse-heart">
              <span className="text-2xl text-[#F76A8C]">🔥</span>
            </div>
            <div>
              <h2 className="font-serif font-semibold text-xl text-[#2D2060]">
                Sintonia de Casal
              </h2>
              <p className="text-gray text-xs">
                {casal.streakAtual} dias de conexão consecutivos!
              </p>
            </div>
          </div>
          
          {/* Interactive reset state button (Simulator helper) */}
          <button 
            onClick={resetDatabaseState}
            className="p-1.5 text-gray hover:text-[#7C6AF7] rounded-lg hover:bg-[#F0EBFF] transition"
            title="Redefinir simulador"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ProgressBar Terreno */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-1 text-xs text-[#2D2060]">
            <span className="font-syne font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#7C6AF7]" /> Nível do Terreno: <span className="text-[#7C6AF7]">{casal.nivelTerreno}</span>
            </span>
            <span className="font-syne font-bold text-[11px]">{(casal.xpCasal % 500)} / 500 XP</span>
          </div>
          <div className="w-full bg-[#F0EBFF] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#7C6AF7] to-[#C084FC] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (casal.xpCasal % 500) / 5)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ⚡ DESTAQUE DO DIA (PASSO 3 — One Single Action in Spotlight) */}
      <div className="bg-gradient-to-br from-[#1C1340] to-[#0A0718] text-white p-6 rounded-[22px] shadow-[0_4px_20px_rgba(28,19,64,0.15)] relative overflow-hidden" id="daily_highlight">
        <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-5xl">✦</div>
        
        <div className="space-y-3 relative z-10">
          <span className="inline-block bg-[#F76A8C] text-[9px] font-bold text-white tracking-widest uppercase px-2.5 py-0.5 rounded-full">
            Missão Especial do Dia ⭐
          </span>
          
          {heroTask ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-semibold leading-snug text-[#FAF7FF]">
                  {heroTask.titulo}
                </h3>
                <p className="text-xs text-purple-light mt-1">
                  Atribuída a: <b className="text-[#F9A8C9]">{heroTask.responsavel === "karina-id" ? "Karina" : "Yuri"}</b>
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="font-syne text-[#F9A8C9] font-black text-sm">
                  +{heroTask.xp} XP de União
                </div>
                
                {heroTask.responsavel === currentUserId ? (
                  <button
                    onClick={() => completeTask(heroTask.id)}
                    className="bg-gradient-to-r from-[#7C6AF7] to-[#A78BFA] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Concluir Agora ✓
                  </button>
                ) : (
                  <span className="text-xs text-indigo-200 italic">Parceiro agindo...</span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <h3 className="font-serif text-lg text-cream">Todas as obrigações feitas! 🎉</h3>
              <p className="text-xs text-indigo-150">Que tal criar momentos especiais na aba de Rituais ou dar uma passada nos mimos?</p>
            </div>
          )}
        </div>
      </div>

      {/* 🏠 VISUAL TERRAIN (PASSO 3 — Separated Custom Section) */}
      <div className={`p-6 rounded-[22px] border ${terrainInfo.colorClass} shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-4 relative`} id="sandbox_terrain_view">
        <div className="flex justify-between items-center border-b border-[#F0EBFF]/60 pb-2">
          <div>
            <span className="text-[10px] font-bold text-[#7C6AF7] tracking-widest uppercase block">Seu Pedacinho Cósmico</span>
            <h3 className="font-serif font-bold text-xl text-[#2D2060]">
              {terrainInfo.title}
            </h3>
          </div>
          <span className="text-xs font-syne font-bold text-gray">{terrainInfo.description}</span>
        </div>

        {/* Visual elements */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* ELA: O Jardim */}
          <div className="bg-white/85 p-3.5 rounded-2xl border border-[#F0EBFF] relative space-y-3 min-h-[140px] flex flex-col justify-between overflow-hidden">
            {activeGardenStyle === "garden-spring" && <div className="absolute inset-x-0 bottom-0 bg-pink-100/30 h-10 border-t border-pink-200/50" />}
            {activeGardenStyle === "garden-winter" && <div className="absolute inset-x-0 bottom-0 bg-sky-100/30 h-10 border-t border-sky-200/50" />}

            <div className="relative z-10 flex justify-between items-center">
              <span className="text-[11px] font-bold text-[#2D2060]">🌸 Jardim da Karina</span>
              <span className="text-[10px] text-gray">Refúgio</span>
            </div>

            {/* Simulated interactive flower visualization */}
            <div className="relative z-10 h-10 text-center flex items-center justify-center gap-1">
              <span className="text-2xl animate-bounce">✿</span>
              {casal.nivelTerreno >= 2 && <span className="text-2xl">💮</span>}
              {casal.nivelTerreno >= 3 && <span className="text-lg">🌸</span>}
              {casal.nivelTerreno >= 4 && <span className="text-2xl">🌹</span>}
              {activeGardenStyle === "garden-spring" && <span className="text-xs animate-ping">✨</span>}
            </div>

            <div className="relative z-10 flex justify-between items-center border-t border-[#F0EBFF]/70 pt-2 text-[10px]">
              <span className="font-mono text-gray">Água: {gardenHydration}%</span>
              <button
                onClick={waterGarden}
                className="bg-[#FAF7FF] border border-[#F0EBFF] px-2.5 py-1 rounded-xl text-sky-500 font-bold hover:bg-[#F0EBFF] flex items-center gap-1 transition"
              >
                <Droplet className="w-3 h-3 text-sky-500" /> Regar
              </button>
            </div>
          </div>

          {/* ELE: A Garagem */}
          <div className="bg-white/85 p-3.5 rounded-2xl border border-[#F0EBFF] relative space-y-3 min-h-[140px] flex flex-col justify-between overflow-hidden">
            {activeGarageStyle === "garage-neon" && <div className="absolute inset-x-0 bottom-0 bg-indigo-950/20 h-10 border-t border-purple-500/50" />}

            <div className="relative z-10 flex justify-between items-center">
              <span className="text-[11px] font-bold text-[#2D2060]">🔧 Garagem do Yuri</span>
              <span className="text-[10px] text-gray">Recanto</span>
            </div>

            {/* Simulated tool objects */}
            <div className="relative z-10 h-10 text-center flex items-center justify-center gap-1">
              <span className="text-2xl">🛠️</span>
              {casal.nivelTerreno >= 3 && <span className="text-xl animate-spin">⚙️</span>}
              {casal.nivelTerreno >= 4 && <span className="text-2xl">🎮</span>}
              {activeGarageStyle === "garage-neon" && <span className="text-xs">🕹️</span>}
            </div>

            <div className="relative z-10 flex justify-between items-center border-t border-[#F0EBFF]/70 pt-2 text-[10px]">
              <span className="font-mono text-gray-400">Objetos: {casal.nivelTerreno}</span>
              <span className="text-[9px] uppercase font-bold text-[#7C6AF7] bg-[#F0EBFF] px-2 py-0.5 rounded">
                Ativo
              </span>
            </div>
          </div>

        </div>

        {/* Pet Pipoca Container */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-[#F0EBFF] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🐱</span>
            <div>
              <h4 className="font-bold text-xs text-[#2D2060]">Mascote do Casal: Pipoca 🐾</h4>
              <p className="text-[10px] text-gray mt-0.5">Humor: <span className="text-emerald-500 font-bold">{petStatus}</span></p>
            </div>
          </div>
          <button
            onClick={feedPet}
            className="text-[11px] bg-[#FAF7FF] hover:bg-[#F0EBFF] border border-[#F0EBFF] text-[#F76A8C] font-semibold py-1.5 px-3 rounded-xl transition"
          >
            🍎 Alimentar Pipoca
          </button>
        </div>
      </div>

      {/* 📅 TAREFAS DIÁRIAS (PASSO 3 — Spacious, clean, clear) */}
      <div className="bg-white p-6 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-5" id="daily_chores_section">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2D2060]">
              Obrigações e Carinhos
            </h3>
            <p className="text-xs text-gray mt-1">Checklist semanal com atribuição por parceiro</p>
          </div>
          
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold text-xs rounded-xl py-2 px-3.5 flex items-center gap-1 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        {/* Days of Week Tab Buttons */}
        <div className="flex justify-between items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {dias.map((d) => {
            const isSelected = selectedDia === d.key;
            const undoneCount = tarefas.filter(t => t.dia === d.key && !t.concluida).length;
            
            return (
              <button
                key={d.key}
                onClick={() => setSelectedDia(d.key)}
                className={`py-2 px-3.5 rounded-xl border font-bold text-xs transition relative flex-1 text-center select-none cursor-pointer ${
                  isSelected
                    ? "bg-[#7C6AF7] text-white border-[#7C6AF7]"
                    : "bg-[#FAF7FF] text-[#2D2060] border-[#F0EBFF] hover:bg-[#F0EBFF]"
                }`}
              >
                <span>{d.label}</span>
                {undoneCount > 0 && (
                  <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#F76A8C]'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Add custom chore form */}
        {showAddTask && (
          <form onSubmit={handleCreateTask} className="p-4 bg-[#FAF7FF] rounded-2xl border border-[#F0EBFF] space-y-3">
            <h4 className="text-xs font-bold text-[#2D2060] tracking-wider uppercase">Cadastrar Tarefa para a {selectedDia}</h4>
            
            <div className="space-y-2.5">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pagar a internet, lavar os banheiros..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs text-[#2D2060] outline-none animate-fade-in"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] text-gray uppercase font-bold mb-0.5">Responsável</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs text-gray"
                  >
                    <option value="karina-id">Karina (Ela)</option>
                    <option value="yuri-id">Yuri (Ele)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray uppercase font-bold mb-0.5">Tag de Categoria</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as CategoriaTarefa)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl py-2 px-3 text-xs text-gray"
                  >
                    <option value="Casa">🏠 Casa</option>
                    <option value="Compras">🛒 Compras</option>
                    <option value="Financeiro">💰 Financeiro</option>
                    <option value="Outro">✨ Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#F76A8C] hover:bg-[#F76A8C]/95 text-white text-xs font-bold py-2 rounded-xl transition"
                >
                  Criar Tarefa
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="border border-gray-150 py-2 px-4 rounded-xl text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tasks Checklist */}
        <div className="space-y-2.5">
          {dailyTasks.length === 0 ? (
            <div className="p-6 bg-[#FAF7FF] rounded-2xl border border-[#F0EBFF] text-center">
              <span className="text-xl">☕</span>
              <p className="text-xs text-gray font-medium mt-1">Tudo em paz! Nenhuma missão cadastrada para esta {selectedDia}.</p>
            </div>
          ) : (
            dailyTasks.map((t) => {
              const isMine = t.responsavel === currentUserId;
              const assignName = t.responsavel === "karina-id" ? "Karina" : "Yuri";

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    t.concluida
                      ? "bg-gray-50/50 border-gray-100 opacity-60"
                      : "bg-white border-[#F0EBFF] hover:border-[#7C6AF7]/20 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeTask(t.id)}
                      disabled={t.concluida || !isMine}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                        t.concluida
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isMine
                          ? "border-[#7C6AF7] hover:bg-[#7C6AF7]/10"
                          : "border-gray-light bg-[#FAF7FF]"
                      }`}
                    >
                      {t.concluida && <span className="text-[10px] font-bold">✓</span>}
                    </button>

                    <div>
                      <h4 className={`text-xs font-bold ${t.concluida ? "line-through text-gray" : "text-[#2D2060]"}`}>
                        {t.titulo}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-[#FAF7FF] px-1.5 py-0.5 rounded text-gray uppercase font-mono tracking-wider font-bold">
                          {t.tag}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                          t.responsavel === "karina-id" 
                            ? "bg-pink-50 border-[#F9A8C9]/30 text-[#F76A8C]" 
                            : "bg-[#FAF7FF] border-[#F0EBFF] text-[#7C6AF7]"
                        }`}>
                          {assignName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-syne font-semibold text-[#7C6AF7]">
                    +{t.xp} XP
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
