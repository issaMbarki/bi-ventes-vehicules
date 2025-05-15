const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 4000;

app.get("/api/overview", (req, res) => {
  const { annee, state, marque } = req.query;

  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT
      COUNT(fv.Id_Vente) AS total_ventes,
      AVG(fv.sellingprice) AS prix_moyen,
      AVG(fv.sellingprice - fv.MMR) AS ecart_moyen,
      SUM(fv.sellingprice) AS montant_total
    FROM fait_vente fv
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause};
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});
let count = 1;
app.get("/api/filters", (req, res) => {
  const queries = {
    annees: "SELECT DISTINCT Annee FROM date ORDER BY Annee DESC",
    states: "SELECT DISTINCT State FROM state ORDER BY State",
    marques: "SELECT DISTINCT Make FROM vehicle ORDER BY Make",
  };

  const results = {};

  const fetch = Object.entries(queries).map(([key, sql]) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        results[key] = rows.map((r) => Object.values(r)[0]);
        resolve();
      });
    });
  });

  Promise.all(fetch)
    .then(() => res.json(results))
    .catch((err) => res.status(500).json({ error: err.message }));
});
app.get("/api/monthly-evolution", (req, res) => {
  const { annee, state, marque } = req.query;

  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT 
      CONCAT(d.mois, ' ', d.Annee) AS mois_annee,
      COUNT(fv.Id_Vente) AS total_ventes
    FROM fait_vente fv
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY d.Annee, d.mois
    ORDER BY d.Annee, FIELD(d.mois, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/top-marques", (req, res) => {
  const { annee, state } = req.query;

  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT 
      v.Make AS marque,
      COUNT(fv.Id_Vente) AS total_ventes
    FROM fait_vente fv
    JOIN vehicle v ON fv.VIN = v.VIN
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    ${whereClause}
    GROUP BY v.Make
    ORDER BY total_ventes DESC
    LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/temps/day-of-week", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT d.Jour_Semaine AS jour, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY d.Jour_Semaine
    ORDER BY FIELD(d.Jour_Semaine, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche');
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/temps/by-year", (req, res) => {
  const { state, marque } = req.query;
  let filters = [];
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT d.Annee AS annee, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY d.Annee
    ORDER BY d.Annee;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/temps/avg-price-by-month", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT d.mois, AVG(fv.sellingprice) AS prix_moyen
    FROM fait_vente fv
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY d.mois
    ORDER BY FIELD(d.mois, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/marque/avg-price-by-make", (req, res) => {
  const { annee, state } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT v.Make AS marque, AVG(fv.sellingprice) AS prix_moyen
    FROM fait_vente fv
    JOIN vehicle v ON fv.VIN = v.VIN
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    ${whereClause}
    GROUP BY v.Make
    ORDER BY prix_moyen DESC
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get("/api/marque/top-models", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT CONCAT(v.Make, ' ', v.Model) AS marque_modele, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN vehicle v ON fv.VIN = v.VIN
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    ${whereClause}
    GROUP BY marque_modele
    ORDER BY ventes DESC
    LIMIT 10
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/marque/ecart-par-modele", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT v.Model AS modele, AVG(fv.sellingprice - fv.MMR) AS ecart
    FROM fait_vente fv
    JOIN vehicle v ON fv.VIN = v.VIN
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    ${whereClause}
    GROUP BY v.Model
    ORDER BY ecart DESC
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/state/ventes-par-state", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT s.State AS state, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY s.State
    ORDER BY ventes DESC;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.get("/api/state/prix-moyen-par-state", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT s.State AS state, AVG(fv.sellingprice) AS prix_moyen
    FROM fait_vente fv
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY s.State
    ORDER BY prix_moyen DESC;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/state/ranking", (req, res) => {
  const { annee, state, marque } = req.query;
  let filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause =
    filters.length > 0 ? "WHERE " + filters.join(" AND ") : "";

  const query = `
    SELECT s.State AS state, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY s.State
    ORDER BY ventes DESC
    LIMIT 10;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Classement des vendeurs par chiffre d'affaires
app.get("/api/seller/classement-chiffre-affaire", (req, res) => {
  const { annee, state, marque } = req.query;
  const filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const query = `
    SELECT se.Seller AS vendeur, SUM(fv.sellingprice) AS chiffre_affaire
    FROM fait_vente fv
    JOIN seller se ON fv.Id_Seller = se.Id_Seller
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY se.Seller
    ORDER BY chiffre_affaire DESC
    LIMIT 10;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Prix moyen par vendeur
app.get("/api/seller/prix-moyen", (req, res) => {
  const { annee, state, marque } = req.query;
  const filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const query = `
    SELECT se.Seller AS vendeur, AVG(fv.sellingprice) AS prix_moyen
    FROM fait_vente fv
    JOIN seller se ON fv.Id_Seller = se.Id_Seller
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY se.Seller
    ORDER BY prix_moyen DESC
    LIMIT 10;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Top vendeurs par volume de ventes
app.get("/api/seller/top-volume", (req, res) => {
  const { annee, state, marque } = req.query;
  const filters = [];
  if (annee) filters.push(`d.Annee = ${db.escape(annee)}`);
  if (state) filters.push(`s.State = ${db.escape(state)}`);
  if (marque) filters.push(`v.Make = ${db.escape(marque)}`);

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const query = `
    SELECT se.Seller AS vendeur, COUNT(*) AS ventes
    FROM fait_vente fv
    JOIN seller se ON fv.Id_Seller = se.Id_Seller
    JOIN date d ON fv.Id_Date = d.Id_Date
    JOIN state s ON fv.Id_State = s.Id_State
    JOIN vehicle v ON fv.VIN = v.VIN
    ${whereClause}
    GROUP BY se.Seller
    ORDER BY ventes DESC
    LIMIT 10;
  `;
  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
