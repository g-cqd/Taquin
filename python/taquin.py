#!/usr/local/bin/python3
# -*-coding:utf-8 -*

from random import shuffle
from math import ceil

def extend(l,cs):
	while len(cs) > 0:
		c = cs.pop(0)
		i = 0
		j = 0
		n = len(l)
		if n > 0:
			while (j < n):
				if c.f > l[i].f: i += 1
				elif c.f == l[i].f:
					if c.inv > l[i].inv: i += 1
				j += 1
		l.insert(i,c)


class Taquin:
	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		self.previous = previous
		self.inv = None
		self.dis = None
		self.man = None
		if previous == None:
			self.sequence = self.magic(1)
			self.move = "_"
			self.g = 0
		else:
			self.sequence = previous.sequence.copy()
			self.moveTile(move)
			self.move = move
			self.g = self.previous.g + 1
			self.inv,self.dis,self.man = self.details()
		self.moves = self.findMoves()
		self.h = self.man + self.dis
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
		weighting = self.environment.weighting
		sequence = self.sequence
		inv = 0
		rate = 0
		man = 0
		k = 0
		for i, e in enumerate(sequence):
			if (e != 0 and (i+1) != e): rate += 1
			for j in range(i+1, length):
				if (e!=0 and sequence[j] != 0 and e > sequence[j]): inv += 1
			if (i > 0):
				pos = self.coordinates(i)
				x = i%width
				coords = (((width - 1) if x == 0 else (x - 1)), ceil(i / width) - 1)
				man += weighting[0][k] * (abs(pos[0]-coords[0]) + abs(pos[1]-coords[1]))
				k += 1
		if (weighting[1] > 1): man /= weighting[1]
		return (inv,rate,man)
	def findMoves(self):
		limit = self.environment.sizes[0] - 1
		coords = self.coordinates()
		last = self.move
		moves = []
		if coords[0] != 0 	  and last != 'l': moves.append('r')
		if coords[0] != limit and last != 'r': moves.append('l')
		if coords[1] != 0	  and last != 'u': moves.append('d')
		if coords[1] != limit and last != 'd': moves.append('u')
		return moves
	def moveTile(self, move):
		sequence = self.sequence
		width = self.environment.sizes[0]
		x = self.coordinates(self.coordinates())
		if move == 'r': y = x - 1
		if move == 'l': y = x + 1
		if move == 'd': y = x - width
		if move == 'u': y = x + width
		sequence[x] = sequence[y]
		sequence[y] = 0
	def valid(self):
		width = self.environment.sizes[0]
		self.inv,self.dis,self.man = self.details()
		inv = self.inv
		row = abs(self.coordinates()[1] - width)
		return True if (((width % 2 == 1) and (inv % 2 == 0)) or ((width % 2 == 0) and ((row % 2 == 1) == (inv % 2 == 0)))) else False
	def childs(self):
		childList = []
		for move in self.moves:
			child = Taquin(self.environment,self,move)
			childArray = [child]
			if childArray[0].h == 0: return childArray[0]
			extend(childList,childArray)
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
	print("\n")
	print("Taquin :")
	print(("\t- seq\t:\t{}	").format(taquin.sequence))
	print(("\t- move\t:\t{}	").format(taquin.move))
	print(("\t- moves\t:\t{}").format(taquin.moves))
	print(("\t- inv\t:\t{}	").format(taquin.inv))
	print(("\t- man\t:\t{}	").format(taquin.man))
	print(("\t- dis\t:\t{}	").format(taquin.dis))
	print(("\t- g\t:\t{}	").format(taquin.g))
	print(("\t- h\t:\t{}	").format(taquin.h))
	print(("\t- f\t:\t{}	").format(taquin.f))
	print("\n")


class Environment:
	def __init__(self,width):
		self.sizes = (width,width*width)
		self.weighting = self.computeWeighting()
		self.start = Taquin(self)
		self.moves = []
		self.current = self.start
		self.end = None
	def computeWeighting(self):
		width = self.sizes[0]
		length = self.sizes[1] - 1
		pi = [0] * length
		weight = length
		for i in range(width-1):
			j = 0
			while pi[j] != 0:
				j += 1
			k = 0
			while (k < width - i):
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
		return (pi,1)
	def expand(self):
		pipe = [self.current]
		while (not self.end):
			shouldBeExpanded = pipe.pop(0)
			children = shouldBeExpanded.childs()
			if isinstance(children,Taquin):
				self.end = children
				return children
			else:
				extend(pipe,children)

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
