from random import shuffle

# Ce qu'il faut :
#	- Séquence
# 		=> liste || grille
#		=> Calcul d'inversions
#		=> Calcul de Swap Disponibles (mode mono ou multi)
#		=> Position du Blank
#		=> Calcul de Solvabilité
#	- Taquin
# 		+ Contenu
# 		+ Chemin
#		+ Parent
#	- Environnement
#		+ Largeur
#		+ Taille
#		+ Dico des Etats Explores
#		+ Liste Frontiere


class Environnement(object):
	def __init__(self, width):
		self.number = 0
		self.sizes = (width, width*width)
		self.start = Taquin(self)


# Pas encore implémenté
class Case(object):
	def __init__(self,number,x,y):
		self.number = number
		self.coord = (x,y)



class Taquin(object):
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.identity = self.environment.number
		self.environment.number += 1
		self.matrix = None
		self.previous = None
		if previous == None:
			self.matrix = self.magic(1)
			self.path = ""
			self.distance = 0
		else:
			assert isinstance(previous,Taquin) and isinstance(move,str)
			self.matrix = self.__act__(self.previous,move)
			self.path = self.previous.path + move
			self.distance = self.previous.distance + 1
	def __type__(self):
		return isinstance(self.matrix[0], list)
	def __mtrx__(self):
		sizes = self.environment.sizes
		if isinstance(self.matrix[0], list):
			return False
		else:
			x = [None]*sizes[0]
			for i in range(0,sizes[0]):
				y = [None]*sizes[0]
				for j in range(0,sizes[0]):
					y[j] = self.matrix[(i*sizes[0])+j]
				x[i] = y
			return x
	def __list__(self):
		if not isinstance(self.matrix[0], list):
			return False
		else:
			x = []
			for i in self.matrix:
				x += self.matrix[i]
			return x
	def __invr__(self):
		if len(self.matrix):
			x = self.__list__() if self.__type__() else self.matrix
			y = 0
			z = len(x)
			for i in range(0, z):
				for j in range(i+1, z):
					y += 1 if (isinstance(x[i], int) and isinstance(x[j], int) and x[i] > x[j]) else 0
		else: return False
		return y
	def __row__(self):
		sizes = self.environment.sizes
		x = self.__mtrx__()
		for i in range(0, sizes[0]):
			for j in range(0, sizes[0]):
				if (x[i][j] == None):
					return i+1
	def __move__(self):
		#return sorted_array_of_possible_moves
		pass
	def __act__(self,previous,move):
		#return sequence_after_move
		return self.matrix
	def __test__(self):
		sizes = self.environment.sizes
		x = self.__invr__()
		y = self.__row__()
		return True if (((sizes[0] % 2 == 1) and (x % 2 == 0)) or ((sizes[0] % 2 == 0) and ((y % 2 == 1) == (x % 2 == 0)))) else False
	def magic(self, r=0):
		sizes = self.environment.sizes
		x = [None]*sizes[1]
		for i in range(1, sizes[1]):
			x[i-1] = i
		if r == 1:
			shuffle(x)
			self.matrix = x
			while not self.__test__():
				shuffle(x)
				self.matrix = x
		return x



class __main__:
	e = Environnement(3)
	print(e)
	print(e.sizes)
	print(e.start)
	print(e.start.matrix)
