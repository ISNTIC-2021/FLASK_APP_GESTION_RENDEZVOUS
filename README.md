# Auteur

Projet réalisé dans le cadre du module **Technologies Web**.

- **Nom : SAID BOUSSIF**
- **Formation : Bachelor Ingénierie des Systèmes Informatiques et Logiciels - TEMPS AMENAGE**
- **EST ESSAOUIRA 2025/2026**


# QueueBuddy – Gestion de créneaux de rendez-vous
Application web simple permettant de gérer des **créneaux de rendez-vous (slots)** et des **réservations d’étudiants (bookings)**.

Le projet est développé avec :
- **Frontend** : React
- **Backend** : Flask (API REST)
- **Base de données** : SQLite

---

# Objectif du projet
QueueBuddy permet d'organiser des rendez-vous entre des étudiants et une administration ou un service.

Fonctionnement général :

1. L’**administrateur** crée des créneaux disponibles.
2. L’**étudiant** consulte les créneaux.
3. L’étudiant **réserve un créneau**.
4. L’admin peut **modifier le statut** de la réservation.

---

# Fonctionnalités principales

## Côté étudiant
- Consulter les créneaux disponibles
- Réserver un créneau
- Consulter ses réservations
- Voir le statut de ses réservations

Statuts possibles :
- `pending`
- `confirmed`
- `done`
- `canceled`

---

## Côté administrateur
- Créer des créneaux
- Voir toutes les réservations
- Modifier le statut d’une réservation

---

# Règles de validation

Le backend vérifie automatiquement :

### 1. Pas de réservation en double
Un étudiant ne peut pas réserver deux fois le même créneau.

### 2. Créneau complet
Si le nombre de réservations atteint la capacité du créneau, la réservation est refusée.

### 3. Codes HTTP
L’API retourne des codes corrects :

| Code | Signification |
|-----|---------------|
| 200 | Succès |
| 201 | Création réussie |
| 400 | Erreur de validation |
| 404 | Ressource non trouvée |

---

# Architecture du projet


QueueBuddy
│
├── backend
│ ├── app.py
│ └── queuebuddy.db
│
└── frontend
├── package.json
└── src
├── App.js
├── api.js
└── pages
├── Home.js
├── MyBookings.js
└── Admin.js


---

# Technologies utilisées

## Backend
- Python
- Flask
- Flask-CORS
- SQLite

## Frontend
- React
- React Router
- Axios

---

# Installation et exécution

## 1. Backend (Flask)

Aller dans le dossier backend :


cd backend


Créer un environnement virtuel (optionnel mais recommandé) :


python -m venv venv


Activer l’environnement :

### Windows

venv\Scripts\activate


### Linux / Mac

source venv/bin/activate


Installer les dépendances :


pip install flask flask-cors


Lancer le serveur :


python app.py


Le serveur démarre sur :


http://127.0.0.1:5000


La base SQLite `queuebuddy.db` est créée automatiquement.

---

# Frontend (React)

Aller dans le dossier frontend :


cd frontend


Installer les dépendances :


npm install


Dans `package.json` vérifier la présence du proxy :


"proxy": "http://127.0.0.1:5000
"


Lancer l’application :


npm start


Le frontend sera accessible sur :


http://localhost:3000


---

# Endpoints API

## Créneaux

### GET /api/slots
Retourne tous les créneaux disponibles.

Exemple :


[
{ "id": 1, "datetime": "2026-03-05 10:00", "capacity": 2 }
]


---

### POST /api/slots
Créer un créneau.

Body :


{
"datetime": "2026-03-05 10:00",
"capacity": 2
}


---

# Réservations

### POST /api/bookings
Créer une réservation.

Body :


{
"slot_id": 1,
"student_name": "Said",
"student_id": "CNE123",
"reason": "Rendez-vous administratif"
}


Réponse :


{
"id": 5,
"slot_id": 1,
"student_name": "Said",
"student_id": "CNE123",
"reason": "Rendez-vous administratif",
"status": "pending"
}


---

### GET /api/bookings
Retourne toutes les réservations.

---

### PATCH /api/bookings/{id}
Modifier le statut d’une réservation.

Body :


{
"status": "confirmed"
}


---

# Scénario de démonstration (soutenance)

1. L’admin crée un créneau dans la page **Admin**
2. L’étudiant va dans la page **Créneaux**
3. L’étudiant réserve un créneau
4. L’admin change le statut de la réservation
5. L’étudiant consulte **Mes réservations** et voit le statut mis à jour

Test supplémentaire :

- Essayer de réserver deux fois le même créneau → erreur
- Remplir un créneau jusqu’à sa capacité → refus de réservation

---

# Améliorations possibles

- Authentification administrateur
- Notifications utilisateur
- Recherche de créneaux par date
- Filtrage des réservations par statut
- Interface plus avancée

---

