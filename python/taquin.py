#!/usr/local/bin/python3
# -*-coding:utf-8 -*

from random import shuffle
from math import ceil
from func import *

class Taquin:
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.previous = previous
		if previous == None:
			self.sequence = self.magic(1)
			self.path = "_"
			self.g = 0
		else:
			self.sequence = previous.sequence.copy()
			self.moveTile(move)
			self.path = self.previous.path + move
			self.g = self.previous.g + 1
		self.identity = self.environment.number
		self.environment.number = self.identity + 1
		self.inv = self.inversions()
		self.moves = self.findMoves()
		self.man = self.manhattan()
		#self.disorder = self.disorderRate()
		self.h = self.man
		self.f = self.h + self.g
	def inversions(self):
		sequence = self.sequence
		inv = 0
		length = self.environment.sizes[1]
		for i in range(length):
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
		limit = self.environment.sizes[0] - 1
		coords = self.coordinates()
		last = self.path[-1]
		moves = []
		if coords[0] != 0 	  and last != 'l': moves.append('r')
		if coords[0] != limit and last != 'r': moves.append('l')
		if coords[1] != 0	  and last != 'u': moves.append('d')
		if coords[1] != limit and last != 'd': moves.append('u')
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
		row = abs(self.coordinates()[1] - width)
		return True if (((width % 2 == 1) and (inv % 2 == 0)) or ((width % 2 == 0) and ((row % 2 == 1) == (inv % 2 == 0)))) else False
	def disorderRate(self):
		rate = 0
		for i, e in enumerate(self.sequence):
			rate += 1 if e != 0 and (i + 1) != e else 0
		return rate
	def manhattan(self):
		total = 0
		pos = []
		width, length = self.environment.sizes
		weightings = self.environment.weightings
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
			child = Taquin(self.environment,self,move)
			if child.man == 0:
				return child
			length = len(childList)
			if length > 0:
				i = 0
				while (i < length):
					if child.f > childList[i].f:
						i += 1
					elif child.f == childList[i].f:
						if child.inv > childList[i].inv:
							i += 1
						else:
							childList.insert(i,child)
							i = length
					else:
						childList.insert(i,child)
						i = length
			else:
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

def printTaquin(taquin):
	print("\n\n")
	print(("Taquin {}:").format(taquin.identity))
	print(("\t- Seq.\t:\t{}	").format(taquin.sequence))
	print(("\t- Path\t:\t{}	").format(taquin.path))
	print(("\t- g\t:\t{}	").format(taquin.g))
	print(("\t- inv\t:\t{}	").format(taquin.inv))
	print(("\t- moves\t:\t{}	").format(taquin.moves))
	print(("\t- man\t:\t{}	").format(taquin.man))
	#print(("\t- ord.\t:\t{}	").format(taquin.disorder))
	print(("\t- h\t:\t{}	").format(taquin.h))
	print(("\t- f\t:\t{}	").format(taquin.f))


class Environment:
	def __init__(self,width):
		self.number = 0
		self.sizes = (width,width*width)
		self.weightings = self.getWeightings()
		self.start = Taquin(self)
		self.moves = []
		self.current = self.start
		self.end = None

	def getWeightings(self):
		weightings = []
		width = self.sizes[0]
		length = self.sizes[1] - 1
		pi = [0] * length
		weight = length
		for i in range(width-1):
			j = 0
			while pi[j] != 0: j += 1
			for k in range(width-i):
				pi[j] = weight
				j += 1
				weight -= 1
			j += i
			pi[j] = weight
			weight -= 1
			j += width
			while j < length - 1 :
				pi[j] = weight
				weight -= 1
				j += width
		weightings.append((pi,1))
		return weightings



	def expand(self):
		pipe = [self.current]
		tree = dict()
		while (not self.end):
			shouldBeExpanded = pipe.pop(0)
			update(tree,shouldBeExpanded)
			children = shouldBeExpanded.childs()
			if isinstance(children,Taquin):
				self.end = children
				return children
			else:
				extend(pipe,children)


	def expand_tmp(self):
		queue = [self.start]
		explored = {self.start.sequence:self.start}
		end = False
		while (not end):
			for shouldBeExpanded in queue:
				sbe_seq = shouldBeExpanded.sequence
				if not (sbe_seq in explored.keys()):
					childs = shouldBeExpanded.childs()
					if isinstance(childs,Taquin):
						self.end = childs
						return childs
					queue.extend(childs)
				queue.pop(0)

	def play(self,move):
		previous = self.start if len(self.moves) < 1 else self.moves[-1]
		self.current = Taquin(self,previous,move)
		self.moves.append((move,self.current))
		return self.current

class __main__:
	env = int(input("Taille du taquin ? "))
	a = Environment(env)
	printTaquin(a.start)
	a.expand()
	printTaquin(a.end)
