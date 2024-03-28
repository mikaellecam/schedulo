# Application pour les emplois du temps universitaires

***

Nous souhaitons implémenter une version simplifiée et minimale d'une application web pour accéder aux
emplois du temps universitaires. L'objectif de remplacer l'ADE étant trop ambitieux, nous nous concentrerons sur l'expérience
utilisateur et la facilité d'utilisation. N'ayant pas accès aux serveurs de l'université, nous allons seulement regarder
les emplois du temps pour la licence informatique (L2-L3, tous les sites).

Chaque utilisateur devra créer un compte, et définir quelques informations pour essayer de reproduire un compte étudiant.

L'implémentation sera basée sur la framework Next.js, qui nous permet de travailler sur le frontend et backend de
notre application d'une manière simple et rapide, en utilisant des aspects de rendements sur le serveur et de React.

***

### 1. Modèle de données :

Nous utiliserons une base de données pour stocker les comptes des utilisateurs et les emplois du temps universitaires
correspondants.

#### La base de données contiendra des tables pour :

-  Utilisateurs : stockant des informations sur les comptes universitaires, y compris le nom d'utilisateur,
   le mot de passe (haché pour la sécurité) et d'autres détails pertinents tels que la promotion.

- Emploi du temps : contenant des informations sur les cours, tels que le nom du cours, le code du cours, l'instructeur, le numéro de la salle et la plage horaire.

### 2. Vues :

#### Le site Web comprendra les pages suivantes :
- Page de connexion : où les utilisateurs peuvent se connecter à l'aide de leurs identifiants universitaires.
- Page d'emploi du temps : affichant l'emploi du temps de l'utilisateur de manière claire et concise. Cette page comprendra
  également un système de filtre avec de la recherche optionelle pour afficher les cours d'une certaine manière, par exemple, de
  pouvoir afficher seulement les cours sélectionné ou affichage par jour, semaine ou mois.
- Page de profil : permettant aux utilisateurs de consulter et de modifier les détails de leur compte. Y compris la possibilité
  d'ajouter des cours, de les supprimer, de les modifier. Permettant de mélanger plusieurs emplois du temps en un seul pour une
  meilleure visibilité.

### 3. Routes et logique de contrôle :
- `GET auth/login` : affiche la page de connexion.
- `POST auth/login` : traite les informations d'identification (recherche et vérification de mot de passe dans la base de données) et redirige vers la page d'emploi du temps si l'authentification est réussite.
- `GET auth/signup` : affiche la page d'inscription.
- `POST auth/signup` : traite les informations d'inscription (création d'un nouveau utilisateur dans la base de données) et redirige vers la page d'emploi du temps si l'inscription est réussite.
- `GET /timetable` : affiche l'emploi du temps de l'utilisateur. Page principile de l'application.
- `GET /profile` : affiche une page qui nous montre les informations de l'utilisateur, avec des options de modification sur l'UI.
- `POST /profile` : met à jour les informations de profil de l'utilisateur, communication avec la base de données sous la forme d'une mise à jour.
- `GET /logout` : déconnecte l'utilisateur et redirige vers la page de connexion.

### Technologies :

- **Frontend** : React.js pour l'interface utilisateur, nous permattant de rendre l'application plus dynamique et interactive,
  mais également de pouvoir réutiliser des composants, facilitant la conception et la maintenance de l'application.
- **Backend** : Next.js pour le serveur et le routage, avec une API REST pour la communication entre le frontend et le backend.
- **Base de données** : Implémentation en SQL, le technologie utilisée peut être PostgreSQL ou SQLite.
