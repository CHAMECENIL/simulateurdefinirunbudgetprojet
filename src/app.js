// Données du simulateur
let postes = [];

// Références DOM
const btnAjouter    = document.getElementById('btnAjouter');
const btnExportCSV  = document.getElementById('btnExportCSV');
const btnReset      = document.getElementById('btnReset');
const corpsTableau  = document.getElementById('corpsTableau');
const ligneVide     = document.getElementById('ligneVide');
const totalHTEl     = document.getElementById('totalHT');
const totalTVAEl    = document.getElementById('totalTVA');
const totalTTCEl    = document.getElementById('totalTTC');

// Ajouter un poste
btnAjouter.addEventListener('click', () => {
  const categorie   = document.getElementById('categorie').value;
  const description = document.getElementById('description').value.trim();
  const quantite    = parseFloat(document.getElementById('quantite').value) || 0;
  const coutUnitaire = parseFloat(document.getElementById('coutUnitaire').value) || 0;

  if (!description) {
    alert('Veuillez saisir une description pour ce poste.');
    return;
  }

  const poste = {
    id: Date.now(),
    categorie,
    description,
    quantite,
    coutUnitaire,
    total: quantite * coutUnitaire
  };

  postes.push(poste);
  document.getElementById('description').value = '';
  document.getElementById('quantite').value = '1';
  document.getElementById('coutUnitaire').value = '';

  renderTableau();
  renderSynthese();
});

// Supprimer un poste
function supprimerPoste(id) {
  postes = postes.filter(p => p.id !== id);
  renderTableau();
  renderSynthese();
}

// Afficher le tableau
function renderTableau() {
  // Vider le corps sauf la ligne vide
  Array.from(corpsTableau.querySelectorAll('tr:not(#ligneVide)')).forEach(tr => tr.remove());

  if (postes.length === 0) {
    ligneVide.style.display = '';
    return;
  }

  ligneVide.style.display = 'none';

  postes.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.categorie}</td>
      <td>${p.description}</td>
      <td>${p.quantite}</td>
      <td>${formaterEuros(p.coutUnitaire)}</td>
      <td><strong>${formaterEuros(p.total)}</strong></td>
      <td><button class="btn-supprimer" onclick="supprimerPoste(${p.id})">Supprimer</button></td>
    `;
    corpsTableau.appendChild(tr);
  });
}

// Afficher la synthèse
function renderSynthese() {
  const totalHT  = postes.reduce((acc, p) => acc + p.total, 0);
  const tva      = totalHT * 0.20;
  const totalTTC = totalHT + tva;

  totalHTEl.textContent  = formaterEuros(totalHT);
  totalTVAEl.textContent = formaterEuros(tva);
  totalTTCEl.textContent = formaterEuros(totalTTC);
}

// Exporter en CSV
btnExportCSV.addEventListener('click', () => {
  if (postes.length === 0) {
    alert('Aucun poste à exporter.');
    return;
  }

  const lignes = [
    ['Catégorie', 'Description', 'Quantité', 'Coût unitaire (€)', 'Total (€)'],
    ...postes.map(p => [p.categorie, p.description, p.quantite, p.coutUnitaire, p.total])
  ];

  const totalHT  = postes.reduce((acc, p) => acc + p.total, 0);
  lignes.push([]);
  lignes.push(['', '', '', 'Total HT', totalHT]);
  lignes.push(['', '', '', 'TVA 20%', totalHT * 0.20]);
  lignes.push(['', '', '', 'Total TTC', totalHT * 1.20]);

  const csvContent = lignes.map(l => l.join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'budget_projet.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Réinitialiser
btnReset.addEventListener('click', () => {
  if (postes.length === 0) return;
  if (confirm('Réinitialiser tous les postes ?')) {
    postes = [];
    renderTableau();
    renderSynthese();
  }
});

// Utilitaire : formater en euros
function formaterEuros(valeur) {
  return valeur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
