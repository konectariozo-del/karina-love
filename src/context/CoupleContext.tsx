/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HomeState,
  UserState,
  TaskState,
  RitualState,
  RewardState,
  ProposalState,
  CoupleAppState,
  DayOfWeek,
  TaskCategory,
} from "../types";

// Setup some initial seed data matching Yuri (Creator) and Karina (Wife)
const INITIAL_HOME: HomeState = {
  id: "home-888",
  partnerAId: "karina-id", // Ela
  partnerBId: "yuri-id", // Ele
  streak: 5, // active streak!
  lastActiveDate: "2026-05-24",
  terrainLevel: 2,
  terrainXp: 380, // out of 500 for level 3
  createdAt: new Date().toISOString(),
};

const INITIAL_USERS: { ela: UserState; ele: UserState } = {
  ela: {
    id: "karina-id",
    homeId: "home-888",
    role: "ela",
    displayName: "Karina",
    avatarId: "avatar-fada", // Garden Fairy Look
    xp: 220,
    badge: "Estrela do Jardim ✨",
    streakBonus: 5,
    createdAt: new Date().toISOString(),
  },
  ele: {
    id: "yuri-id",
    homeId: "home-888",
    role: "ele",
    displayName: "Yuri",
    avatarId: "avatar-gamer", // Neon Gamer Look
    xp: 160,
    badge: "Mestre da Louça 🍳",
    streakBonus: 4,
    createdAt: new Date().toISOString(),
  },
};

const INITIAL_TASKS: TaskState[] = [
  { id: "task-1", homeId: "home-888", title: "Lavar a louça do jantar", category: "casa", xpValue: 40, assigneeId: "yuri-id", dayOfWeek: "segunda", completed: true, completedAt: "2026-05-25T19:00:00Z" },
  { id: "task-2", homeId: "home-888", title: "Limpar o filtro do café e balcão", category: "casa", xpValue: 30, assigneeId: "yuri-id", dayOfWeek: "segunda", completed: false },
  { id: "task-3", homeId: "home-888", title: "Regar a horta do quintal", category: "casa", xpValue: 50, assigneeId: "karina-id", dayOfWeek: "segunda", completed: false },
  { id: "task-4", homeId: "home-888", title: "Pagar a conta de luz do mês", category: "financeiro", xpValue: 50, assigneeId: "karina-id", dayOfWeek: "terca", completed: false },
  { id: "task-5", homeId: "home-888", title: "Comprar snacks e vinhos p/ Pipoca", category: "compras", xpValue: 30, assigneeId: "yuri-id", dayOfWeek: "quinta", completed: false },
  { id: "task-6", homeId: "home-888", title: "Arrumar a cama grande de manhã", category: "casa", xpValue: 20, assigneeId: "karina-id", dayOfWeek: "segunda", completed: true, completedAt: "2026-05-25T08:00:00Z" },
  { id: "task-7", homeId: "home-888", title: "Separar roupas para lavar", category: "casa", xpValue: 30, assigneeId: "yuri-id", dayOfWeek: "quarta", completed: false },
];

const INITIAL_RITUALS: RitualState[] = [
  { id: "ritual-1", homeId: "home-888", title: "💆 Massagem relaxante", description: "Um tempo para relaxar os ombros e focar um no outro sem preocupações.", dayOfWeek: "terca", confirmedByA: false, confirmedByB: false },
  { id: "ritual-2", homeId: "home-888", title: "🍿 Pipoca depois do trabalho", description: "Pipoca quentinha com manteiga e risadas compartilhadas.", dayOfWeek: "quinta", confirmedByA: false, confirmedByB: false },
  { id: "ritual-3", homeId: "home-888", title: "☕ Café da manhã junto", description: "Colocar a mesa bonita, preparar ovos mexidos e conversar sem pressa.", dayOfWeek: "sabado", confirmedByA: false, confirmedByB: false },
  { id: "ritual-4", homeId: "home-888", title: "🎬 Noite de filme juntinhos", description: "Luzes apagadas, som alto e um clássico do cinema no sofá.", dayOfWeek: "sexta", confirmedByA: false, confirmedByB: false },
  { id: "ritual-5", homeId: "home-888", title: "🌙 Conversa sem celular antes de dormir", description: "Perguntar como foi o dia de forma profunda por 10 minutos.", dayOfWeek: "segunda", confirmedByA: false, confirmedByB: false },
];

