// ============================================================
// BudgetQuest — UI Controller
// Gère tous les écrans, modaux, animations et événements DOM
// ============================================================

window.BQ_UI = (function () {

  // ── Références DOM (remplies au init) ────────────────────
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  // ─────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────

  function init() {
    BQ_ENGINE.init();
    _bindHomeEvents();
    _bindLevelEvents();
    _bindGameEvents();
    _bindStakeholderEvents();
    _bindResultsEvents();
    showScreen('home');
  }

  // ─────────────────────────────────────────────────────────
  // NAVIGATION ENTRE ÉCRANS
  // ─────────────────────────────────────────────────────────

  function showScreen(name) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const target = $('screen-' + name);
    if (target) {
      target.classList.add('active');
      target.scrollTop = 0;
    }
  }

  // ─────────────────────────────────────────────────────────
  // ÉCRAN : ACCUEIL
  // ─────────────────────────────────────────────────────────

  function _bindHomeEvents() {
    $('btn-start')?.addEventListener('click', () => {
      renderLevels();
      showScreen('levels');
    });
    $('btn-continue')?.addEventListener('click', () => {
      renderLevels();
      showScreen('levels');
    });
  }

  // ─────────────────────────────────────────────────────────
  // ÉCRAN : SÉLECTION DE NIVEAU
  // ─────────────────────────────────────────────────────────

  function renderLevels() {
    const grid = $('levels-grid');
    if (!grid) return;
    grid.innerHTML = '';

    BQ_DATA.levels.forEach(level => {
      const unlocked = BQ_ENGINE.isLevelUnlocked(level.id);
      const hs = BQ_ENGINE.getHighScore(level.id);
      const stars = hs ? (hs >= 80 ? 3 : hs >= 50 ? 2 : 1) : 0;
      const starsHtml = [1,2,3].map(i => `<span class="star ${i <= stars ? 'filled' : ''}">${i <= stars ? '★' : '☆'}</span>`).join('');
      const diffDots = Array.from({length: 5}, (_,i) => `<span class="diff-dot ${i < level.difficulty ? 'active' : ''}"></span>`).join('');
      const comingSoon = !unlocked && level.comingSoon;

      const card = document.createElement('div');
      card.className = `level-card ${unlocked ? 'unlocked' : 'locked'} ${comingSoon ? 'coming-soon' : ''}`;
      card.innerHTML = `
        <div class="level-card-badge">${level.icon}</div>
        <div class="level-card-num">Niveau ${level.id}</div>
        <div class="level-card-name">${level.name}</div>
        <div class="level-card-sub">${level.subtitle}</div>
        <div class="level-card-budget">${level.budgetRange}</div>
        <div class="level-card-diff">${diffDots}</div>
        ${stars > 0 ? `<div class="level-card-stars">${starsHtml}</div>` : ''}
        ${hs ? `<div class="level-card-score">Meilleur : ${hs}%</div>` : ''}
        ${!unlocked ? `<div class="level-lock">🔒</div>` : ''}
        ${comingSoon ? `<div class="coming-soon-badge">Bientôt</div>` : ''}
      `;

      if (unlocked && !comingSoon) {
        card.addEventListener('click', () => startLevel(level.id));
      }
      grid.appendChild(card);
    });
  }

  function _bindLevelEvents() {
    $('btn-back-levels')?.addEventListener('click', () => showScreen('home'));
  }

  // ─────────────────────────────────────────────────────────
  // DÉMARRAGE D'UN NIVEAU
  // ─────────────────────────────────────────────────────────

  function startLevel(levelId) {
    const result = BQ_ENGINE.startLevel(levelId);
    if (!result) { showToast('Niveau non disponible.', 'warning'); return; }
    _renderBriefing(result.scenario, result.level);
    showScreen('briefing');
  }

  function _renderBriefing(scenario, level) {
    const s = scenario;

    $('briefing-level-badge').textContent = `Niveau ${level.id} — ${level.name}`;
    $('briefing-scenario-title').textContent = s.title;
    $('briefing-scenario-sub').textContent = s.subtitle;
    $('briefing-context').textContent = s.context;

    // Client
    $('briefing-client-avatar').textContent = s.client.avatar;
    $('briefing-client-name').textContent = s.client.name;
    $('briefing-client-role').textContent = s.client.role + ' · ' + s.client.company;

    // DAF
    $('briefing-daf-avatar').textContent = s.daf.avatar;
    $('briefing-daf-name').textContent = s.daf.name;
    $('briefing-daf-role').textContent = s.daf.role + ' · ' + s.client.company;
    $('briefing-daf-arrives').textContent = `Arrive au tour ${s.daf.appearsAtTurn}`;

    // Budget cible (indicatif)
    $('briefing-budget-range').textContent = level.budgetRange;

    // Compétences
    const skillsEl = $('briefing-skills');
    skillsEl.innerHTML = level.skills.map(sk => `<span class="skill-tag">${sk}</span>`).join('');
  }

  $('btn-start-mission')?.addEventListener('click', () => {
    showScreen('game');
    _initGameScreen();
  });

  // ─────────────────────────────────────────────────────────
  // ÉCRAN DE JEU — INITIALISATION
  // ─────────────────────────────────────────────────────────

  function _initGameScreen() {
    const st = BQ_ENGINE.getState();
    const scenario = st._scenario;

    // Header
    $('game-level-badge').textContent = `Niveau ${st.currentLevelId}`;
    $('game-scenario-title').textContent = scenario.title;

    // Bouton questionnement parties prenantes
    _updateStakeholderBtn();

    // Premier rendu du tour
    _renderCurrentTurn();
  }

  // ─────────────────────────────────────────────────────────
  // RENDU D'UN TOUR
  // ─────────────────────────────────────────────────────────

  function _renderCurrentTurn() {
    const st = BQ_ENGINE.getState();
    const turnDef = BQ_ENGINE.getCurrentTurnDef();
    if (!turnDef) return;

    // Compteur de tours
    $('turn-counter').textContent = `Tour ${st.currentTurn} / ${BQ_DATA.config.turnsPerGame}`;
    $('turn-title').textContent = turnDef.title;

    // Barre de progression des tours
    const pct = ((st.currentTurn - 1) / BQ_DATA.config.turnsPerGame) * 100;
    $('turn-progress-bar').style.width = pct + '%';

    // Portrait de l'interlocuteur
    _renderSpeaker(turnDef, st);

    // Dialogue
    $('dialogue-text').textContent = turnDef.dialogue;
    $('dialogue-box').className = `dialogue-box emotion-${turnDef.emotion || 'neutral'}`;

    // Satisfaction
    _renderSatisfactionBars(st, null);

    // Boutons d'action
    _renderActionButtons(turnDef);

    // Réinitialiser le panneau de choix
    $('choices-panel').innerHTML = '';
    $('choices-panel').classList.remove('visible');
    $('btn-next-turn').style.display = 'none';

    // Journal
    _renderJournal(st.journal);

    // Budget tracker
    _renderBudgetTracker(st);
  }

  function _renderSpeaker(turnDef, st) {
    const scenario = st._scenario;
    let avatar, name, role;

    if (turnDef.speaker === 'daf' && st.dafPresent) {
      avatar = scenario.daf.avatar;
      name   = scenario.daf.name;
      role   = scenario.daf.role;
    } else {
      avatar = scenario.client.avatar;
      name   = scenario.client.name;
      role   = scenario.client.role;
    }

    $('speaker-avatar').textContent = avatar;
    $('speaker-name').textContent   = name;
    $('speaker-role').textContent   = role;

    // Mood
    const satVal = (turnDef.speaker === 'daf' && st.dafPresent) ? st.dafSatisfaction : st.clientSatisfaction;
    const mood = BQ_ENGINE.getSatisfactionMood(satVal);
    $('speaker-avatar').className = `speaker-avatar mood-${mood}`;
  }

  function _renderSatisfactionBars(st, delta) {
    // Client
    const clientPct = st.clientSatisfaction;
    const clientBar = $('client-sat-bar');
    clientBar.style.width = clientPct + '%';
    clientBar.style.background = _satColor(clientPct);
    $('client-sat-label').textContent = st._scenario.client.name.split(' ')[0];
    $('client-sat-value').textContent = clientPct + '%';
    $('client-sat-mood').textContent  = _satEmoji(clientPct);

    // DAF (visible seulement si présent)
    const dafSection = $('daf-sat-section');
    if (st.dafPresent) {
      dafSection.style.display = '';
      const dafPct = st.dafSatisfaction;
      const dafBar = $('daf-sat-bar');
      dafBar.style.width = dafPct + '%';
      dafBar.style.background = _satColor(dafPct);
      $('daf-sat-label').textContent = st._scenario.daf.name.split(' ')[0];
      $('daf-sat-value').textContent = dafPct + '%';
      $('daf-sat-mood').textContent  = _satEmoji(dafPct);
    } else {
      dafSection.style.display = 'none';
    }

    // Animation si delta
    if (delta !== null && delta !== 0) {
      const el = $('sat-delta-indicator');
      el.textContent = (delta > 0 ? '+' : '') + delta;
      el.className   = `sat-delta ${delta > 0 ? 'positive' : 'negative'}`;
      el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 1800);

      // Pulse sur la barre
      clientBar.classList.add(delta > 0 ? 'pulse-pos' : 'pulse-neg');
      setTimeout(() => clientBar.classList.remove('pulse-pos', 'pulse-neg'), 700);
    }
  }

  function _satColor(pct) {
    if (pct >= 75) return 'linear-gradient(90deg, #059669, #10b981)';
    if (pct >= 50) return 'linear-gradient(90deg, #d97706, #fbbf24)';
    return 'linear-gradient(90deg, #dc2626, #ef4444)';
  }

  function _satEmoji(pct) {
    if (pct >= 80) return '😊';
    if (pct >= 60) return '🙂';
    if (pct >= 35) return '😐';
    return '😠';
  }

  // ─────────────────────────────────────────────────────────
  // BOUTONS D'ACTION
  // ─────────────────────────────────────────────────────────

  function _renderActionButtons(turnDef) {
    const container = $('action-buttons');
    container.innerHTML = '';

    BQ_DATA.actionTypes.forEach(at => {
      const available = turnDef.availableActions.includes(at.id);
      const reason    = turnDef.lockedReasons ? turnDef.lockedReasons[at.id] : null;

      const btn = document.createElement('button');
      btn.className = `action-btn ${available ? 'available' : 'locked'}`;
      btn.dataset.actionId = at.id;
      btn.style.setProperty('--action-color', at.color);
      btn.innerHTML = `
        <span class="action-icon">${at.icon}</span>
        <span class="action-label">${at.label}</span>
        ${!available && reason ? `<span class="action-lock-reason">${reason}</span>` : ''}
      `;

      if (available) {
        btn.addEventListener('click', () => _onActionSelected(at.id));
      } else {
        btn.title = reason || 'Non disponible ce tour.';
      }
      container.appendChild(btn);
    });
  }

  function _onActionSelected(actionTypeId) {
    const choices = BQ_ENGINE.selectActionType(actionTypeId);
    if (!choices) return;

    // Highlight le bouton sélectionné
    $$('.action-btn').forEach(b => b.classList.remove('selected'));
    $$('.action-btn').forEach(b => {
      if (parseInt(b.dataset.actionId) === actionTypeId) b.classList.add('selected');
    });

    if (!choices || choices.length === 0) {
      showToast('Plus de choix disponibles pour cette action.', 'info');
      BQ_ENGINE.getState().phase = 'action_select';
      return;
    }

    _renderChoices(choices, actionTypeId);
  }

  // ─────────────────────────────────────────────────────────
  // PANNEAU DE CHOIX
  // ─────────────────────────────────────────────────────────

  function _renderChoices(choices, actionTypeId) {
    const panel = $('choices-panel');
    const actionType = BQ_DATA.actionTypes.find(a => a.id === actionTypeId);
    panel.innerHTML = '';
    panel.classList.add('visible');

    const header = document.createElement('div');
    header.className = 'choices-header';
    header.innerHTML = `
      <span class="choices-title" style="color:${actionType.color}">${actionType.icon} ${actionType.label}</span>
      <span class="choices-hint">Choisissez une option — attention aux pièges cachés !</span>
    `;
    panel.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'choices-grid';

    choices.forEach(choice => {
      const card = document.createElement('div');
      card.className = 'choice-card';
      card.dataset.choiceId = choice.id;
      card.innerHTML = `
        <div class="choice-text">${choice.text}</div>
        ${choice.tooltip ? `<div class="choice-tooltip">💡 ${choice.tooltip}</div>` : ''}
      `;
      card.addEventListener('click', () => _onChoiceSelected(choice.id, card, choices));
      grid.appendChild(card);
    });

    panel.appendChild(grid);

    // Scroll vers le panel
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function _onChoiceSelected(choiceId, cardEl, choices) {
    const result = BQ_ENGINE.selectChoice(choiceId);
    if (!result) return;

    const choice = result.choice;

    // Désactiver tous les cards
    $$('.choice-card').forEach(c => {
      c.style.pointerEvents = 'none';
      c.classList.add('dimmed');
    });
    cardEl.classList.remove('dimmed');
    cardEl.classList.add(choice.isTrap ? 'selected-trap' : 'selected-good');

    if (choice.isTrap && choice.trapReveal) {
      const trapEl = document.createElement('div');
      trapEl.className = 'trap-reveal';
      trapEl.innerHTML = `<span class="trap-icon">⚠️</span> ${choice.trapReveal}`;
      cardEl.appendChild(trapEl);
    }

    // Mise à jour des barres de satisfaction avec animation
    const st = BQ_ENGINE.getState();
    _renderSatisfactionBars(st, result.delta);

    // Toast feedback
    const toastType = choice.isTrap ? 'trap' : (result.delta > 0 ? 'success' : 'warning');
    showToast(result.journalEntry, toastType);

    // Journal & budget
    _renderJournal(st.journal);
    _renderBudgetTracker(st);

    // Score du tour
    _showTurnScore(result.points, choice.isTrap);

    // Bouton "Tour suivant"
    const nextBtn = $('btn-next-turn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = st.currentTurn < BQ_DATA.config.turnsPerGame ? 'Tour suivant →' : 'Terminer la partie →';
  }

  function _showTurnScore(points, isTrap) {
    const el = $('turn-score-badge');
    el.textContent = isTrap ? '⚠️ Piège ! +0 pts' : `+${points} pts`;
    el.className   = `turn-score-badge ${isTrap ? 'trap' : points > 10 ? 'good' : 'ok'}`;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 2500);
  }

  // ─────────────────────────────────────────────────────────
  // JOURNAL
  // ─────────────────────────────────────────────────────────

  function _renderJournal(journal) {
    const el = $('game-journal');
    if (!el || journal.length === 0) return;
    el.innerHTML = journal.slice(-6).reverse().map(entry => `
      <div class="journal-entry ${entry.isTrap ? 'trap' : entry.delta > 0 ? 'positive' : 'negative'}">
        <span class="journal-turn">T${entry.turn}</span>
        <span class="journal-action">${entry.actionLabel}</span>
        <span class="journal-delta ${entry.delta > 0 ? 'pos' : 'neg'}">${entry.delta > 0 ? '+' : ''}${entry.delta}</span>
      </div>
    `).join('');
  }

  // ─────────────────────────────────────────────────────────
  // BUDGET TRACKER
  // ─────────────────────────────────────────────────────────

  function _renderBudgetTracker(st) {
    const el = $('budget-items-list');
    if (!el) return;

    if (st.budgetItems.length === 0) {
      el.innerHTML = '<div class="budget-empty">Aucun poste estimé</div>';
    } else {
      const total = st.budgetItems.reduce((s, i) => s + (i.amount || 0), 0);
      el.innerHTML = st.budgetItems.map(item => `
        <div class="budget-item">
          <span class="budget-item-label">${item.label}</span>
          <span class="budget-item-amount">${item.amount ? _fmt(item.amount) : 'À évaluer'}</span>
        </div>
      `).join('') + (total > 0 ? `<div class="budget-total"><b>Sous-total</b><b>${_fmt(total)}</b></div>` : '');
    }

    // Enveloppe globale
    const range = st.budgetEstimateRange;
    if (range.low > 0 || range.high > 0) {
      $('budget-envelope-display').textContent = `${_fmt(range.low)} – ${_fmt(range.high)}`;
      $('budget-envelope-display').style.display = 'block';
    }
  }

  // ─────────────────────────────────────────────────────────
  // TIMER
  // ─────────────────────────────────────────────────────────

  function onTimerTick(remaining) {
    const el = $('game-timer');
    if (!el) return;
    el.textContent = BQ_ENGINE.formatTimer(remaining);
    el.className = 'game-timer' + (remaining <= 60 ? ' critical' : remaining <= 120 ? ' warning' : '');
  }

  // ─────────────────────────────────────────────────────────
  // BOUTON TOUR SUIVANT
  // ─────────────────────────────────────────────────────────

  function _bindGameEvents() {
    $('btn-next-turn')?.addEventListener('click', () => {
      const result = BQ_ENGINE.nextTurn();
      if (!result) return; // endGame déjà appelé

      if (BQ_ENGINE.getState().phase === 'end') {
        // Cas : nextTurn a déclenché endGame
        return;
      }

      $('btn-next-turn').style.display = 'none';
      _renderCurrentTurn();
    });

    // Remplacer le bouton "start mission" ici aussi
    const btnMission = $('btn-start-mission');
    if (btnMission) {
      btnMission.addEventListener('click', () => {
        showScreen('game');
        _initGameScreen();
      });
    }

    // Mettre à jour la progression globale
    _renderGlobalProgress();
  }

  function _renderGlobalProgress() {
    const el = $('global-progress-track');
    if (!el) return;
    el.innerHTML = BQ_DATA.levels.map(l => {
      const unlocked = BQ_ENGINE.isLevelUnlocked(l.id);
      const hs = BQ_ENGINE.getHighScore(l.id);
      return `<div class="gp-dot ${unlocked ? 'unlocked' : 'locked'} ${hs ? 'done' : ''}" title="Niv. ${l.id} — ${l.name}">${l.id}</div>`;
    }).join('');
  }

  // ─────────────────────────────────────────────────────────
  // MODE QUESTIONNEMENT PARTIES PRENANTES
  // ─────────────────────────────────────────────────────────

  function _updateStakeholderBtn() {
    const st = BQ_ENGINE.getState();
    const max = BQ_DATA.config.stakeholderMaxUses;
    const remaining = max - st.stakeholderUsed;
    const btn = $('btn-stakeholder');
    if (!btn) return;
    btn.textContent = `👥 Consulter (${remaining} restant${remaining > 1 ? 's' : ''})`;
    btn.disabled = remaining <= 0;
    btn.classList.toggle('exhausted', remaining <= 0);
  }

  function _bindStakeholderEvents() {
    $('btn-stakeholder')?.addEventListener('click', () => _openStakeholderModal('expert'));

    $$('.stakeholder-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabKey = tab.dataset.tab;
        _switchStakeholderTab(tabKey);
      });
    });

    $('btn-close-stakeholder')?.addEventListener('click', () => {
      BQ_ENGINE.closeStakeholder();
      $('modal-stakeholder').classList.remove('visible');
      _updateStakeholderBtn();
    });
  }

  function _openStakeholderModal(defaultTab) {
    const result = BQ_ENGINE.openStakeholder(defaultTab);
    const modal  = $('modal-stakeholder');

    if (result.error === 'quota_exceeded') {
      showToast(`Vous avez épuisé vos ${result.maxUses} consultations disponibles.`, 'warning');
      return;
    }

    $('stakeholder-remaining').textContent = `${result.remaining} consultation${result.remaining > 1 ? 's' : ''} restante${result.remaining > 1 ? 's' : ''}`;

    _switchStakeholderTab(defaultTab, result);
    modal.classList.add('visible');
  }

  function _switchStakeholderTab(tab, initialResult) {
    const st = BQ_ENGINE.getState();

    $$('.stakeholder-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    let data;
    if (initialResult && initialResult.tab === tab) {
      data = initialResult;
    } else {
      // Pour changer d'onglet sans consommer une utilisation
      const hints = st._scenario.stakeholders[tab]?.hints || {};
      const hint  = hints[st.currentTurn] || hints[1] || '(Pas d\'information disponible.)';
      const stakeholder = st._scenario.stakeholders[tab];
      data = { tab, hint, stakeholder };
    }

    if (data.stakeholder) {
      $('stakeholder-avatar').textContent  = data.stakeholder.avatar;
      $('stakeholder-name').textContent    = data.stakeholder.name;
    }
    $('stakeholder-hint').textContent = data.hint;
  }

  // ─────────────────────────────────────────────────────────
  // ÉCRAN : RÉSULTATS
  // ─────────────────────────────────────────────────────────

  function showResults(gameResult) {
    const r = gameResult;

    $('result-scenario-title').textContent = r.scenario.title;
    $('result-level-badge').textContent = `Niveau ${r.level.id} — ${r.level.name}`;

    // Score circulaire
    _animateScoreCircle(r.scorePercent);

    // Étoiles
    [1,2,3].forEach(i => {
      const el = $(`result-star-${i}`);
      if (el) {
        el.textContent = i <= r.stars ? '★' : '☆';
        el.className = `result-star ${i <= r.stars ? 'filled' : ''}`;
        if (i <= r.stars) {
          setTimeout(() => el.classList.add('pop'), i * 250);
        }
      }
    });

    // Badge résultat
    const badge = $('result-badge');
    badge.textContent = r.passed ? '🏆 Niveau validé !' : '🔄 Niveau non validé';
    badge.className   = `result-badge ${r.passed ? 'passed' : 'failed'}`;

    // Satisfaction
    $('result-client-sat').textContent = r.clientSatisfaction + '%';
    $('result-daf-sat').textContent    = r.dafSatisfaction + '%';
    $('result-avg-sat').textContent    = r.avgSatisfaction + '%';

    // Feedback
    $('result-feedback-text').textContent = r.feedbackText;

    // Journal des décisions
    _renderResultJournal(r.journal);

    // Budget recap
    _renderResultBudget(r);

    // Boutons
    const btnNext = $('btn-next-level');
    if (r.passed && r.nextLevelUnlocked && r.nextLevelUnlocked <= BQ_DATA.config.maxLevel) {
      btnNext.style.display = '';
      btnNext.textContent   = `Niveau ${r.nextLevelUnlocked} débloqué → Jouer`;
      btnNext.onclick = () => {
        renderLevels();
        showScreen('levels');
      };
    } else {
      btnNext.style.display = 'none';
    }

    showScreen('results');
  }

  function _animateScoreCircle(pct) {
    const circle = $('score-circle-fill');
    if (!circle) return;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray  = circumference;
    circle.style.strokeDashoffset = circumference;
    circle.style.stroke = pct >= 80 ? '#10b981' : pct >= 50 ? '#fbbf24' : '#ef4444';

    $('score-circle-text').textContent = '0%';
    let current = 0;
    const step  = pct / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, pct);
      circle.style.strokeDashoffset = circumference - (circumference * current / 100);
      $('score-circle-text').textContent = Math.round(current) + '%';
      if (current >= pct) clearInterval(timer);
    }, 16);
  }

  function _renderResultJournal(journal) {
    const el = $('result-journal');
    if (!el) return;
    el.innerHTML = journal.map(entry => `
      <tr class="${entry.isTrap ? 'row-trap' : entry.delta >= 0 ? 'row-good' : 'row-bad'}">
        <td>T${entry.turn}</td>
        <td>${entry.actionLabel}</td>
        <td class="entry-choice">${entry.choiceText}</td>
        <td>${entry.isTrap ? '⚠️ Piège' : entry.delta > 0 ? `<span class="delta-pos">+${entry.delta}</span>` : `<span class="delta-neg">${entry.delta}</span>`}</td>
        <td><b>${entry.points} pts</b></td>
      </tr>
    `).join('');
  }

  function _renderResultBudget(r) {
    const el = $('result-budget');
    if (!el) return;
    if (r.budgetItems.length === 0) {
      el.innerHTML = '<p class="budget-empty">Aucun poste budgétaire estimé pendant la partie.</p>';
      return;
    }
    const total = r.budgetItems.reduce((s, i) => s + (i.amount || 0), 0);
    const target = r.scenario.targetBudget;
    let accuracy = '';
    if (total > 0) {
      const diff = total - target.ideal;
      const pct  = Math.abs(diff) / target.ideal * 100;
      accuracy = pct < 10 ? '✅ Excellent' : pct < 25 ? '🟡 Acceptable' : '❌ À retravailler';
    }
    el.innerHTML = r.budgetItems.map(i =>
      `<div class="budget-item"><span>${i.label}</span><span>${i.amount ? _fmt(i.amount) : 'À évaluer'}</span></div>`
    ).join('') +
      `<div class="budget-total"><b>Total estimé</b><b>${_fmt(total)}</b></div>` +
      (accuracy ? `<div class="budget-accuracy">${accuracy} · Cible : ${_fmt(target.min)}–${_fmt(target.max)}</div>` : '');
  }

  function _bindResultsEvents() {
    $('btn-retry')?.addEventListener('click', () => {
      const st = BQ_ENGINE.getState();
      if (st.currentLevelId) startLevel(st.currentLevelId);
    });
    $('btn-levels-from-results')?.addEventListener('click', () => {
      renderLevels();
      showScreen('levels');
    });
  }

  // ─────────────────────────────────────────────────────────
  // TOAST NOTIFICATIONS
  // ─────────────────────────────────────────────────────────

  function showToast(message, type = 'info') {
    const container = $('toast-container');
    if (!container) return;

    const icons = { success:'✅', warning:'⚠️', trap:'🪤', info:'💡', error:'❌' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || '💬'}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('dismissing'), 3200);
    setTimeout(() => toast.remove(), 3700);
  }

  // ─────────────────────────────────────────────────────────
  // CALLBACK DU MOTEUR — fin de partie déclenchée par timer
  // ─────────────────────────────────────────────────────────

  // Appelé par engine.js via nextTurn() quand tous les tours sont passés
  // ou directement si endGame est déclenché
  function onGameEnd(gameResult) {
    showResults(gameResult);
  }

  // Patch nextTurn dans BQ_ENGINE pour détecter la fin
  const _origNextTurn = BQ_ENGINE.nextTurn.bind(BQ_ENGINE);
  BQ_ENGINE.nextTurn = function () {
    const st = BQ_ENGINE.getState();
    if (st.currentTurn >= BQ_DATA.config.turnsPerGame) {
      const result = BQ_ENGINE.endGame('complete');
      showResults(result);
      return null;
    }
    return _origNextTurn();
  };

  // ─────────────────────────────────────────────────────────
  // UTILITAIRES
  // ─────────────────────────────────────────────────────────

  function _fmt(n) {
    return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(n);
  }

  // ─────────────────────────────────────────────────────────
  // API PUBLIQUE
  // ─────────────────────────────────────────────────────────
  return {
    init,
    showScreen,
    renderLevels,
    startLevel,
    showResults,
    showToast,
    onTimerTick,
    onGameEnd,
  };

})();

// Démarrage automatique une fois le DOM chargé
document.addEventListener('DOMContentLoaded', () => BQ_UI.init());
