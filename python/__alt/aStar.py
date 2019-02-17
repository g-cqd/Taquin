from math import sqrt,ceil

class arbre:
    def __init__(self):
        tableau = [[7,6,1],[4,8,2],[3,5,'X']]
        taquin = aStarResolving(tableau)
        taquin.coupsPossibles()
        print('DISTANCE MANHATTAN : ',taquin.distanceManhattanTotale())



class aStarResolving:
    def __init__(self,taquin):
        self._taquin = taquin
    def setTaquin(self, taquin):
        self._taquin=taquin
    def getTaquin(self):
        return self._taquin

    # -- implémenté --
    def list(self):
        #transforme matrice en liste
        x = []
        i = 0
        while(i<len(self._taquin)):
            x += self._taquin[i]
            i += 1
        print(x)

        return x

    def inversionCase(self,x1,y1,x2,y2,taquin):
        #inverse deux tuiles et renvoie le taquin obtenu
        temp = 0
        temp = taquin[x1][y1]
        taquin[x1][y1] = taquin[x2][y2]
        taquin[x2][y2] = taquin[x1][y1]
        return taquin

    # -- implémenté --
    def positionTuile(self,numeroTuile):
        #renvoie la position d'une tuile sous forme de liste [x,y]
        taquinL = self.list()
        coordonneees = []
        indice = 0
        for i in taquinL:
            if(taquinL[i]==numeroTuile):

                indice = i
                break

        dimensions = int(sqrt(len(taquinL)))
        if((indice+1)%dimensions == 0):
            coordonneees.append(3)
        if((indice+1)%dimensions != 0 ):
            coordonneees.append((indice+1)%dimensions)
        coordonneees.append(int(ceil(float((indice+1))/float(dimensions))))
        print(coordonneees)
        return coordonneees

    # -- implémenté --
    def coupsPossibles(self):
        #renvoie la liste des coups possibles
        coord = self.positionTuile('X')
        coupsP = []
        if(coord[0] != 3):
            coupsP.append('right')
        if(coord[0]!= 1):
            coupsP.append('left')
        if(coord[1]!= 3):
            coupsP.append('up')
        if(coord[1]!= 1):
            coupsP.append('down')
        print(coupsP)
        return coupsP

    def jouerCoup(self,coup):
        blanc = self.positionTuile('X')
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

    def distanceManhattanTotale(self):
        distanceM = 0
        i = 1
        pos = []
        taquinL = self.list()

        dimensions = int(sqrt(len(taquinL)))

        while(i!=dimensions*dimensions-1):
            print('IIIIIIII',i)
            pos = self.positionTuile(i)
            print('TA MAMAN LA CACAHUETE',pos)
            if((i)%dimensions == 0):
                posX = 3
            if((i)%dimensions != 0 ):
                posX = i%dimensions
            posY = int(ceil(float((i))/float(dimensions)))
            distanceM += abs(pos[0] - posX) + abs(pos[1] - posY)
            i+=1
        return distanceM


class __main__:
    arbre = arbre()
