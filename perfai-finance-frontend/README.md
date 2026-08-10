# PerfAI Finance

Application Next.js de gestion de portefeuille client et de demandes de crédit. Elle s’appuie sur Supabase pour l’authentification Google et la persistance, puis calcule un score de risque explicable pour chaque demande.

> Le terme « IA » désigne dans cette version un moteur de règles métier déterministe et explicable. Ce n’est ni un modèle de machine learning, ni un appel à un LLM.

## Fonctionnalités

- Connexion Google avec Supabase Auth et redirection vers le tableau de bord.
- Création, modification, recherche et suppression de clients.
- Création et décision (`pending`, `approved`, `rejected`) des demandes de crédit.
- Analyse de risque d’une demande, conservation de son résultat et génération d’alertes.
- Indicateurs et activités alimentés par les données Supabase : dashboard, clients, demandes, analyses et alertes.

## Démarrage

Prérequis : Node.js 20+ et un projet Supabase avec Google OAuth configuré.

Créez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Ajoutez `http://localhost:3000/callback` et l’URL de production correspondante aux URL de redirection autorisées dans Supabase Authentication.

```bash
npm install
npm run dev
```

Commandes de contrôle :

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Architecture

```text
src/
├── app/                         # Routes App Router et layouts
│   ├── (auth)/                  # Login et callback OAuth
│   ├── (protected)/             # Dashboard, clients, crédits, analyse
│   ├── layout.tsx               # Layout HTML global
│   └── page.tsx                 # Landing page
├── components/
│   ├── analysis/                # Affichage des résultats de scoring
│   ├── auth/                    # Protection client des routes
│   ├── clients/                 # Table, KPIs, analyse et activité clients
│   ├── credit/                  # Table, KPIs et activité des demandes
│   ├── dashboard/               # KPIs, graphique et alertes dashboard
│   ├── landing/                 # Sections de la landing page
│   └── shared/                  # Composants UI réutilisables
├── hooks/                       # État React et orchestration des services
├── lib/                         # Client Supabase, constantes et utilitaires
├── services/                    # Accès Supabase et moteur de règles
├── types/                       # Contrats TypeScript des tables
└── utils/                       # Formatage et messages d’erreurs
```

## Modèle de données attendu

| Table | Rôle | Champs utilisés |
| --- | --- | --- |
| `clients` | Profil du demandeur | `full_name`, `monthly_income`, `business_age`, `activity`, `location`, `created_by` |
| `credit_requests` | Demande de financement | `client_id`, `amount`, `duration_months`, `purpose`, `status`, `created_by` |
| `risk_analysis` | Résultat persistant d’une analyse | `request_id`, `score`, `risk_level`, `recommendation`, `explanation` |
| `alerts` | Alertes métier produites par l’analyse | `client_id`, `type`, `message`, `severity` |

Les tables doivent être protégées par des politiques RLS Supabase. Le client navigateur ne doit disposer que de la clé anonyme publique ; aucune clé `service_role` ne doit être exposée au front.

## Moteur de scoring

Le moteur est dans `src/services/scoringEngine.ts`. Il reçoit un `Client` et une `CreditRequest`, valide le montant et la durée, puis démarre à **50 points**. Un score élevé signifie un risque faible.

| Règle | Condition | Impact |
| --- | --- | --- |
| Stabilité | Ancienneté ≥ 5 / ≥ 3 / ≥ 1 an | +20 / +15 / +8 |
| Expérience | Même ancienneté | +15 / +10 / +5 |
| Mensualité / revenu | `< 30%` / `< 50%` / `< 70%` / ≥ 70% | +20 / +10 / +5 / -10 |
| Montant excessif | Montant > 12 × revenu mensuel | -20 |
| Montant / revenu annuel | ≤ 1 / > 1 / > 1,5 | +5 / -5 / -15 |

Le score final est arrondi et borné entre **0 et 100**.

| Score | Niveau de risque | Recommandation enregistrée |
| --- | --- | --- |
| ≥ 70 | Faible | `CREDIT RECOMMANDE` |
| 45 à 69 | Moyen | `CREDIT A EVALUER` |
| < 45 | Élevé | `CREDIT NON RECOMMANDE` |

### Explication produite

Le moteur génère aussi un texte explicable : ancienneté de l’activité, revenu mensuel, part de la mensualité dans le revenu, score et niveau de risque. Il est enregistré dans `risk_analysis.explanation` et affiché sur `/risk-analysis`.

### Hypothèses et limites métier

- La mensualité est une approximation : `montant / durée`. Aucun taux, frais, garantie, historique de paiement ou dette existante n’est pris en compte.
- L’ancienneté est volontairement pondérée deux fois, au titre de la stabilité et de l’expérience : jusqu’à +35 points. Cette pondération mérite une validation métier.
- Une donnée absente n’ajoute ni ne retire de point. Elle ne doit donc pas être interprétée comme favorable.
- Les recommandations sont des aides à la décision, jamais une approbation automatique du crédit.
- Le seuil du graphique dashboard est une cible métier fixe de 30 % ; les données observées sont la moyenne mensuelle de `100 - score`.

