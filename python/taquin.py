#!/usr/local/bin/python3
# -*-coding:utf-8 -*

from random import shuffle
from math import ceil
from collections import OrderedDict
import time

class Taquin:
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.previous = previous
		self.inv = None
		self.man = None
		if previous == None:
			self.path = "_"
			self.g = 0
			self.sequence = self.magic(1)
		else:
			self.path = previous.path + move
			self.g = previous.g + 1
			self.sequence = previous.sequence.copy()
			self.moveTile(move)
			self.inv,self.man = self.details()
		self.moves = self.findMoves()
		self.h = self.man
		self.f = self.h + self.g
	def coordinates(self, content=0):
		width = self.environment.sizes[0]
		if isinstance(content, list):
			return (width * content[1]) + content[0]
		else:
			index = self.sequence.index(content)
			y = ceil((index + 1) / width) - 1
			x = index - (y * width)
			return [x, y]
	def details(self):
		width, length = self.environment.sizes
		weightings = self.environment.weightings
		sequence = self.sequence
		inv = 0
		man = 0
		for weighting in weightings:
			k = 0
			stepMan = 0
			for i, e in enumerate(sequence):
				for j in range(i+1, length):
					if (e!=0 and sequence[j] != 0 and e > sequence[j]):
						inv += 1
				if (i > 0):
					pos = self.coordinates(i)
					x = i%width
					coords = (((width - 1) if x == 0 else (x - 1)), ceil(i / width) - 1)
					stepMan += (abs(pos[0]-coords[0]) + abs(pos[1]-coords[1])) * weighting[0][k]
					k += 1
			if (weighting[1] > 1):
				stepMan /= weighting[1]
			man += stepMan
		return (inv,man)
	def findMoves(self,flex=False):
		limit = self.environment.sizes[0] - 1
		coords = self.coordinates()
		last = self.path[self.g]
		moves = []
		if coords[0] != 0 	  and (last != 'L' or flex): moves.append('R')
		if coords[0] != limit and (last != 'R' or flex): moves.append('L')
		if coords[1] != 0	  and (last != 'U' or flex): moves.append('D')
		if coords[1] != limit and (last != 'D' or flex): moves.append('U')
		return moves
	def moveTile(self, move):
		sequence = self.sequence
		width = self.environment.sizes[0]
		x = self.coordinates(self.coordinates())
		if move == 'R': y = x - 1
		if move == 'L': y = x + 1
		if move == 'D': y = x - width
		if move == 'U': y = x + width
		sequence[x] = sequence[y]
		sequence[y] = 0
	def valid(self):
		width = self.environment.sizes[0]
		self.inv,self.man = self.details()
		inv = self.inv
		row = abs(self.coordinates()[1] - width)
		return True if (((width % 2 == 1) and (inv % 2 == 0)) or ((width % 2 == 0) and ((row % 2 == 1) == (inv % 2 == 0)))) else False
	def children(self):
		childList = []
		for move in self.moves:
			child = Taquin(self.environment,self,move)
			if child.h == 0: return child
			childList.append(child)
		return childList
	def magic(self, rand=0):
		length = self.environment.sizes[1]
		sequence = [0]*length
		for i in range(1, length): sequence[i-1] = i
		if rand == 1:
			shuffle(sequence)
			self.sequence = sequence
			while not self.valid():
				shuffle(sequence)
				self.sequence = sequence
		return sequence
	def __repr__(self):
		printable = ""
		printable += "\n"
		printable += "Taquin :\n"
		printable += ("|  seq. .. : {}\n").format(self.sequence)
		printable += ("|  path .. : {}\n").format(self.path)
		printable += ("|  inv. .. : {}\n").format(self.inv)
		printable += ("|  man. .. : {}\n").format(self.man)
		printable += ("|  moves . : {}\n").format(self.moves)
		printable += ("|  g ..... : {}\n").format(self.g)
		printable += ("|  h ..... : {}\n").format(self.h)
		printable += ("|  f ..... : {}").format(self.f)
		printable += "\n"
		return printable