const INITIAL_REWARDS: RewardState[] = [
  { id: "reward-1", homeId: "home-888", title: "Fazer cafuné de 20 minutos ininterruptos", xpRequired: 150, assigneeId: "karina-id", progress: 80 },
  { id: "reward-2", homeId: "home-888", title: "Eu escolho o filme + snack preferido hoje", xpRequired: 100, assigneeId: "yuri-id", progress: 60 },
  { id: "reward-3", homeId: "home-888", title: "Minha janta favorita pedida no iFood", xpRequired: 300, assigneeId: "karina-id", progress: 120 },
  { id: "reward-4", homeId: "home-888", title: "Uma tarde inteira livre p/ jogar videogame", xpRequired: 250, assigneeId: "yuri-id", progress: 200 },
];

const INITIAL_PROPOSALS: ProposalState[] = [
  { id: "proposal-1", homeId: "home-888", proposerId: "karina-id", receiverId: "yuri-id", taskId: "task-2", rewardId: "reward-2", status: "pending" },
];

interface CoupleContextType {
  state: CoupleAppState;
  toggleActor: () => void;
  completeTask: (taskId: string) => void;
  addCustomTask: (title: string, category: TaskCategory, assigneeId: string, dayOfWeek: DayOfWeek, xpValue: number) => void;
  proposeTrade: (taskId: string, rewardId: string) => void;
  respondToTrade: (proposalId: string, accept: boolean) => void;
  toggleRitualApproval: (ritualId: string) => void;
  addCustomReward: (title: string, xpRequired: number, assigneeId: string) => void;
  redeemReward: (rewardId: string) => void;
  buyStars: (starsCount: number) => void;
  unlockCosmetic: (cosmeticId: string, cost: number) => void;
  unlockedCosmetics: string[];
  activeGardenStyle: string;
  activeGarageStyle: string;
  setCosmeticStyle: (type: "garden" | "garage", styleId: string) => void;
  waterGarden: () => void;
  feedPet: () => void;
  petStatus: "feliz" | "faminto" | "contente";
  gardenHydration: number; // 0 to 100
  recentActivity: Array<{ id: string; user: string; text: string; time: string; color: string }>;
}

const CoupleContext = createContext<CoupleContextType | undefined>(undefined);

