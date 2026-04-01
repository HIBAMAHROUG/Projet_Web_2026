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


## conception global
![diagramme use case ](Diagramme.png)

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
