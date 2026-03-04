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
