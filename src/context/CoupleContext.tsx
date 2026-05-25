/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DiaSemana,
  CategoriaTarefa,
  CasalState,
  UsuarioState,
  TarefaState,
  RitualState,
  RecompensaState,
  TrocaState,
  CoupleAppState,
} from "../types";
import {
  db,
  auth,
  isFirebaseFallback,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  getDocs,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Mock preset seeding data in Portuguese as requested (for local sandbox/simulator and offline setups)
const PRESET_CASAL: CasalState = {
  id: "casal-yuri-karina",
  nome: "Nossa Constelação de Amor 🌌",
  criadoEm: "2026-05-20T12:00:00Z",
  streakAtual: 6,
  streakUltimaData: "2026-05-24T20:00:00Z",
  xpCasal: 380,
  nivelTerreno: 2
};

const PRESET_USUARIOS: { ela: UsuarioState; ele: UsuarioState } = {
  ela: {
    id: "karina-id",
    nome: "Karina",
    papel: "ela",
    xpIndividual: 220,
    avatar: "🧚‍♀️",
    badges: ["Fada do Jardim Ativa 🌸", "Estrela Radiante ✨"]
  },
  ele: {
    id: "yuri-id",
    nome: "Yuri",
    papel: "ele",
    xpIndividual: 160,
    avatar: "🕹️",
    badges: ["Churrasqueiro Profissional 🥩", "Gamer Estrategista 🎮"]
  }
};

const PRESET_TAREFAS: TarefaState[] = [
  { id: "task-1", titulo: "Lavar a louça do jantar", responsavel: "yuri-id", dia: "Seg", xp: 40, tag: "Casa", concluida: true, concluidaEm: "2026-05-25T19:00:00Z", trocaDisponivel: false },
  { id: "task-2", titulo: "Limpar o filtro de café e balcão", responsavel: "yuri-id", dia: "Seg", xp: 30, tag: "Casa", concluida: false, concluidaEm: null, trocaDisponivel: true },
  { id: "task-3", titulo: "Regar camélias do jardim", responsavel: "karina-id", dia: "Seg", xp: 50, tag: "Casa", concluida: false, concluidaEm: null, trocaDisponivel: false },
  { id: "task-4", titulo: "Ajustar planilhas financeiras", responsavel: "karina-id", dia: "Ter", xp: 50, tag: "Financeiro", concluida: false, concluidaEm: null, trocaDisponivel: true },
  { id: "task-5", titulo: "Comprar snacks e vinhos do Cinema", responsavel: "yuri-id", dia: "Qui", xp: 35, tag: "Compras", concluida: false, concluidaEm: null, trocaDisponivel: false },
  { id: "task-6", titulo: "Arrumar a cama grande de manhã", responsavel: "karina-id", dia: "Seg", xp: 20, tag: "Casa", concluida: true, concluidaEm: "2026-05-25T08:00:00Z", trocaDisponivel: false }
];

const PRESET_RITUAIS: RitualState[] = [
  { id: "ritual-1", titulo: "💆 Massagem nos Ombros", descricao: "Um tempo para relaxar o cansaço do trabalho acumulado e focar um no outro sem preocupações.", dia: "Ter", horario: "22:00", xpBonus: 80, confirmacaoEla: false, confirmacaoEle: false, ultimaConfirmacao: null },
  { id: "ritual-2", titulo: "🍿 Pipoca depois do trabalho", descricao: "Pipoca quentinha com manteiga e risadas assistindo a um filme juntinhos.", dia: "Qui", horario: "21:30", xpBonus: 100, confirmacaoEla: false, confirmacaoEle: false, ultimaConfirmacao: null },
  { id: "ritual-3", titulo: "☕ Café da manhã com carinho", descricao: "Colocar a mesa de forma charmosa com flores e ovos mexidos no domingo de manhã.", dia: "Dom", horario: "09:30", xpBonus: 120, confirmacaoEla: false, confirmacaoEle: false, ultimaConfirmacao: null },
  { id: "ritual-4", titulo: "🌙 Diálogo sem pressa", descricao: "Perguntar sobre o sentimento do outro por 10 minutos sem telas antes de dormir.", dia: "Seg", horario: "23:00", xpBonus: 60, confirmacaoEla: false, confirmacaoEle: false, ultimaConfirmacao: null }
];

const PRESET_RECOMPENSAS: RecompensaState[] = [
  { id: "reward-1", titulo: "Fazer cafuné de 25 minutos 💆‍♀️", custoXP: 150, configuradaPor: "karina-id", resgatada: false, resgatadaEm: null },
  { id: "reward-2", titulo: "Pedir minha pizza delivery favorita 🍕", custoXP: 120, configuradaPor: "yuri-id", resgatada: false, resgatadaEm: null },
  { id: "reward-3", titulo: "Massagem corporal completa com óleo 🌸", custoXP: 300, configuradaPor: "karina-id", resgatada: false, resgatadaEm: null },
  { id: "reward-4", titulo: "Voucher de 1h livre para videogame 🎮", custoXP: 180, configuradaPor: "yuri-id", resgatada: false, resgatadaEm: null }
];

const PRESET_TROCAS: TrocaState[] = [
  { id: "exchange-1", tarefaId: "task-2", proponenteId: "karina-id", recompensaOferecida: "Prometo lavar a louça do almoço amanhã completo 🍳", status: "pendente", contrapropostaTexto: null, criadaEm: "2026-05-25T15:00:00Z" }
];

interface CoupleContextType {
  state: CoupleAppState;
  toggleActor: () => void;
  setCurrentUserId: (id: string) => void;
  completeTask: (taskId: string) => void;
  addCustomTask: (titulo: string, tag: CategoriaTarefa, responsavel: string, dia: DiaSemana, xp: number) => void;
  proposeTrade: (tarefaId: string, recompensaOferecida: string) => void;
  respondToTrade: (trocaId: string, status: "aceita" | "recusada" | "contraproposta", contraTexto?: string | null) => void;
  toggleRitualApproval: (ritualId: string) => void;
  addCustomReward: (titulo: string, custoXP: number, configuradaPor: string) => void;
  redeemReward: (rewardId: string) => void;
  buyStars: (starsCount: number) => void;
  unlockCosmetic: (cosmeticId: string, cost: number) => void;
  activeGardenStyle: string;
  activeGarageStyle: string;
  setCosmeticStyle: (type: "garden" | "garage", styleId: string) => void;
  waterGarden: () => void;
  feedPet: () => void;
  petStatus: "feliz" | "faminto" | "contente";
  gardenHydration: number;
  recentActivity: Array<{ id: string; user: string; text: string; time: string; color: string }>;
  resetDatabaseState: () => void;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>("karina-id");
  const [casal, setCasal] = useState<CasalState>(PRESET_CASAL);
  const [usuarios, setUsuarios] = useState<{ ela: UsuarioState; ele: UsuarioState }>(PRESET_USUARIOS);
  const [tarefas, setTarefas] = useState<TarefaState[]>(PRESET_TAREFAS);
  const [rituais, setRituais] = useState<RitualState[]>(PRESET_RITUAIS);
  const [recompensas, setRecompensas] = useState<RecompensaState[]>(PRESET_RECOMPENSAS);
  const [trocas, setTrocas] = useState<TrocaState[]>(PRESET_TROCAS);
  const [stars, setStars] = useState<number>(1500); // Concept currency
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>(["garden-default", "garage-default"]);
  const [activeGardenStyle, setActiveGardenStyle] = useState<string>("garden-default");
  const [activeGarageStyle, setActiveGarageStyle] = useState<string>("garage-default");

  // Game/Emotional/Pet attributes
  const [gardenHydration, setGardenHydration] = useState<number>(75);
  const [petStatus, setPetStatus] = useState<"feliz" | "faminto" | "contente">("contente");
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; user: string; text: string; time: string; color: string }>>([
    { id: "act-1", user: "Karina", text: "concluiu 'Arrumar a cama grande' (+20 XP)", time: "Hoje 08:00", color: "#F76A8C" },
    { id: "act-2", user: "Yuri", text: "concluiu 'Lavar a louça do jantar' (+40 XP)", time: "Ontem 19:00", color: "#7C6AF7" }
  ]);

  // Load from LocalStorage if firebase fallback is true
  useEffect(() => {
    if (isFirebaseFallback) {
      const saved = localStorage.getItem("karinalove_v2_storage");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
          if (parsed.casal) setCasal(parsed.casal);
          if (parsed.usuarios) setUsuarios(parsed.usuarios);
          if (parsed.tarefas) setTarefas(parsed.tarefas);
          if (parsed.rituais) setRituais(parsed.rituais);
          if (parsed.recompensas) setRecompensas(parsed.recompensas);
          if (parsed.trocas) setTrocas(parsed.trocas);
          if (parsed.stars !== undefined) setStars(parsed.stars);
          if (parsed.unlockedCosmetics) setUnlockedCosmetics(parsed.unlockedCosmetics);
          if (parsed.activeGardenStyle) setActiveGardenStyle(parsed.activeGardenStyle);
          if (parsed.activeGarageStyle) setActiveGarageStyle(parsed.activeGarageStyle);
          if (parsed.gardenHydration !== undefined) setGardenHydration(parsed.gardenHydration);
          if (parsed.petStatus) setPetStatus(parsed.petStatus);
          if (parsed.recentActivity) setRecentActivity(parsed.recentActivity);
        } catch (e) {
          console.error("Failed to restore simulated local storage", e);
        }
      }
    }
  }, []);

  // Save to LocalStorage if in simulation
  const writeSimulatedState = (
    uId: string,
    cSal: CasalState,
    uSers: typeof usuarios,
    tArs: TarefaState[],
    rIts: RitualState[],
    rEcs: RecompensaState[],
    tRos: TrocaState[],
    sTrs: number,
    uCos: string[],
    gStyle: string,
    garStyle: string,
    hYdr: number,
    pSt: "feliz" | "faminto" | "contente",
    act: typeof recentActivity
  ) => {
    if (isFirebaseFallback) {
      localStorage.setItem(
        "karinalove_v2_storage",
        JSON.stringify({
          currentUserId: uId,
          casal: cSal,
          usuarios: uSers,
          tarefas: tArs,
          rituais: rIts,
          recompensas: rEcs,
          trocas: tRos,
          stars: sTrs,
          unlockedCosmetics: uCos,
          activeGardenStyle: gStyle,
          activeGarageStyle: garStyle,
          gardenHydration: hYdr,
          petStatus: pSt,
          recentActivity: act,
        })
      );
    }
  };

  // Setup Live Real-time Listeners if Firebase is provisioned
  useEffect(() => {
    if (!isFirebaseFallback && db) {
      // Listen to Casal
      const refCasal = doc(db, "casais", PRESET_CASAL.id);
      const unsubCasal = onSnapshot(refCasal, (docSnap) => {
        if (docSnap.exists()) {
          setCasal({ id: docSnap.id, ...docSnap.data() } as CasalState);
        } else {
          // Create preset casal if missing
          setDoc(refCasal, {
            nome: PRESET_CASAL.nome,
            criadoEm: PRESET_CASAL.criadoEm,
            streakAtual: PRESET_CASAL.streakAtual,
            streakUltimaData: PRESET_CASAL.streakUltimaData,
            xpCasal: PRESET_CASAL.xpCasal,
            nivelTerreno: PRESET_CASAL.nivelTerreno
          }).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}`));
        }
      });

      // Listen to Usuarios
      const refEla = doc(db, "casais", PRESET_CASAL.id, "usuarios", "karina-id");
      const refEle = doc(db, "casais", PRESET_CASAL.id, "usuarios", "yuri-id");

      const unsubEla = onSnapshot(refEla, (snap) => {
        if (snap.exists()) {
          setUsuarios(prev => ({ ...prev, ela: { id: snap.id, ...snap.data() } as UsuarioState }));
        } else {
          setDoc(refEla, PRESET_USUARIOS.ela).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}/usuarios/karina-id`));
        }
      });

      const unsubEle = onSnapshot(refEle, (snap) => {
        if (snap.exists()) {
          setUsuarios(prev => ({ ...prev, ele: { id: snap.id, ...snap.data() } as UsuarioState }));
        } else {
          setDoc(refEle, PRESET_USUARIOS.ele).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}/usuarios/yuri-id`));
        }
      });

      // Listen to Subcollections
      const refTarefas = collection(db, "casais", PRESET_CASAL.id, "tarefas");
      const unsubTarefas = onSnapshot(refTarefas, (querySnap) => {
        const loaded: TarefaState[] = [];
        querySnap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as TarefaState);
        });
        if (loaded.length > 0) {
          setTarefas(loaded);
        } else {
          // Preload tasks to Firestore if empty
          PRESET_TAREFAS.forEach((t) => {
            setDoc(doc(db, "casais", PRESET_CASAL.id, "tarefas", t.id), {
              titulo: t.titulo,
              responsavel: t.responsavel,
              dia: t.dia,
              xp: t.xp,
              tag: t.tag,
              concluida: t.concluida,
              concluidaEm: t.concluidaEm,
              trocaDisponivel: t.trocaDisponivel
            }).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}/tarefas/${t.id}`));
          });
        }
      });

      const refRituais = collection(db, "casais", PRESET_CASAL.id, "rituais");
      const unsubRituais = onSnapshot(refRituais, (querySnap) => {
        const loaded: RitualState[] = [];
        querySnap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as RitualState);
        });
        if (loaded.length > 0) {
          setRituais(loaded);
        } else {
          PRESET_RITUAIS.forEach((r) => {
            setDoc(doc(db, "casais", PRESET_CASAL.id, "rituais", r.id), {
              titulo: r.titulo,
              descricao: r.descricao,
              dia: r.dia,
              horario: r.horario,
              xpBonus: r.xpBonus,
              confirmacaoEla: r.confirmacaoEla,
              confirmacaoEle: r.confirmacaoEle,
              ultimaConfirmacao: r.ultimaConfirmacao
            }).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}/rituais/${r.id}`));
          });
        }
      });

      const refRecompensas = collection(db, "casais", PRESET_CASAL.id, "recompensas");
      const unsubRecompensas = onSnapshot(refRecompensas, (querySnap) => {
        const loaded: RecompensaState[] = [];
        querySnap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as RecompensaState);
        });
        if (loaded.length > 0) {
          setRecompensas(loaded);
        } else {
          PRESET_RECOMPENSAS.forEach((rew) => {
            setDoc(doc(db, "casais", PRESET_CASAL.id, "recompensas", rew.id), {
              titulo: rew.titulo,
              custoXP: rew.custoXP,
              configuradaPor: rew.configuradaPor,
              resgatada: rew.resgatada,
              resgatadaEm: rew.resgatadaEm
            }).catch(err => handleFirestoreError(err, OperationType.WRITE, `casais/${PRESET_CASAL.id}/recompensas/${rew.id}`));
          });
        }
      });

      const refTrocas = collection(db, "casais", PRESET_CASAL.id, "trocas");
      const unsubTrocas = onSnapshot(refTrocas, (querySnap) => {
        const loaded: TrocaState[] = [];
        querySnap.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...docSnap.data() } as TrocaState);
        });
        setTrocas(loaded);
      });

      return () => {
        unsubCasal();
        unsubEla();
        unsubEle();
        unsubTarefas();
        unsubRituais();
        unsubRecompensas();
        unsubTrocas();
      };
    }
  }, [isFirebaseFallback]);

  const toggleActor = () => {
    const nextId = currentUserId === "karina-id" ? "yuri-id" : "karina-id";
    setCurrentUserId(nextId);
    writeSimulatedState(
      nextId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, recentActivity
    );
  };

  const getActorName = (uid: string) => {
    return uid === "karina-id" ? "Karina" : "Yuri";
  };

  // Logging utility
  const logActivity = (user: string, text: string, color: string, currentList = recentActivity) => {
    const newAct = {
      id: `act-${Date.now()}`,
      user,
      text,
      time: "Agora",
      color,
    };
    const updated = [newAct, ...currentList.slice(0, 15)];
    setRecentActivity(updated);
    return updated;
  };

  const getLevelForXp = (xp: number): number => {
    if (xp < 200) return 1;
    if (xp < 500) return 2;
    if (xp < 900) return 3;
    if (xp < 1500) return 4;
    return 5;
  };

  // Adds XP safely across databases or locals
  const addXpToCouple = (xpAmount: number, userUid: string) => {
    const isEla = userUid === "karina-id";
    const roleKey = isEla ? "ela" : "ele";
    const userToAward = usuarios[roleKey];

    const finalIndividualXp = userToAward.xpIndividual + xpAmount;
    const finalCasalXp = casal.xpCasal + xpAmount;
    const finalLevel = getLevelForXp(finalCasalXp);
    const didLevelUp = finalLevel > casal.nivelTerreno;

    // Badges checking
    let currentBadges = [...userToAward.badges];
    if (finalIndividualXp > 350 && !currentBadges.includes("Senhor do Lar 🏰")) {
      currentBadges.push(isEla ? "Rainha Suprema ✨👑" : "Senhor do Lar 🏰");
    }

    const updatedUser: UsuarioState = {
      ...userToAward,
      xpIndividual: finalIndividualXp,
      badges: currentBadges,
    };

    const updatedCasal: CasalState = {
      ...casal,
      xpCasal: finalCasalXp,
      nivelTerreno: finalLevel,
    };

    const updatedUsuarios = {
      ...usuarios,
      [roleKey]: updatedUser,
    };

    const nextHydration = Math.min(100, gardenHydration + 10);
    const nextPet: "feliz" | "faminto" | "contente" = "feliz";

    setCasal(updatedCasal);
    setUsuarios(updatedUsuarios);
    setGardenHydration(nextHydration);
    setPetStatus(nextPet);

    let updatedList = recentActivity;
    if (didLevelUp) {
      updatedList = logActivity("Sistema ⭐️", `Terreno subiu para o Nível ${finalLevel}! 🎉`, "#C084FC", updatedList);
    }

    if (!isFirebaseFallback && db) {
      const casalRef = doc(db, "casais", PRESET_CASAL.id);
      updateDoc(casalRef, {
        xpCasal: finalCasalXp,
        nivelTerreno: finalLevel
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}`));

      const userRef = doc(db, "casais", PRESET_CASAL.id, "usuarios", userUid);
      updateDoc(userRef, {
        xpIndividual: finalIndividualXp,
        badges: currentBadges
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/usuarios/${userUid}`));
    }

    return { updatedCasal, updatedUsuarios, nextHydration, nextPet, updatedList };
  };

  const completeTask = (taskId: string) => {
    const taskObj = tarefas.find(t => t.id === taskId);
    if (!taskObj || taskObj.concluida) return;

    const doerName = getActorName(taskObj.responsavel);
    const badgeColor = taskObj.responsavel === "karina-id" ? "#F76A8C" : "#7C6AF7";

    const updatedTarefas = tarefas.map(t => {
      if (t.id === taskId) {
        return { ...t, concluida: true, concluidaEm: new Date().toISOString() };
      }
      return t;
    });

    const { updatedCasal, updatedUsuarios, nextHydration, nextPet, updatedList } = addXpToCouple(taskObj.xp, taskObj.responsavel);

    const finalActivity = logActivity(
      doerName,
      `concluiu '${taskObj.titulo}' (+${taskObj.xp} XP)`,
      badgeColor,
      updatedList
    );

    setTarefas(updatedTarefas);

    if (!isFirebaseFallback && db) {
      const taskRef = doc(db, "casais", PRESET_CASAL.id, "tarefas", taskId);
      updateDoc(taskRef, {
        concluida: true,
        concluidaEm: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/tarefas/${taskId}`));
    } else {
      writeSimulatedState(
        currentUserId, updatedCasal, updatedUsuarios, updatedTarefas, rituais, recompensas, trocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, nextHydration, nextPet, finalActivity
      );
    }
  };

  const addCustomTask = (
    titulo: string,
    tag: CategoriaTarefa,
    responsavel: string,
    dia: DiaSemana,
    xp: number
  ) => {
    const taskId = `task-${Date.now()}`;
    const newTask: TarefaState = {
      id: taskId,
      titulo,
      responsavel,
      dia,
      xp,
      tag,
      concluida: false,
      concluidaEm: null,
      trocaDisponivel: true,
    };

    const nextTarefas = [...tarefas, newTask];
    setTarefas(nextTarefas);

    const creatorName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(creatorName, `criou tarefa: '${titulo}' para ${getActorName(responsavel)}`, color);

    if (!isFirebaseFallback && db) {
      const taskRef = doc(db, "casais", PRESET_CASAL.id, "tarefas", taskId);
      setDoc(taskRef, {
        titulo,
        responsavel,
        dia,
        xp,
        tag,
        concluida: false,
        concluidaEm: null,
        trocaDisponivel: true
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, `casais/${PRESET_CASAL.id}/tarefas/${taskId}`));
    } else {
      writeSimulatedState(
        currentUserId, casal, usuarios, nextTarefas, rituais, recompensas, trocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
      );
    }
  };

  const proposeTrade = (tarefaId: string, recompensaOferecida: string) => {
    const taskUnit = tarefas.find(t => t.id === tarefaId);
    if (!taskUnit) return;

    if (taskUnit.responsavel === currentUserId) {
      alert("A tarefa já está atribuída a você! Escolha uma do parceiro.");
      return;
    }

    const exchangeId = `troca-${Date.now()}`;
    const newExchange: TrocaState = {
      id: exchangeId,
      tarefaId,
      proponenteId: currentUserId,
      recompensaOferecida,
      status: "pendente",
      contrapropostaTexto: null,
      criadaEm: new Date().toISOString()
    };

    const nextTrocas = [...trocas, newExchange];
    setTrocas(nextTrocas);

    const matchName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(matchName, `pediu troca de '${taskUnit.titulo}' por: '${recompensaOferecida}' 🔄`, color);

    if (!isFirebaseFallback && db) {
      const exchangeRef = doc(db, "casais", PRESET_CASAL.id, "trocas", exchangeId);
      setDoc(exchangeRef, {
        tarefaId,
        proponenteId: currentUserId,
        recompensaOferecida,
        status: "pendente",
        contrapropostaTexto: null,
        criadaEm: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, `casais/${PRESET_CASAL.id}/trocas/${exchangeId}`));
    } else {
      writeSimulatedState(
        currentUserId, casal, usuarios, tarefas, rituais, recompensas, nextTrocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
      );
    }
  };

  const respondToTrade = (trocaId: string, status: "aceita" | "recusada" | "contraproposta", contraTexto?: string | null) => {
    const targetExchange = trocas.find(t => t.id === trocaId);
    if (!targetExchange) return;

    const responder = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    let finalAct = recentActivity;

    let nextTarefas = [...tarefas];
    let nextCasal = casal;
    let nextUsuarios = usuarios;
    let finalHydration = gardenHydration;

    if (status === "aceita") {
      // Execute Swap: reassing Task owner
      nextTarefas = tarefas.map(t => {
        if (t.id === targetExchange.tarefaId) {
          return { ...t, responsavel: targetExchange.proponenteId }; // Swapped!
        }
        return t;
      });
      setTarefas(nextTarefas);

      // Reward co-op XP (+50 XP)
      const res = addXpToCouple(50, targetExchange.proponenteId);
      nextCasal = res.updatedCasal;
      nextUsuarios = res.updatedUsuarios;
      finalHydration = res.nextHydration;

      finalAct = logActivity(responder, `aceitou a troca! Assumiu novo carinho de cooperação (+50 XP Casal) 🤝`, color, res.updatedList);

      if (!isFirebaseFallback && db) {
        // Swap task assignee on DB
        const taskRef = doc(db, "casais", PRESET_CASAL.id, "tarefas", targetExchange.tarefaId);
        updateDoc(taskRef, { responsavel: targetExchange.proponenteId })
          .catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/tarefas/${targetExchange.tarefaId}`));
      }
    } else if (status === "recusada") {
      finalAct = logActivity(responder, `recusou o acordo de troca de tarefas 💔`, color);
    } else if (status === "contraproposta") {
      finalAct = logActivity(responder, `enviou contraproposta: "${contraTexto}" 📝`, color);
    }

    const updatedTrocas = trocas.map(t => {
      if (t.id === trocaId) {
        return { ...t, status, contrapropostaTexto: contraTexto || null };
      }
      return t;
    });
    setTrocas(updatedTrocas);

    if (!isFirebaseFallback && db) {
      const exchangeRef = doc(db, "casais", PRESET_CASAL.id, "trocas", trocaId);
      updateDoc(exchangeRef, {
        status,
        contrapropostaTexto: contraTexto || null
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/trocas/${trocaId}`));
    } else {
      writeSimulatedState(
        currentUserId, nextCasal, nextUsuarios, nextTarefas, rituais, recompensas, updatedTrocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, finalHydration, petStatus, finalAct
      );
    }
  };

  const toggleRitualApproval = (ritualId: string) => {
    const targetRitual = rituais.find(r => r.id === ritualId);
    if (!targetRitual) return;

    const isEla = currentUserId === "karina-id";
    const nextConfEla = isEla ? !targetRitual.confirmacaoEla : targetRitual.confirmacaoEla;
    const nextConfEle = !isEla ? !targetRitual.confirmacaoEle : targetRitual.confirmacaoEle;

    const bothApproved = nextConfEla && nextConfEle;
    const actorName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";

    let nextCasal = casal;
    let nextUsuarios = usuarios;
    let updatedList = recentActivity;
    let nextHydration = gardenHydration;
    let nextPet = petStatus;

    if (bothApproved) {
      // Dual Complete! Award massive co-op XP
      const resA = addXpToCouple(80, "karina-id");
      const resB = addXpToCouple(80, "yuri-id");

      const finalXp = casal.xpCasal + 160;
      const finalLvl = getLevelForXp(finalXp);

      nextCasal = {
        ...casal,
        xpCasal: finalXp,
        nivelTerreno: finalLvl,
        streakAtual: casal.streakAtual + 1,
        streakUltimaData: new Date().toISOString()
      };

      nextUsuarios = {
        ela: { ...usuarios.ela, xpIndividual: usuarios.ela.xpIndividual + 80 },
        ele: { ...usuarios.ele, xpIndividual: usuarios.ele.xpIndividual + 80 },
      };

      nextHydration = 100;
      nextPet = "feliz";

      updatedList = logActivity(
        "Ritual 💞",
        `Ambos validaram '${targetRitual.titulo}'! Intimidade expandida e streak subiu (+80 XP individuais/casal) ✨`,
        "#F76A8C",
        resB.updatedList
      );

      if (!isFirebaseFallback && db) {
        updateDoc(doc(db, "casais", PRESET_CASAL.id), {
          xpCasal: finalXp,
          nivelTerreno: finalLvl,
          streakAtual: casal.streakAtual + 1,
          streakUltimaData: new Date().toISOString()
        }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}`));
      }
    } else {
      const actionTxt = (isEla ? !targetRitual.confirmacaoEla : !targetRitual.confirmacaoEle) ? "marcou como feito" : "desfez marcação de";
      updatedList = logActivity(actorName, `${actionTxt} '${targetRitual.titulo}' 🕯️`, color);
    }

    const updatedRituais = rituais.map(r => {
      if (r.id === ritualId) {
        return {
          ...r,
          confirmacaoEla: nextConfEla,
          confirmacaoEle: nextConfEle,
          ultimaConfirmacao: bothApproved ? new Date().toISOString() : r.ultimaConfirmacao
        };
      }
      return r;
    });
    setRituais(updatedRituais);

    if (!isFirebaseFallback && db) {
      const ritRef = doc(db, "casais", PRESET_CASAL.id, "rituais", ritualId);
      updateDoc(ritRef, {
        confirmacaoEla: nextConfEla,
        confirmacaoEle: nextConfEle,
        ultimaConfirmacao: bothApproved ? new Date().toISOString() : targetRitual.ultimaConfirmacao
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/rituais/${ritualId}`));
    } else {
      writeSimulatedState(
        currentUserId, nextCasal, nextUsuarios, tarefas, updatedRituais, recompensas, trocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, nextHydration, nextPet, updatedList
      );
    }
  };

  const addCustomReward = (titulo: string, custoXP: number, configuradaPor: string) => {
    const rewardId = `reward-${Date.now()}`;
    const newReward: RecompensaState = {
      id: rewardId,
      titulo,
      custoXP,
      configuradaPor,
      resgatada: false,
      resgatadaEm: null,
    };

    const nextRecompensas = [...recompensas, newReward];
    setRecompensas(nextRecompensas);

    const matchName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(matchName, `cadastrou recompensa em desejos: '${titulo}' (Custo: ${custoXP} XP)`, color);

    if (!isFirebaseFallback && db) {
      setDoc(doc(db, "casais", PRESET_CASAL.id, "recompensas", rewardId), {
        titulo,
        custoXP,
        configuradaPor,
        resgatada: false,
        resgatadaEm: null
      }).catch(err => handleFirestoreError(err, OperationType.CREATE, `casais/${PRESET_CASAL.id}/recompensas/${rewardId}`));
    } else {
      writeSimulatedState(
        currentUserId, casal, usuarios, tarefas, rituais, nextRecompensas, trocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
      );
    }
  };

  const redeemReward = (rewardId: string) => {
    const targetRew = recompensas.find(r => r.id === rewardId);
    if (!targetRew) return;

    // Check if claimant (who is configurePor / or current actor) has enough Individual XP
    const claimantUid = targetRew.configuradaPor;
    const roleKey = claimantUid === "karina-id" ? "ela" : "ele";
    const claimantUser = usuarios[roleKey];

    if (claimantUser.xpIndividual < targetRew.custoXP) {
      alert(`XP Individual insuficiente! Você precisa de mais ${targetRew.custoXP - claimantUser.xpIndividual} XP.`);
      return;
    }

    // Deduct Individual XP
    const userUpdatedXp = claimantUser.xpIndividual - targetRew.custoXP;
    const updatedUser = { ...claimantUser, xpIndividual: userUpdatedXp };

    const updatedUsuarios = {
      ...usuarios,
      [roleKey]: updatedUser,
    };

    setUsuarios(updatedUsuarios);

    // Swap status to claimed or remove
    const nextRecompensas = recompensas.map(r => {
      if (r.id === rewardId) {
        return { ...r, resgatada: true, resgatadaEm: new Date().toISOString() };
      }
      return r;
    });
    setRecompensas(nextRecompensas);

    const winner = getActorName(claimantUid);
    const finalActivity = logActivity(
      "Mimo 🎁",
      `${winner} resgatou prêmio '${targetRew.titulo}'! Promessa cobrada!`,
      "#C084FC"
    );

    if (!isFirebaseFallback && db) {
      // Update individual user on database
      updateDoc(doc(db, "casais", PRESET_CASAL.id, "usuarios", claimantUid), {
        xpIndividual: userUpdatedXp
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/usuarios/${claimantUid}`));

      updateDoc(doc(db, "casais", PRESET_CASAL.id, "recompensas", rewardId), {
        resgatada: true,
        resgatadaEm: new Date().toISOString()
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `casais/${PRESET_CASAL.id}/recompensas/${rewardId}`));
    } else {
      writeSimulatedState(
        currentUserId, casal, updatedUsuarios, tarefas, rituais, nextRecompensas, trocas,
        stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
      );
    }
  };

  const buyStars = (starsCount: number) => {
    const finalStars = stars + starsCount;
    setStars(finalStars);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `recarregou ${starsCount} Estrelas Karina! ✨🛒`, color);

    writeSimulatedState(
      currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      finalStars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
    );
  };

  const unlockCosmetic = (cosmeticId: string, cost: number) => {
    if (stars < cost) {
      alert("Estrelas insuficientes! Recarregue Stars na loja.");
      return;
    }

    const nextCosmetics = [...unlockedCosmetics, cosmeticId];
    const finalStars = stars - cost;

    setUnlockedCosmetics(nextCosmetics);
    setStars(finalStars);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `desbloqueou estilo premium '${cosmeticId}'! 🌠`, color);

    writeSimulatedState(
      currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      finalStars, nextCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, petStatus, finalActivity
    );
  };

  const setCosmeticStyle = (type: "garden" | "garage", styleId: string) => {
    const nextGarden = type === "garden" ? styleId : activeGardenStyle;
    const nextGarage = type === "garage" ? styleId : activeGarageStyle;

    if (type === "garden") setActiveGardenStyle(styleId);
    else setActiveGarageStyle(styleId);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const labelType = type === "garden" ? "Jardim da Karina" : "Garagem do Yuri";
    const finalActivity = logActivity(userName, `decorou o terreno (${labelType}) com o estilo exclusivo! 🌳`, color);

    writeSimulatedState(
      currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      stars, unlockedCosmetics, nextGarden, nextGarage, gardenHydration, petStatus, finalActivity
    );
  };

  const waterGarden = () => {
    const nextHydration = Math.min(100, gardenHydration + 20);
    setGardenHydration(nextHydration);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `regou o jardim do amor! 🌹💧`, color);

    writeSimulatedState(
      currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, nextHydration, petStatus, finalActivity
    );
  };

  const feedPet = () => {
    setPetStatus("feliz");

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `alimentou o pet virtual do casal (+15% Humor)! 🐾🍎`, color);

    writeSimulatedState(
      currentUserId, casal, usuarios, tarefas, rituais, recompensas, trocas,
      stars, unlockedCosmetics, activeGardenStyle, activeGarageStyle, gardenHydration, "feliz", finalActivity
    );
  };

  const resetDatabaseState = () => {
    if (confirm("Deseja realmente redefinir o simulador para o estado original?")) {
      localStorage.removeItem("karinalove_v2_storage");
      setCasal(PRESET_CASAL);
      setUsuarios(PRESET_USUARIOS);
      setTarefas(PRESET_TAREFAS);
      setRituais(PRESET_RITUAIS);
      setRecompensas(PRESET_RECOMPENSAS);
      setTrocas(PRESET_TROCAS);
      setStars(1500);
      setUnlockedCosmetics(["garden-default", "garage-default"]);
      setActiveGardenStyle("garden-default");
      setActiveGarageStyle("garage-default");
      setGardenHydration(75);
      setPetStatus("contente");
      setRecentActivity([
        { id: "act-1", user: "Karina", text: "concluiu 'Arrumar a cama grande' (+20 XP)", time: "Hoje 08:00", color: "#F76A8C" },
        { id: "act-2", user: "Yuri", text: "concluiu 'Lavar a louça do jantar' (+40 XP)", time: "Ontem 19:00", color: "#7C6AF7" }
      ]);
      alert("Constelação redefinida!");
    }
  };

  const value: CoupleContextType = {
    state: {
      currentUserId,
      casalId: PRESET_CASAL.id,
      casal,
      usuarios,
      tarefas,
      rituais,
      recompensas,
      trocas,
      stars,
      unlockedDecorations: unlockedCosmetics,
      activeDecorationStyle: activeGardenStyle
    },
    toggleActor,
    setCurrentUserId,
    completeTask,
    addCustomTask,
    proposeTrade,
    respondToTrade,
    toggleRitualApproval,
    addCustomReward,
    redeemReward,
    buyStars,
    unlockCosmetic,
    activeGardenStyle,
    activeGarageStyle,
    setCosmeticStyle,
    waterGarden,
    feedPet,
    petStatus,
    gardenHydration,
    recentActivity,
    resetDatabaseState
  };

  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>;
};

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (context === undefined) {
    throw new Error("useCouple deve ser usado dentro de um CoupleProvider");
  }
  return context;
};
