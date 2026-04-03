// ============================================================
// BudgetQuest — Game Engine
// window.BQ_ENGINE : toute la logique de jeu, sans manipulation
// du DOM (responsabilité de ui.js)
// ============================================================

window.BQ_ENGINE = (function () {

  // ── État global de la partie ──────────────────────────────
  const state = {
    currentLevelId: null,
    currentScenarioId: null,
    currentTurn: 1,
    phase: 'idle', // idle | action_select | choice_select | stakeholder | feedback | end

    timerTotal: 1200,
    timerRemaining: 1200,
    _timerInterval: null,

    clientSatisfaction: 50,
    dafSatisfaction: 50,
    dafPresent: false,

    selectedActionType: null,
    usedChoiceIds: [],           // ids des choix déjà joués (pas de répétition)
    usedActionTypesThisTurn: [], // types d'action déjà utilisés ce tour

    budgetItems: [],             // { label, amount }
    budgetEstimateRange: { low: 0, high: 0 },

    stakeholderUsed: 0,
    bilanCompleted: false,
    bilanResult: null,
    journal: [],                 // { turn, actionLabel, choiceText, delta, points, isTrap }

    turnScores: [],              // { turn, points, maxPoints }
    totalScore: 0,
    totalMaxScore: 0,

    unlocked: { levels: [1], highScores: {} },

    // Scénario actif (référence vers BQ_DATA)
    _scenario: null,
    _level: null,
  };

  // ─────────────────────────────────────────────────────────
  // PERSISTANCE
  // ─────────────────────────────────────────────────────────

  function saveProgress() {
    try {
      localStorage.setItem('budgetquest_progress', JSON.stringify(state.unlocked));
    } catch (e) { /* silencieux si storage indisponible */ }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem('budgetquest_progress');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.levels)) {
          state.unlocked = parsed;
          return;
        }
      }
    } catch (e) { /* rien */ }
    state.unlocked = { levels: [1], highScores: {} };
  }

  // ─────────────────────────────────────────────────────────
  // INITIALISATION
  // ─────────────────────────────────────────────────────────

  function init() {
    loadProgress();
    // Synchronise les niveaux débloqués dans BQ_DATA
    BQ_DATA.levels.forEach(lvl => {
      lvl.unlocked = state.unlocked.levels.includes(lvl.id);
    });
  }

  // ─────────────────────────────────────────────────────────
  // DÉMARRAGE D'UNE PARTIE
  // ─────────────────────────────────────────────────────────

  function startLevel(levelId) {
    const level = BQ_DATA.levels.find(l => l.id === levelId);
    if (!level) return null;
    if (!level.unlocked) return null;
    if (!level.scenarios || level.scenarios.length === 0) return null;

    // Choix aléatoire du scénario pour la rejouabilité
    const scenarioIds = level.scenarios;
    const pick = scenarioIds[Math.floor(Math.random() * scenarioIds.length)];
    const scenario = BQ_DATA.scenarios[pick];
    if (!scenario) return null;

    // Reset de l'état
    state.currentLevelId = levelId;
    state.currentScenarioId = pick;
    state.currentTurn = 1;
    state.phase = 'action_select';
    state.timerRemaining = BQ_DATA.config.timeLimit;
    state.clientSatisfaction = scenario.client.initialSatisfaction;
    state.dafSatisfaction = scenario.daf.initialSatisfaction;
    state.dafPresent = false;
    state.selectedActionType = null;
    state.usedChoiceIds = [];
    state.usedActionTypesThisTurn = [];
    state.budgetItems = [];
    state.budgetEstimateRange = { low: 0, high: 0 };
    state.stakeholderUsed = 0;
    state.bilanCompleted = false;
    state.bilanResult = null;
    state.journal = [];
    state.turnScores = [];
    state.totalScore = 0;
    state.totalMaxScore = 0;
    state._scenario = scenario;
    state._level = level;

    _startTimer();
    return { level, scenario, turn: _currentTurnDef() };
  }

  // ─────────────────────────────────────────────────────────
  // TIMER
  // ─────────────────────────────────────────────────────────

  function _startTimer() {
    _clearTimer();
    state._timerInterval = setInterval(() => {
      state.timerRemaining--;
      if (window.BQ_UI) BQ_UI.onTimerTick(state.timerRemaining);
      if (state.timerRemaining <= 0) {
        endGame('timeout');
      }
    }, 1000);
  }

  function _clearTimer() {
    if (state._timerInterval) {
      clearInterval(state._timerInterval);
      state._timerInterval = null;
    }
  }

  function pauseTimer() { _clearTimer(); }

  function resumeTimer() {
    if (state.phase !== 'end') _startTimer();
  }

  // ─────────────────────────────────────────────────────────
  // SÉLECTION D'UN TYPE D'ACTION
  // ─────────────────────────────────────────────────────────

  function selectActionType(actionTypeId) {
    if (state.phase !== 'action_select') return null;
    const turn = _currentTurnDef();
    if (!turn.availableActions.includes(actionTypeId)) return null;

    state.selectedActionType = actionTypeId;
    state.phase = 'choice_select';

    const choices = _getChoicesForAction(actionTypeId);
    return choices;
  }

  function _getChoicesForAction(actionTypeId) {
    const poolKey = _actionKey(actionTypeId);
    const pool = state._scenario.actionPools[poolKey];
    if (!pool) return [];

    // Filtrer : disponibles selon minTurn + non encore utilisées
    let available = pool.filter(c => {
      const turnOk = (c.minTurn === undefined) || (c.minTurn <= state.currentTurn);
      const notUsed = !state.usedChoiceIds.includes(c.id);
      return turnOk && notUsed;
    });

    // Mélanger pour éviter que les pièges soient toujours en dernière position
    available = _shuffle(available);

    // Limiter à 4 choix max par action
    return available.slice(0, 4);
  }

  function _actionKey(id) {
    const map = { 1:'questions', 2:'reformulation', 3:'argumentaire', 4:'prechiffrage', 5:'enveloppe' };
    return map[id];
  }

  // ─────────────────────────────────────────────────────────
  // VALIDATION D'UN CHOIX
  // ─────────────────────────────────────────────────────────

  function selectChoice(choiceId) {
    if (state.phase !== 'choice_select') return null;

    const poolKey = _actionKey(state.selectedActionType);
    const pool = state._scenario.actionPools[poolKey];
    const choice = pool.find(c => c.id === choiceId);
    if (!choice) return null;

    // Marquer comme utilisé
    state.usedChoiceIds.push(choiceId);
    state.usedActionTypesThisTurn.push(state.selectedActionType);

    // Appliquer les effets
    const delta = choice.effects.satisfactionDelta || 0;
    _applySatisfactionDelta(delta);

    if (choice.effects.addBudgetItem) {
      state.budgetItems.push({ ...choice.effects.addBudgetItem, turn: state.currentTurn });
    }

    // Mettre à jour l'enveloppe si action de type 5
    if (state.selectedActionType === 5) {
      _updateEnveloppe(choice);
    }

    // Calculer le score du tour
    const points = choice.isTrap ? 0 : (choice.scorePoints || 0);
    const maxPoints = _getMaxPointsForAction(poolKey);

    // Journal
    const actionLabel = BQ_DATA.actionTypes.find(a => a.id === state.selectedActionType)?.label || '';
    state.journal.push({
      turn: state.currentTurn,
      actionLabel,
      choiceText: choice.text,
      delta,
      points,
      isTrap: choice.isTrap || false,
      journalEntry: choice.effects.journalEntry || '',
    });

    state.turnScores.push({ turn: state.currentTurn, points, maxPoints });
    state.totalScore += points;
    state.totalMaxScore += maxPoints;

    state.phase = 'feedback';

    return {
      choice,
      delta,
      newClientSatisfaction: state.clientSatisfaction,
      newDafSatisfaction: state.dafSatisfaction,
      points,
      journalEntry: choice.effects.journalEntry || '',
    };
  }

  function _applySatisfactionDelta(delta) {
    const cfg = BQ_DATA.config;
    // Le DAF reçoit la moitié de l'impact une fois présent
    if (state.dafPresent) {
      state.clientSatisfaction = _clamp(state.clientSatisfaction + Math.round(delta * 0.7), cfg.minSatisfaction, cfg.maxSatisfaction);
      state.dafSatisfaction    = _clamp(state.dafSatisfaction    + Math.round(delta * 0.6), cfg.minSatisfaction, cfg.maxSatisfaction);
    } else {
      state.clientSatisfaction = _clamp(state.clientSatisfaction + delta, cfg.minSatisfaction, cfg.maxSatisfaction);
    }
  }

  function _updateEnveloppe(choice) {
    // Extraire les montants depuis le texte si c'est une bonne réponse
    if (!choice.isTrap && choice.id) {
      // Heuristique simple : on repère les montants dans le texte
      const matches = choice.text.match(/(\d[\d\s]*)\s*€/g);
      if (matches && matches.length >= 2) {
        const amounts = matches.map(m => parseInt(m.replace(/\D/g, '')));
        state.budgetEstimateRange.low  = Math.min(...amounts);
        state.budgetEstimateRange.high = Math.max(...amounts);
      } else if (matches && matches.length === 1) {
        const amt = parseInt(matches[0].replace(/\D/g, ''));
        state.budgetEstimateRange.low  = Math.round(amt * 0.9);
        state.budgetEstimateRange.high = Math.round(amt * 1.1);
      }
    }
  }

  function _getMaxPointsForAction(poolKey) {
    const pool = state._scenario.actionPools[poolKey];
    if (!pool || pool.length === 0) return 20;
    return Math.max(...pool.map(c => c.scorePoints || 0));
  }

  // ─────────────────────────────────────────────────────────
  // PASSER AU TOUR SUIVANT
  // ─────────────────────────────────────────────────────────

  function nextTurn() {
    if (state.phase !== 'feedback') return null;

    state.currentTurn++;
    state.selectedActionType = null;
    state.usedActionTypesThisTurn = [];

    if (state.currentTurn > BQ_DATA.config.turnsPerGame) {
      return endGame('complete');
    }

    // Vérifier si le DAF entre en scène
    const apAtTurn = state._scenario.daf.appearsAtTurn;
    if (!state.dafPresent && apAtTurn && state.currentTurn >= apAtTurn) {
      state.dafPresent = true;
    }

    state.phase = 'action_select';
    return { turn: state.currentTurn, turnDef: _currentTurnDef() };
  }

  // ─────────────────────────────────────────────────────────
  // BILAN BUDGÉTAIRE (tour 10)
  // ─────────────────────────────────────────────────────────

  function startBilan() {
    const bilan = state._scenario?.budgetBilan;
    if (!bilan) return null;
    state.phase = 'bilan';
    return bilan;
  }

  function submitBudgetBilan(allocations) {
    const bilan = state._scenario?.budgetBilan;
    if (!bilan) return null;

    const tolerance = bilan.tolerance ?? 0.10;

    // Évaluer chaque couche
    const layerResults = bilan.layers.map(layer => {
      const userAmount = parseFloat(allocations[layer.id]) || 0;
      const diff       = layer.target > 0 ? Math.abs(userAmount - layer.target) / layer.target : 1;
      const ok         = diff <= tolerance;
      return { ...layer, userAmount, diffPct: Math.round(diff * 100), ok };
    });

    // Score bilan : % de couches dans la tolérance (pondéré égal)
    const okCount    = layerResults.filter(r => r.ok).length;
    const bilanScore = Math.round((okCount / layerResults.length) * 100);

    // Vérifier le total
    const userTotal  = bilan.layers.reduce((s, l) => s + (parseFloat(allocations[l.id]) || 0), 0);
    const totalDiff  = bilan.totalTarget > 0 ? Math.abs(userTotal - bilan.totalTarget) / bilan.totalTarget : 1;
    const totalOk    = totalDiff <= tolerance;

    state.bilanCompleted = true;
    state.bilanResult    = { layerResults, bilanScore, totalOk, userTotal };

    return {
      layerResults,
      bilanScore,
      totalOk,
      userTotal,
      targetTotal: bilan.totalTarget,
      tolerance,
    };
  }

  // ─────────────────────────────────────────────────────────
  // PARTIES PRENANTES — MODE QUESTIONNEMENT
  // ─────────────────────────────────────────────────────────

  function openStakeholder(tab) {
    const maxUses = BQ_DATA.config.stakeholderMaxUses;
    if (state.stakeholderUsed >= maxUses) {
      return { error: 'quota_exceeded', maxUses };
    }

    state.stakeholderUsed++;
    pauseTimer();

    const prevPhase = state.phase;
    state.phase = 'stakeholder';
    state._prevPhase = prevPhase;

    const hints = state._scenario.stakeholders[tab]?.hints || {};
    const hint = hints[state.currentTurn] || hints[1] || '(Pas d\'information disponible pour ce tour.)';
    const stakeholder = state._scenario.stakeholders[tab];

    return {
      tab,
      hint,
      stakeholder,
      usedCount: state.stakeholderUsed,
      remaining: maxUses - state.stakeholderUsed,
    };
  }

  function closeStakeholder() {
    state.phase = state._prevPhase || 'action_select';
    state._prevPhase = null;
    resumeTimer();
  }

  // ─────────────────────────────────────────────────────────
  // FIN DE PARTIE
  // ─────────────────────────────────────────────────────────

  function endGame(reason) {
    _clearTimer();
    state.phase = 'end';

    // Calcul du score final
    // Actions = 50%, Bilan budgétaire = 50%
    const actionRatio = state.totalMaxScore > 0 ? state.totalScore / state.totalMaxScore : 0;
    let ratio;
    if (state.bilanCompleted && state.bilanResult) {
      const bilanRatio = state.bilanResult.bilanScore / 100;
      ratio = (actionRatio * 0.5) + (bilanRatio * 0.5);
    } else {
      // Bilan non réalisé (timeout) : malus — seule la moitié des actions compte
      ratio = actionRatio * 0.5;
    }
    const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
    const passed = stars >= BQ_DATA.config.passingStars;

    // Satisfaction moyenne pondérée
    const avgSatisfaction = state.dafPresent
      ? Math.round((state.clientSatisfaction * 0.55) + (state.dafSatisfaction * 0.45))
      : state.clientSatisfaction;

    // Déterminer le feedback
    let feedbackKey = 'poor';
    if (stars === 3) feedbackKey = 'excellent';
    else if (stars === 2) feedbackKey = 'good';
    const feedbackText = state._scenario.endFeedback[feedbackKey];

    // Débloquer le niveau suivant
    if (passed) {
      const nextId = state.currentLevelId + 1;
      if (nextId <= BQ_DATA.config.maxLevel && !state.unlocked.levels.includes(nextId)) {
        state.unlocked.levels.push(nextId);
        // Synchroniser dans BQ_DATA
        const nextLevel = BQ_DATA.levels.find(l => l.id === nextId);
        if (nextLevel) nextLevel.unlocked = true;
      }
    }

    // Enregistrer le meilleur score
    const scorePercent = Math.round(ratio * 100);
    const key = String(state.currentLevelId);
    if (!state.unlocked.highScores[key] || scorePercent > state.unlocked.highScores[key]) {
      state.unlocked.highScores[key] = scorePercent;
    }

    saveProgress();

    return {
      reason,
      passed,
      stars,
      scorePercent,
      totalScore: state.totalScore,
      totalMaxScore: state.totalMaxScore,
      avgSatisfaction,
      clientSatisfaction: state.clientSatisfaction,
      dafSatisfaction: state.dafSatisfaction,
      feedbackText,
      journal: [...state.journal],
      turnScores: [...state.turnScores],
      budgetItems: [...state.budgetItems],
      budgetRange: { ...state.budgetEstimateRange },
      scenario: state._scenario,
      level: state._level,
      nextLevelUnlocked: passed ? state.currentLevelId + 1 : null,
    };
  }

  // ─────────────────────────────────────────────────────────
  // GETTERS PUBLICS
  // ─────────────────────────────────────────────────────────

  function getState() { return state; }

  function getCurrentTurnDef() { return _currentTurnDef(); }

  function getSatisfactionMood(value) {
    if (value >= 80) return 'enthusiastic';
    if (value >= 60) return 'interested';
    if (value >= 35) return 'neutral';
    return 'hostile';
  }

  function formatTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function isLevelUnlocked(levelId) {
    return state.unlocked.levels.includes(levelId);
  }

  function getHighScore(levelId) {
    return state.unlocked.highScores[String(levelId)] || null;
  }

  // Pour debug / reset
  function resetProgress() {
    state.unlocked = { levels: [1], highScores: {} };
    BQ_DATA.levels.forEach((lvl, i) => { lvl.unlocked = (i === 0); });
    saveProgress();
  }

  // ─────────────────────────────────────────────────────────
  // UTILITAIRES PRIVÉS
  // ─────────────────────────────────────────────────────────

  function _currentTurnDef() {
    if (!state._scenario) return null;
    return state._scenario.turns.find(t => t.turn === state.currentTurn) || null;
  }

  function _clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ─────────────────────────────────────────────────────────
  // API PUBLIQUE
  // ─────────────────────────────────────────────────────────
  return {
    init,
    startLevel,
    selectActionType,
    selectChoice,
    nextTurn,
    startBilan,
    submitBudgetBilan,
    openStakeholder,
    closeStakeholder,
    endGame,
    pauseTimer,
    resumeTimer,
    getState,
    getCurrentTurnDef,
    getSatisfactionMood,
    formatTimer,
    isLevelUnlocked,
    getHighScore,
    resetProgress,
  };

})();
