#!/usr/local/bin/python3
# -*-coding:utf-8 -*

from random import shuffle
from math import ceil
from time import sleep, time

class Taquin:
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.previous = previous
		if previous == None:
			self.sequence = self.magic(1)
			self.path = "_"
			self.g = 1
		else:
			assert isinstance(previous,Taquin) and isinstance(move,str)
			self.sequence = previous.sequence.copy()
			self.moveTile(move)
			self.path = self.previous.path + move
			self.g = self.previous.g + 1
		self.identity = self.environment.number
		self.environment.number += 1
		self.inv = self.inversions()
		self.moves = self.findMoves()
		self.man = self.manhattan()
		self.disorder = self.disorderRate()
		self.h = self.man + self.disorder
		self.f = self.h + self.g
	def inversions(self):
		sequence = self.sequence
		inv = 0
		length = self.environment.sizes[1]
		for i in range(0, length):
			for j in range(i+1, length):
				inv += 1 if (sequence[i]!=0 and sequence[j] != 0 and sequence[i] > sequence[j]) else 0
		return inv
	def coordinates(self, content=0):
		width = self.environment.sizes[0]
		if isinstance(content, list):
			return width * content[1] + content[0]
		else:
			index = self.sequence.index(content)
			y = ceil((index + 1) / width) - 1
			x = index - (y * width)
			return [x, y]
	def findMoves(self):
		bound = self.environment.sizes[0] - 1
		coords = self.coordinates()
		lastMove = self.path[-1]
		moves = []
		if coords[0] != 0 	  and lastMove != 'l': moves.append('r')
		if coords[0] != bound and lastMove != 'r': moves.append('l')
		if coords[1] != 0	  and lastMove != 'u': moves.append('d')
		if coords[1] != bound and lastMove != 'd': moves.append('u')
		return moves
	def moveTile(self, move):
		sequence = self.sequence.copy()
		width = self.environment.sizes[0]
		x = self.coordinates(self.coordinates())
		if move == 'r': y = x - 1
		if move == 'l': y = x + 1
		if move == 'd': y = x - width
		if move == 'u': y = x + width
		sequence[x] = sequence[y]
		sequence[y] = 0
		self.sequence = sequence
	def valid(self):
		width = self.environment.sizes[0]
		inv = self.inversions()
		row = self.coordinates()[1]+1
		return True if (((width % 2 == 1) and (inv % 2 == 0)) or ((width % 2 == 0) and ((row % 2 == 1) == (inv % 2 == 0)))) else False
	def weightings(self):
		weightings = []
		width = self.environment.sizes[0]
		length = self.environment.sizes[1] - 1
		for index in range(1, 7):
			pi = []
			rho = (4 if index % 2 != 0 else 1)
			if index == 1:
				if width == 3:
					pi = [36, 12, 12, 4, 1, 1, 4, 1]
				else:
					pi = [None]
			elif index == 2 or index == 3:
				for i in range(length):
					pi.append(length - i)
			elif index == 4 or index == 5:
				pi = [0] * length
				weight = length
				for i in range(width-1):
					j = 0
					while pi[j] != 0: j += 1
					for k in range(width-i):
						pi[j] = weight
						j += 1
						weight -= 1
					j += 1
					pi[j] = weight
					weight -= 1
					j += width
					while j < length - 1:
						pi[j] = weight
						weight -= 1
						j += width
			elif index == 6:
				pi = [1]*length
			if (pi != [None]):
				weightings.append((pi,rho))
		return weightings
	def disorderRate(self):
		rate = 0
		for i, e in enumerate(self.sequence):
			rate += 1 if e != 0 and (i + 1) != e else 0
		return rate
	def manhattan(self):
		total = 0
		pos = []
		width, length = self.environment.sizes
		weightings = self.weightings()
		for weighting in weightings:
			distance = 0
			for i in range(1, length):
				j = 0
				pos = self.coordinates(i)
				x = i%width
				coords = (((width - 1) if x == 0 else (x - 1)),ceil(i / width) - 1)
				distance += weighting[0][j] * ( abs( pos[0] - coords[0] ) + abs( pos[1] - coords[1] ) )
				j += 1
			distance /= weighting[1]
			total += distance
		return total
	def childs(self):
		childList = []
		for move in self.moves:
			childList.append(Taquin(self.environment,self,move))
		return childList
	def magic(self, rand=0):
		length = self.environment.sizes[1]
		sequence = [0]*length
		for i in range(1, length):
			sequence[i-1] = i
		if rand == 1:
			shuffle(sequence)
			self.sequence = sequence
			while not self.valid():
				shuffle(sequence)
				self.sequence = sequence
		return sequence


def printTaquin(taquin):
	print("\n\n")
	print(("Taquin {}:").format(taquin.identity))
	print(("	- Seq.\t:\t{}	").format(taquin.sequence))
	print(("	- Path\t:\t{}	").format(taquin.path))
	print(("	- g\t:\t{}	").format(taquin.g))
	print(("	- inv\t:\t{}	").format(taquin.inv))
	print(("	- moves\t:\t{}	").format(taquin.moves))
	print(("	- man\t:\t{}	").format(taquin.man))
	print(("	- ord.\t:\t{}	").format(taquin.disorder))
	print(("	- h\t:\t{}	").format(taquin.h))
	print(("	- f\t:\t{}	").format(taquin.f))


class Environment:
	def __init__(self,width):
		self.number = 0
		self.sizes = (width,width*width)
		self.start = Taquin(self)
		self.end = None


	@staticmethod
	def lookForPriorities(explored):
		shouldBeExpanded = explored[0]
		


	def expandMel(self):
		root = self.start
		explored = [root]
		final = False

		while (final == False):
			shouldBeExpanded = explored[0]
			for taquin in explored:
				if (shouldBeExpanded.f > taquin.f): shouldBeExpanded = taquin
			newChilds = shouldBeExpanded.childs()

			for child in newChilds:
				if (child.disorder == 0):
					return child
			explored.extend(newChilds)
			explored.remove(shouldBeExpanded)



class __main__:
	a = Environment(3)
	a.end = a.expandMel()
	printTaquin(a.end)
