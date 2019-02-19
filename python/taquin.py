from random import shuffle
from math import ceil

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
		self.final = self.start.magic(0)

class Taquin(object):
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.identity = self.environment.number
		self.environment.number += 1
		self.sequence = None
		self.previous = None
		if previous == None:
			self.sequence = self.magic(1)
			self.path = ""
			self.distance = 0
		else:
			assert isinstance(previous,Taquin) and isinstance(move,str)
			# self.sequence = self.__act__(self.previous,move)
			self.path = self.previous.path + move
			self.distance = self.previous.distance + 1
	def __invr__(self):
		if len(self.sequence):
			x = self.sequence
			y = 0
			z = self.environment.sizes[1]
			for i in range(0, z):
				for j in range(i+1, z):
					y += 1 if (isinstance(x[i], int) and isinstance(x[j], int) and x[i] > x[j]) else 0
		else: return False
		return y
	def __rowc__(self, content=None):
		sequence = self.sequence
		sizes = self.environment.sizes
		for i in range(0, sizes[1]):
			if sequence[i] == content:
				return (ceil((i+1) / sizes[0]))
	def __moves__(self):
		width = self.environment.sizes[0]
		x = self.__rowc__()-1
		y = self.sequence.index(None) - (x*width)
		bound = width - 1
		moves = []
		if y != bound: moves.append('right')
		if y != 0: moves.append('left')
		if x != bound: moves.append('up')
		if x != 0: moves.append('down')
		return moves
	def __move__(self, move):
		sequence = self.sequence
		width = self.environment.sizes[0]
		x = sequence.index(None)
		if move == 'right':
			y = x - 1
		if move == 'left':
			y = x + 1
		if move == 'up':
			y = x - width
		if move == 'down':
			y = x + width
		self.sequence[x] = self.sequence[y]
		self.sequence[y] = None
		self.sequence = sequence
		return sequence
	def __test__(self):
		sizes = self.environment.sizes
		x = self.__invr__()
		y = (self.__rowc__())+1
		return True if (((sizes[0] % 2 == 1) and (x % 2 == 0)) or ((sizes[0] % 2 == 0) and ((y[0] % 2 == 1) == (x % 2 == 0)))) else False
	def manhattan(self, index=False):
		sequence = self.sequence
		width = self.environment.sizes[0]
		distance = 0
		if not index:
			for i, e in enumerate(sequence):
				if e != None:
					x = self.__rowc__(e) - 1
					y = i - (x * width)
					pos = (x, y)

					v = ceil(e / width) - 1
					w = (e-1) - (v*width)
					inipos = (v, w)

					distance += abs(pos[0] - inipos[0]) + abs(pos[1] - inipos[1])
		else:
			for i, e in enumerate(sequence):
				if i == index:
					x = self.__rowc__(e) - 1
					y = i - (x * width)
					pos = (x, y)

					v = ceil(e / width) - 1
					w = (e-1) - (v*width)
					inipos = (v, w)

					distance = abs(pos[0] - inipos[0]) + abs(pos[1] - inipos[1])
		return distance
	def magic(self, rand=0):
		sizes = self.environment.sizes
		sequence = [None]*sizes[1]
		for i in range(1, sizes[1]):
			sequence[i-1] = i
		if rand == 1:
			shuffle(sequence)
			self.sequence = sequence
			while not self.__test__():
				shuffle(sequence)
				self.sequence = sequence
		return sequence

class __main__:
	e = Environnement(3)
	print('Width:\t\t', e.sizes[0])
	print('Length:\t\t', e.sizes[1])
	print('Sequence:\t', e.start.sequence)
	print('Blank Row:\t', e.start.__rowc__())
	print('Blank Index:\t', e.start.sequence.index(None))
	print('Manhattan:\t',e.start.manhattan())
