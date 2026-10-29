# Nova — Conciergerie digitale (application mobile React Native)

Prototype de l'application mobile Nova, construit avec **Expo (SDK 58), React Native et TypeScript**.
Fonctionne sur iPhone, Android et en version web.

## Lancer l'application sur votre téléphone

1. Installez **Node.js 20 ou plus** sur votre ordinateur (https://nodejs.org).
2. Installez l'application **Expo Go** sur votre téléphone (App Store ou Google Play).
3. Dézippez le dossier `nova`, ouvrez un terminal dedans, puis lancez :

   ```bash
   npm install
   npx expo start
   ```

4. Un code QR s'affiche dans le terminal. Scannez-le avec l'appareil photo (iPhone) ou avec Expo Go (Android).
   Le téléphone et l'ordinateur doivent être sur le même réseau Wi-Fi.

Pour l'essayer dans un navigateur : `npx expo start --web`.

## Ce que contient le prototype

**Espace utilisateur** (employé, membre ou locataire)
- Présentation en 3 écrans, puis connexion simulée « Continuer avec le compte de mon entreprise »
- Accueil personnalisé avec le champ « Que puis-je faire pour vous ? » et des demandes fréquentes
- Catalogue des 8 catégories de services, avec la couverture définie par l'entreprise
- Nouvelle demande : description, date, adresse (bureau, domicile, autre), budget, pièce jointe, estimation
- Assistant concierge : comprend une demande écrite en langage naturel, pose les questions manquantes (date, adresse) et propose une demande prête à confirmer
- Suivi en 4 étapes, fiche du concierge, messagerie, notation, favoris, « refaire cette demande »
- Messages, profil, préférences (langue, mode sombre, notifications)
- Bandeau « Version de test » et formulaire « Donner mon avis »

**Espace entreprise** (administrateur RH ou gestionnaire)
- Aperçu : indicateurs clés, activité hebdomadaire, catégories les plus utilisées
- Membres : invitation par courriel, activation et désactivation
- Règles : services couverts et plafond mensuel par personne
- Avis des testeurs (les avis envoyés depuis l'espace utilisateur y apparaissent)
- Forfait : « Phase de tests — accès gratuit » et abonnement professionnel à venir, avec « Être informé »

**Partout** : français / anglais, mode clair / sombre, commutateur Utilisateur / Entreprise en haut de l'écran pour la démo.

## Limites du prototype

- Toutes les données sont fictives (Atelier Boréal, Camille Tremblay, les chiffres du tableau de bord) et ne sont pas enregistrées : elles reviennent à zéro au redémarrage.
- L'assistant fonctionne en mode simulé (règles locales dans `src/assistant.ts`). Pour le brancher sur Gemini ou un autre modèle, passez par votre propre serveur : ne mettez jamais de clé API dans l'application.
- Pas de vraie connexion, ni de paiement, ni de notifications push. Les réponses du concierge sont simulées.

## Organisation du code

```
App.tsx                      Polices, thème, fournisseur d'état
src/AppContext.tsx           État global (demandes, membres, règles, avis, langue, thème)
src/data.ts                  Catégories et données de démonstration
src/i18n.ts                  Textes français et anglais
src/theme.ts                 Palette bleu nuit, ivoire et or ; polices
src/assistant.ts             Assistant simulé (détection catégorie, date, adresse)
src/components/              Composants d'interface partagés
src/navigation/              Navigation (pile + onglets utilisateur et entreprise)
src/screens/user/            Écrans de l'espace utilisateur
src/screens/company/         Écrans de l'espace entreprise
```

## Prochaines étapes pour une vraie version

1. Un serveur (comptes, demandes, messagerie en temps réel), par exemple Firebase ou Supabase.
2. Un outil interne pour les concierges, afin de recevoir et de traiter les demandes.
3. L'assistant IA branché via ce serveur.
4. La publication sur l'App Store et Google Play avec EAS Build (`npx eas build`).
