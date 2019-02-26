# Taquin


## Collaborateurs
- Mélanie Marques : @mmrqs
- Guillaume COQUARD : @originecode


## Caractéristiques du Projet
- Date de début : 11 février 2019
- Date de rendu : 11 mars 2019


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