export const CoupleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>("karina-id");
  const [home, setHome] = useState<HomeState>(INITIAL_HOME);
  const [users, setUsers] = useState<{ ela: UserState; ele: UserState }>(INITIAL_USERS);
  const [tasks, setTasks] = useState<TaskState[]>(INITIAL_TASKS);
  const [rituals, setRituals] = useState<RitualState[]>(INITIAL_RITUALS);
  const [rewards, setRewards] = useState<RewardState[]>(INITIAL_REWARDS);
  const [proposals, setProposals] = useState<ProposalState[]>(INITIAL_PROPOSALS);
  const [stars, setStars] = useState<number>(1500); // Pre-load 1500 Estrelas
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>(["garden-default", "garage-default"]);
  const [activeGardenStyle, setActiveGardenStyle] = useState<string>("garden-default");
  const [activeGarageStyle, setActiveGarageStyle] = useState<string>("garage-default");
  
  // Interactive variables
  const [gardenHydration, setGardenHydration] = useState<number>(75);
  const [petStatus, setPetStatus] = useState<"feliz" | "faminto" | "contente">("contente");
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; user: string; text: string; time: string; color: string }>>([
    { id: "act-1", user: "Karina", text: "concluiu 'Arrumar a cama grande'", time: "Hoje 08:00", color: "#F76A8C" },
    { id: "act-2", user: "Yuri", text: "concluiu 'Lavar a louça do jantar'", time: "Hoje 19:00", color: "#7C6AF7" },
  ]);

  // Load from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem("karina_love_app_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentUserId) setCurrentUserId(parsed.currentUserId);
        if (parsed.home) setHome(parsed.home);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.rituals) setRituals(parsed.rituals);
        if (parsed.rewards) setRewards(parsed.rewards);
        if (parsed.proposals) setProposals(parsed.proposals);
        if (parsed.stars !== undefined) setStars(parsed.stars);
        if (parsed.unlockedCosmetics) setUnlockedCosmetics(parsed.unlockedCosmetics);
        if (parsed.activeGardenStyle) setActiveGardenStyle(parsed.activeGardenStyle);
        if (parsed.activeGarageStyle) setActiveGarageStyle(parsed.activeGarageStyle);
        if (parsed.gardenHydration !== undefined) setGardenHydration(parsed.gardenHydration);
        if (parsed.petStatus) setPetStatus(parsed.petStatus);
        if (parsed.recentActivity) setRecentActivity(parsed.recentActivity);
      } catch (e) {
        console.error("Erro ao carregar dados do LocalStorage", e);
      }
    }
  }, []);

  // Save changes to local storage helper
  const saveState = (
    newUserId: string,
    newHome: HomeState,
    newUsers: typeof users,
    newTasks: TaskState[],
    newRituals: RitualState[],
    newRewards: RewardState[],
    newProposals: ProposalState[],
    newStars: number,
    cosmetics: string[],
    garden: string,
    garage: string,
    hydration: number,
    pet: "feliz" | "faminto" | "contente",
    activity: typeof recentActivity
  ) => {
    localStorage.setItem(
      "karina_love_app_state",
      JSON.stringify({
        currentUserId: newUserId,
        home: newHome,
        users: newUsers,
        tasks: newTasks,
        rituals: newRituals,
        rewards: newRewards,
        proposals: newProposals,
        stars: newStars,
        unlockedCosmetics: cosmetics,
        activeGardenStyle: garden,
        activeGarageStyle: garage,
        gardenHydration: hydration,
        petStatus: pet,
        recentActivity: activity,
      })
    );
  };

  const getActorName = (uid: string) => {
    return uid === "karina-id" ? "Karina" : "Yuri";
  };

  const logActivity = (user: string, text: string, color: string, currentActList = recentActivity) => {
    const newAct = {
      id: `act-${Date.now()}`,
      user,
      text,
      time: "Agora mesmo",
      color,
    };
    const updated = [newAct, ...currentActList.slice(0, 15)];
    setRecentActivity(updated);
    return updated;
  };

  // Helper to sync to Firestore if firebase-applet-config exists (silent fallback)
  const toggleActor = () => {
    const nextId = currentUserId === "karina-id" ? "yuri-id" : "karina-id";
    setCurrentUserId(nextId);
    saveState(
      nextId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      recentActivity
    );
  };

  // Math for Level Projections:
  // Level thresholds: 
  // Lvl 1: 0 - 200 XP
  // Lvl 2: 200 - 500 XP
  // Lvl 3: 500 - 900 XP
  // Lvl 4: 900 - 1500 XP
  // Lvl 5: 1500+ XP
  const getLevelForXp = (xp: number): number => {
    if (xp < 200) return 1;
    if (xp < 500) return 2;
    if (xp < 900) return 3;
    if (xp < 1500) return 4;
    return 5;
  };

  const addXpToCouple = (xpAmount: number, targetUserUid: string) => {
    // 1. Update Home Shared XP and Level
    const newSharedXp = home.terrainXp + xpAmount;
    const newLevel = getLevelForXp(newSharedXp);
    const didLevelUp = newLevel > home.terrainLevel;
    
    const updatedHome = {
      ...home,
      terrainXp: newSharedXp,
      terrainLevel: newLevel,
    };

    // 2. Update Individual User XP
    const isUserEla = targetUserUid === "karina-id";
    const userRoleKey = isUserEla ? "ela" : "ele";
    const userStateToUpdate = users[userRoleKey];

    const newIndividualXp = userStateToUpdate.xp + xpAmount;
    
    // Auto badges based on XP milestones
    let dynamicBadge = userStateToUpdate.badge;
    if (newIndividualXp > 300) {
      dynamicBadge = isUserEla ? "Imperatriz Celeste ✨👑" : "Lorde da Fortaleza 🛠️🔋";
    } else if (newIndividualXp > 200) {
      dynamicBadge = isUserEla ? "Fada do Jardim Ativa 🌸" : "Churrasqueiro Profissional 🥩";
    } else if (newIndividualXp > 100) {
      dynamicBadge = isUserEla ? "Apoio de Ouro 🎖️" : "Príncipe das Compras 🛒";
    }

    const updatedUsers = {
      ...users,
      [userRoleKey]: {
        ...userStateToUpdate,
        xp: newIndividualXp,
        badge: dynamicBadge,
      }
    };

    // Trigger hydration & pet boosts on completing tasks
    const newHydration = Math.min(100, gardenHydration + 15);
    const newPet: "feliz" | "faminto" | "contente" = "feliz";

    setHome(updatedHome);
    setUsers(updatedUsers);
    setGardenHydration(newHydration);
    setPetStatus(newPet);

    let updatedAct = recentActivity;
    if (didLevelUp) {
      updatedAct = logActivity("Sistema ⭐️", `Terreno subiu para o Nível ${newLevel}! ✨`, "#C084FC", updatedAct);
    }

    return { updatedHome, updatedUsers, newHydration, newPet, updatedAct };
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        if (t.completed) return t; // Already completed
        
        // Mark checked and trigger XP rewards
        return {
          ...t,
          completed: true,
          completedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.completed) return;

    // Award task assignee the XP
    const { updatedHome, updatedUsers, newHydration, newPet, updatedAct } = addXpToCouple(
      targetTask.xpValue,
      targetTask.assigneeId
    );

    // Logging
    const taskDoer = getActorName(targetTask.assigneeId);
    const color = targetTask.assigneeId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(taskDoer, `concluiu tarefa: '${targetTask.title}' (+${targetTask.xpValue} XP)`, color, updatedAct);

    // Filter today's tasks and see if there is active daily combo!
    // If they completed another task today, counts towards Streak updates
    setTasks(updatedTasks);
    saveState(
      currentUserId,
      updatedHome,
      updatedUsers,
      updatedTasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      newHydration,
      newPet,
      finalActivity
    );
  };

  const addCustomTask = (
    title: string,
    category: TaskCategory,
    assigneeId: string,
    dayOfWeek: DayOfWeek,
    xpValue: number
  ) => {
    const newTask: TaskState = {
      id: `task-${Date.now()}`,
      homeId: home.id,
      title,
      category,
      xpValue,
      assigneeId,
      dayOfWeek,
      completed: false,
    };

    const nextTasks = [...tasks, newTask];
    setTasks(nextTasks);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `adicionou a tarefa '${title}'`, color);

    saveState(
      currentUserId,
      home,
      users,
      nextTasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const proposeTrade = (taskId: string, rewardId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const reward = rewards.find((r) => r.id === rewardId);
    if (!task || !reward) return;

    // Create a swap proposal
    const receiverId = task.assigneeId; // Whomever is already holding the task
    const proposerId = currentUserId;

    if (proposerId === receiverId) {
      alert("Você não pode propor uma troca por uma tarefa que já é sua!");
      return;
    }

    const newProposal: ProposalState = {
      id: `proposal-${Date.now()}`,
      homeId: home.id,
      proposerId,
      receiverId,
      taskId,
      rewardId,
      status: "pending",
    };

    const nextProposals = [...proposals, newProposal];
    setProposals(nextProposals);

    const senderName = getActorName(proposerId);
    const color = proposerId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(
      senderName,
      `propôs trocar '${task.title}' pela recompensa '${reward.title}' 🔄`,
      color
    );

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      nextProposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const respondToTrade = (proposalId: string, accept: boolean) => {
    const proposal = proposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    const proposalIndex = proposals.findIndex((p) => p.id === proposalId);
    let nextProposals = [...proposals];

    const responderName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";

    if (!accept) {
      // Marked as declined
      nextProposals[proposalIndex] = { ...proposal, status: "declined" };
      setProposals(nextProposals);
      const finalActivity = logActivity(responderName, `recusou a proposta de troca de tarefa 🔄`, color);

      saveState(
        currentUserId,
        home,
        users,
        tasks,
        rituals,
        rewards,
        nextProposals,
        stars,
        unlockedCosmetics,
        activeGardenStyle,
        activeGarageStyle,
        gardenHydration,
        petStatus,
        finalActivity
      );
      return;
    }

    // Accept swap:
    // 1. Swap task assignee to the proposer!
    const taskIndex = tasks.findIndex((t) => t.id === proposal.taskId);
    let nextTasks = [...tasks];
    if (taskIndex !== -1) {
      nextTasks[taskIndex] = {
        ...nextTasks[taskIndex],
        assigneeId: proposal.proposerId, // Proposer takes ownership!
      };
    }

    // 2. Proposer gains the task, and we feed reward progress or immediate reward completion!
    // Let's add 50 XP bonus for the successful cooperation as negotiated!
    const { updatedHome, updatedUsers, newHydration, newPet, updatedAct } = addXpToCouple(50, proposal.proposerId);

    // 3. Status set to accepted
    nextProposals[proposalIndex] = { ...proposal, status: "accepted" };

    setTasks(nextTasks);
    setProposals(nextProposals);

    // Log negotiation triumph
    const originalDoer = getActorName(proposal.receiverId);
    const taker = getActorName(proposal.proposerId);
    const finalActivity = logActivity(
      responderName,
      `aceitou a troca! ${taker} assumiu a tarefa de ${originalDoer} 🤝 (+50 XP)`,
      color,
      updatedAct
    );

    saveState(
      currentUserId,
      updatedHome,
      updatedUsers,
      nextTasks,
      rituals,
      rewards,
      nextProposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      newHydration,
      newPet,
      finalActivity
    );
  };

  const toggleRitualApproval = (ritualId: string) => {
    const originalRituals = [...rituals];
    const ritualIndex = rituals.findIndex((r) => r.id === ritualId);
    if (ritualIndex === -1) return;

    const r = rituals[ritualIndex];
    const isUserEla = currentUserId === "karina-id";

    const nextConfA = isUserEla ? !r.confirmedByA : r.confirmedByA;
    const nextConfB = !isUserEla ? !r.confirmedByB : r.confirmedByB;

    let bothConfirmed = nextConfA && nextConfB;
    let xpGranted = 0;
    
    let nextHome = { ...home };
    let nextUsers = { ...users };
    let finalActivity = recentActivity;
    let nextHydration = gardenHydration;
    let nextPet = petStatus;

    if (bothConfirmed) {
      // Big celebration! Heart blast! 🌟
      // Award BOTH partner 100 XP collective boost
      const resultA = addXpToCouple(100, home.partnerAId);
      // Take the new values and add to the next partner to aggregate XP correctly
      
      const newSharedXp = resultA.updatedHome.terrainXp + 100;
      const newLevel = getLevelForXp(newSharedXp);
      const didLevelUp = newLevel > resultA.updatedHome.terrainLevel;
      
      nextHome = {
        ...resultA.updatedHome,
        terrainXp: newSharedXp,
        terrainLevel: newLevel,
        streak: resultA.updatedHome.streak + 1, // Extend collective streak!
      };

      nextUsers = {
        ela: {
          ...resultA.updatedUsers.ela,
          xp: resultA.updatedUsers.ela.xp + (home.partnerAId === "karina-id" ? 0 : 100),
        },
        ele: {
          ...resultA.updatedUsers.ele,
          xp: resultA.updatedUsers.ele.xp + (home.partnerBId === "yuri-id" ? 100 : 0),
        },
      };

      nextHydration = 100; // Flourish garden fully
      nextPet = "feliz";

      const actorName = getActorName(currentUserId);
      const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
      finalActivity = logActivity(
        "Ritual 💞",
        `Ambos confirmaram '${r.title}'! Conexão expandida e streak aumentou! (+100 XP individual/casal)`,
        "#F76A8C",
        resultA.updatedAct
      );
    } else {
      // Just logged individual partial verification
      const actorName = getActorName(currentUserId);
      const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
      const statePhrase = (isUserEla ? !r.confirmedByA : !r.confirmedByB) ? "confirmou" : "desfez confirmação de";
      finalActivity = logActivity(actorName, `${statePhrase} sua parte no ritual '${r.title}' 🕯️`, color);
    }

    // Assemble new items
    const updatedRituals = [...rituals];
    updatedRituals[ritualIndex] = {
      ...r,
      confirmedByA: nextConfA,
      confirmedByB: nextConfB,
      lastTriggered: bothConfirmed ? new Date().toISOString() : r.lastTriggered,
    };

    setRituals(updatedRituals);
    if (bothConfirmed) {
      setHome(nextHome);
      setUsers(nextUsers);
      setGardenHydration(nextHydration);
      setPetStatus(nextPet);
    }

    saveState(
      currentUserId,
      bothConfirmed ? nextHome : home,
      bothConfirmed ? nextUsers : users,
      tasks,
      updatedRituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      nextHydration,
      nextPet,
      finalActivity
    );
  };

  const addCustomReward = (title: string, xpRequired: number, assigneeId: string) => {
    const newReward: RewardState = {
      id: `reward-${Date.now()}`,
      homeId: home.id,
      title,
      xpRequired,
      assigneeId,
      progress: 0,
    };

    const nextRewards = [...rewards, newReward];
    setRewards(nextRewards);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `cadastrou recompensa do desejo: '${title}' (${xpRequired} XP necessário)`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      nextRewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    const userKey = reward.assigneeId === "karina-id" ? "ela" : "ele";
    const user = users[userKey];

    if (user.xp < reward.xpRequired) {
      alert(`Você não tem XP suficiente! Faltam ${reward.xpRequired - user.xp} XP.`);
      return;
    }

    // Fully redeem! Subtract individual XP
    const updatedUsers = {
      ...users,
      [userKey]: {
        ...user,
        xp: user.xp - reward.xpRequired,
      }
    };

    setUsers(updatedUsers);

    // Filter it out or mark completed
    const nextRewards = rewards.filter((r) => r.id !== rewardId);
    setRewards(nextRewards);

    const userName = getActorName(reward.assigneeId);
    const color = reward.assigneeId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(
      "Recompensa 🎁",
      `${userName} resgatou o prêmio: '${reward.title}'! Promessa cobrada com sucesso!`,
      "#C084FC"
    );

    saveState(
      currentUserId,
      home,
      updatedUsers,
      tasks,
      rituals,
      nextRewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const buyStars = (starsCount: number) => {
    const finalStars = stars + starsCount;
    setStars(finalStars);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `recarregou ${starsCount} Estrelas Karina! 💎`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      finalStars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const unlockCosmetic = (cosmeticId: string, cost: number) => {
    if (stars < cost) {
      alert("Estrelas insuficientes! Recarregue mais Estrelas do Desejo na Loja.");
      return;
    }

    const nextCosmetics = [...unlockedCosmetics, cosmeticId];
    const finalStars = stars - cost;

    setUnlockedCosmetics(nextCosmetics);
    setStars(finalStars);

    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `desbloqueou cosmético exclusivo: '${cosmeticId}'! 🛍️`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      finalStars,
      nextCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const setCosmeticStyle = (type: "garden" | "garage", styleId: string) => {
    if (type === "garden") {
      setActiveGardenStyle(styleId);
    } else {
      setActiveGarageStyle(styleId);
    }

    // Trigger update in activity logs
    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const labelType = type === "garden" ? "Jardim da Karina" : "Garagem do Yuri";
    const styleLabel = styleId.includes("spring") ? "Primavera Encantada" : styleId.includes("neon") ? "Cyberpunk Gamer" : styleId.includes("winter") ? "Alpes de Inverno" : "Estilo Clássico";
    const finalActivity = logActivity(userName, `decorou o terreno (${labelType}) com o estilo: '${styleLabel}' 🏡`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      type === "garden" ? styleId : activeGardenStyle,
      type === "garage" ? styleId : activeGarageStyle,
      gardenHydration,
      petStatus,
      finalActivity
    );
  };

  const waterGarden = () => {
    const nextHydration = Math.min(100, gardenHydration + 25);
    setGardenHydration(nextHydration);
    
    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `regou as flores da horta! 🌸`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      nextHydration,
      petStatus,
      finalActivity
    );
  };

  const feedPet = () => {
    setPetStatus("feliz");
    
    const userName = getActorName(currentUserId);
    const color = currentUserId === "karina-id" ? "#F76A8C" : "#7C6AF7";
    const finalActivity = logActivity(userName, `alimentou o pet virtual do casal! 🐾`, color);

    saveState(
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      stars,
      unlockedCosmetics,
      activeGardenStyle,
      activeGarageStyle,
      gardenHydration,
      "feliz",
      finalActivity
    );
  };

  const value: CoupleContextType = {
    state: {
      currentUserId,
      home,
      users,
      tasks,
      rituals,
      rewards,
      proposals,
      stars,
    },
    toggleActor,
    completeTask,
    addCustomTask,
    proposeTrade,
    respondToTrade,
    toggleRitualApproval,
    addCustomReward,
    redeemReward,
    buyStars,
    unlockCosmetic,
    unlockedCosmetics,
    activeGardenStyle,
    activeGarageStyle,
    setCosmeticStyle,
    waterGarden,
    feedPet,
    petStatus,
    gardenHydration,
    recentActivity,
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
