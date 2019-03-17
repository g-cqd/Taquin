# Taquin


## Collaborateurs
- Mélanie Marques : @mmrqs
- Guillaume COQUARD : @originecode


## Caractéristiques du Projet
- Date de début : 11 février 2019
- Date de rendu : 18 mars 2019


## Objectifs du Projet
- Implémentation de l'algorithme A-Star associé à différents heuristiques dont celui de la distance Manhattan
- Résolution du puzzle Jeu de Taquin, pour un coté de longueur 3


## Extensions possibles
- Interface Graphique
- Autorisation du déplacement double
- Implémentation du parcours en profondeur


## A Faire
- [x] Algorithme de génération de grille aléatoire
- [x] Algorithme de vérification de solvabilité d'une grille
- [ ] Algorithme de calcul des coups possibles à partir d'un état
- [ ] Trouver la structure de données adéquate
- [ ] Implémentation du parcours

## Idées à ne pas oublier
- [ ] Barre de chargement dans l'interface
- [ ] Tooltips
- [ ] Choisir les heuristiques pour la résolution via des radios buttons


## Avancement

### 19-02-11
- [x] Création d'une interface Web et génération (JS) de grille de taquins (solvables et non solvables)
### 19-02-12
- [x] Algorithme de Solvabilité (JS)
- [x] @mmrqs : Algorithme de Solvabilité (Python)
### 19-02-13
- [x] @originecode : Algorithme de Solvabilité (Python)
### 19-02-14
- [x] @originecode : Réécriture des classes
	- Préparation à la détection des coups
	- Préparation à la génération d'enfant
### 19-02-16
- [x] @originecode : Réécriture des classes (suite)

### 19-02-17
- [x] @mmrqs: ajout fonctions
	- situation dans le repère (x,y) d'une tuile
	- inversion de deux tuiles
	- coups possibles
	- jouer coups
	- commencement de la fonction distance de Manhattan

### 19-02-18 | 19
- [x] @originecode: Implémentations
	- Abandon de la matrice à 2 dimensions
	- Implémentation des inversions de tuiles sur liste
	- Implémentation des coups possibles
	- Implémentation du jeu de chaque coup
	- Implémentation de la distance de Manhattan totale

### 19-02-26
- [x] @originecode: Implémentations
	- Résolution de Taquins 3x3
- [x] @mmrqs : commencement de l'interface graphique
	- positionnement et personnalisation des boutons
	- positionnement des labels
	- génération d'un taquin de taille variable en fonction des paramètres entrés.
	
### 19-02-28
- [x] @mmrqs : Généralisation des heuristiques H4/H5 à des taquins de taille n*n

### 19-03-04
- [x] @mmrqs : Utilisation d'un dictionnaire ordonné pour gérer la frontière

### 19-03-07
- [x] @mmrqs : Modification de la fonction permettant de jouer un coup sur le Taquin 

### 19-03-08
- [x] @mmrqs : Modification de l'interface graphique. Elle permet dorénavant de générer un Taquin solvable, d'y jouer et de lancer la solution.

### 19-03-09
- [x] @mmrqs : - Intégration du mode 'Pilot' dans l'interface Graphique (pour les Taquins 3*3). 
	       - Possibilité de choisir les heuristiques à utiliser. 
	       - Affichage des distances de Manhattan, nombre d'inversions, taux de désordre à chaque coup joué.
### 19-03-10
- [x] @mmrqs : - Affichage de la solution sous forme d'une successions flèches (pour plus de clareté)
	       - Génération d'une fenêtre à la fin de la partie récapitulant les performances du joueur.
### 19-03-12
- [x] @mmrqs : - Choix de l'algorithme à utiliser dans l'interface
	       - Intégration du taux de désordre dans l'interface 
### 19-03-13:
- [x] @mmrqs : - Gestion des états explorés à l'aide d'un dictionnaire