class Environment:
	def __init__(self,width,choices=None):
		self.sizes = (width,width*width)
		self.choices = choices
		self.weightings = self.getWeightings(choices)
		self.moves = [Taquin(self)]
		self.end = []
	def getWeightings(self,choices):
		if (choices == None): choices = [i for i in range(1,7)]
		weightings = []
		width = self.sizes[0]
		length = self.sizes[1] - 1
		pi = []
		for index in choices:
			rho = (4 if index % 2 != 0 else 1)
			if index == 1:
				if width == 3:
					pi = [36, 12, 12, 4, 1, 1, 4, 1]
			if index == 2 or index == 3:
				pi = [(length+1) - i for i in range(1,length+1)]
			if index == 4 or index == 5:
				pi = [0] * length
				weight = length
				for i in range(width-1):
					j = 0
					while pi[j] != 0:
						j += 1
					k = 0
					while k < width-i:
						pi[j] = weight
						j += 1
						weight -= 1
						k += 1
					j += i
					pi[j] = weight
					weight -= 1
					j += width
					while j < length - 1 :
						pi[j] = weight
						weight -= 1
						j += width
			if index == 6:
					pi = [1] * length
			if (len(pi)>0):
				weightings.append((pi,rho,index))
		return weightings
	def correct(self):
		for move in self.moves:
			move.inv,move.man = move.details()
			move.h = move.man
			move.f = move.g + move.h
	def aStar(self):
		print(self.moves[-1])
		queue = OrderedDict()
		queue[self.moves[-1].f] = [self.moves[-1]]
		while (True):
			# Retourne le premier élément dans liste des clés
			k = list(queue.keys())[0]
			# L'état à traiter est la premiere valeur contenu par la clé
			shouldBeExpanded = queue[ k ][0]
			# Suppression de cet état dans le dictionnaire
			del queue[ k ][0]
			# Si la clé est vide : la supprimer
			if queue[ k ] == []: del queue[ k ]
			# Découverte des enfants de l'état à expanser
			children = shouldBeExpanded.children()
			# Si l'état retourne un enfant et non une liste d'enfants
			# alors c'est la solution donc l'enregistrer et le retourner
			if isinstance(children,Taquin):
				print(children)
				self.end.append(children)
				return self.end[-1]
			# Sinon ajouter les enfants dans le dictionnaire
			else:
				for child in children :
					if(child.f in queue):
						# Si la clé existe déjà, ajouter l'enfant aux éléments que la clé contient déjà
						queue[child.f].append(child)
					else:
						# Sinon initialiser la clé avec une liste contenant l'enfant
						queue[child.f] = [child]
				queue = OrderedDict( sorted( queue.items(), key=lambda t: t[0]))
	def expand(self,function,decomposition=0):
		if (decomposition==0):
			print("\n\n")
			start = time.time()
			print(("Heuristiques utilisées : {}").format(self.choices))
			result = function()
			print(("Duration : {}").format(time.time() - start))
			print("\n\n")
			return result
		else:
			results = []
			decomposition = self.weightings.copy()
			for weighting in decomposition:
				print("\n")
				start = time.time()
				print(("Heuristiques utilisées : {}").format(weighting[2]))
				self.weightings = [weighting]
				self.correct()
				results.append(function())
				print(("Duration : {}").format(time.time() - start))
				print("\n\n.........................................\n")
			return results
	def play(self,move):
		self.moves.append(Taquin(self,self.moves[-1],move))
		return self.moves[-1]

class __main__:
	env = int(input(">>> Taille du taquin ?\n>>> "))
	choices = str(input(">>> Heuristiques ?\n>>> Entrez les numéros séparés par des espaces.\n>>> "))
	decomposition = 0
	if len(choices) == 1: choices = [int(choices)]
	else:
		choices = choices.split(' ')
		for index,choice in enumerate(choices): choices[index] = int(choice)
		decomposition = int(input(">>> Voulez-vous associer les heuristiques ou dissocier les exécutions (n:0/y:1) ?\n>>> "))
	a = Environment(env,choices)
	while(a.moves[-1].h != 0):
		print(a.moves[-1])
		move = "_"
		while not move in ["R","L","D","U","E"]:
			move = str(input((">>> Dans quel direction voulez vous aller ? {}\n>>> Ou alors peut-être voulez-vous explorer ? ['E']\n>>> ").format(a.moves[-1].moves)))
		if move in a.moves[-1].moves:
			a.play(move)
		elif move == "E":
			a.expand(a.aStar,decomposition)
			exit(0)
