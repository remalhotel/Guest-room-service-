# Remal Hotel & Villas - Room Service System

Système de commande de nourriture et boissons pour l'hôtel Remal.

## 🚀 Interfaces

| Interface | URL | Description |
|-----------|-----|-------------|
| Client | `index.html` | Commande pour les clients |
| Staff Login | `staff-login.html` | Connexion du personnel |
| Staff Dashboard | `staff.html` | Tableau de bord cuisine |

## 🔑 Accès

- **Client** : Accessible à tous
- **Staff** : Mot de passe requis (`remal2024` par défaut)

## 🛠️ Technologies

- HTML5 / CSS3 / JavaScript
- Tailwind CSS
- Supabase (Base de données et temps réel)
- Font Awesome

## 📊 Base de données

```sql
CREATE TABLE food_orders (
    id SERIAL PRIMARY KEY,
    room_number TEXT,
    guest_name TEXT,
    meal_type TEXT,
    items JSONB,
    total_amount NUMERIC,
    special_instructions TEXT,
    delivery_time TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE food_orders REPLICA IDENTITY FULL;
