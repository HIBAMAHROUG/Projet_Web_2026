# Projet Web 2026 — FaithPath

Plateforme web orientée contenu islamique avec pages d’authentification, page d’accueil et module des horaires de prière.

## Objectif du projet

- Proposer une expérience simple et moderne autour de fonctionnalités utiles au quotidien.
- Offrir un accès rapide aux horaires de prière via géolocalisation ou recherche manuelle.
- Maintenir une interface cohérente avec un style global centralisé.

## Fonctionnalités actuelles

- Authentification front (localStorage):
	- Connexion
	- Création de compte
	- Restauration mot de passe (interface)
- Page d’accueil avec sections de découverte.
- Page Horaires de prière:
	- Détection de localisation
	- Chargement des horaires du jour
	- Prochaine prière + compte à rebours
	- Saisie de ville en fallback
	- Mise en cache locale des données

## Structure du projet

- [start.html](start.html): page de connexion
- [signup.html](signup.html): création de compte
- [restaurationmdp.html](restaurationmdp.html): récupération mot de passe
- [page_acceuil.html](page_acceuil.html): page d’accueil
- [prayertime.html](prayertime.html): page des horaires de prière
- [prayertime.js](prayertime.js): logique API + rendu des horaires
- [styles.css](styles.css): feuille de style globale
- [img](img): ressources visuelles
- [data](data): données statiques éventuelles

## Lancer le projet en local

Option 1 (recommandée): extension Live Server dans VS Code

- Ouvrir le dossier projet dans VS Code
- Clic droit sur [start.html](start.html) ou [page_acceuil.html](page_acceuil.html)
- Ouvrir avec Live Server

Option 2 (serveur Python)

- Dans le dossier projet, exécuter:
	- `python -m http.server 3000`
- Ouvrir ensuite:
	- `http://localhost:3000/start.html`

## Notes techniques

- Les comptes utilisateurs front sont stockés en localStorage (démo / environnement non production).
- Le style est fusionné dans un seul fichier: [styles.css](styles.css).
- Les horaires de prière utilisent des APIs externes (AlAdhan + Nominatim).

## Améliorations prévues

- Backend réel pour l’authentification sécurisée (JWT + refresh token).
- Validation avancée côté serveur.
- Internationalisation et accessibilité renforcée.
- Optimisation et modularisation CSS.

## Auteurs

- Équipe Projet Web 2026