## Flux d’analyse et recommandations

```text
Utilisateur sélectionne une demande
          ↓
useRiskAnalysis.analyze()
          ↓
riskService.analyzeCreditRequest()
          ↓
Récupération de la demande et du client depuis Supabase
          ↓
calculateScore() → score, niveau, recommandation, explication
          ↓
Upsert dans risk_analysis (unicité attendue sur request_id)
          ↓
generateRiskAlerts() → suppression des alertes de risque précédentes
          ↓
Création de l’alerte cohérente avec le nouveau niveau
```

Alertes générées :

- risque élevé : alerte `critical` ;
- risque moyen : alerte `warning` ;
- score ≥ 80 : alerte informative sur le bon profil.

Une relance remplace les alertes de risque automatiques du client afin d’éviter les doublons. Les autres types d’alertes ne sont pas supprimés.

## Données affichées dans l’interface

- **Dashboard** : KPI de portefeuille, analyses enregistrées, alertes récentes et moyenne du risque par mois sur les cinq derniers mois.
- **Page Clients** : risques et suivis basés sur la dernière analyse disponible de chaque client ; progression fondée sur les créations du mois en cours comparées au mois précédent.
- **Page Demandes** : niveau de risque issu de `risk_analysis`, jamais d’une estimation visuelle à partir du montant ; activité issue des demandes, analyses et alertes réelles.
- **Page Analyse des risques** : résultat persistant de la demande sélectionnée, recommandation et explication du moteur.

## Composants et exécution

### Server Components

Sans directive `'use client'`, les composants sont des Server Components par défaut. Dans ce projet, ils rendent principalement la structure et le contenu statique :

- layouts : `src/app/layout.tsx`, `src/app/(auth)/layout.tsx`, `src/app/(protected)/layout.tsx` ;
- pages structurelles : landing page, `/clients` et `/credit-requests` ;
- composants de présentation : sections `landing`, badges, `KpiCard`, `Loading`, `EmptyState`, `RiskScore`, `RiskIndicator`.

Ils ne détiennent pas d’état React ni de gestionnaire d’événement. Une page Server Component peut composer des Client Components, comme les tableaux interactifs.

`components/analysis/RiskAnalysisResult.tsx` et `AiRiskRecommandation.tsx` sont également des Server Components statiques, mais ne sont pas montés par la route actuelle `/risk-analysis`. Ils contiennent encore du contenu d’exemple et constituent des candidats à la suppression ou à la refonte avant toute réutilisation.

### Client Components

Les fichiers avec `'use client'` s’exécutent dans le navigateur car ils emploient état, effets, navigation ou Supabase côté client :

- routes interactives : `login/page.tsx`, `callback/page.tsx`, `dashboard/page.tsx`, `risk-analysis/page.tsx` ;
- tableaux et modales : `ClientTable`, `CreditRequestTable`, `Modal`, `RequestError` ;
- données vivantes : composants dashboard, KPIs clients/crédits et cartes d’activité ;
- navigation et authentification : `DashboardNavbar`, `DashboardSidebar`, `AuthGuard` ;
- hooks : `useAuth`, `useClients`, `useCreditRequests`, `useRiskAnalysis`.

### Server Actions et API Routes

Il n’y en a actuellement **aucune**. Les fichiers de `src/services` sont des fonctions TypeScript ordinaires appelées depuis les Client Components et parlent directement à Supabase avec l’utilisateur authentifié.

Conséquences :

- les règles de sécurité doivent impérativement être appliquées avec RLS dans Supabase ;
- le calcul de scoring est aujourd’hui visible et exécutable côté navigateur ;
- pour protéger la logique, centraliser l’audit ou intégrer des sources sensibles, il faudra déplacer l’analyse vers une Server Action, une Route Handler ou une Edge Function Supabase.

## Fichiers principaux

| Fichier | Responsabilité |
| --- | --- |
| `src/services/scoringEngine.ts` | Règles de scoring et explication textuelle |
| `src/services/riskService.ts` | Lecture, analyse et sauvegarde des résultats |
| `src/services/alertService.ts` | CRUD des alertes et déduplication métier |
| `src/services/clientService.ts` | CRUD et recherche clients |
| `src/services/creditService.ts` | CRUD et décisions de demandes |
| `src/services/dashboardService.ts` | Agrégats KPI du dashboard |
| `src/hooks/useRiskAnalysis.ts` | Orchestration analyse + alertes dans l’UI |
| `src/app/(protected)/risk-analysis/page.tsx` | Écran d’exécution et consultation de l’analyse |
| `src/services/scoringEngine.test.ts` | Tests unitaires du moteur de scoring |

## Tests actuels

`npm test` exécute Vitest. Les tests couvrent actuellement :

- un dossier soutenable classé en risque faible ;
- un montant trop élevé classé en risque élevé ;
- le rejet des montants et durées invalides.

À compléter en priorité : cas limites des seuils, persistance Supabase, RLS, déduplication d’alertes et parcours OAuth.
