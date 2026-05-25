/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { Gift, RefreshCw, Plus, Check, X, ShieldAlert, BadgeInfo } from "lucide-react";

export default function RecompensasTab() {
  const {
    state,
    addCustomReward,
    redeemReward,
    proposeTrade,
    respondToTrade,
  } = useCouple();

  const { currentUserId, rewards, tasks, proposals, users } = state;

  const isEla = currentUserId === "karina-id";
  const userObj = isEla ? users.ela : users.ele;
  const partnerObj = isEla ? users.ele : users.ela;

  // Form states
  const [showAddReward, setShowAddReward] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardXp, setNewRewardXp] = useState<number>(100);

  // Proposal Form states
  const [showProposeTrade, setShowProposeTrade] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [selectedRewardId, setSelectedRewardId] = useState<string>("");

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    addCustomReward(newRewardTitle, newRewardXp, currentUserId);
    setNewRewardTitle("");
    setShowAddReward(false);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !selectedRewardId) return;
    proposeTrade(selectedTaskId, selectedRewardId);
    setSelectedTaskId("");
    setSelectedRewardId("");
    setShowProposeTrade(false);
  };

  // Filter tasks belonging only to the other partner that are not completed yet
  const partnerIncompleteTasks = tasks.filter(
    (t) => t.assigneeId === partnerObj.id && !t.completed
  );

  // Filter rewards configured by me (current active user)
  const myRewards = rewards.filter((r) => r.assigneeId === currentUserId);
  const partnerRewards = rewards.filter((r) => r.assigneeId !== currentUserId);

  // Active proposals sent to me from my partner
  const incomingProposals = proposals.filter(
    (p) => p.receiverId === currentUserId && p.status === "pending"
  );

  // Outgoing pending proposals
  const outgoingProposals = proposals.filter(
    (p) => p.proposerId === currentUserId && p.status === "pending"
  );

  return (
    <div className="space-y-6" id="rewards_tab_container">
      
      {/* Top Banner introducing XP currency status */}
      <div className="bg-gradient-to-r from-[#7C6AF7] to-[#C084FC] p-6 rounded-3xl text-white flex justify-between items-center shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wide">
            Carteira Espacial de Pontos
          </span>
          <h3 className="font-serif font-bold text-2xl">
            Suas Moedas de Progresso
          </h3>
          <p className="text-xs text-indigo-100 italic">
            Acumule XP concluindo obrigações para sacar mimos merecidos.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-indigo-150 uppercase tracking-wide font-medium">Seu XP Disponível</p>
          <p className="text-4xl font-syne font-black text-pink-300">
            {userObj.xp} <span className="text-sm font-sans font-medium text-white">XP</span>
          </p>
          <p className="text-[9px] text-indigo-100">{userObj.displayName} ({userObj.badge})</p>
        </div>
      </div>

      {/* DETALHE TROCAS NEGOCIADAS (Chore swapping panel) */}
      <div className="bg-white p-6 rounded-3xl border border-[#F0EBFF] shadow-sm space-y-4" id="negotiated_trade_hub">
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#2D2060]">
              Trocas Negociadas 🔄
            </h3>
            <p className="text-xs text-gray-550">
              Pare de cobrar! Se a tarefa do outro estiver pesando, proponha assumi-la em troca de um prêmio.
            </p>
          </div>
          <button
            onClick={() => setShowProposeTrade(!showProposeTrade)}
            className="bg-yellow-500 hover:bg-yellow-650 text-[#0A0718] text-xs font-bold rounded-xl px-4 py-2 transition flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Propor Troca
          </button>
        </div>

        {/* Propose trade inline workflow */}
        {showProposeTrade && (
          <form onSubmit={handleSendProposal} className="p-4 bg-yellow-50/70 border border-yellow-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-[#2D2060] uppercase tracking-wider flex items-center gap-1">
              <BadgeInfo className="w-4 h-4 text-yellow-500" />
              Lançar Acordo de Cooperação
            </h4>

            {partnerIncompleteTasks.length === 0 ? (
              <p className="text-xs text-gray-500 bg-white p-3 rounded-xl border border-dashed border-gray-200">
                Seu parceiro não tem nenhuma tarefa pendente para você negociar! Bom trabalho para os dois. ✨
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                <div>
                  <label className="block text-[10px] text-[#2D2060] font-bold mb-1">
                    1. Escolha a tarefa dele p/ você fazer:
                  </label>
                  <select
                    required
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                  >
                    <option value="">-- Selecione uma Tarefa dele --</option>
                    {partnerIncompleteTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.dayOfWeek}] {t.title} (+{t.xpValue} XP)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-[#2D2060] font-bold mb-1">
                    2. Oferta: Qual recompensa sua você deseja liberar:
                  </label>
                  <select
                    required
                    value={selectedRewardId}
                    onChange={(e) => setSelectedRewardId(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                  >
                    <option value="">-- Selecione uma Recompensa requisitada --</option>
                    {myRewards.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.xpRequired} XP)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {partnerIncompleteTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!selectedTaskId || !selectedRewardId}
                  className="bg-[#2D2060] text-white hover:bg-[#2D2060]/90 rounded-xl py-2 px-5 font-bold text-xs transition disabled:opacity-50"
                >
                  Confirmar Proposta 🔥
                </button>
                <button
                  type="button"
                  onClick={() => setShowProposeTrade(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-3"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        )}

        {/* Incoming / Outgoing Proposals displays */}
        <div className="space-y-2">
          
          {/* Incoming proposals from counterpart */}
          {incomingProposals.map((prop) => {
            const proposerName = prop.proposerId === "karina-id" ? "Karina" : "Yuri";
            const task = tasks.find((t) => t.id === prop.taskId);
            const reward = rewards.find((r) => r.id === prop.rewardId);

            return (
              <div key={prop.id} className="p-4 bg-pink-50/50 border border-pink-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-pulse">
                <div className="space-y-1">
                  <span className="text-[9px] bg-pink-100 text-pink-500 rounded px-1.5 py-0.5 font-bold">PROPOSTA RECEBIDA</span>
                  <p className="text-xs text-gray-700">
                    <b>{proposerName}</b> oferece assumir sua tarefa <b>"{task?.title || 'Fazer Chores'}"</b> se você aceitar liberar o desejo dele: <b>"{reward?.title || 'Recompensa'}"</b>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToTrade(prop.id, true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Aceitar
                  </button>
                  <button
                    onClick={() => respondToTrade(prop.id, false)}
                    className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-xl text-xs font-bold transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Outgoing proposals awaiting partner approval */}
          {outgoingProposals.map((prop) => {
            const task = tasks.find((t) => t.id === prop.taskId);
            const reward = rewards.find((r) => r.id === prop.rewardId);

            return (
              <div key={prop.id} className="p-3 bg-gray-50 border border-gray-250 border-dashed rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-[#FAF7FF] border border-gray-150 text-gray-450 px-1.5 py-0.5 rounded font-bold font-mono uppercase">Enviado</span>
                  <p className="text-[11px] text-gray-450">
                    Aguardando {partnerObj.displayName} aceitar trocar <b>"{task?.title}"</b> pela recompensa <b>"{reward?.title}"</b>.
                  </p>
                </div>
              </div>
            );
          })}

          {incomingProposals.length === 0 && outgoingProposals.length === 0 && (
            <p className="text-[10px] text-gray-450 italic text-center py-2 bg-gray-50/50 rounded-xl">
              Nenhuma negociação em aberto no momento. Tudo em paz doméstica! 😄
            </p>
          )}

        </div>

      </div>

      {/* POOLS OF CUSTOM DESIRES AND REWARDS */}
      <div className="space-y-4" id="rewards_pool_workspace">
        
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-2xl text-[#2D2060]">
              Mimos Configuráveis 🎁
            </h3>
            <p className="text-xs text-gray-550">
              Cadastre desejos que estimulam o carinho e o espírito esportivo.
            </p>
          </div>
          <button
            onClick={() => setShowAddReward(!showAddReward)}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/90 text-white text-xs font-bold rounded-xl px-4 py-2 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Desejo
          </button>
        </div>

        {/* Add custom reward form overlay / expandable */}
        {showAddReward && (
          <form onSubmit={handleCreateReward} className="p-4 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl space-y-3">
            <h4 className="text-xs font-extrabold text-[#2D2060] uppercase tracking-wider">Novo Mimo</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Título do Mimo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Massagem de 30min, Isenção da Louça por 2 dias"
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Custo em XP p/ desbloquear</label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={newRewardXp}
                  onChange={(e) => setNewRewardXp(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-[#F76A8C] text-white hover:bg-[#F76A8C]/90 rounded-xl py-2 px-5 font-bold text-xs transition"
              >
                Cadastrar Desejo ⭐️
              </button>
              <button
                type="button"
                onClick={() => setShowAddReward(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-3"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Display grids split: MY DESIRES vs PARTNER DESIRES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* My desires */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-pink-600 uppercase tracking-widest border-b border-pink-100 pb-1 flex items-center justify-between">
              <span>Seus Desejos Disponíveis</span>
              <span className="text-[10px] lowercase font-normal text-gray-400">configurados por você</span>
            </h4>

            {myRewards.length === 0 ? (
              <p className="text-xs p-4 text-center bg-gray-50 rounded-2xl border text-gray-400 italic">Cadastre desejos para incentivá-lo a cooperar!</p>
            ) : (
              myRewards.map((reward) => {
                const isAffordable = userObj.xp >= reward.xpRequired;
                
                return (
                  <div key={reward.id} className="p-4 bg-white border border-[#F0EBFF] hover:border-pink-100 rounded-2xl space-y-3.5 relative shadow-2xs">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-serif font-bold text-md text-[#2D2060]">
                          {reward.title}
                        </h5>
                        <p className="text-[10px] text-pink-500 font-mono font-bold uppercase mt-0.5">
                          Custo: {reward.xpRequired} XP
                        </p>
                      </div>

                      <button
                        onClick={() => redeemReward(reward.id)}
                        disabled={!isAffordable}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                          isAffordable
                            ? "bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white shadow-xs"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Resgatar
                      </button>
                    </div>

                    {/* Progress slider bar towards reward */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-1 inline-flex overflow-hidden">
                        <div
                          className="bg-[#7C6AF7] h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (userObj.xp / reward.xpRequired) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-gray-400">
                        <span>XP Atual: {userObj.xp}</span>
                        <span>Progresso: {Math.round(Math.min(100, (userObj.xp / reward.xpRequired) * 100))}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Partner wishes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest border-b border-purple-100 pb-1 flex items-center justify-between">
              <span>Desejos do Parceiro</span>
              <span className="text-[10px] lowercase font-normal text-gray-400">desbloqueia se ele conquistar</span>
            </h4>

            {partnerRewards.length === 0 ? (
              <p className="text-xs p-4 text-center bg-gray-50 rounded-2xl border text-gray-400 italic">O parceiro ainda não cadastrou nenhum mimo.</p>
            ) : (
              partnerRewards.map((reward) => {
                const partnerAffordable = partnerObj.xp >= reward.xpRequired;
                
                return (
                  <div key={reward.id} className="p-4 bg-[#FAF7FF]/50 border border-gray-150/60 rounded-2xl space-y-3 relative">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-sans font-medium text-xs text-gray-500">
                          {reward.title}
                        </h5>
                        <p className="text-[9px] text-purple-500 font-bold uppercase">
                          Custo: {reward.xpRequired} XP
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold ${
                        partnerAffordable
                          ? "bg-emerald-50 text-emerald-500 border border-emerald-100"
                          : "bg-gray-105 text-gray-450"
                      }`}>
                        {partnerAffordable ? "Pode resgatar" : "Falta XP"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-1 inline-flex overflow-hidden">
                        <div
                          className="bg-[#7C6AF7] h-1.5 rounded-full opacity-60"
                          style={{ width: `${Math.min(100, (partnerObj.xp / reward.xpRequired) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-gray-400">
                        <span>XP de {partnerObj.displayName}: {partnerObj.xp}</span>
                        <span>Meta: {reward.xpRequired} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
