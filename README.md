# Projet Web 2026 — FaithPath

Plateforme web orientée contenu islamique avec pages d’authentification, page d’accueil et module des horaires de prière.

## Objectif du projet

- Proposer une expérience simple et moderne autour de fonctionnalités utiles au quotidien.
- Offrir un accès rapide aux horaires de prière via géolocalisation ou recherche manuelle.
- Maintenir une interface cohérente avec un style global centralisé.

## Fonctionnalités actuelles

- Authentification (front, localStorage):
	- Inscription avec validation des champs
	- Vérification email déjà existant
	- Connexion avec contrôle email/mot de passe
	- Persistance de session utilisateur courante
	- Page de restauration mot de passe (interface)

- Page d’accueil (FaithPath):
	- Header + navigation responsive
	- Affichage du nom utilisateur connecté
	- Hero en arabe avec identité visuelle islamique
	- Grille de fonctionnalités:
		- القرآن الكريم
		- أسماء الله الحسنى
		- مسار الأنبياء
		- التقويم الهجري
		- أوقات الصلاة
		- المسبحة الإلكترونية
		- قصة الصحابة
		- حاسب نفسك
		- اختبارات دينية
		- صدقة جارية
		- أذكار الصباح والمساء
	- Sections contenu: القرآن / حديث / خدمات / footer complet

- Page Horaires de prière:
	- Géolocalisation navigateur automatique
	- Reverse geocoding (ville/pays)
	- Recherche manuelle par ville/pays
	- Chargement des horaires via API AlAdhan
	- Affichage des prières: الفجر، الشروق، الظهر، العصر، المغرب، العشاء
	- Carte de la prochaine prière + compte à rebours temps réel
	- Mise en évidence visuelle de la prochaine prière
	- Cache local des données du jour pour accélérer l’affichage
	- États UI complets: chargement, erreur, fallback manuel

- Expérience UI/UX globale:
	- Design responsive (mobile/tablette/desktop)
	- Identité graphique unifiée dans un seul fichier CSS
	- Icônes et cartes thématiques (croissant, mosquée, palette verte/or)
	- Animations légères et transitions fluides

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

- Ouvrir le dossier projet dans VS Code
- Clic droit sur [start.html](start.html) ou [page_acceuil.html](page_acceuil.html)
- Ouvrir avec Live Server

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
