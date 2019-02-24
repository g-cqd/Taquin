#!/usr/local/bin/python3
# -*-coding:utf-8 -*

from random import shuffle
from math import ceil
from time import sleep, time

class Taquin:

	def __init__(self, environment, previous=None, move=None):
		self.environment = environment
		if previous == None:
			self.previous = previous
			self.sequence = self.magic(1)
			self.path = "_"
			self.g = 1
		else:
			assert isinstance(previous,Taquin) and isinstance(move,str)
			self.previous = previous
			self.sequence = previous.sequence
			self.moveTile(move)
			self.path = self.previous.path + move
			self.g = self.previous.g + 1
		self.identity = self.environment.number
		self.environment.number += 1
		self.inv = self.inversions()
		self.moves = self.findMoves()
		self.man = self.manhattan()
		self.disord = self.disorder()
		self.h = self.man + self.disord

	def inversions(self):
		sequence = self.sequence
		inv = 0
		length = self.environment.sizes[1]
		for i in range(0, length):
			for j in range(i+1, length):
				inv += 1 if (isinstance(sequence[i], int) and isinstance(sequence[j], int) and sequence[i] > sequence[j]) else 0
		return inv

	def coordinates(self, content=None):
		width = self.environment.sizes[0]
		if isinstance(content, tuple):
			return width * content[1] + content[0]
		else:
			index = self.sequence.index(content)
			y = ceil((index+1) / width) - 1
			x = index - (y * width)
			return (x,y)

	def findMoves(self):
		width = self.environment.sizes[0]
		bound = width - 1
		coords = self.coordinates()
		lastMove = self.path[-1]
		moves = []
		if coords[0] != 0 	  and lastMove != 'l': moves.append('r')
		if coords[0] != bound and lastMove != 'r': moves.append('l')
		if coords[1] != 0	  and lastMove != 'u': moves.append('d')
		if coords[1] != bound and lastMove != 'd': moves.append('u')
		return moves

	def moveTile(self, move):
		width = self.environment.sizes[0]
		x = self.coordinates(self.coordinates())
		if move == 'r': y = x - 1
		if move == 'l': y = x + 1
		if move == 'd': y = x - width
		if move == 'u': y = x + width
		self.sequence[x] = self.sequence[y]
		self.sequence[y] = None

	def valid(self):
		width = self.environment.sizes[0]
		inv = self.inversions()
		row = self.coordinates()[1]+1
		return True if (((width % 2 == 1) and (inv % 2 == 0)) or ((width % 2 == 0) and ((row % 2 == 1) == (inv % 2 == 0)))) else False

	def weightings(self):
		weightings = []
		width = self.environment.sizes[0]
		length = self.environment.sizes[1]-1

		for index in range(1, 7):
			pi = []
			rho = (4 if index % 2 != 0 else 1)
			if index == 1:
				pi = [36, 12, 12, 4, 1, 1, 4, 1]
			elif index == 2 or index == 3:
				for i in range(0, length):
					pi.append(length - i)


			elif index == 4 or index == 5:
				pi = [0] * length
				weight = length



				for i in range(0, width-1):
					j = 0
					while pi[j] != 0:
						j += 1
					for k in range(0,width-i):
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
			weightings.append((pi,rho))
		for weights in weightings:
			print(weights)
		return weightings

	def disorder(self):
		disord = 0
		for i, e in enumerate(self.sequence):
			disord += 1 if e != None and (i + 1) != e else 0
		return disord

	def manhattan(self):
		distanceSum = 0
		j = 0
		i = 1
		pos = []
		width, length = self.environment.sizes
		weightings = self.weightings()
		for weighting in weightings:
			distance = 0
			while i != length:
				pos = self.coordinates(i)
				x = i%width
				xy = ((width - 1) if x == 0 else (x - 1),ceil(i / width) - 1)
				distance += weighting[0][j] * ( abs( pos[0] - xy[0] ) + abs( pos[1] - xy[1] ) )
				j += 1
				i += 1
			distance /= weighting[1]
			distanceSum += distance
			print(("h({}):\t{}").format(j,distance))
		return distanceSum

	def magic(self, rand=0):
		length = self.environment.sizes[1]
		sequence = [None]*length
		for i in range(1, length):
			sequence[i-1] = i
		if rand == 1:
			shuffle(sequence)
			self.sequence = sequence
			while not self.valid():
				shuffle(sequence)
				self.sequence = sequence
		return sequence





class Environment:
	def __init__(self,width):
		self.number = 0
		self.sizes = (width,width*width)
		self.start = Taquin(self)
		self.explored = dict()

	@staticmethod
	def sortChildMoves(moves):
		length = len(moves)
		result = []
		while len(result) != length:
			minimum = moves[0]
			for move in moves:
				if move.h < minimum.h: minimum = move
			result.append(minimum)
			moves.pop(moves.index(minimum))
		return result

	def expand(self):
		frontiere = [self.start]
		while len(frontiere) > 0:
			if frontiere[0].disord == 0:
				print(frontiere[0].sequence)
				return True
			elif frontiere[0].sequence in self.explored.values():
				frontiere.pop(0)
			else:
				print(frontiere[0].sequence)
				moves = frontiere[0].findMoves()
				shift = len(moves)
				taquins = []
				for move in moves:
					taquins.append(Taquin(self, frontiere[0], move))
				taquins = self.sortChildMoves(taquins)
				self.explored[frontiere[0]]=frontiere[0].sequence
				frontiere = taquins + frontiere
				frontiere.pop(shift)


	def expanda(self):
		frontiere = [self.start]
		for taquin in frontiere:
			print(taquin.sequence)
			if taquin.inv == 0 : return taquin
			elif not taquin.sequence in self.explored.values():
				moves = taquin.findMoves()
				taquins = []
				for move in moves:
					taquins.append(Taquin(self,taquin,move))
				taquins = self.sortChildMoves(taquins)
				frontiere.extend(taquins)
				self.explored[taquin.path]=taquin.sequence


		while len(frontiere) > 0:
			print(frontiere[0].sequence)
			moves = frontiere[0].findMoves()
			taquins = []
			for move in moves:
				current = Taquin(self, frontiere[0], move)
				if current.disord == 0:
					print(current.sequence)
					return current
				else: taquins.append(current)
			frontiere = self.sortChildMoves(taquins) + frontiere
			frontiere.pop()







class __main__:
	e = Environment(3)
	e.expand()
