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
			self.distance = 0
		else:
			assert isinstance(previous,Taquin) and isinstance(move,str)
			self.previous = previous
			self.sequence = self.moveTile(previous.sequence,move)
			self.path = self.previous.path + move
			self.distance = self.previous.distance + 1
		self.identity = self.environment.number
		self.environment.number += 1

	def inversions(self):
		sequence = self.sequence
		number = 0
		length = self.environment.sizes[1]
		for i in range(0, length):
			for j in range(i+1, length):
				number += 1 if (isinstance(sequence[i], int) and isinstance(sequence[j], int) and sequence[i] > sequence[j]) else 0
		return number

	def coordinates(self, content=None):
		sequence = self.sequence
		width = self.environment.sizes[0]
		for index, element in enumerate(sequence):
			if element == content:
				y = ceil( (index+1) / width )
				x = index - ( (y-1) * width )
				return (x,y)

	def findMoves(self):
		width = self.environment.sizes[0]
		coords = self.coordinates()
		x = coords[0]
		y = coords[1]
		bound = width - 1
		moves = []
		if x != 0: moves.append('r')
		if x != bound: moves.append('l')
		if y != 0: moves.append('d')
		if y != bound: moves.append('u')
		print(('moves: {}').format(moves))
		return moves

	def moveTile(self, seq, move):
		sequence = seq.copy()
		width = self.environment.sizes[0]
		x = sequence.index(None)
		print(('sequence:\t{}').format(sequence))
		print(('width:\t{}').format(width))
		print(('x yndex:\t{}').format(x))
		if move == 'r': y = x - 1
		if move == 'l': y = x + 1
		if move == 'd': y = x + width
		if move == 'u': y = x - width
		print(('y index:\t{}').format(y))
		print(('move: {}').format(move))
		sequence[x] = sequence[y]
		sequence[y] = None
		return sequence

	def valid(self):
		sizes = self.environment.sizes
		x = self.inversions()
		y = self.coordinates()[1]+1
		return True if (((sizes[0] % 2 == 1) and (x % 2 == 0)) or ((sizes[0] % 2 == 0) and ((y % 2 == 1) == (x % 2 == 0)))) else False

	def manhattan(self, index=False):
		sequence = self.sequence
		width = self.environment.sizes[0]
		distance = 0
		if not index:
			for i, e in enumerate(sequence):
				if e != None:
					x = self.coordinates(e)[1] - 1
					y = i - (x * width)
					pos = (x, y)
					v = ceil(e / width) - 1
					w = (e-1) - (v*width)
					inipos = (v, w)
					distance += abs(pos[0] - inipos[0]) + abs(pos[1] - inipos[1])
		else:
			for i, e in enumerate(sequence):
				if i == index:
					x = self.coordinates(e)[1] - 1
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
		self.end = self.start.magic(0)

	def expand(self):
		frontiere = [self.start]
		for taquin in frontiere:
			print(taquin.path)
			for move in taquin.findMoves():
				current = Taquin(self, taquin, move)
				if current.path not in self.explored.keys():
					if current.sequence == self.end:
						print(current.path)
						return current
					else: frontiere.append(current)
			frontiere.pop(0)
			sleep(1)







class __main__:
	e = Environment(3)
	e.expand()
	print('Width:\t\t', e.sizes[0])
	print('Length:\t\t', e.sizes[1])
	print('Sequence:\t', e.start.sequence)
	print('Blank Row:\t', e.start.coordinates())
	print('Manhattan:\t',e.start.manhattan())
