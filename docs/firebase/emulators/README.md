Installation de firebase cli pour mettre en place les emulateurs : `npm install firebase-tools`
Connection à son compte google avec `firebase login`

Installation des emulateurs avec `firebase init emulators`
Selection des champs qui nous intéressent :
 - Authentication Emulator (sur le port 9099)
 - Database Emulator (sur le port 9000)
 - Hosting Emulator (sur le port 5000)
Il est alors possible de se connecter en local

Pour connecter l'application aux deux émulateurs, nous procédons ainsi : 
 - firebase.auth().useEmulator("http://127.0.0.1:9099") pour connecter à l'émulateur d'authentication
 - modification de la configuration firebase lors de l'initialisation de celle-ci en changeant le changeant le champs "DatabaseURL"

Pour se connecter à l'hôte, d'après les règles mises en place, nous devons utiliser 
`npm run build` pour d'abord créer l'application.
