// ============================================================
// BudgetQuest — Data Layer
// window.BQ_DATA : tout le contenu du jeu (niveaux, scénarios,
// actions, parties prenantes)
// ============================================================

window.BQ_DATA = {

  config: {
    turnsPerGame: 10,
    timeLimit: 1200,        // 20 minutes en secondes
    maxLevel: 10,
    passingStars: 2,
    stakeholderMaxUses: 2,
    maxSatisfaction: 100,
    minSatisfaction: 0,
  },

  // ── 5 types d'action fixes ──────────────────────────────────
  actionTypes: [
    { id: 1, key: 'questions',      label: 'Poser des questions',         icon: '❓', color: '#7c3aed', description: 'Interrogez votre interlocuteur pour clarifier le besoin et les contraintes.' },
    { id: 2, key: 'reformulation',  label: 'Reformuler le besoin',        icon: '🔄', color: '#0891b2', description: 'Synthétisez ce que vous avez compris pour valider avec le client.' },
    { id: 3, key: 'argumentaire',   label: 'Commencer un argumentaire',   icon: '💼', color: '#d97706', description: 'Développez un argument pour justifier votre approche ou votre budget.' },
    { id: 4, key: 'prechiffrage',   label: 'Pré-chiffrer des éléments',   icon: '🔢', color: '#059669', description: 'Estimez des postes budgétaires spécifiques pour construire votre chiffrage.' },
    { id: 5, key: 'enveloppe',      label: "Estimer l'enveloppe initiale", icon: '💰', color: '#ca8a04', description: 'Proposez une fourchette budgétaire globale pour le projet.' },
  ],

  // ── Définitions des 10 niveaux ──────────────────────────────
  levels: [
    { id:1,  name:'Budget de Lot Projet',         subtitle:'Junior Consultant',     icon:'🌱', difficulty:1, budgetRange:'20k€ – 80k€',      sector:'Digital / Transformation', description:"Maîtrisez le chiffrage d'un lot dans un projet simple. Apprenez à écouter, questionner et estimer face à votre premier client.", unlocked:true,  comingSoon:false, scenarios:['1-A','1-B'], skills:['Écoute active','Chiffrage JH','Identification des besoins'] },
    { id:2,  name:'Projet Complet',                subtitle:'Consultant',            icon:'🌿', difficulty:2, budgetRange:'80k€ – 300k€',     sector:'Industrie / ERP',          description:"Gérez le budget d'un projet complet multi-lots avec des imprévus. La négociation commence.", unlocked:false, comingSoon:false, scenarios:['2-A'], skills:['Découpage en lots','Gestion des risques','Négociation initiale'] },
    { id:3,  name:'Projet Multi-équipes',          subtitle:'Consultant Senior',     icon:'🌳', difficulty:3, budgetRange:'300k€ – 800k€',    sector:'Banque / Finance',         description:"Coordonnez les budgets de plusieurs équipes avec des dépendances complexes et des arbitrages.", unlocked:false, comingSoon:false, scenarios:[], skills:['Arbitrage','Budget multi-équipes','Reporting COMEX'] },
    { id:4,  name:'Programme de Transformation',   subtitle:'Manager',               icon:'🏗️', difficulty:4, budgetRange:'800k€ – 2M€',      sector:'Retail / Supply Chain',    description:"Pilotez un programme de transformation avec contraintes réglementaires et parties prenantes multiples.", unlocked:false, comingSoon:false, scenarios:[], skills:['Gouvernance programme','Réglementaire','Change management'] },
    { id:5,  name:'Programme Critique',            subtitle:'Senior Manager',        icon:'⚡', difficulty:5, budgetRange:'2M€ – 5M€',        sector:'Santé / Pharma',           description:"Gérez un programme critique avec événements aléatoires fréquents et enjeux réglementaires.", unlocked:false, comingSoon:false, scenarios:[], skills:['Budget prévisionnel','Gestion de crise','Relations investisseurs'] },
    { id:6,  name:'Portefeuille Sectoriel',        subtitle:'Director',              icon:'🗂️', difficulty:6, budgetRange:'5M€ – 15M€',       sector:'Énergie / Utilities',      description:"Arbitrez entre plusieurs projets en compétition pour des ressources limitées.", unlocked:false, comingSoon:false, scenarios:[], skills:['Portfolio management','Arbitrage stratégique','ROI multi-projets'] },
    { id:7,  name:'Transformation Digitale',       subtitle:'Senior Director',       icon:'💡', difficulty:7, budgetRange:'15M€ – 40M€',      sector:'Assurance / Digital',      description:"Pilotez une transformation digitale avec lobbying interne et résistances organisationnelles.", unlocked:false, comingSoon:false, scenarios:[], skills:['Lobbying interne','Stratégie digitale','Conduite du changement'] },
    { id:8,  name:'Portefeuille Réglementaire',    subtitle:'VP / Associate Partner',icon:'⚖️', difficulty:8, budgetRange:'40M€ – 100M€',     sector:'Services Financiers',      description:"Naviguez entre DORA, RGPD, Bâle IV et objectifs de performance.", unlocked:false, comingSoon:false, scenarios:[], skills:['Conformité réglementaire','Budget compliance','Risk management'] },
    { id:9,  name:'Programme Cyber & Sécurité',    subtitle:'Partner',               icon:'🔐', difficulty:9, budgetRange:'100M€ – 250M€',    sector:'Défense / Cyber',          description:"Défendez un budget cybersécurité face à des décideurs sceptiques lors d'une crise.", unlocked:false, comingSoon:false, scenarios:[], skills:['Cybersécurité budget','Gestion de crise','Communication C-level'] },
    { id:10, name:'Portefeuille Complexe',         subtitle:'Expert / Managing Partner',icon:'👑',difficulty:10,budgetRange:'> 250M€',          sector:'Multi-secteurs',           description:"Le niveau ultime : portefeuille multi-pays avec cyber, réglementaire, lobbying et arbitrages politiques.", unlocked:false, comingSoon:false, scenarios:[], skills:['Portfolio complexe','Politique d\'entreprise','Maîtrise totale'] },
  ],

  // ── Scénarios ────────────────────────────────────────────────
  scenarios: {

    // ════════════════════════════════════════════════════════════
    // NIVEAU 1 — SCÉNARIO A : Le CRM de PharmaConnect
    // ════════════════════════════════════════════════════════════
    '1-A': {
      id: '1-A', levelId: 1,
      title: 'Le CRM de PharmaConnect',
      subtitle: 'Modernisation commerciale · 50 utilisateurs',
      client: { name:'Sophie Renard', role:'Directrice Commerciale', company:'PharmaConnect', avatar:'👩‍💼', initialSatisfaction:55 },
      daf:    { name:'François Blanc', role:'Directeur Administratif & Financier', avatar:'👨‍💼', appearsAtTurn:3, initialSatisfaction:45 },
      context: "PharmaConnect est un distributeur pharmaceutique de 200 collaborateurs. Leur force commerciale de 50 personnes pilote encore ses opportunités sous Excel. Le DG a donné pour objectif de moderniser le processus commercial avant Q4.",
      targetBudget: { min:45000, max:58000, ideal:51000 },

      stakeholders: {
        client: { name:'Sophie Renard', avatar:'👩‍💼', hints: {
          1:"🤫 Sophie pense : « J'espère qu'ils vont d'abord comprendre nos vrais problèmes avant de sortir une solution toute faite... »",
          2:"🤫 Sophie confie : « Nos 10 commerciaux terrain ont des téléphones Android. Il faudra que le CRM fonctionne en mobile. »",
          3:"🤫 Sophie avoue : « Le vrai budget qu'on peut débloquer est autour de 55 000€. Le DG a validé mais François ne sait pas encore. »",
          4:"🤫 Sophie pense : « François va tout faire pour réduire. Il leur faut des arguments béton sur le ROI. »",
          5:"🤫 Sophie révèle : « Notre ERP SAGE est la version 2014 — la migration des données clients sera le vrai défi technique. »",
          6:"🤫 Sophie confie : « Les 15k€ que citent nos concurrents, c'est sans intégration ni formation. Incomparable. »",
          7:"🤫 Sophie pense : « Si le consultant propose quelque chose de trop cher ou trop technique, je vais perdre mon DG. »",
          8:"🤫 Sophie révèle : « Notre COMEX se réunit le 15 du mois prochain. Il nous faut un chiffrage validé avant. »",
          9:"🤫 Sophie pense : « Je veux une décomposition claire : licences + paramétrage + formation. Pas un chiffre global opaque. »",
          10:"🤫 Sophie confie : « Si le consultant défend bien son budget au COMEX, j'ai promis de recommander leur cabinet pour le prochain AO. »",
        }},
        daf: { name:'François Blanc', avatar:'👨‍💼', hints: {
          1:"💼 François (pas encore là) est réputé pour rejeter les projets sans ROI documenté.",
          2:"💼 Une source interne : François a déjà refusé un projet CRM l'an dernier pour « chiffrage insuffisant ».",
          3:"💼 François pense : « Je vais challenger chaque ligne. Ce consultant doit me prouver qu'il connaît son sujet. »",
          4:"💼 François cherche : une décomposition en postes (licences / intégration / formation), pas un chiffre global.",
          5:"💼 François confie à voix basse : « Le plafond réel est 60 000€ mais je ne le dirai pas. J'attends qu'ils argumentent. »",
          6:"💼 François pense : « Un projet à 15k€ n'existe pas — s'ils y croient, j'ai affaire à des débutants. »",
          7:"💼 François veut voir : analyse des risques si le projet dépasse budget ou délai.",
          8:"💼 François : « Je validerai si j'ai : 3 postes détaillés, un ROI sur 18 mois, une provision pour risques. »",
          9:"💼 François pense : « La fourchette 45k-55k me semble raisonnable si c'est bien justifié. »",
          10:"💼 François au COMEX sera favorable si le consultant a répondu à toutes ses questions sur le détail des coûts.",
        }},
        expert: { name:'Laure M. (Senior Consultant)', avatar:'🧑‍💻', hints: {
          1:"💡 Conseil : Commencez par les questions d'intégration système. C'est là que se cachent souvent 30% des coûts.",
          2:"💡 Conseil : Demandez combien d'utilisateurs sont vraiment actifs vs. qui a juste besoin d'un accès lecture.",
          3:"💡 Conseil : Avec un DAF strict, utilisez la technique des 3 postes : Licences / Mise en œuvre / Accompagnement.",
          4:"💡 Conseil : Ne jamais donner un chiffre unique. Toujours une fourchette avec la variable qui justifie l'écart.",
          5:"💡 Conseil : L'intégration ERP SAGE peut coûter entre 8k et 20k€ selon l'état de la base existante.",
          6:"💡 Conseil : Face à « nos concurrents font ça moins cher », demandez ce qui est hors périmètre de leur offre.",
          7:"💡 Conseil : Accès mobile responsive = souvent suffisant. App native = +30-50% du budget. Bien qualifier.",
          8:"💡 Conseil : Budget idéal pour ce profil : 45-55k€. En dessous = manque crédibilité. Au-dessus sans ROI = refus.",
          9:"💡 Conseil : Décomposition recommandée : Licences 22k€/an · Intégration 12k€ · Formation 8k€ · Provision 8k€.",
          10:"💡 Conseil : En défense de budget, commencez par le ROI, puis la décomposition, puis les risques si refus.",
        }},
      },

      turns: [
        { turn:1,  title:'La présentation du besoin',   speaker:'client', dialogue:"Bonjour et merci de nous recevoir. Notre situation : 50 commerciaux qui travaillent encore sur Excel, c'est ingérable. On perd des opportunités, personne ne sait qui suit quoi. Notre DG a dit « CRM avant Q4 ». J'ai pensé à quelque chose autour de 30 000€. Qu'est-ce que vous pouvez faire pour nous ?",     emotion:'neutral',     availableActions:[1,4], lockedReasons:{ 2:"Vous n'avez pas encore assez d'info pour reformuler.", 3:"Trop tôt pour argumenter — d'abord comprendre.", 5:"Ne jamais estimer avant d'avoir qualifié le besoin." } },
        { turn:2,  title:'Creuser le besoin',           speaker:'client', dialogue:"Ce que vous me dites est intéressant. On a 200 collaborateurs en tout, mais le CRM c'est pour les 50 commerciaux. Ils ont tous un portable professionnel. On utilise SAGE comme ERP depuis 10 ans. Est-ce que ça change quelque chose ?",      emotion:'interested',   availableActions:[1,2,4], lockedReasons:{ 3:"Pas encore assez de matière pour argumenter.", 5:"Construisez d'abord votre chiffrage poste par poste." } },
        { turn:3,  title:"L'entrée du DAF",             speaker:'daf',    dialogue:"Je me joins à cette réunion si vous le permettez. François Blanc, DAF de PharmaConnect. 30 000€ c'est le budget annoncé, mais j'ai besoin de comprendre ce qui justifie chaque euro. Un CRM c'est des licences, de la mise en œuvre, de la formation... Vous pouvez détailler ?",      emotion:'strict',       availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:4,  title:'Le challenge budgétaire',     speaker:'daf',    dialogue:"J'ai regardé en ligne — des CRM à 30€/utilisateur/mois existent. Pour 50 personnes : 18 000€/an. Avec une provision de 20%, ça fait 21 600€. Expliquez-moi la différence.",                                                          emotion:'challenging',   availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:5,  title:'La contrainte technique',     speaker:'client', dialogue:"Ah oui, j'allais mentionner — notre SAGE est la version 2014, pas du tout dans le cloud. Et on a des données clients depuis 15 ans. Il faudra sûrement tout migrer et connecter les deux outils. C'est faisable ?",                         emotion:'worried',       availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:6,  title:'La pression concurrentielle', speaker:'client', dialogue:"J'ai parlé à un autre cabinet hier. Ils nous proposent un CRM complet pour 15 000€. Franchement, c'est la moitié de ce que vous avancez. Comment vous justifiez cette différence ?",                                                        emotion:'skeptical',     availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:7,  title:'Les exigences cachées',       speaker:'client', dialogue:"Au fait, 10 de nos commerciaux sont en itinérance totale. Il leur faudrait absolument un accès mobile, idéalement avec une vraie app. Et ils ont des connexions parfois instables. C'est intégrable dans ce qu'on a discuté ?",               emotion:'concerned',     availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:8,  title:'Le plafond révélé',           speaker:'daf',    dialogue:"Soyons francs. Notre plafond de décision sans passer par le conseil d'administration est de 55 000€. Si votre proposition dépasse ce seuil, ça devient beaucoup plus compliqué à valider. Dans cette enveloppe, qu'est-ce que vous pouvez livrer ?", emotion:'direct',        availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:9,  title:'La proposition finale',       speaker:'client', dialogue:"Vous avez maintenant tous les éléments. Notre COMEX se réunit dans 15 jours. On a besoin de votre proposition budgétaire détaillée : quel périmètre, quel budget, quelle garantie de délai. Je vous écoute.",                               emotion:'attentive',     availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:10, title:'La défense au COMEX',         speaker:'daf',    dialogue:"Notre DG est maintenant avec nous. Sa question : pourquoi ce budget et pas moins ? Qu'est-ce qui se passe si on réduit de 20% ? Et quel est votre engagement sur le délai Q4 ? Défendez votre position.",                                       emotion:'formal',        availableActions:[1,2,3,5], lockedReasons:{ 4:"L'heure n'est plus au chiffrage — défendez votre budget." } },
      ],

      actionPools: {
        questions: [
          { id:'q1',  minTurn:1, text:"Quels sont les principaux dysfonctionnements avec votre système actuel ?",                        isTrap:false, effects:{ satisfactionDelta:10, journalEntry:"Bonne question d'ouverture — vous cherchez à comprendre avant de vendre." },                                                                                    scorePoints:14 },
          { id:'q2',  minTurn:1, text:"Combien d'utilisateurs seront actifs au lancement vs. à terme ?",                                isTrap:false, effects:{ satisfactionDelta:8,  journalEntry:"Question pertinente — vous anticipez la scalabilité du projet et l'impact sur les licences." },                                                            scorePoints:11 },
          { id:'q3',  minTurn:1, text:"Quels systèmes devront être connectés au CRM ?",                                                  isTrap:false, effects:{ satisfactionDelta:12, addBudgetItem:{ label:"Intégration systèmes (à évaluer)", amount:0 }, journalEntry:"Excellente question — l'intégration ERP peut représenter 20-30% du budget total." },  scorePoints:17 },
          { id:'q4',  minTurn:1, text:"Votre budget de 30 000€, est-il négociable ?",                                                   isTrap:true,  trapReveal:"Vous avez mis la charrue avant les bœufs. Sophie vous regarde avec méfiance — vous semblez déjà penser à la vente avant d'écouter.", effects:{ satisfactionDelta:-12, journalEntry:"Piège ! Parler budget avant de qualifier le besoin diminue votre crédibilité." }, scorePoints:0 },
          { id:'q5',  minTurn:2, text:"Qui sera le chef de projet côté client et combien de temps peut-il y consacrer ?",               isTrap:false, effects:{ satisfactionDelta:7,  journalEntry:"Question smart — l'engagement côté client impacte directement les JH et les délais." },                                                                  scorePoints:10 },
          { id:'q6',  minTurn:2, text:"Quelle est la priorité absolue : fonctionnalités, délai ou budget ?",                            isTrap:false, effects:{ satisfactionDelta:9,  journalEntry:"Question stratégique — vous montrez que vous connaissez le triangle coût-délai-périmètre." },                                                             scorePoints:13 },
          { id:'q7',  minTurn:2, text:"Pourquoi n'avez-vous pas mis en place un CRM plus tôt ?",                                        isTrap:true,  trapReveal:"Sophie se raidit : « Ce n'est pas vraiment la question, non ? » Vous avez été perçu comme condescendant.", effects:{ satisfactionDelta:-8, journalEntry:"Piège ! Cette question paraît accusatrice. Préférez les questions orientées vers l'avenir." }, scorePoints:0 },
          { id:'q8',  minTurn:3, text:"Monsieur Blanc, quels critères de ROI allez-vous utiliser pour valider ce projet ?",             isTrap:false, effects:{ satisfactionDelta:11, journalEntry:"Brillant — vous donnez la parole au DAF et anticipez ses critères de décision." },                                                                      scorePoints:16 },
          { id:'q9',  minTurn:4, text:"Les 30€/mois cités incluent-ils la formation, le support et l'intégration ?",                   isTrap:false, effects:{ satisfactionDelta:10, journalEntry:"Bien joué — vous remettez en contexte la comparaison superficielle du DAF." },                                                                            scorePoints:15 },
          { id:'q10', minTurn:5, text:"Quel est l'état de la base de données clients dans SAGE ? Y a-t-il des doublons ?",             isTrap:false, effects:{ satisfactionDelta:13, addBudgetItem:{ label:"Migration / Qualité données", amount:8000 }, journalEntry:"Excellent réflexe — la qualité des données SAGE conditionne le coût de migration." }, scorePoints:18 },
          { id:'q11', minTurn:6, text:"Peut-on avoir les détails de l'offre à 15k€ — périmètre exact et références clients ?",         isTrap:false, effects:{ satisfactionDelta:9,  journalEntry:"Bonne tactique — vous invitez le client à comparer des choses comparables." },                                                                          scorePoints:13 },
          { id:'q12', minTurn:7, text:"L'accès mobile — application native ou accès web mobile responsive suffit-il ?",                isTrap:false, effects:{ satisfactionDelta:11, journalEntry:"Question technique clé — app native vs responsive peut faire varier le budget de 15 000€." },                                                             scorePoints:16 },
        ],
        reformulation: [
          { id:'r1', text:"Si je comprends bien : déployer un CRM pour 50 commerciaux avec gestion des opportunités et reporting, intégré à votre ERP SAGE, opérationnel avant Q4, avec accès mobile pour les itinérants. C'est bien le périmètre ?",   isTrap:false, effects:{ satisfactionDelta:14, journalEntry:"Reformulation précise et complète — vous avez intégré tous les enjeux." }, scorePoints:20 },
          { id:'r2', text:"Vous souhaitez moderniser votre gestion commerciale en passant d'Excel à un CRM pour vos 50 commerciaux, opérationnel avant Q4.",                                                                                             isTrap:false, effects:{ satisfactionDelta:6,  journalEntry:"Reformulation partielle — manque l'intégration SAGE et le mobile." }, scorePoints:8 },
          { id:'r3', text:"Vous souhaitez un CRM complet avec module RH pour gérer les fiches collaborateurs et les congés, en plus des fonctionnalités commerciales.",                                                                                   isTrap:true,  trapReveal:"Sophie vous arrête : « Le RH ? Pas du tout ! On parle uniquement de l'équipe commerciale. » Vous avez sur-interprété.", effects:{ satisfactionDelta:-10, journalEntry:"Piège ! Vous avez ajouté du scope non demandé — Sophie perd confiance dans votre écoute." }, scorePoints:0 },
          { id:'r4', text:"Vous voulez développer un CRM sur mesure pour remplacer intégralement votre ERP SAGE.",                                                                                                                                        isTrap:true,  trapReveal:"François intervient : « Non, absolument pas. Remplacer SAGE n'est pas le sujet. » Vous avez confondu CRM et ERP.", effects:{ satisfactionDelta:-18, journalEntry:"Erreur grave — confondre CRM et ERP est une faute professionnelle basique." }, scorePoints:0 },
        ],
        argumentaire: [
          { id:'a1', text:"ROI : 15% de gain productivité sur 50 commerciaux à 50k€/an = 375k€ de valeur. Investissement amorti en 4 mois.",                                                                                                                       isTrap:false, effects:{ satisfactionDelta:13, journalEntry:"Excellent argumentaire ROI — vous parlez le langage du DAF." }, scorePoints:18 },
          { id:'a2', text:"Risque du statu quo : 2-3 deals perdus/mois à 20k€ moyen = 480k€ de CA annuel en danger. Le coût c'est de ne rien faire.",                                                                                                              isTrap:false, effects:{ satisfactionDelta:11, journalEntry:"Bon argumentaire risque — vous inversez la question avec des chiffres concrets." }, scorePoints:15 },
          { id:'a3', text:"Notre solution inclut 47 fonctionnalités : gestion du pipeline, KPIs temps réel, templates email, gestion contacts hiérarchiques...",                                                                                                    isTrap:true,  trapReveal:"François baille discrètement. « Très bien, mais ce que j'entends c'est du coût, pas de la valeur. »", effects:{ satisfactionDelta:-5, journalEntry:"Piège ! Les fonctionnalités sans valeur business ne convainquent pas un DAF." }, scorePoints:2 },
          { id:'a4', text:"Salesforce coûte 150€/user/mois — pour votre taille : 90k€/an. Nous sommes 40% moins cher.",                                                                                                                                            isTrap:true,  trapReveal:"François répond : « Alors pourquoi ne pas choisir Salesforce ? Leur support est meilleur. » Vous avez ouvert une porte piège.", effects:{ satisfactionDelta:-7, journalEntry:"Piège ! Citer des concurrents premium peut dévaloriser votre propre proposition." }, scorePoints:1 },
          { id:'a5', text:"Analyse différentielle : l'offre à 15k€ ne couvre pas l'intégration SAGE (8-12k€), ni la formation (5k€), ni le support. Le vrai delta de prix est nul.",                                                                               isTrap:false, effects:{ satisfactionDelta:14, journalEntry:"Excellente réponse — vous démontez l'argument concurrentiel avec des faits précis." }, scorePoints:18 },
        ],
        prechiffrage: [
          { id:'pc1', text:"Licences SaaS : 50 users × 75€/mois × 12 = 45 000€/an (coût récurrent annuel).",                                                                                                 isTrap:false, effects:{ satisfactionDelta:8,  addBudgetItem:{ label:"Licences SaaS (annuel)", amount:45000 }, journalEntry:"Bonne estimation des licences — vous précisez bien la récurrence annuelle." }, scorePoints:12 },
          { id:'pc2', text:"Intégration SAGE ERP : 15 à 25 JH selon complexité, soit 10 500€ à 17 500€ (à 700€/JH).",                                                                                       isTrap:false, effects:{ satisfactionDelta:10, addBudgetItem:{ label:"Intégration SAGE ERP", amount:14000 }, journalEntry:"Estimation réaliste — vous montrez que vous connaissez les enjeux techniques." }, scorePoints:15 },
          { id:'pc3', text:"Formation : 2 sessions × 25 commerciaux × 1 jour = 5 000€. Formateurs internes après.",                                                                                           isTrap:false, effects:{ satisfactionDelta:7,  addBudgetItem:{ label:"Formation utilisateurs", amount:5000 }, journalEntry:"Bonne prise en compte de la formation — souvent oubliée dans les budgets CRM." }, scorePoints:10 },
          { id:'pc4', text:"Tout compris, ça tourne autour de 20 000€. C'est faisable dans votre budget.",                                                                                                    isTrap:true,  trapReveal:"François : « Sur quelle base ? Je ne vois aucune décomposition. » Vous perdez toute crédibilité technique.", effects:{ satisfactionDelta:-14, journalEntry:"Piège ! Un chiffre global sans décomposition n'est pas crédible face à un DAF." }, scorePoints:0 },
          { id:'pc5', text:"Provision pour risques : 10% du budget total, soit environ 5 000€ à 6 000€.",                                                                                                     isTrap:false, effects:{ satisfactionDelta:9,  addBudgetItem:{ label:"Provision risques (10%)", amount:5500 }, journalEntry:"Excellente pratique — inclure une provision risque montre votre maturité projet." }, scorePoints:13 },
          { id:'pc6', text:"Migration données SAGE : nettoyage + mapping + import = 8 à 15 JH, soit 5 600€ à 10 500€.",                                                                                      isTrap:false, effects:{ satisfactionDelta:11, addBudgetItem:{ label:"Migration données SAGE", amount:8000 }, journalEntry:"Bon réflexe — la migration des données SAGE est un poste critique souvent oublié." }, scorePoints:16 },
        ],
        enveloppe: [
          { id:'e1', text:"Je propose 25 000€ — on peut faire quelque chose de bien dans votre enveloppe initiale.",                                                                                           isTrap:true,  trapReveal:"Vous venez d'accepter un budget impossible. Dans 3 mois vous serez en dépassement et perdrez le client.",                                           effects:{ satisfactionDelta:5, journalEntry:"Piège grave ! Accepter 25k€ pour ce périmètre mène inévitablement à un dépassement." }, scorePoints:0 },
          { id:'e2', text:"Sur la base des éléments qualifiés, je pencherais pour une fourchette de 45 000€ à 55 000€, incluant licences, intégration, formation et provision risques.",                      isTrap:false, effects:{ satisfactionDelta:14, journalEntry:"Excellente estimation — fourchette réaliste, justifiée, avec provision. Très professionnel." }, scorePoints:20 },
          { id:'e3', text:"Comptez entre 80 000€ et 100 000€ pour un projet de cette envergure.",                                                                                                              isTrap:true,  trapReveal:"François Blanc clôt son carnet : « 80k€ c'est hors de question sans validation du CA. On s'arrête là. »",                                              effects:{ satisfactionDelta:-16, journalEntry:"Piège ! Dépasser le plafond implicite (55k€) sans justification fait capoter le projet." }, scorePoints:0 },
          { id:'e4', text:"Je m'engage sur 48 500€ exactement, clé en main.",                                                                                                                                  isTrap:true,  trapReveal:"Sophie semble satisfaite mais François demande : « Et si la migration dure plus longtemps ? Vous absorbez le surcoût ? » Vous êtes piégé.",              effects:{ satisfactionDelta:2, journalEntry:"Piège ! Un engagement exact sans condition vous expose à des surcoûts non couverts." }, scorePoints:3 },
          { id:'e5', text:"Cela dépend entièrement de vos choix. Je ne peux pas m'avancer sans audit préalable de 3 semaines.",                                                                                isTrap:true,  trapReveal:"Sophie se lève : « On avait besoin d'un chiffrage aujourd'hui. Si vous n'êtes pas en mesure, on regarde ailleurs. »",                                  effects:{ satisfactionDelta:-12, journalEntry:"Piège ! Refuser de donner une fourchette est inacceptable — vous devez vous positionner." }, scorePoints:0 },
        ],
      },

      endFeedback: {
        excellent: "Vous avez brillamment conduit cette réunion. Vos questions étaient pertinentes, votre reformulation précise, votre budget justifié poste par poste. Sophie et François ont tous deux recommandé votre cabinet au COMEX.",
        good: "Bonne performance globale. Vous avez su construire une relation de confiance et proposer un budget raisonnable. Quelques hésitations sur les arbitrages techniques, mais rien de rédhibitoire.",
        poor: "Le sponsor a perdu confiance au fil des échanges. Des questions prématurées sur le budget et des estimations peu détaillées ont fragilisé votre position. À retenter avec une meilleure stratégie d'écoute.",
      },

      budgetBilan: {
        totalTarget: 51000,
        tolerance: 0.10,
        layers: [
          { id:'licences',    label:'Licences SaaS (annuel)',      target:22000, hint:"Coût de location du CRM pour 50 utilisateurs sur 12 mois." },
          { id:'integration', label:'Intégration ERP SAGE',         target:12000, hint:"Connexion bidirectionnelle entre le CRM et votre SAGE 2014." },
          { id:'formation',   label:'Formation utilisateurs',        target:5000,  hint:"Accompagnement des 50 commerciaux à la prise en main." },
          { id:'migration',   label:'Migration & qualité données',   target:6000,  hint:"Nettoyage et transfert des 15 ans de données clients depuis SAGE." },
          { id:'provision',   label:'Provision risques (10%)',       target:6000,  hint:"Marge de sécurité standard pour absorber les imprévus." },
        ],
      },
    },

    // ════════════════════════════════════════════════════════════
    // NIVEAU 1 — SCÉNARIO B : La Refonte Web d'ArtisanCo
    // ════════════════════════════════════════════════════════════
    '1-B': {
      id: '1-B', levelId: 1,
      title: "La Refonte Web d'ArtisanCo",
      subtitle: 'E-commerce B2B · Budget contraint',
      client: { name:'Nicolas Petit', role:'Directeur Marketing', company:'ArtisanCo', avatar:'👨‍💻', initialSatisfaction:60 },
      daf:    { name:'Isabelle Roux', role:'DAF', avatar:'👩‍💼', appearsAtTurn:4, initialSatisfaction:40 },
      context: "ArtisanCo est un distributeur B2B d'outillage (500 références, 1 200 clients actifs). Leur site de 2017 ne convertit plus. Nicolas veut un e-commerce moderne avec catalogue, devis en ligne et espace client.",
      targetBudget: { min:35000, max:48000, ideal:40000 },

      stakeholders: {
        client: { name:'Nicolas Petit', avatar:'👨‍💻', hints: {
          1:"🤫 Nicolas pense : « Je veux que ce soit beau ET fonctionnel. Le design est aussi important que les fonctions. »",
          2:"🤫 Nicolas révèle : « Notre ERP interne a une API REST documentée — l'intégration produits devrait être simple. »",
          3:"🤫 Nicolas : « Notre directeur commercial veut absolument un module devis en ligne. C'est non-négociable. »",
          4:"🤫 Nicolas pense : « Isabelle va bloquer si ça dépasse 45k€. C'est son seuil de délégation. »",
          5:"🤫 Nicolas confie : « 1 200 clients + 500 références = la migration catalogue est le vrai risque. »",
          6:"🤫 Nicolas : « Le délai non-négociable c'est septembre — avant nos salons professionnels d'automne. »",
          7:"🤫 Nicolas pense : « Je préfère lancer avec 80% des fonctionnalités en septembre que 100% en décembre. »",
          8:"🤫 Nicolas révèle : « Si on a une V1 à 35k€ et une V2 à 15k€, Isabelle acceptera plus facilement. »",
          9:"🤫 Nicolas : « La référence qu'on admire c'est le site Manutan — sobre, efficace, rapide. »",
          10:"🤫 Nicolas pense : « Si le consultant propose un phasage V1/V2, c'est gagné. »",
        }},
        daf: { name:'Isabelle Roux', avatar:'👩‍💼', hints: {
          1:"💼 Isabelle n'est pas encore là, mais son avis est connu : elle n'approuve pas sans ROI documenté.",
          2:"💼 Isabelle a un seuil de délégation de 45 000€. Au-delà, passage en conseil d'administration.",
          3:"💼 Isabelle pense : « Un phasage V1/V2 me convient si la V1 est fonctionnelle et la V2 optionnelle. »",
          4:"💼 Isabelle : « Je veux voir le ROI en CA additionnel généré par le nouveau site. »",
          5:"💼 Isabelle confie : « Notre taux de conversion actuel est 0,8%. La moyenne sectorielle est 2,5%. »",
          6:"💼 Isabelle : « Si la refonte amène à 2% de conversion sur 3M€ de CA digital = 36k€ de CA additionnel/an. »",
          7:"💼 Isabelle pense : « Je peux accepter jusqu'à 48k€ si le ROI sur 18 mois est documenté. »",
          8:"💼 Isabelle veut : timeline détaillée, liste des livrables, et une clause de pénalités de retard.",
          9:"💼 Isabelle : « Un engagement de mise en ligne avant le 15 septembre me convient. »",
          10:"💼 Isabelle validerait 35-45k€ avec phasage V1/V2 et ROI documenté.",
        }},
        expert: { name:'Marc D. (Expert Digital)', avatar:'🧑‍🎨', hints: {
          1:"💡 Une refonte e-commerce B2B de ce type se situe typiquement entre 30k€ et 60k€.",
          2:"💡 Avec une API ERP documentée, l'intégration catalogue peut être réduite à 8-12 JH.",
          3:"💡 Module devis en ligne sur mesure = 8-15 JH supplémentaires. À bien qualifier.",
          4:"💡 Approche V1/V2 recommandée : V1 = catalogue + commandes + espace client. V2 = devis + configurateur.",
          5:"💡 Migration 1 200 clients + 500 références = prévoir 5-8 JH de data cleaning minimum.",
          6:"💡 Budget recommandé V1 : Design 8k€ · Dev front 12k€ · Intégration ERP 8k€ · Migration 5k€ · Recette 4k€ ≈ 37k€.",
          7:"💡 V2 optionnelle (devis en ligne) : +8k€ à 12k€ selon complexité des règles métier.",
          8:"💡 Délai raisonnable pour une V1 de ce type : 14-18 semaines. Lancement septembre = démarrer fin mai.",
          9:"💡 Stack recommandée : Prestashop 8 ou WooCommerce selon les compétences de l'équipe client.",
          10:"💡 En défense budget : commencez par le coût du statu quo (perte de conversion = perte CA).",
        }},
      },

      turns: [
        { turn:1,  title:"L'ambition digitale",       speaker:'client', dialogue:"Notre site 2017 fait honte. On perd des clients au profit de concurrents mieux digitalisés. Je veux un vrai e-commerce B2B : catalogue pro, devis en ligne, espace client, commandes. Et je voudrais que ce soit beau. Budget ? On n'a pas encore vraiment défini... quelque chose de raisonnable.",                                                                   emotion:'enthusiastic', availableActions:[1,4], lockedReasons:{ 2:"Besoin encore à qualifier.", 3:"Trop tôt pour argumenter.", 5:"Pas encore assez d'éléments." } },
        { turn:2,  title:"Les détails techniques",    speaker:'client', dialogue:"Bonne nouvelle : notre ERP interne a une API REST, ça devrait simplifier l'intégration. On a 500 références produits et 1 200 clients actifs à migrer. Et nos clients sont à 60% sur mobile.",                                                                                                                                                              emotion:'helpful',     availableActions:[1,2,4], lockedReasons:{ 3:"Construisez d'abord votre analyse.", 5:"Attendez d'avoir tous les éléments." } },
        { turn:3,  title:"La contrainte délai",       speaker:'client', dialogue:"J'aurais dû préciser : nos salons professionnels sont en octobre. Il faut absolument être en ligne avant le 15 septembre. Est-ce que c'est tenable selon vous ?",                                                                                                                                                                                          emotion:'concerned',   availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:4,  title:"La DAF fait son entrée",    speaker:'daf',    dialogue:"Bonjour, Isabelle Roux, DAF. Nicolas m'a parlé de ce projet. Avant que vous continuiez : quel est le retour sur investissement attendu ? Et quel budget comptez-vous nous proposer ?",                                                                                                                                                                     emotion:'direct',      availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:5,  title:"L'enjeu de conversion",     speaker:'daf',    dialogue:"Notre taux de conversion actuel est 0,8%. Si vous doublez ce taux sur notre CA digital de 3M€, ça fait 36 000€ de CA additionnel annuel. Votre prestation doit se rembourser d'elle-même. Vous vous engagez sur quoi ?",                                                                                                                                   emotion:'challenging', availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:6,  title:"Le phasage suggéré",        speaker:'client', dialogue:"J'ai réfléchi — peut-être qu'on pourrait faire une V1 sans le module devis et l'ajouter en V2 ? Je préfère quelque chose de bien en septembre plutôt que trop ambitieux en décembre.",                                                                                                                                                                    emotion:'pragmatic',   availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:7,  title:"La contrainte budgétaire",  speaker:'daf',    dialogue:"Mon seuil de validation sans passer en conseil est de 45 000€. Au-dessus, c'est 6 semaines de délai supplémentaire. Soit vous êtes sous les 45k€, soit vous me convainquez que le ROI justifie la procédure longue.",                                                                                                                                     emotion:'firm',        availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:8,  title:"La demande de détail",      speaker:'daf',    dialogue:"J'ai besoin d'un breakdown précis : UX/Design, développement front, intégration ERP, migration données, tests et recette. Et ce qui est dans le périmètre V1 vs V2.",                                                                                                                                                                                     emotion:'analytical',  availableActions:[2,3,4,5], lockedReasons:{ 1:"Plus besoin de questions — concentrez-vous sur la proposition." } },
        { turn:9,  title:"La proposition finale",     speaker:'client', dialogue:"On y est. Proposez votre offre V1 avec option V2. Budget, délai, ce qui est inclus, ce qui ne l'est pas. On décide aujourd'hui.",                                                                                                                                                                                                                         emotion:'decisive',    availableActions:[2,3,4,5], lockedReasons:{ 1:"Les questions sont fermées — c'est l'heure de la proposition." } },
        { turn:10, title:"L'arbitrage final",         speaker:'daf',    dialogue:"V1 à 37k€ et V2 à 11k€ en option, c'est bien. Mais si je prends V1+V2 directement, peut-on avoir une remise d'engagement ? Et qui assume le risque de dépassement de délai ?",                                                                                                                                                                           emotion:'negotiating', availableActions:[2,3,5], lockedReasons:{ 1:"Ce n'est plus le moment de poser des questions.", 4:"Le chiffrage est défini — défendez-le." } },
      ],

      actionPools: {
        questions: [
          { id:'bq1', minTurn:1, text:"Quelles sont les 3 fonctionnalités absolument prioritaires pour le lancement ?",                                isTrap:false, effects:{ satisfactionDelta:10, journalEntry:"Question de priorisation — essentielle pour cadrer la V1." }, scorePoints:14 },
          { id:'bq2', minTurn:1, text:"Vos clients B2B ont-ils des besoins spécifiques : devis multi-lignes, remises par profil, intégration ERP client ?", isTrap:false, effects:{ satisfactionDelta:12, journalEntry:"Question experte sur le B2B — vous montrez votre connaissance du secteur." }, scorePoints:16 },
          { id:'bq3', minTurn:2, text:"L'API ERP est-elle documentée et stable, ou faudra-t-il un travail de reverse engineering ?",                    isTrap:false, effects:{ satisfactionDelta:11, journalEntry:"Bonne question technique — la qualité de l'API conditionne le coût d'intégration." }, scorePoints:15 },
          { id:'bq4', minTurn:1, text:"Avez-vous un budget maximum en tête pour aider à calibrer notre proposition ?",                                   isTrap:true,  trapReveal:"Isabelle intervient : « C'est à vous de nous proposer quelque chose — c'est votre métier. »", effects:{ satisfactionDelta:-8, journalEntry:"Piège ! Demander le budget en début de réunion est une faiblesse de positionnement." }, scorePoints:0 },
          { id:'bq5', minTurn:2, text:"Quel est le CA digital actuel et quel est l'objectif à 12 mois ?",                                               isTrap:false, effects:{ satisfactionDelta:13, journalEntry:"Question ROI-oriented excellente — vous préparez déjà l'argumentaire business." }, scorePoints:17 },
        ],
        reformulation: [
          { id:'br1', text:"Refonte e-commerce B2B en 2 phases : V1 (catalogue, commandes, espace client) avant le 15 sept., V2 (module devis) optionnelle. Intégration API ERP + migration 1 200 clients et 500 références. Budget sous 45k€.",   isTrap:false, effects:{ satisfactionDelta:15, journalEntry:"Reformulation parfaite incluant phasage, délai, contrainte budget et périmètre technique." }, scorePoints:20 },
          { id:'br2', text:"Vous voulez un site e-commerce moderne avec toutes les fonctionnalités pour septembre.",                                                                                                                                     isTrap:false, effects:{ satisfactionDelta:4,  journalEntry:"Trop vague — manque le phasage, la contrainte budget et l'aspect B2B." }, scorePoints:5 },
          { id:'br3', text:"Vous voulez refaire tout votre système informatique, y compris l'ERP, pour septembre.",                                                                                                                                      isTrap:true,  trapReveal:"Nicolas : « Non ! On ne touche pas à l'ERP, on le connecte juste. Relisez vos notes. »", effects:{ satisfactionDelta:-12, journalEntry:"Piège ! Confusion grave entre refonte site et refonte SI." }, scorePoints:0 },
        ],
        argumentaire: [
          { id:'ba1', text:"ROI documenté : passer de 0,8% à 2% de conversion sur 3M€ = +36k€ CA/an. Investissement rentabilisé en moins d'un an.",                           isTrap:false, effects:{ satisfactionDelta:15, journalEntry:"Parfait argumentaire ROI — vous utilisez les propres chiffres d'Isabelle pour lui vendre le projet." }, scorePoints:20 },
          { id:'ba2', text:"Approche phasée V1/V2 : dérisquez le projet, livrez de la valeur dès septembre, optionnalisez le module devis selon les retours utilisateurs.",     isTrap:false, effects:{ satisfactionDelta:12, journalEntry:"Bon argumentaire de phasage — vous réduisez le risque perçu par la DAF." }, scorePoints:16 },
          { id:'ba3', text:"On peut faire ça pour 28 000€ si vous réduisez le périmètre — ça couvre le design et le dev.",                                                       isTrap:true,  trapReveal:"Nicolas : « Et la migration ? L'intégration ERP ? Vous avez oublié 40% du projet. »", effects:{ satisfactionDelta:-10, journalEntry:"Piège ! Réduire le budget en oubliant des postes clés crée des problèmes en production." }, scorePoints:0 },
        ],
        prechiffrage: [
          { id:'bpc1', text:"UX/Design + maquettes : 10-12 JH × 700€ = 7 000€ à 8 400€.",                     isTrap:false, effects:{ satisfactionDelta:8, addBudgetItem:{ label:"UX / Design", amount:7700 }, journalEntry:"Bon chiffrage design — vous montrez la décomposition par profil." }, scorePoints:11 },
          { id:'bpc2', text:"Développement front + back : 18-22 JH × 700€ = 12 600€ à 15 400€.",              isTrap:false, effects:{ satisfactionDelta:8, addBudgetItem:{ label:"Développement", amount:14000 }, journalEntry:"Estimation dev réaliste pour ce périmètre." }, scorePoints:11 },
          { id:'bpc3', text:"Intégration API ERP : 10-14 JH × 700€ = 7 000€ à 9 800€ selon la doc.",          isTrap:false, effects:{ satisfactionDelta:9, addBudgetItem:{ label:"Intégration ERP", amount:8400 }, journalEntry:"Bonne estimation avec condition sur la qualité de la doc API." }, scorePoints:13 },
          { id:'bpc4', text:"Migration données + recette : 8-10 JH = 5 600€ à 7 000€.",                        isTrap:false, effects:{ satisfactionDelta:9, addBudgetItem:{ label:"Migration + Recette", amount:6300 }, journalEntry:"Bien pensé — migration et recette sont souvent sous-estimées." }, scorePoints:13 },
          { id:'bpc5', text:"Tout ça c'est environ 20 000€, c'est rapide à faire.",                             isTrap:true,  trapReveal:"Nicolas : « 20k€ ? Vous n'avez pas inclus l'intégration ERP ni la migration. C'est irréaliste. »", effects:{ satisfactionDelta:-13, journalEntry:"Piège ! Sous-estimer grossièrement le budget détruit votre crédibilité." }, scorePoints:0 },
        ],
        enveloppe: [
          { id:'be1', text:"V1 à 37 000€ (mise en ligne garantie 15 sept.) + V2 optionnelle à 11 000€. Total max V1+V2 : 48 000€.",  isTrap:false, effects:{ satisfactionDelta:16, journalEntry:"Proposition parfaite — phasage clair, budget sous le seuil DAF, délai respecté." }, scorePoints:20 },
          { id:'be2', text:"Budget global : 55 000€ tout compris.",                                                                    isTrap:true,  trapReveal:"Isabelle ferme son carnet : « 55k€ passe en comité. Ça reporte la décision de 6 semaines. »", effects:{ satisfactionDelta:-10, journalEntry:"Piège ! Dépasser 45k€ sans phasage déclenche une procédure longue." }, scorePoints:1 },
          { id:'be3', text:"Je propose 42 000€ tout compris, V1 et V2.",                                                               isTrap:false, effects:{ satisfactionDelta:10, journalEntry:"Budget acceptable et sous le seuil — mais sans phasage, moins convaincant." }, scorePoints:12 },
          { id:'be4', text:"On peut faire ça pour 22 000€ si vous limitez les fonctionnalités.",                                       isTrap:true,  trapReveal:"Nicolas : « 22k€ pour quoi exactement ? Ça ne couvre même pas le design et le dev. »", effects:{ satisfactionDelta:-15, journalEntry:"Piège ! Un budget irréaliste détruit instantanément votre crédibilité." }, scorePoints:0 },
        ],
      },

      endFeedback: {
        excellent: "Proposition V1/V2 parfaitement calibrée, ROI documenté, budget sous le seuil DAF. Nicolas et Isabelle ont signé la semaine suivante. Référence client obtenue.",
        good: "Bonne proposition avec quelques ajustements. Le phasage était pertinent même si le budget aurait pu être mieux justifié.",
        poor: "La proposition n'a pas convaincu Isabelle. Un manque de décomposition et un ROI non documenté ont conduit au refus du projet.",
      },

      budgetBilan: {
        totalTarget: 40000,
        tolerance: 0.10,
        layers: [
          { id:'design',      label:'UX / Design & maquettes',      target:8000,  hint:"Conception des interfaces et des parcours utilisateurs B2B." },
          { id:'dev',         label:'Développement front & back',    target:14000, hint:"Intégration HTML/CSS + développement des fonctionnalités catalogue et commandes." },
          { id:'integration', label:'Intégration API ERP',           target:9000,  hint:"Connexion au catalogue produits et aux stocks via l'API REST documentée." },
          { id:'migration',   label:'Migration données & recette',   target:6000,  hint:"Import des 1 200 clients, 500 références + tests de validation." },
          { id:'provision',   label:'Provision risques',             target:3000,  hint:"Marge de sécurité pour les aléas du projet (délai, API, bugs)." },
        ],
      },
    },

    // ════════════════════════════════════════════════════════════
    // NIVEAU 2 — SCÉNARIO A : L'ERP de MétalPro Industries
    // ════════════════════════════════════════════════════════════
    '2-A': {
      id: '2-A', levelId: 2,
      title: "L'ERP de MétalPro Industries",
      subtitle: 'Migration ERP multi-sites · Projet complexe',
      client: { name:'Bertrand Morel', role:'DSI', company:'MétalPro Industries', avatar:'👨‍🔬', initialSatisfaction:50 },
      daf:    { name:'Christine Lacroix', role:'DG / CFO', avatar:'👩‍💼', appearsAtTurn:2, initialSatisfaction:45 },
      context: "MétalPro Industries est un groupe de 800 personnes sur 4 sites. Ils veulent remplacer leur ERP SAP 2010 vieillissant. Périmètre : finance, RH, production, achats. Budget de principe annoncé : 200 000€.",
      targetBudget: { min:260000, max:320000, ideal:285000 },

      stakeholders: {
        client: { name:'Bertrand Morel', avatar:'👨‍🔬', hints: {
          1:"💡 Bertrand pense : « La vraie contrainte c'est la migration des données de production — 20 ans de données SAP. »",
          2:"💡 Bertrand : « 4 sites = 4 directions, 4 façons de travailler. La conduite du changement sera le vrai défi. »",
          3:"💡 Bertrand révèle : « Christine a obtenu 350k€ du board — mais elle veut négocier en dessous. »",
          4:"💡 Bertrand : « Notre go-live idéal c'est début janvier — hors période de clôture comptable. »",
          5:"💡 Bertrand confie : « On a essayé de migrer il y a 5 ans — ça a échoué à cause d'une conduite du changement insuffisante. »",
          6:"💡 Bertrand : « Le module production est le plus complexe — 3 sites ont des process différents. »",
          7:"💡 Bertrand : « On n'a pas de consultant SAP en interne — il faudra tout porter côté prestataire. »",
          8:"💡 Bertrand : « Le budget formation seul c'est 800 personnes × 2 jours. Ne pas sous-estimer. »",
          9:"💡 Bertrand : « On veut un engagement de résultat, pas une régie. Portage du risque côté prestataire. »",
          10:"💡 Bertrand : « Si vous assumez le risque, le budget peut monter à 300k€. Mais on veut des pénalités de retard. »",
        }},
        daf: { name:'Christine Lacroix', avatar:'👩‍💼', hints: {
          1:"💼 Christine : « Budget board : 350k€ max. Je veux négocier sous 300k€ pour garder une marge. »",
          2:"💼 Christine : « Je veux un phasage sur 18 mois — livraison site par site, pas de go-live global. »",
          3:"💼 Christine : « ROI attendu : réduction de 2 ETP back-office (valeur 120k€/an) + gains achats. »",
          4:"💼 Christine : « Pénalités de retard : 1% du contrat par semaine. »",
          5:"💼 Christine : « Provision risque obligatoire dans le budget — minimum 15%. »",
          6:"💼 Christine : « Je veux un comité de pilotage mensuel avec reporting budget. »",
          7:"💼 Christine : « Engagement de résultat ou régie — si régie, plafond à 280k€. »",
          8:"💼 Christine : « Licences + maintenance annuelle à inclure dans le TCO 5 ans. »",
          9:"💼 Christine : « Fourchette que j'accepterais : 260k-300k€ avec phasage clair. »",
          10:"💼 Christine validerait 285k€ avec : phasage 4 sites, provision 15%, engagement résultat, comité mensuel.",
        }},
        expert: { name:'Pierre (Expert ERP)', avatar:'🧑‍🔧', hints: {
          1:"💡 Migration ERP multi-sites 800 personnes : marché = 250k€ - 400k€.",
          2:"💡 Phasage recommandé : site pilote 6 mois, puis déploiement 3 sites en 12 mois.",
          3:"💡 Postes : Licences 60k€ · Paramétrage 100k€ · Migration 40k€ · Formation 50k€ · Conduite du changement 25k€ · Provision 15% = 41k€ → Total ≈ 316k€.",
          4:"💡 Conduite du changement : souvent sous-estimé. Prévoir 8-10% du total.",
          5:"💡 Migration données SAP : audit qualité + 3 cycles de tests. Minimum 35-50 JH.",
          6:"💡 Module production (MES) : le plus complexe. Prévoir +20% sur les estimations dev.",
          7:"💡 Engagement résultat vs régie : avec engagement résultat, marger +10-15% pour absorber le risque.",
          8:"💡 TCO 5 ans : ne pas oublier la maintenance annuelle à 15-20% du coût licence.",
          9:"💡 Budget recommandé : 270k€-300k€ avec provision 15% et phasage 18 mois.",
          10:"💡 En défense : présenter le ROI 5 ans (économies ETP + gains SCM - investissement) = ROI positif en an 2.",
        }},
      },

      turns: [
        { turn:1,  title:"La migration ERP",           speaker:'client', dialogue:"Notre SAP date de 2010. Les consultants qui le maintiennent coûtent une fortune. On veut migrer. 4 sites, 800 personnes, finance + RH + production + achats. Budget de principe : 200 000€. Vous pouvez faire ça ?",                                                                                                      emotion:'technical',  availableActions:[1,4], lockedReasons:{ 2:"Besoin à clarifier.", 3:"Trop tôt.", 5:"Attendez." } },
        { turn:2,  title:"La DG/CFO entre en scène",   speaker:'daf',    dialogue:"Christine Lacroix, DG et CFO. Je vais être directe : 200 000€ c'est notre budget de principe, mais je suis consciente que le marché est différent. Ce qui m'importe c'est le ROI sur 5 ans et un phasage intelligent.",                                                                                                   emotion:'strategic',  availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:3,  title:"Le périmètre complet",        speaker:'client', dialogue:"Il faut inclure : finance (pilote obligatoire), RH (800 personnes), production (3 sites avec des process différents), et achats. On a 20 ans de données dans SAP à migrer. Et on n'a pas de consultant SAP en interne.",                                                                                                  emotion:'concerned',  availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:4,  title:"Le mode contractuel",         speaker:'daf',    dialogue:"Régie ou engagement de résultat ? Si vous portez le risque, je suis prête à mettre plus. Si c'est en régie, je plafonne à 280 000€. Et je veux des pénalités de retard.",                                                                                                                                               emotion:'negotiating',availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:5,  title:"L'échec du passé",            speaker:'client', dialogue:"Je dois vous dire quelque chose : on a essayé de migrer il y a 5 ans. Ça a échoué à cause d'une conduite du changement insuffisante. 800 personnes, 4 cultures de site différentes. C'est ça le vrai risque. Comment vous adressez ça ?",                                                                              emotion:'vulnerable',  availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:6,  title:"Le défi technique",           speaker:'client', dialogue:"Le module production est le plus complexe — 3 sites ont des process métier totalement différents. Comment vous phasez ça et quel impact sur le budget ?",                                                                                                                                                                emotion:'technical',  availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:7,  title:"La question formation",       speaker:'daf',    dialogue:"Formation : 800 personnes sur 4 sites. Je veux que tout le monde soit formé avant le go-live, pas après. C'est combien ? Et est-ce que c'est dans votre budget ou en sus ?",                                                                                                                                           emotion:'direct',     availableActions:[1,2,3,4,5], lockedReasons:{} },
        { turn:8,  title:"Le TCO 5 ans demandé",        speaker:'daf',    dialogue:"Je ne veux pas voir juste le coût projet. Je veux le TCO sur 5 ans : investissement + licences + maintenance + support. Et en face, les économies attendues. Donnez-moi la vraie équation économique.",                                                                                                                  emotion:'analytical', availableActions:[2,3,4,5], lockedReasons:{ 1:"Toutes les données sont là — maintenant proposez." } },
        { turn:9,  title:"La proposition complète",     speaker:'client', dialogue:"On a besoin de votre proposition complète : périmètre, phasage 18 mois, budget total avec décomposition, mode contractuel, engagement sur le délai. C'est la dernière réunion avant notre COMEX.",                                                                                                                     emotion:'attentive',  availableActions:[2,3,4,5], lockedReasons:{ 1:"L'heure est à la proposition." } },
        { turn:10, title:"La négociation finale",       speaker:'daf',    dialogue:"Votre proposition à 285 000€ est dans nos cordes. Mais je veux 3 choses : 1/ phasage site pilote en 6 mois, 2/ pénalités de retard 1%/semaine, 3/ provision risque visible dans le budget. Vous acceptez ces conditions ?",                                                                                            emotion:'decisive',   availableActions:[2,3,5], lockedReasons:{ 1:"Inutile de questionner.", 4:"Le chiffrage est fixé." } },
      ],

      actionPools: {
        questions: [
          { id:'cq1', minTurn:1, text:"Quel est l'état de la qualité des données dans votre SAP actuel ?",                         isTrap:false, effects:{ satisfactionDelta:12, journalEntry:"Question critique — la qualité des données SAP peut faire doubler le coût de migration." }, scorePoints:16 },
          { id:'cq2', minTurn:1, text:"Les 4 sites ont-ils des process métier harmonisés ou fortement différenciés ?",             isTrap:false, effects:{ satisfactionDelta:11, journalEntry:"Question essentielle pour le phasage et le chiffrage du module production." }, scorePoints:15 },
          { id:'cq3', minTurn:1, text:"Avez-vous des ressources internes dédiées au projet (MOA, chefs de projet) ?",             isTrap:false, effects:{ satisfactionDelta:9,  journalEntry:"Sans ressources internes, le portage prestataire est total — impact direct sur le budget." }, scorePoints:13 },
          { id:'cq4', minTurn:1, text:"200k€ c'est votre vrai budget ou une première estimation ?",                                isTrap:true,  trapReveal:"Christine répond sèchement : « C'est à vous de nous dire ce que ça doit coûter. »", effects:{ satisfactionDelta:-10, journalEntry:"Piège ! Chercher le budget plutôt que construire la valeur est une faiblesse." }, scorePoints:0 },
          { id:'cq5', minTurn:2, text:"Quel est le coût annuel actuel de maintenance de votre SAP ?",                             isTrap:false, effects:{ satisfactionDelta:13, journalEntry:"Excellente question ROI — comparer le coût actuel SAP au coût du nouveau projet." }, scorePoints:17 },
        ],
        reformulation: [
          { id:'cr1', text:"Migration ERP sur 4 sites, 800 personnes, périmètre finance + RH + production + achats. Phasage 18 mois, site pilote finance en 6 mois. Budget en fourchette 270-300k€ avec engagement résultat et provision 15%.",   isTrap:false, effects:{ satisfactionDelta:16, journalEntry:"Reformulation complète et professionnelle — vous maîtrisez le sujet." }, scorePoints:20 },
          { id:'cr2', text:"Vous voulez changer votre SAP pour un ERP moderne pour toute la société.",                                                                                                                                               isTrap:false, effects:{ satisfactionDelta:3,  journalEntry:"Trop vague — manque phasage, périmètre précis, contraintes contractuelles." }, scorePoints:4 },
          { id:'cr3', text:"Vous voulez remplacer SAP par Salesforce pour gérer vos ventes et votre marketing.",                                                                                                                                     isTrap:true,  trapReveal:"Bertrand : « Salesforce ? On parle d'ERP industriel, pas de CRM. » Erreur fondamentale.", effects:{ satisfactionDelta:-20, journalEntry:"Erreur grave — confondre ERP industriel et CRM est une faute professionnelle majeure." }, scorePoints:0 },
        ],
        argumentaire: [
          { id:'ca1', text:"ROI 5 ans : investissement 285k€. Économies : 2 ETP back-office (120k€/an) + gains achats (50k€/an) = 170k€/an. ROI positif dès l'an 2.",                      isTrap:false, effects:{ satisfactionDelta:15, journalEntry:"Argumentaire ROI 5 ans irréfutable — vous pensez en CFO." }, scorePoints:20 },
          { id:'ca2', text:"Conduite du changement incluse à 10% du budget = 28k€. C'est la leçon tirée de l'échec du projet de 2019.",                                                      isTrap:false, effects:{ satisfactionDelta:13, journalEntry:"Vous montrez que vous avez intégré la leçon de l'échec précédent. Très fort." }, scorePoints:18 },
          { id:'ca3', text:"On peut faire ça pour 200k€ si on réduit la conduite du changement et on fait la formation en interne.",                                                          isTrap:true,  trapReveal:"Christine : « La conduite du changement insuffisante a fait échouer le dernier projet. Vous reproduisez l'erreur ? »", effects:{ satisfactionDelta:-15, journalEntry:"Piège ! Réduire la conduite du changement est exactement ce qui a fait échouer le projet précédent." }, scorePoints:0 },
        ],
        prechiffrage: [
          { id:'cpc1', text:"Licences ERP : 800 users × 500€/an = 400k€ sur 5 ans (à inclure dans le TCO).",                        isTrap:false, effects:{ satisfactionDelta:9,  addBudgetItem:{ label:"Licences ERP (5 ans)", amount:400000 }, journalEntry:"Bonne vision TCO — vous pensez coût total de possession." }, scorePoints:12 },
          { id:'cpc2', text:"Paramétrage + intégration : 4 modules × 4 sites = 100-130 JH à 800€/JH = 80k à 104k€.",               isTrap:false, effects:{ satisfactionDelta:10, addBudgetItem:{ label:"Paramétrage / Intégration", amount:92000 }, journalEntry:"Estimation paramétrage solide avec décomposition par module et site." }, scorePoints:14 },
          { id:'cpc3', text:"Formation 800 personnes × 2 jours : 40 sessions × 5k€ = 200k€.",                                        isTrap:true,  trapReveal:"Christine : « 200k€ de formation seule ? C'est plus que tout le reste. Revoyez vos calculs. »", effects:{ satisfactionDelta:-8, journalEntry:"Piège ! Sur-estimation de la formation — 800 pers en cascade interne = 30-40k€ maxi." }, scorePoints:0 },
          { id:'cpc4', text:"Conduite du changement : 10% du budget total = 28 500€. Inclut plan com, ateliers, support post go-live.", isTrap:false, effects:{ satisfactionDelta:12, addBudgetItem:{ label:"Conduite du changement (10%)", amount:28500 }, journalEntry:"Excellent réflexe de provisionner la conduite du changement." }, scorePoints:16 },
          { id:'cpc5', text:"Provision risque 15% : sur 250k€ de budget projet = 37 500€. Standard sur ce type de projet.",           isTrap:false, effects:{ satisfactionDelta:11, addBudgetItem:{ label:"Provision risques (15%)", amount:37500 }, journalEntry:"15% de provision sur un projet ERP complexe est un minimum — très bien." }, scorePoints:15 },
        ],
        enveloppe: [
          { id:'ce1', text:"Proposition : 285 000€ en engagement de résultat. Phasage 18 mois (pilote 6 mois, déploiement 12 mois). Provision 15% incluse. Pénalités retard 0,5%/semaine.",   isTrap:false, effects:{ satisfactionDelta:16, journalEntry:"Proposition parfaite — budget réaliste, mode contractuel assumé, phasage clair." }, scorePoints:20 },
          { id:'ce2', text:"On peut tenir dans les 200k€ si on réduit quelques postes.",                                                                                                        isTrap:true,  trapReveal:"Christine : « 200k€ pour ce périmètre ? Bertrand, leur concurrent était à 310k€ avec 15 ans d'expérience. »", effects:{ satisfactionDelta:-12, journalEntry:"Piège ! Accepter 200k€ pour un projet qui en vaut 285k€ est une erreur de positionnement grave." }, scorePoints:0 },
          { id:'ce3', text:"Fourchette 260 000€ à 310 000€ selon les résultats de l'audit initial de 2 semaines.",                                                                              isTrap:false, effects:{ satisfactionDelta:10, journalEntry:"Fourchette acceptable — mais moins précis qu'une proposition ferme." }, scorePoints:12 },
          { id:'ce4', text:"Ce projet vaut minimum 400 000€ sur le marché. Je ne peux pas m'engager en dessous.",                                                                               isTrap:true,  trapReveal:"Christine clôt le dossier : « 400k€ dépasse notre autorisation de dépense. Fin de la réunion. »", effects:{ satisfactionDelta:-18, journalEntry:"Piège ! Dépasser massivement le budget disponible sans stratégie est une erreur fatale." }, scorePoints:0 },
        ],
      },

      endFeedback: {
        excellent: "Vous avez parfaitement navigué entre Bertrand et Christine, intégré la leçon de l'échec précédent et proposé un budget justifié avec ROI 5 ans. La mission est signée.",
        good: "Bonne performance sur un projet complexe. Le budget était cohérent même si quelques postes manquaient de détail.",
        poor: "Le projet ERP est trop complexe pour votre niveau actuel. Travaillez vos bases sur un projet plus simple.",
      },

      budgetBilan: {
        totalTarget: 285000,
        tolerance: 0.10,
        layers: [
          { id:'licences',    label:'Licences ERP (année 1)',          target:40000,  hint:"Coût de licence pour 800 utilisateurs sur la première année d'exploitation." },
          { id:'parametre',   label:'Paramétrage & intégration',       target:90000,  hint:"4 modules × 4 sites — environ 100-130 JH à 800€/JH." },
          { id:'migration',   label:'Migration données SAP',           target:40000,  hint:"20 ans de données SAP — audit qualité, nettoyage, 3 cycles de tests." },
          { id:'formation',   label:'Formation 800 collaborateurs',    target:45000,  hint:"Formation en cascade : formateurs internes + sessions par profil métier." },
          { id:'cdc',         label:'Conduite du changement',          target:28000,  hint:"10% du budget — plan com, ateliers, support post go-live sur 4 sites." },
          { id:'provision',   label:'Provision risques (15%)',         target:42000,  hint:"15% est le standard sur les projets ERP multi-sites complexes." },
        ],
      },
    },
  },
};
