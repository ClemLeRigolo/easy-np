# Installations et lancement

## Le site web

### Installations des dépendaces liées au site web

Le project utilise un fichier `package.json` qui indique toutes les dépendances liées au
site web. Comme ce dernier est entièrement en Javascript et Nodejs, il suffit de lancer
la commande : 
```{bash}
npm install 
# ou de manière équivalente
npm i
```

### Lancement du site

Une fois les [dépendances](#Le-site-web) installées, il suffit de lancer:
```{bash}
npm start
```
Le site sera disponible en localhost sur le port 3000 :  [http://localhost:3000/](http://localhost:3000/).

## La documentation

### Installation des dépendances liées à la documentation

Pour documenter le project, nous utilisons [Mkdocs](https://www.mkdocs.org/).
Mkdocs est un project python. Il s'installe à l'aide de pip.
Il est recommandé d'utiliser un environnement virtuel pour installer pip.

#### L'environnement virtuel python

Pour installer l'environnement virtuel, il suffit de faire :
```{bash}
# à la racine du project 
python -m venv venv
```
Un dossier `venv` est alors créé. C'est dans ce dossier que les modules Python vont être installés par `pip`.
Pour plus d'information, voir ce [tutorial](https://realpython.com/python-virtual-environments-a-primer/) ou la [documentaion python](https://docs.python.org/3/library/venv.html).

Une fois l'environnement virtuel installer, il faut le lancer :
```{bash}
# toujours depuis la racine du project
source ./venv/bin/activate
```
Lorsque l'environnement virtuel est actif, le prompte du terminal est modifié :
```{bash}
(venv) prompt
```
Pour le désactiver, il suffit alors de taper `deactivate`.

**Remarque:** l'environnement virtuel est **local** au terminal. 

#### Installation des dépendances mkdocs

```{bash}
# installation de mkdocs
python -m pip install mkdocs
# installation de material (le theme courant utilisé)
python -m pip install mkdocs-material
``` 

### Lancement de mkdocs
Le lancement de mkdocs (après avoir lancer l'environnement virtuel si vous en utiliser un) se fait via la commande : 
```{bash}
mkdocs serve
```
Il sera alors possible de voir la documentation en local sur le port 8000 : [http://localhost:8000](http://localhost:8000/)
