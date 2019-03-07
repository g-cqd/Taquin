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
					man += (abs(pos[0]-coords[0]) + abs(pos[1]-coords[1])) * weighting[0][k]
					k += 1
			if (weighting[1] > 1):
				man /= weighting[1]
		man += stepMan
		return (inv,man)
	def findMoves(self,flex=False):
		limit = self.environment.sizes[0] - 1
		coords = self.coordinates()
		last = self.path[-1]
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

def printTaquin(taquin):
	print("\n")
	print("Taquin :")
	print(("\t- seq : {}\t	").format(taquin.sequence))
	print(("\t- pat : {}\t	").format(taquin.path))
	print(("\t- mov : {}\t	").format(taquin.moves))
	print(("\t- inv : {}\t- g : {}").format(taquin.inv,taquin.g))
	print(("\t- man : {}\t- h : {}").format(taquin.man,taquin.h))
	print(("\t- f   : {}").format(taquin.f))
	print("\n")


class Environment:
	def __init__(self,width,choices=None):
		self.sizes = (width,width*width)
		self.weightings = self.getWeightings(choices)
		self.start = Taquin(self)
		self.moves = ""
		self.current = self.start
		self.end = None
	def getWeightings(self,choices):
		if (choices == None):
			choices = [i for i in range(1,7)]
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
				weightings.append((pi,rho))
		return weightings
	def expand(self):

		Dictionnaire = dict()
		Dictionnaire[self.current.f] = [self.current]
		print('dans expand',self.current.sequence)
		while (not self.end):

			key = list(Dictionnaire.keys())[0]

			shouldBeExpanded = Dictionnaire[ key ][0]

			del Dictionnaire[ key ][0]
			if Dictionnaire[ key ] == []: del Dictionnaire[ key ]

			children = shouldBeExpanded.children()

			if isinstance(children,Taquin):
				self.end = children
				return children
			else:
				for child in children :
					if(child.f in Dictionnaire): Dictionnaire[child.f].append(child)
					else: Dictionnaire[child.f] = [child]

				Dictionnaire = OrderedDict( sorted( Dictionnaire.items(), key=lambda t: t[0]))

	def play(self,move):
		for item in move :
			self.current.moveTile(item)
			self.current.inv,self.current.man = self.current.details()
			self.current.moves = self.current.findMoves()
			self.current.h = self.current.man
			self.current.f = self.current.h + self.current.g



class __main__:
	env = int(input(">>> Taille du taquin ?\n>>> "))
	choices = str(input(">>> Heuristiques ?\n>>> Entrez les numéros séparés par des espaces.\n>>> "))
	if len(choices) == 1: choices = [int(choices)]
	else:
		choices = choices.split(' ')
		for index,choice in enumerate(choices): choices[index] = int(choice)

	a = Environment(env,choices)
	printTaquin(a.start)
	a.expand()
	printTaquin(a.end)
