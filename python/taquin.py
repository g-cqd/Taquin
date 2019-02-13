import random
from math import *

class generationTaquin:
    def __init__(self,Largeur):
        self._Largeur = Largeur
    def getLargeur(self):
        return self._Largeur
    def setLargeur(self, Largeur):
        self._Largeur= Largeur
    def generation(self):
        temps = time.time()
        grilleSolvable = False
        while(grilleSolvable == False):
            liste_init = []
            listeFin = []
            i = 1
            while(i!=(self.getLargeur()*self.getLargeur())):
                liste_init.append(i)
                print(liste_init)
                i = i+1
            liste_init.append('X')
            temp = 0
            nombrePermutation = 0
            permute = True
            print(liste_init)
            random.shuffle(liste_init)

            for item in liste_init:
                listeFin.append(item)

            print('LISTE FIN',listeFin)
            liste_init.remove('X')
            print('LISTE FIN',listeFin)
            while(permute !=False):
                j = 0
                permute = False
                while(j!=len(liste_init)-1):
                    if(liste_init[j]>liste_init[j+1]):
                        temp = liste_init[j]
                        liste_init[j] = liste_init[j+1]
                        liste_init[j+1]=temp
                        nombrePermutation = nombrePermutation+1
                        permute = True
                    j = j+1
            if((self.getLargeur()%2==1)and(nombrePermutation%2==0)):
                grilleSolvable = True
            if((self.getLargeur()%2==0)and((self.getLargeur()-ceil(listeFin.index('X')/4))%2==0)and(nombrePermutation%2==1)):
                grilleSolvable = True
            if((self.getLargeur()%2==0)and((self.getLargeur()-ceil(listeFin.index('X')/4))%2==1)and(nombrePermutation%2==0)):
                grilleSolvable = True
        return listeFin

class __main__:
    Largeur = int(input("Dimensions de la grille?"))
    taquin = generationTaquin(Largeur)
    grille = taquin.generation()
    print('GRILLE',grille)
