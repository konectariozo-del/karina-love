/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { DayOfWeek, TaskCategory, TaskState } from "../types";
import {
  Sparkles,
  Droplet,
  Heart,
  Plus,
  Compass,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  User,
  Activity,
  Smile,
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
  } = useCouple();

  const { currentUserId, home, users, tasks } = state;
  const activeUser = currentUserId === "karina-id" ? users.ela : users.ele;
  const partnerUser = currentUserId === "karina-id" ? users.ele : users.ela;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("segunda");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>("casa");
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>("karina-id");
  const [newTaskXp, setNewTaskXp] = useState<number>(30);

  // Filter tasks for the selected weekday
  const dailyTasks = tasks.filter((t) => t.dayOfWeek === selectedDay);

  const days: { key: DayOfWeek; label: string }[] = [
    { key: "segunda", label: "Seg" },
    { key: "terca", label: "Ter" },
    { key: "quarta", label: "Qua" },
    { key: "quinta", label: "Qui" },
    { key: "sexta", label: "Sex" },
    { key: "sabado", label: "Sáb" },
    { key: "domingo", label: "Dom" },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addCustomTask(
      newTaskTitle,
      newTaskCategory,
      newTaskAssignee,
      selectedDay,
      newTaskXp
    );
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  // Compute terrain level descriptions and styles
  const getTerrainDetails = (level: number) => {
    switch (level) {
      case 1:
        return {
          title: "Terreno Inicial Baldo",
          description: "Nível 1 — Comecem a regar e a construir!",
          colorClass: "bg-amber-100/60 border-amber-200",
        };
      case 2:
        return {
          title: "Casa Básica e Grama Inicial",
          description: "Nível 2 — A horta começou a brotar!",
          colorClass: "bg-emerald-50/75 border-emerald-100",
        };
      case 3:
        return {
          title: "Telhado, Janelas e Horta Vigorosa",
          description: "Nível 3 — As flores estão perfumando o ar.",
          colorClass: "bg-indigo-50/70 border-indigo-100",
        };
      case 4:
        return {
          title: "Setup de Games, Churrasqueira e Oficina",
          description: "Nível 4 — A garagem está quase completa!",
          colorClass: "bg-purple-50/70 border-purple-100",
        };
      default:
        return {
          title: "Piscina e Mansão dos Sonhos",
          description: "Nível 5 — Área premium de lazer desbloqueada!",
          colorClass: "bg-pink-50/60 border-pink-100",
        };
    }
  };

  const terrainInfo = getTerrainDetails(home.terrainLevel);

  // Generate particle coordinate arrays for visual appeal
  const renderFlowers = () => {
    const flowerCount = home.terrainLevel * 3;
    const colors = ["bg-pink-400", "bg-rose-400", "bg-purple-400", "bg-amber-400"];
    const styles = [
      activeGardenStyle === "garden-spring" ? "scale-125 shadow-pink-200 shadow-md" : "",
      activeGardenStyle === "garden-winter" ? "bg-cyan-200 opacity-60 border-white border text-white" : "",
    ];
    
    return Array.from({ length: flowerCount }).map((_, i) => {
      const top = (15 + (i * 27) % 65) + "%";
      const left = (10 + (i * 31) % 75) + "%";
      const color = colors[i % colors.length];
      return (
        <span
          key={`flower-${i}`}
          className={`absolute w-3 h-3 rounded-full ${color} animate-pulse ${styles[i % styles.length]}`}
          style={{ top, left, zIndex: 10 }}
        >
          <span className="absolute -inset-0.5 rounded-full border border-white opacity-40"></span>
        </span>
      );
    });
  };

  const renderGarageTools = () => {
    const gearCount = home.terrainLevel * 2;
    const colors = ["bg-slate-400", "bg-zinc-600", "bg-yellow-500", "bg-blue-400"];
    return Array.from({ length: gearCount }).map((_, i) => {
      const top = (20 + (i * 23) % 60) + "%";
      const right = (10 + (i * 37) % 75) + "%";
      const color = colors[i % colors.length];
      return (
        <span
          key={`gear-${i}`}
          className={`absolute w-3.5 h-3.5 rounded ${color} opacity-80`}
          style={{ top, right, zIndex: 10 }}
        >
          <span className="block text-[6px] font-bold text-white text-center">⚙️</span>
        </span>
      );
    });
  };

  return (
    <div className="space-y-6" id="home_tab_container">
      {/* Dynamic Header Badge */}
      <div className="p-4 bg-white rounded-3xl border border-[#FAF7FF] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="streak_status_card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100 animate-pulse-heart">
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h3 className="font-syne font-extrabold text-lg text-[#2D2060]">
              Streak de {home.streak} Dias!
            </h3>
            <p className="text-xs text-gray-500">
              {currentUserId === "karina-id" 
                ? "Seu esforço foi visto hoje ✨ continue alimentando o jardim!"
                : "Sua parceira fez 2 missões hoje. Você tá perdendo! 👀"}
            </p>
          </div>
        </div>
        
        {/* Terrain Level Badge with Ring */}
        <div className="flex items-center gap-2 bg-[#FAF7FF] px-4 py-2 rounded-2xl border border-[#F0EBFF]">
          <Compass className="w-5 h-5 text-[#8b5cf6]" />
          <span className="text-xs font-semibold text-[#2D2060]">
            Nível do Terreno: <b className="text-[#7C6AF7] text-sm font-syne">{home.terrainLevel}</b>
          </span>
          <div className="w-12 bg-gray-200 rounded-full h-1.5 ml-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(home.terrainXp % 500) / 5}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-mono text-gray-400">{(home.terrainXp % 500)}/500 XP</span>
        </div>
      </div>

      {/* VIRTUAL TERRAIN BOARD */}
      <div className={`p-6 rounded-3xl border ${terrainInfo.colorClass} shadow-md overflow-hidden relative min-h-[340px] flex flex-col justify-between`} id="terrain_visualizer">
        {/* Background Starry Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none text-indigo-900 font-serif text-[10px] tracking-widest leading-loose">
          ✦   *      ✧   .     *  ✦   ✧
            .   ✦   .  *      *   .     ✧
        </div>
        
        {/* Cosmic Theme Decor for higher levels */}
        {home.terrainLevel >= 4 && (
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#C084FC]/25 rounded-full blur-2xl pointer-events-none"></div>
        )}

        {/* Home Level Label Banner */}
        <div className="z-10 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-100 shadow-sm inline-flex items-center gap-2 self-start">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-syne font-extrabold text-[#2D2060]">
            {terrainInfo.title}
          </span>
        </div>

        {/* Divided Visual Scene */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch justify-between relative py-6 z-10">
          
          {/* DELA: O Jardim (Left Column) */}
          <div className="flex-1 min-h-[160px] rounded-2xl bg-white/60 backdrop-blur-sm border border-pink-100 p-4 relative flex flex-col justify-between overflow-hidden">
            {/* Seasonal background decor */}
            {activeGardenStyle === "garden-spring" ? (
              <div className="absolute inset-0 bg-pink-50/40 border-pink-200 border-2 pointer-events-none rounded-xl" />
            ) : activeGardenStyle === "garden-winter" ? (
              <div className="absolute inset-0 bg-sky-50/40 border-sky-100 border-2 pointer-events-none rounded-xl" />
            ) : null}

            <div className="flex justify-between items-center relative z-10 border-b border-pink-150/40 pb-2">
              <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                🌸 Jardim da {users.ela.displayName}
              </span>
              <span className="text-[10px] text-gray-500">Nível {home.terrainLevel >= 3 ? "Florescente 🥕" : "Brotando 🌾"}</span>
            </div>

            {/* Render Flower Particles based on level */}
            <div className="relative h-20 w-full my-1">
              {renderFlowers()}
              {home.terrainLevel >= 3 && (
                <div className="absolute bottom-1 left-2 flex gap-1 items-center bg-sand-200 p-1 rounded-md text-[10px]">
                  <span>🥕</span>
                  <span>🧅</span>
                  <span>🥬</span>
                </div>
              )}
              {home.terrainLevel >= 4 && (
                <div className="absolute top-2 right-2 text-lg">💡</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 relative z-10 border-t border-pink-50">
              <span className="text-[10px] text-gray-500 font-mono">Hidratação: {gardenHydration}%</span>
              <button 
                onClick={waterGarden}
                className="bg-sky-50 hover:bg-sky-100 text-sky-500 text-xs px-2.5 py-1 rounded-xl border border-sky-100 flex items-center gap-1 transition"
              >
                <Droplet className="w-3.5 h-3.5 fill-sky-500" />
                Regar
              </button>
            </div>
          </div>

          {/* VIRTUAL PET IN THE MIDDLE */}
          <div className="flex flex-col items-center justify-center px-4 self-center relative py-2 min-w-[100px]" id="couple_pet_container">
            <div className="w-14 h-14 bg-[#FAF7FF] rounded-full border-2 border-[#7C6AF7] flex items-center justify-center shadow-md relative animate-bounce z-10">
              <span className="text-3xl">🐱</span>
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            </div>
            <div className="mt-1 bg-white px-2.5 py-0.5 rounded-full border border-[#FAF7FF] shadow-xs z-10 text-center">
              <p className="text-[9px] font-extrabold text-[#7C6AF7] uppercase tracking-wide">Pipoca (Pet)</p>
              <p className="text-[8px] text-gray-400">Status: <b className="text-emerald-500">{petStatus}</b></p>
            </div>
            <button 
              onClick={feedPet}
              className="mt-1.5 bg-[#FAF7FF] hover:bg-pink-50 text-[10px] text-pink-500 border border-pink-100 rounded-full px-2.5 py-0.5"
            >
              🐾 Alimentar
            </button>
          </div>

          {/* DELE: A Garagem (Right Column) */}
          <div className="flex-1 min-h-[160px] rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-100 p-4 relative flex flex-col justify-between overflow-hidden">
            {/* Style override active style */}
            {activeGarageStyle === "garage-neon" ? (
              <div className="absolute inset-0 bg-[#0A0718]/40 border-[#7C6AF7] border-2 pointer-events-none rounded-xl" />
            ) : null}

            <div className="flex justify-between items-center relative z-10 border-b border-purple-150/40 pb-2">
              <span className="text-xs font-bold text-[#7C6AF7] flex items-center gap-1">
                🛠️ Garagem/Oficina do {users.ele.displayName}
              </span>
              <span className="text-[10px] text-gray-500">Nível {home.terrainLevel>=4 ? "Setup Gamer 🕹️" : "Oficina 🛠️"}</span>
            </div>

            {/* Render Gear Particles / BBQ / Game Setup based on level */}
            <div className="relative h-20 w-full my-1">
              {renderGarageTools()}
              {home.terrainLevel >= 3 && (
                <div className="absolute bottom-1 right-2 text-xl filter drop-shadow animate-pulse" title="Churrasqueira">🍖🔥</div>
              )}
              {home.terrainLevel >= 4 && (
                <div className="absolute top-2 left-2 text-lg">🕹️💻</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 relative z-10 border-t border-purple-50">
              <span className="text-[10px] text-gray-500 font-mono">Construções: {home.terrainLevel}/5</span>
              <span className="text-[10px] bg-slate-150 text-slate-600 px-2.5 py-0.5 rounded-full border border-gray-100 font-medium">
                {home.terrainLevel >= 4 ? "Setup Gamer ✅" : home.terrainLevel >= 3 ? "Churrasqueira ✅" : "Toda Ativa 🛠️"}
              </span>
            </div>
          </div>

        </div>

        {/* Motivational Quote or Subtext */}
        <p className="text-center text-[10px] text-gray-500 italic mt-2 z-10">
          "As conquistas dele liberam as suas decorações, e vice-versa. União é progresso."
        </p>
      </div>

      {/* WEEK DAY AGENDA & CHORES CHECKLIST */}
      <div className="bg-white p-6 rounded-3xl border border-[#F0EBFF] shadow-sm space-y-6" id="tasks_agenda_panel">
        
        {/* Header and Add Task */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#2d2060]">
              Agenda da Semana
            </h3>
            <p className="text-xs text-gray-500">Selecione o dia para mapear as missões residenciais</p>
          </div>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/90 text-white rounded-2xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Day Selector Buttons */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar" id="day_scroller">
          {days.map((day) => {
            const isSelected = selectedDay === day.key;
            
            // Check count of incomplete tasks for this day
            const taskOnDay = tasks.filter((t) => t.dayOfWeek === day.key);
            const pendingCount = taskOnDay.filter((t) => !t.completed).length;

            return (
              <button
                key={`day-${day.key}`}
                onClick={() => setSelectedDay(day.key)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center gap-1 relative ${
                  isSelected
                    ? "bg-[#2D2060] text-white border-[#2D2060] shadow-md"
                    : "bg-[#FAF7FF] text-[#2D2060] border-[#F0EBFF] hover:bg-[#F0EBFF]"
                }`}
              >
                {day.label}
                {pendingCount > 0 && (
                  <span className={`w-2 h-2 rounded-full absolute top-1 right-1 ${isSelected ? "bg-pink-400" : "bg-[#7C6AF7]"}`}></span>
                )}
              </button>
            );
          })}
        </div>

        {/* New Task Inline Form Container */}
        {showAddTask && (
          <form onSubmit={handleCreateTask} className="p-4 bg-[#FAF7FF] rounded-2xl border border-[#F0EBFF] space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold text-[#2D2060] uppercase tracking-wider">Registrar Nova Missão Gamificada</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Nome da Tarefa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tirar o lixoReciclável, Pagar o gás"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#7C6AF7]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Responsável</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                >
                  <option value="karina-id">Karina (Ela)</option>
                  <option value="yuri-id">Yuri (Ele)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Categoria de Tag</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                >
                  <option value="casa">🏠 Casa / Limpeza</option>
                  <option value="compras">🛒 Compras / Logística</option>
                  <option value="financeiro">💰 Financeiro / Contas</option>
                  <option value="outro">✨ Outros Afetivos</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Recompensa (Valor XP)</label>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={newTaskXp}
                  onChange={(e) => setNewTaskXp(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#F76A8C] text-white hover:bg-[#F76A8C]/90 rounded-xl py-2 px-4 font-bold text-xs transition"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 p-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Chores Checklist */}
        <div className="space-y-3" id="agenda_tasks_list">
          {dailyTasks.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <span className="text-2xl block mb-1">🍿</span>
              <p className="text-xs text-gray-400 font-medium">Nenhuma tarefa pendente para esta {selectedDay}!</p>
              <p className="text-[10px] text-gray-400 italic">Espaço livre para focar inteiramente em rituais.</p>
            </div>
          ) : (
            dailyTasks.map((task) => {
              const isOwner = task.assigneeId === currentUserId;
              const assigneeName = task.assigneeId === "karina-id" ? "Karina" : "Yuri";
              
              // Color tags
              const categoryEmojis: Record<TaskCategory, string> = {
                casa: "🏠",
                compras: "🛒",
                financeiro: "💰",
                outro: "✨",
              };

              return (
                <div
                  key={task.id}
                  className={`flex justify-between items-center p-3.5 rounded-2xl border transition ${
                    task.completed
                      ? "bg-gray-50/60 border-gray-100 opacity-65"
                      : "bg-white border-[#F0EBFF] hover:border-violet-100 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Tick Button */}
                    <button
                      onClick={() => completeTask(task.id)}
                      disabled={task.completed}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? "bg-emerald-500 border-emerald-500 text-white cursor-not-allowed"
                          : isOwner
                          ? "border-[#7C6AF7] hover:bg-[#7C6AF7]/10"
                          : "border-gray-200 cursor-not-allowed"
                      }`}
                      title={isOwner ? "Clique para concluir tarefa" : `Tarefa delegada ao parceiro`}
                    >
                      {task.completed ? (
                        <span className="text-xs">✓</span>
                      ) : isOwner ? (
                        <span className="text-[#7C6AF7] text-[10px] opacity-0 hover:opacity-100 font-black">✓</span>
                      ) : null}
                    </button>

                    <div>
                      <p className={`text-xs font-bold ${task.completed ? "line-through text-gray-400" : "text-[#2D2060]"}`}>
                        {task.title}
                      </p>
                      
                      {/* Meta Information Tags */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded-md text-gray-500 uppercase font-mono font-bold tracking-wider">
                          {categoryEmojis[task.category]} {task.category}
                        </span>
                        
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          task.assigneeId === "karina-id" 
                            ? "bg-pink-50 border-pink-100 text-pink-500 font-bold" 
                            : "bg-purple-50 border-purple-100 text-[#7C6AF7] font-bold"
                        }`}>
                          <User className="w-2.5 h-2.5" />
                          {assigneeName} {isOwner && "(Você)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* XP Value Reward display */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-syne font-extrabold text-[#7C6AF7] bg-[#F0EBFF] px-2.5 py-1 rounded-xl">
                      +{task.xpValue} XP
                    </span>
                    {!isOwner && !task.completed && (
                      <span className="text-[8px] text-pink-500 italic">Troca de tarefa disponível</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
