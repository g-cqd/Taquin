from random import shuffle

class Sequence(list):
	def __grd__(self, size):
		g = Sequence([None]*size)
		for i in range(0, size):
			e = Sequence([None]*size)
			for j in range(0,size):
				e[j] = self[(i * size) + j]
			g[i] = e
		return g
	def __lst__(self):
		l = Sequence([])
		for i in self:
			l += self[i]
		return l
	def __inv__(self):
		if len(self):
			if isinstance(self[0], Sequence): r = self.__lst__()
			else: r = self
			n = 0
			l = len(r)
			for i in range(0, l):
				for j in range(i+1, l):
					if isinstance(r[i], int) and isinstance(r[j], int) and r[i] > r[j]:
						n += 1
		else: return False
		return n

class Taquin:
	def __init__(self, sequence, move="Z"):
		self.sequence = sequence
		self.move = move

class Environment:
	def __init__(self, size):
		self._size	= size
		self._length= size * size
		self._start = None
		self._end	= self.__ini__()
		self._valid	= self.__gen__()
	def __len__(self):
		return self._length
	def __ini__(self):
		l = Sequence([None]*self._length)
		for i in range(1,self._length):
			l[i-1] = i
		return l
	def __gen__(self):
		l = self.__ini__()
		shuffle(l)
		self._start = l
		while not self.__chk__():
			shuffle(l)
			self._start = l
		return True
	def __row__(self):
		g = self._start.__grd__(self._size)
		for i in range(0, self._size):
			for j in range(0, self._size):
				if (g[i][j] == None): return i+1
	def __inv__(self):
		return self._start.__inv__()
	def __chk__(self):
		if ((self._size % 2 == 1) and (self.__inv__() % 2 == 0)) or ((self._size % 2 == 0) and ((self.__row__() % 2 == 1) == (self.__inv__() % 2 == 0))):
			return True
		else:
			return False
	# Properties
	def __size__(self):
		return self._size
	size = property(__size__)
	def __end__(self):
		return self._end.__grd__(self._size)
	end = property(__end__)
	def __start__(self):
		return self._start.__grd__(self._size)
	start = property(__start__)
	inversions = property(__inv__)
	validity = property(__chk__)

class __main__:
	size = int(input("Saisissez la largeur de votre Taquin : "))
	a = Environment(size)
	print(a.size)
	print(len(a))
	print(a.start)
	print(a.end)
	print(a.inversions)
