/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useCouple } from "../context/CoupleContext";
import { CategoriaTarefa } from "../types";
import { Gift, RefreshCw, Plus, Check, X, ShieldAlert, BadgeInfo } from "lucide-react";

export default function RecompensasTab() {
  const {
    state,
    addCustomReward,
    redeemReward,
    proposeTrade,
    respondToTrade,
  } = useCouple();

  const { currentUserId, recompensas, tarefas, trocas, usuarios } = state;

  const isEla = currentUserId === "karina-id";
  const userObj = isEla ? usuarios.ela : usuarios.ele;
  const partnerObj = isEla ? usuarios.ele : usuarios.ela;

  // Form states
  const [showAddReward, setShowAddReward] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardXp, setNewRewardXp] = useState<number>(100);

  // Proposal Form states
  const [showProposeTrade, setShowProposeTrade] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [swapOfferedReward, setSwapOfferedReward] = useState<string>("");

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    addCustomReward(newRewardTitle, newRewardXp, currentUserId);
    setNewRewardTitle("");
    setShowAddReward(false);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !swapOfferedReward.trim()) return;
    proposeTrade(selectedTaskId, swapOfferedReward);
    setSelectedTaskId("");
    setSwapOfferedReward("");
    setShowProposeTrade(false);
  };

  // Filter tasks belonging only to the other partner that are not completed yet
  const partnerIncompleteTasks = tarefas.filter(
    (t) => t.responsavel === partnerObj.id && !t.concluida
  );

  // Filter rewards configured by me (current active user) vs partner
  const myRewards = recompensas.filter((r) => r.configuradaPor === currentUserId && !r.resgatada);
  const partnerRewards = recompensas.filter((r) => r.configuradaPor !== currentUserId && !r.resgatada);
  const claimedRewards = recompensas.filter((r) => r.resgatada);

  // Active proposals sent to me from my partner
  const incomingProposals = trocas.filter(
    (p) => p.proponenteId !== currentUserId && p.status === "pendente"
  );

  // Outgoing pending proposals
  const outgoingProposals = trocas.filter(
    (p) => p.proponenteId === currentUserId && p.status === "pendente"
  );

  return (
    <div className="space-y-6" id="rewards_tab_container">
      
      {/* 💳 REWARDS XP WALLET BAND */}
      <div className="bg-gradient-to-br from-[#1C1340] to-[#0A0718] p-6 rounded-[22px] text-white flex justify-between items-center shadow-[0_4px_20px_rgba(28,19,64,0.12)]">
        <div className="space-y-1">
          <span className="text-[9px] bg-white/10 text-pink-300 font-bold uppercase py-0.5 px-2.5 rounded-full tracking-wider">
            Carteira da Sintonia
          </span>
          <h3 className="font-serif font-bold text-2xl text-cream">
            Pontuações Individuais
          </h3>
          <p className="text-xs text-purple-light italic">
            Acumule pontos em tarefas para cobrar chamegos e mimos especiais.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-purple-light uppercase tracking-widest font-semibold">Seu XP Individual</p>
          <p className="text-4xl font-syne font-black text-[#F76A8C]">
            {userObj.xpIndividual} <span className="text-xs font-sans font-semibold text-white">XP</span>
          </p>
          <p className="text-[9px] text-zinc-300 font-medium">{userObj.nome} (Ativo)</p>
        </div>
      </div>

      {/* 🔄 TROCAS E ACORDOS (Swapping chores dashboard) */}
      <div className="bg-white p-5 rounded-[22px] border border-[#F0EBFF] shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-4" id="chore_swapping_station">
        <div className="flex justify-between items-center pb-1">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2D2060]">
              Acordo de Cavalheiros 🤝
            </h3>
            <p className="text-xs text-gray">Se a tarefa do outro estiver pesando, proponha fazê-la em troca de um agrado!</p>
          </div>
          <button
            onClick={() => setShowProposeTrade(!showProposeTrade)}
            className="bg-[#C084FC] hover:bg-[#C084FC]/95 text-[#0A0718] font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Propor Acordo
          </button>
        </div>

        {/* Swapping inline proposal builder */}
        {showProposeTrade && (
          <form onSubmit={handleSendProposal} className="p-4 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#2D2060] uppercase tracking-wider flex items-center gap-1">
              <BadgeInfo className="w-4 h-4 text-[#7C6AF7]" /> Propor Nova Troca Cooperativa
            </h4>

            {partnerIncompleteTasks.length === 0 ? (
              <p className="text-xs text-gray italic bg-white p-3 rounded-xl border border-dashed border-[#F0EBFF]">
                Seu parceiro não tem obrigações pendentes hoje para você negociar! ✨
              </p>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[9px] text-[#2D2060] font-bold mb-1 uppercase">
                    1. Qual tarefa do {partnerObj.nome} você assume fazer?
                  </label>
                  <select
                    required
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                  >
                    <option value="">-- Selecione uma obrigação dele --</option>
                    {partnerIncompleteTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.dia}] {t.titulo} (+{t.xp} XP)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-[#2D2060] font-bold mb-1 uppercase">
                    2. Em troca, o que você quer receber do parceiro como carinho?
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Ex: Fazer janta deliciosa para mim, Cafuné ininterrupto de 20min..."
                    value={swapOfferedReward}
                    onChange={(e) => setSwapOfferedReward(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-gray outline-none focus:border-[#7C6AF7]"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold text-xs py-2 rounded-xl transition"
                  >
                    Enviar Proposta Oficial 💌
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProposeTrade(false)}
                    className="border border-[#E5E7EB] py-2 px-3 text-xs rounded-xl"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Dynamic Lists of incoming proposals and negotiations */}
        <div className="space-y-2.5">
          {/* Incoming items from spouse */}
          {incomingProposals.map((prop) => {
            const propName = prop.proponenteId === "karina-id" ? "Karina" : "Yuri";
            const task = tarefas.find((t) => t.id === prop.tarefaId);

            return (
              <div key={prop.id} className="p-3.5 bg-pink-50/40 border border-[#F9A8C9]/30 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="inline-block bg-[#F76A8C] text-[8px] text-white py-0.5 px-1.5 rounded uppercase font-bold tracking-wider">
                    Proposta de {propName}
                  </span>
                  <p className="text-xs text-[#2D2060] leading-relaxed">
                    Oferece assumir sua tarefa <b className="text-[#2D2060]">"{task?.titulo}"</b> se você aceitar de bom grado: <b>"{prop.recompensaOffered || prop.recompensaOferecida}"</b>.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => respondToTrade(prop.id, "aceita")}
                    className="bg-emerald-500 hover:bg-emerald-650 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition"
                  >
                    ✓ Aceitar
                  </button>
                  <button
                    onClick={() => respondToTrade(prop.id, "recusada")}
                    className="bg-red-50 hover:bg-red-100 text-red-500 rounded-lg py-1.5 px-3 text-xs font-semibold transition"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            );
          })}

          {/* Outgoing proposals status tracker */}
          {outgoingProposals.map((p) => {
            const task = tarefas.find((t) => t.id === p.tarefaId);
            return (
              <div key={p.id} className="p-3 bg-gray-50 border border-gray-150 border-dashed rounded-xl flex items-center justify-between">
                <p className="text-[11px] text-gray">
                  Aguardando aceitação de {partnerObj.nome} para assumir <b>"{task?.titulo || 'Tarefa'}"</b> em troca de: <i>"{p.recompensaOferecida}"</i>.
                </p>
                <span className="text-[9px] bg-yellow-50 text-yellow-600 px-2 py-0.5 font-bold rounded">Pendente</span>
              </div>
            );
          })}

          {incomingProposals.length === 0 && outgoingProposals.length === 0 && (
            <p className="text-center font-mono text-[10px] text-gray italic bg-gray-50/40 py-2 rounded-xl">
              Nenhuma negociação em aberto no momento. Entendimento pleno! 😄
            </p>
          )}
        </div>
      </div>

      {/* 🎁 MIMOS CONFIGURANDO (Custom Wish pools) */}
      <div className="space-y-4" id="custom_desires_workbench">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2D2060]">
              Cofre de Miminhos do Casal 🎁
            </h3>
            <p className="text-xs text-gray">Crie prêmios simbólicos e dote-os de valor no simulador</p>
          </div>
          <button
            onClick={() => setShowAddReward(!showAddReward)}
            className="bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Desejo
          </button>
        </div>

        {/* Add customized wish expandable form */}
        {showAddReward && (
          <form onSubmit={handleCreateReward} className="p-4 bg-[#FAF7FF] border border-[#F0EBFF] rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-[#2D2060] tracking-wider uppercase">Cadastrar Novo Mimo Afetivo</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[9px] text-gray font-bold mb-0.5 uppercase">Título do Carinho</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jantar à luz de velas, Fazer cafuné de 20min..."
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-gray-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] text-gray font-bold mb-0.5 uppercase">Custo em Pontos (XP)</label>
                <input
                  type="number"
                  min="50"
                  max="1000"
                  value={newRewardXp}
                  onChange={(e) => setNewRewardXp(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#2D2060] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-[#F76A8C] text-white hover:bg-[#F76A8C]/95 rounded-xl py-2 px-4 text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Ativar Desejo ✨
              </button>
              <button
                type="button"
                onClick={() => setShowAddReward(false)}
                className="text-xs text-gray hover:text-gray-600 px-3 cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Seus Desejos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F76A8C] uppercase tracking-widest border-b border-[#F9A8C9]/30 pb-1.5 flex justify-between">
              <span>Seus Desejos Cadastrados</span>
              <span className="text-[9px] lowercase font-normal text-gray">Ativos</span>
            </h4>

            {myRewards.length === 0 ? (
              <p className="text-xs p-5 bg-gray-50/50 rounded-2xl border text-center text-gray italic">
                Você não tem desejos ativos. Crie um para inspirar o parceiro! 🌸
              </p>
            ) : (
              myRewards.map((reward) => {
                const affordable = userObj.xpIndividual >= reward.custoXP;
                const progressPct = Math.min(100, Math.round((userObj.xpIndividual / reward.custoXP) * 100));

                return (
                  <div key={reward.id} className="p-4 bg-white border border-[#F0EBFF] hover:border-pink-100 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-serif font-bold text-base text-[#2D2060]">
                          {reward.title}
                        </h5>
                        <p className="text-[10px] text-[#F76A8C] font-mono font-bold uppercase mt-0.5">
                          CUSTO: {reward.custoXP} XP
                        </p>
                      </div>

                      <button
                        onClick={() => redeemReward(reward.id)}
                        disabled={!affordable}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer ${
                          affordable
                            ? "bg-[#7C6AF7] hover:bg-[#7C6AF7]/95 text-white"
                            : "bg-gray-100 text-gray cursor-not-allowed"
                        }`}
                      >
                        Resgatar
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-[#FAF7FF] border border-[#F0EBFF] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#7C6AF7] h-1.5 rounded-full"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[8px] font-bold text-gray uppercase">
                        <span>XP: {userObj.xpIndividual} / {reward.custoXP}</span>
                        <span>Progresso: {progressPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desejos do Parceiro */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#7C6AF7] uppercase tracking-widest border-b border-[#F0EBFF] pb-1.5 flex justify-between">
              <span>Desejos do {partnerObj.nome}</span>
              <span className="text-[9px] lowercase font-normal text-gray">Em andamento</span>
            </h4>

            {partnerRewards.length === 0 ? (
              <p className="text-xs p-5 bg-gray-50/50 rounded-2xl border text-center text-gray italic">
                {partnerObj.nome} ainda não cadastrou mimos.
              </p>
            ) : (
              partnerRewards.map((reward) => {
                const partnerAffordable = partnerObj.xpIndividual >= reward.custoXP;
                const partnerProgress = Math.min(100, Math.round((partnerObj.xpIndividual / reward.custoXP) * 100));

                return (
                  <div key={reward.id} className="p-4 bg-[#FAF7FF]/50 border border-[#F0EBFF] rounded-2xl space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-serif font-bold text-base text-[#2D2060] opacity-80">
                          {reward.title}
                        </h5>
                        <p className="text-[10px] text-[#7C6AF7] font-mono font-bold mt-0.5">
                          Custo: {reward.custoXP} XP
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-mono tracking-wider ${
                        partnerAffordable
                          ? "bg-emerald-50 text-emerald-500 border border-emerald-100"
                          : "bg-gray-100 text-gray"
                      }`}>
                        {partnerAffordable ? "PODE SACAR ✓" : "DIFICULDADE"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-white border border-[#F0EBFF] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#7C6AF7] h-1.5 rounded-full opacity-65"
                          style={{ width: `${partnerProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-gray uppercase font-semibold">
                        <span>XP dele: {partnerObj.xpIndividual} / {reward.custoXP}</span>
                        <span>Progresso: {partnerProgress}%</span>
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
