from math import sqrt, ceil
import copy
import time


class arbre:
	def __init__(self):
		tableau = [1, 2, 3, 4, 'X', 6, 7, 5, 8]
		racine = aStarResolving(tableau, 0, 0, 0, [])
		etatsExplores = [racine]
		etatFinal = False

		while(etatFinal == False):
			etatAExpanser = self.rechercheEtatPrioritaire(etatsExplores)
			nouveauxEnfants = etatAExpanser.creationEnfants()

			for item in nouveauxEnfants:
				if(item.TauxDeDesordre(item.getTaquin()) == 0):
					etatFinal = True
					print('Liste des coups = ', item.getListeCoups())
					break
			etatsExplores.extend(nouveauxEnfants)
			etatsExplores.remove(etatAExpanser)

	def rechercheEtatPrioritaire(self, etatsExplores):
		if(len(etatsExplores) == 1):
			return etatsExplores[0]
		else:
			minimum = etatsExplores[0]
			i = 0
			while(i < len(etatsExplores)):
				if(minimum.getF() > etatsExplores[i].getF()):
					minimum = etatsExplores[i]
				i += 1

			return minimum


class aStarResolving:
	def __init__(self, taquin, g, f, h, listeCoups):
		"""aStarResolving
		- g : nombre de coups effectues
		- h : la somme des heuristiques
		- f : g + h
		- listeCoups : list()
		"""
		self._taquin = taquin
		self._g = g
		self._listeCoups = listeCoups
		self._f = f
		self._h = h

	def getTaquin(self):
		return self._taquin

	def getG(self):
		return self._g

	def getListeCoups(self):
		return self._listeCoups

	def getF(self):
		return self._f

	def getH(self):
		return self._h

	def largeur(self):
		"""renvoie la largeur du taquin"""
		return int(sqrt(len(self.getTaquin())))

	def inversionCase(self, x1, y1, x2, y2, taquin):
		#inverse deux tuiles et renvoie le taquin obtenu
		pos1 = self.repereEnListe(x1, y1)-1
		pos2 = self.repereEnListe(x2, y2)-1

		temp = taquin[pos1]
		taquin[pos1] = taquin[pos2]
		taquin[pos2] = temp

		#taquin[pos1], taquin[pos2] = taquin[pos2], taquin[pos1]
		return taquin

	def positionTuileRepereOrthonorme(self, numeroTuile, taquinL):
		#renvoie la position d'une tuile sous forme de liste [x,y]
		coordonneees = []
		for i, e in enumerate(taquinL):
			if e == numeroTuile:
				indice = i
				break
		largeur = self.largeur()
		colonne = (indice+1) % largeur
		if(colonne == 0):
			coordonneees.append(int(largeur))
		else:
			coordonneees.append(int(colonne))
		ligne = int(ceil(float(indice+1)/float(largeur)))
		coordonneees.append(int(ligne))

		return coordonneees

	def repereEnListe(self, x1, y1):
		return self.largeur()*(y1-1)+x1

	def coupsPossibles(self):
		#renvoie la liste des coups possibles
		coord = self.positionTuileRepereOrthonorme('X', self.getTaquin())
		coupsP = []
		if(coord[0] != self.largeur()):
			coupsP.append('left')
		if(coord[0] != 1):
			coupsP.append('right')
		if(coord[1] != self.largeur()):
			coupsP.append('up')
		if(coord[1] != 1):
			coupsP.append('down')
		return coupsP

	def jouerCoup(self, coup, taquin):
		#joue un coup
		blanc = self.positionTuileRepereOrthonorme('X', taquin)
		if(coup == 'right'):
			x = blanc[0]-1
			y = blanc[1]
		if(coup == 'left'):
			x = blanc[0]+1
			y = blanc[1]
		if(coup == 'up'):
			x = blanc[0]
			y = blanc[1]+1
		if(coup == 'down'):
			x = blanc[0]
			y = blanc[1]-1
		taquinApres = self.inversionCase(blanc[0], blanc[1], x, y, taquin)
		return taquinApres

	def distanceManhattanTotale(self, poids, taquinL):
		distanceM = 0
		i = 1
		j = 0
		pos = []
		largeur = self.largeur()

		while(i != largeur*largeur):
			pos = self.positionTuileRepereOrthonorme(i, taquinL)
			if((i) % largeur == 0):
				posX = 3
			if((i) % largeur != 0):
				posX = i % largeur
			posY = int(ceil(float((i))/float(largeur)))
			distanceM += poids[j]*(abs(pos[0] - posX) + abs(pos[1] - posY))
			j += 1
			i += 1
		return distanceM

	def generationHeuristiques(self, numero):
		pi = []
		i = 0
		if(numero == 1):
			print('kk')
		if(numero == 2 or numero == 3):
			while(i < self.largeur()*self.largeur()-2):
				pi.append(self.largeur()*self.largeur()-i-1)
				i += 1




		if (numero == 4 or numero == 5):
			while(i < self.largeur()*self.largeur()-1):
				pi.append(0)
				i += 1
			poids = self.largeur()*self.largeur() - 1


			i = 0
			while (i < self.largeur() - 1):

				j = 0
				while(pi[j] != 0):
					j += 1

				l = 0
				while(l < self.largeur()-i):
					pi[j] = poids
					j += 1
					poids -= 1
					l += 1


				j += i
				pi[j] = poids
				poids -= 1
				j += self.largeur()


				while(j < self.largeur()*self.largeur()-2):
					pi[j] = poids
					poids -= 1
					j += self.largeur()
				i += 1

		if(numero == 6):
			while(i < self.largeur()*self.largeur()-2):
				pi.append(1)
				i += 1
		return pi

	def distanceManhattanPonderee(self, taquinL):  # A revoir, division entiere
		distance = 0
		ponderations = [
			([36, 12, 12, 4, 1, 1, 4, 1], 4),
			([8, 7, 6, 5, 4, 3, 2, 1], 1),
			([8, 7, 6, 5, 4, 3, 2, 1], 4),
			([8, 7, 6, 5, 3, 2, 4, 1], 1),
			([8, 7, 6, 5, 3, 2, 4, 1], 4),
			([1, 1, 1, 1, 1, 1, 1, 1], 1)
		]
		for i, e in enumerate(ponderations):
			distance += int(self.distanceManhattanTotale(e[0], taquinL)/e[1])
		return distance

	def TauxDeDesordre(self, taquinL):  # supp taquinl
		desordre = 0
		for i, e in enumerate(self.getTaquin()):
			desordre += 1 if (i+1) != e and e != 'X' else 0
		return desordre

	def heuristiques(self, taquinL):
		h = 0
		h += self.distanceManhattanPonderee(taquinL)
		h += self.TauxDeDesordre(taquinL)
		return h

	def creationEnfants(self):
		listeDeCoups = self.coupsPossibles()
		listeEnfants = []
		for item in listeDeCoups:
			tq = copy.copy(self.getTaquin())
			taquinF = self.jouerCoup(item, tq)
			liste = copy.copy(self.getListeCoups())
			h = self.heuristiques(taquinF)
			g = self.getG()+1
			f = h + g
			liste.append(item)
			listeEnfants.append(aStarResolving(taquinF, g, f, h, liste))

		return listeEnfants


class __main__:


	arbre = arbre()
