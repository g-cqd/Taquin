from random import shuffle

class Etat:
	def __init__(self,cote):
		self.cote = cote
		self.taille = cote * cote
		self.solution = self.__sol__()
		self.sequence = None
		self.solvable = self.__gen__()
	def __sol__(self):
		grid = [None]*self.taille
		for i in range(1, self.taille):
			grid[i - 1] = i
		return grid
	def __gen__(self):
		sequence = self.__sol__()
		shuffle(sequence)
		self.sequence = sequence
		while not self.__chk__():
			shuffle(sequence)
			self.sequence = sequence
		return True
	def __row__(self):
		if self.taille % self.cote == 0:
			index = 0
			for i in range(0, self.taille):
				if self.sequence[i] == None:
					index = i
					break
			tr_index = self.taille - (index + 1)
			for j in range(1, self.cote + 1):
				if tr_index < (j * self.cote):
					return tr_index
	def __inv__(self):
		inversions = 0
		for i in range(0, self.taille):
			if self.sequence[i] != None:
				for j in range(i + 1, self.taille):
					if isinstance(self.sequence[j],int) and self.sequence[i] > self.sequence[j]:
						inversions += 1
		return inversions
	def __chk__(self):
		if ((self.cote % 2 == 1) and (self.__inv__() % 2 == 0)) or ((self.cote % 2 == 0) and ((self.__row__() % 2 == 1) == (self.__inv__() % 2 == 0))):
			return True
		else:
			return False

class __main__:
	cote = int(input("Saisissez la largeur de votre Taquin : "))
	initital = Etat(cote)
	print(initital.cote)
	print(initital.taille)
	print(initital.solution)
	print(initital.sequence)
	print(initital.solvable)
