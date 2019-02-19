from math import sqrt,ceil

class arbre:
    def __init__(self):
        tableau = [7,6,1,4,8,2,3,5,'X'] #Oui, je laisse le X juste pour t embeter :D
        racine = etat(0,0,0,[],tableau)
        etatsExplores = [racine]
        etatFinal = False
        while(etatFinal == False):
            print('entree')
            etatAExpanser = self.rechercheEtatPrioritaire(etatsExplores)
            print('sortie')
            kk = aStarResolving(etatAExpanser.getTaquin(),etatAExpanser.getG(),etatAExpanser.getlisteCoups())
            nouveauxEnfants = kk.creationEnfants()

            for item in nouveauxEnfants:
                if(item.TauxDeDesordre(item.getTaquin())==0):
                    etatFinal = True
                    print('Liste des coups = ',item.getlisteCoups())
                    break           
            etatsExplores.extend(nouveauxEnfants)
            etatsExplores.remove(etatAExpanser)



    def rechercheEtatPrioritaire(self,etatsExplores):
        print('len',len(etatsExplores))
        if(len(etatsExplores)==1):
            print('Wesh')
            return etatsExplores[0]
        else:
            minimum = etatsExplores[0]
            i = 0
            while(i<len(etatsExplores)+1):
                print(1)
                print(minimum.getF())
                if(minimum.getF()> etatsExplores[i].getF()):
                    print(2)
                    minimum = etatsExplores[i]
                print(2)
                i += 1
            return minimum




class etat:
        def __init__(self,g,h,f,listeCoups,taquin):
            self._g = g
            self._h = h
            self._f = f
            self._listeCoups = listeCoups
            self._taquin = taquin

        def getG(self):
            return self._g
        def getH(self):
            return self._h
        def getF(self):
            return self._f
        def getlisteCoups(self):
            return self._listeCoups
        def getTaquin(self):
            return self._taquin

class aStarResolving:
    def __init__(self,taquin, g, listeCoups):
        self._taquin = taquin
        self._g = g
        self._listeCoups = listeCoups

    
    def setTaquin(self, taquin):
        self._taquin=taquin
    def getTaquin(self):
        return self._taquin
    def getG(self):
        return self._g
    def getListeCoups(self):
        return self._listeCoups


    def dimensions(self):
        #renvoie les dimensions du taquin
        return int(sqrt(len(self.getTaquin())))

    def inversionCase(self,x1,y1,x2,y2,taquin):
        #inverse deux tuiles et renvoie le taquin obtenu
        temp = taquin[x1][y1]
        taquin[x1][y1] = taquin[x2][y2]
        taquin[x2][y2] = temp
        return taquin

    def positionTuileRepereOrthonorme(self,numeroTuile, taquinL):
        #renvoie la position d'une tuile sous forme de liste [x,y]
        coordonneees = []
        i = 0
        while (taquinL[i]!=numeroTuile):
            i +=1
        indice = i

        dimensions = self.dimensions()
        if((indice+1)%dimensions == 0):
            coordonneees.append(3)
        if((indice+1)%dimensions != 0 ):
            coordonneees.append((indice+1)%dimensions)
        coordonneees.append(int(ceil(float((indice+1))/float(dimensions))))
        return coordonneees




    def coupsPossibles(self):
        #renvoie la liste des coups possibles
        coord = self.positionTuileRepereOrthonorme('X', self.getTaquin())
        print('NOISETTE',coord)
        coupsP = []
        if(coord[0] != self.dimensions()):
            coupsP.append('left')
        if(coord[0]!= 1):
            coupsP.append('right')
        if(coord[1]!= self.dimensions()):
            coupsP.append('up')
        if(coord[1]!= 1):
            coupsP.append('down')

        return coupsP
    
    def jouerCoup(self,coup):
        #joue un coup
        blanc = self.positionTuileRepereOrthonorme('X', self.getTaquin())
        if(coup =='right'):
            x = blanc[0]-1
            y = blanc[1]
            
        if(coup =='left'):
            x = blanc[0]+1
            y = blanc[1]

        if(coup == 'up'):
            x = blanc[0]
            y = blanc[1]+1

        if(coup == 'down'):
            x = blanc[0]
            y = blanc[1]-1

        taquinApres = self.inversionCase(blanc[0],blanc[1],x,y,self.getTaquin())

        return taquinApres

    def distanceManhattanTotale(self,poids, taquinL):
        distanceM = 0
        i = 1
        j = 0
        pos = []
        dimensions = self.dimensions()

        while(i!=dimensions*dimensions):
            print(i)
            pos = self.positionTuileRepereOrthonorme(i, taquinL)
            if((i)%dimensions == 0):
                posX = 3
            if((i)%dimensions != 0 ):
                posX = i%dimensions
            posY = int(ceil(float((i))/float(dimensions)))
            distanceM += poids[j]*(abs(pos[0] - posX) + abs(pos[1] - posY)) 
            j+=1
            i+=1
        return distanceM
    
    def distanceManhattanPonderee(self,taquinL):
        distance = 0
        pi1 = [36,12,12,4,1,1,4,1]
        distance += float(self.distanceManhattanTotale(pi1,taquinL))/float(4)
        pi23 = [8,7,6,5,4,3,2,1]
        distance += float(5*(self.distanceManhattanTotale(pi23,taquinL)))/float(4)
        pi45 = [8,7,6,5,3,2,4,1]
        distance += float(5*(self.distanceManhattanTotale(pi45,taquinL)))/float(4)
        pi6 =  [1,1,1,1,1,1,1,1]
        distance += self.distanceManhattanTotale(pi6,taquinL)

        return distance
    
    def TauxDeDesordre(self,taquinL):
        taquin = self.getTaquin()
        i = 0
        desordre = 0
        while (i!=len(taquin)):
            if((i+1)!=taquin[i]):
                desordre+=1
            i+=1
        return desordre

    def heuristiques(self,taquinL):
        h = 0
        h+=self.distanceManhattanPonderee(taquinL)
        h+=self.TauxDeDesordre(taquinL)

        return h
    def creationEnfants(self):
        
        listeDeCoups = self.coupsPossibles()
        listeEnfants = []
        print(listeDeCoups)
        for item in listeDeCoups:
            print('TU ME GAVES')
            taquinF = self.jouerCoup(item)
            liste = []
            h = self.heuristiques(taquinF)
            g = self.getG()+1
            f = h+g
            liste.append(item)
            listeEnfants.append(etat(g,h,f,liste,taquinF))
            

        return listeEnfants

    


class __main__:
    arbre = arbre()