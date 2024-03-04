# Les émulateurs

Les [émulateurs](https://firebase.google.com/docs/emulator-suite) sont une fonctionnalité importante de [Firebase](https://firebase.google.com/) puisqu'ils permettent de tester en local les fonctionnalités implémentées.

Dans ce projet, les émulateurs vont permettent de pouvoir faire des testes intégraux sur le projet.
En effet, il est possible d'émuler la base de données réelle sans l'altérer.

## L'installation des outils

### Firebase CLI

Nous supposerons ici que le projet a toutes les dépendances d'installées (sinon voir [ici](./../Organisation/installation.md))
et en particulier de `firebase` et `firebase-tools`.
Il faut alors se connecter à son compte google associé au projet via `firebase login`.
Dans le cas d'un soucis, merci de vous référer à la [documentation officielle](https://firebase.google.com/docs/cli#install_the_firebase_cli) 
des outils Firebase CLI.

### Les émulateurs

Comme le projet possède déjà un fichier `firebase.json`, contrairement à la 
[documentation](https://firebase.google.com/docs/emulator-suite/connect_and_prototype?database=RTDB),
il n'est pas utile de lancer `firebase init`.

L'installation des émulateurs se fait avec la commande :
```{bash}
firebase init emulators
```
Le CLI demande alors quels émulateurs installer.
Pour l'instant, dans ce projet, nous n'avons besoin que de :
 - Authentication Emulator (port par défaut : 9099) : pour s'authentifier via le service
 - Database Emulator (port par défaut : 9000) : pour accéder à la base de données
 - Hosting Emulator (port par défaut : 5000)  : pour accéder à l'application
Les sélectionner en laissant les ports par défaut.
(pour sélectionner utiliser la touche <Space> et les flèches directionnelles).


## Connection aux émulateurs

La connection aux émulateurs se fait de différentes façon.

### La connection à l'hôte

Pour se connecter à l'hôte, il suffit de se connecter à localhost sur le port
5000 dans sur navigateur favori : [http://localhost:5000](http://localhost:5000).


Pour connecter l'application aux deux émulateurs, nous procédons ainsi : 
 - firebase.auth().useEmulator("http://127.0.0.1:9099") pour connecter à l'émulateur d'authentication
 - modification de la configuration firebase lors de l'initialisation de celle-ci en changeant le changeant le champs "DatabaseURL"

Pour se connecter à l'hôte, d'après les règles mises en place, nous devons utiliser 
`npm run build` pour d'abord créer l'application.

Pour export les données des emulators, il faut utiliser la commande : `firebase emulators:export <folder>`
Pour lancer les émulateurs avec les données, il suffit d'utiliser la commande : `firebase emulators:start --import <folder`
