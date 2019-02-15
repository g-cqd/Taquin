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

class Sequence(list):
	"""Liste à une ou deux dimensions"""
	def __type__(self):
		"""Retourne le type de séquence : True => Grille ; False => Liste"""
		return isinstance(self[0], Sequence)
	def __grid__(self,width):
		"""Conversion d'une liste à une dimension en liste à deux dimensions."""
		x = Sequence([None]*width)
		for i in range(0, width):
			y = Sequence([None]*width)
			for j in range(0,width):
				y[j] = self[(i * width) + j]
			x[i] = y
		return x
	def __list__(self):
		x = Sequence([])
		for i in self:
			x += self[i]
		return x
	def __invr__(self):
		if len(self):
			x = self.__list__() if self.__type__() else self
			y = 0
			z = len(x)
			for i in range(0, z):
				for j in range(i+1, z):
					y += 1 if (isinstance(x[i], int) and isinstance(x[j], int) and x[i] > x[j]) else 0
		else: return False
		return y
	def __row__(self,width):
		x = self.__grid__(width)
		for i in range(0, width):
			for j in range(0, width):
				if (x[i][j] == None):
					return i+1
	def __test__(self, width):
		x = self.__invr__()
		y = self.__row__(width)
		return True if (((width % 2 == 1) and (x % 2 == 0)) or ((width % 2 == 0) and ((y % 2 == 1) == (x % 2 == 0)))) else False
	def __move__(self):
		#return sorted_array_of_possible_moves
		pass
	@staticmethod
	def __act__(taquin, move):
		#return sequence_after_move
		pass
	@staticmethod
	def magic(width, rand=0):
		size = width*width
		if rand == 1:
			x = Sequence([None]*size)
			for i in range(1, size):
				x[i-1] = i
			shuffle(x)
			while not x.__test__(width):
				shuffle(x)
		return x

class Environment:
	def __init__(self, width):
		self.number = 0
		self.width = width
		self.size = width * width
		self.start = Taquin(self)

class Taquin:
	def __init__(self,env,prev=None,move=None,sequence=None):
		self.number = env.number
		env.number += 1
		self.env = env
		self.prev = prev
		if sequence == None:
			if prev == None:
				if move == None:
					self.table = Sequence.magic(self.env.width, 1)
					self.path = ""
				else:
					self.table = Sequence([])
					self.path = self.prev.path + move
			else:
				if move != None:
					self.table = Sequence([])
					self.path = self.prev.path + move
		else:
			self.table = Sequence(sequence)
			self.path = ""

class __main__:
	e = Environment(3)
	print(e.start.path)
