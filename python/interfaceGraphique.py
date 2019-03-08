#!/usr/local/bin/python3
# -*-coding:utf-8 -*
import sys
from PyQt5 import QtGui, QtWidgets,QtCore
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton,QLabel,QComboBox
from PyQt5.QtGui import QFontDatabase,QFont
from PyQt5.QtCore import QSize,Qt,QPropertyAnimation
from random import shuffle
from math import sqrt,ceil
import time


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
		self.moves = self.findMoves(True)
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


class Fenetre(QWidget):

	def __init__(self,texte,mode):
		QWidget.__init__(self)
		self.texte = texte
		self.sequence = []
		self.box = []
		self.t = []
		self.mode = mode
		self.label3Present = False
		#Chargement de la police inter bold
		id = QFontDatabase.addApplicationFont("/Users/melaniemarques/Downloads/Inter-3/Inter (TTF)/Inter-Bold.ttf")
		fontstr = QFontDatabase.applicationFontFamilies(id)[0]
		self.font = QFont(fontstr, 18)
		

		self.setWindowTitle("Taquin")
		self.resize(1000,500)
		self.setStyleSheet('background-color: rgb(252,252,252)')


		# Label
		label = QLabel('Paramètres', self)
		label.setFont(self.font)
		label.move(50,50)

		label2 = QLabel('Side Length : ',self)
		label2.setFont(QFont(fontstr, 14))
		label2.move(50,110)


		mode = QLabel('Mode : ',self)
		mode.setFont(QFont(fontstr, 14))
		mode.move(50,160)

		# ComboBox
		ComboBox = QComboBox(self)
		ComboBox.addItem("3 ")
		ComboBox.addItem("4 ")
		ComboBox.addItem("5 ")
		ComboBox.addItem("6 ")
		ComboBox.setStyleSheet('color: black;background-color: rgb(232,232,232);selection-background-color: rgb(255,255,255)')
		ComboBox.setFixedSize(QSize(85,20))
		ComboBox.move(150,110)
		ComboBox.activated[str].connect(self.selectionDimensions)
		#Mode : 
		ComboBoxM = QComboBox(self)
		ComboBoxM.addItem("manual")
		ComboBoxM.addItem("auto")
		ComboBoxM.setStyleSheet('color: black;background-color: rgb(232,232,232);selection-background-color: rgb(255,255,255)')
		ComboBoxM.setFixedSize(QSize(85,20))
		ComboBoxM.move(150,160)
		ComboBoxM.activated[str].connect(self.selectionMode)
		#Generate Button
		generate = QPushButton('Generate',self)
		generate.setFont(QFont(fontstr, 15))
		generate.setFixedSize(QSize(90,30))
		generate.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
		generate.move(700,320)
		
		generate.clicked.connect(self.appuiBoutonGenerate)
		generate.clicked.connect(self.animation)

		#Clear console
		clear = QPushButton('Solution',self)
		clear.setFont(QFont(fontstr, 15))
		clear.setFixedSize(QSize(115,30))
		clear.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
		clear.move(805,320) 
		clear.clicked.connect(self.Solution)
		self.show()

	def positionTuileRepereOrthonorme(self,numeroTuile, taquinL):
		#renvoie la position d'une tuile sous forme de liste [x,y]
		coordonneees = []
		for i,e in enumerate(taquinL):
			if e == numeroTuile:
				indice = i
				break
		largeur = int(self.texte)
		colonne = (indice+1)%largeur
		if( colonne == 0 ):
			coordonneees.append(int(largeur))
		else:
			coordonneees.append(int(colonne))
		ligne = int(ceil(float(indice+1)/float(largeur)))
		coordonneees.append(int(ligne))
		return coordonneees
	def positionDansListe(self,liste,numero):
		pos = 0
		for item in liste:
			if (item == numero):
				return pos
			pos+=1
		return None

	def ok(self):
		numeros = []
		cp = self.a.moves[-1].findMoves(True)
		print(cp)
		positionO = self.positionDansListe(self.a.moves[-1].sequence,0)
		
		for item in cp:
			if (item =="R"):
				numeros.append([self.a.moves[-1].sequence[positionO-1],'r'])
			if (item =="L"):
				numeros.append([self.a.moves[-1].sequence[positionO+1],'l'])
			if (item =="D"):
				numeros.append([self.a.moves[-1].sequence[positionO-int(self.texte)],'d'])
			if (item =="U"):
				numeros.append([self.a.moves[-1].sequence[positionO+int(self.texte)],'u'])
		return numeros
	

	def isItTheEnd(self):
		i = 0
		ok = True
		while(i<len(self.a.moves[-1].sequence)-1):
			if((i+1)!=self.a.moves[-1].sequence[i]): 
				ok = False
			i+=1
		return ok
		
	def appuiBoutonGenerate(self):
		#On supprime l'ancienne génération de taquin :
		if(self.label3Present!=False):
			self.label3.deleteLater()
			self.label3Present = False

		for k in self.box:
			k.deleteLater()
		self.box = []       
		self.fin= False
		DimTaquin = int(self.texte)
		self.nbCoupsJoues = 0
		self.a = Environment(DimTaquin,[1])
		i = 0
		x = 0
		y = 0
		print(self.a.moves[-1].sequence)
	   #On génère les boutons du Taquin : 
		while(i<(DimTaquin*DimTaquin)):
			if(i%DimTaquin==0):
				x = 0
				y+=42
			if(self.a.moves[-1].sequence[i]!=0):
				kk = QPushButton(str(self.a.moves[-1].sequence[i]),self)
				kk.setFont(self.font)
				kk.setFixedSize(QSize(40,40))
				kk.setStyleSheet('color: rgb(170,170,170);background-color: rgb(238,238,238);border: none; border-radius: 4px;')
				kk.move(700+x*42,1*y)
				self.box.append(kk)
			x+=1
			i+=1

		for item in self.box:
			item.clicked.connect(self.appuiBoutonsTaquin)
			item.show()
			
		
		"""if(self.mode == 'auto'):

			a.expand()
			self.solution = a.end.path
			label3 = QLabel("Path : %s"%(self.solution),self)
			label3.setFont(self.font)
			label3.move(50,400)
			label3.show()
			
			#self.animation()"""

			
		
	def appuiBoutonsTaquin(self):

		if((self.fin!=True) and (self.mode == 'manual')):
			ok = False
			#On récupère le numéro du bouton appuyé : 
			sender = self.sender()

			#on vérifie qu'on peut bouger le bouton
			
			
			verif = self.ok() 
			i = 0
			move = "_"
			while(i<len(verif)):
				if(int(sender.text())==verif[i][0]):
					ok = True
					break
				i+=1


			#Si on peut bouger, on bouge le bouton : 
			if(ok == True):
				for item in self.box:
					if(item.text()==sender.text()):
						BoutonClique = item
						x = BoutonClique.x()
						y = BoutonClique.y()
					 
				if(verif[i][1]=='r'):
					BoutonClique.move(x+42,y)
					move = "R"     
				if(verif[i][1]=='l'):
					BoutonClique.move(x-42,y)
					move = "L"
				if(verif[i][1]=='u'):
					BoutonClique.move(x,y-42)
					move = "U"
				if(verif[i][1]=='d'):
					BoutonClique.move(x,y+42)
					move ="D" 
				self.a.play(move)
				self.nbCoupsJoues+=1
				#On vérifie si on est dans l'état final :
				if(self.isItTheEnd()==True):
					self.fin = True
					for boutons in self.box:
						boutons.setStyleSheet('color: rgb(255,255,255);background-color: rgb(0,128,0);border: none; border-radius: 4px;')



		
	def animation(self):
		if(self.mode =='auto'):
			self.a.expand()
			self.solution = self.a.end.path
			label3 = QLabel("Path : %s"%(self.solution),self)
			label3.setFont(self.font)
			label3.move(50,400)
			label3.show()
			i = 0
			self.solution = self.solution.replace('_','')
			print('solution = ',self.solution)
			print('taquin init = ',self.t)
			while(i<len(self.solution)):
				liste = self.ok()
			
				c = self.solution[i]
		   
				j = 0
				variableInter = 0
				while(j<len(liste)):
					if(liste[j][1]==c):
						variableInter = j 
					
						break
					j+=1
			
				for item in self.box:
					if(item.text()==str(liste[variableInter][0])):
						BoutonCliqueA = item
						x = BoutonCliqueA.x()
						y = BoutonCliqueA.y()
						#width = BoutonCliqueA.width()
						#height = BoutonCliqueA.height()
						break
				self.anim = QPropertyAnimation(BoutonCliqueA)
				self.anim.setDuration(214)
				self.anim.setTargetObject(BoutonCliqueA)
				if(liste[variableInter][1]=='r'):
					self.anim.setStartValue(BoutonCliqueA)
					#BoutonCliqueA.move(x+42,y)
					
					self.anim.setEndValue(QPoint(x+42,y))
					#BoutonCliqueA.move(x+42,y)
				if(liste[variableInter][1]=='l'):
					self.anim.setStartValue(BoutonCliqueA)
					#BoutonCliqueA.move(x-42,y)
					self.anim.setEndValue(QPoint(x-42,y))
					#BoutonCliqueA.move(x-42,y)
				if(liste[variableInter][1]=='u'):
					self.anim.setStartValue(BoutonCliqueA)
					#BoutonCliqueA.move(x,y-42)
					self.anim.setEndValue(QPoint(x,y-42))
					#BoutonCliqueA.move(x,y-42)
				if(liste[variableInter][1]=='d'):
					self.anim.setStartValue(BoutonCliqueA)
					#BoutonCliqueA.move(x,y+42)
					self.anim.setEndValue(QPoint(x,y+42))
					#BoutonCliqueA.move(x,y+42)
				self.anim.start()
				tuile = self.positionDansListe(self.t,int(liste[variableInter][0]))
				blanc = self.positionDansListe(self.t,0)
				inter = 0
				inter = self.t[tuile]
				self.t[tuile] = self.t[blanc]
				self.t[blanc] = inter
				
				
				i+=1
			
			for boutons in self.box:
				boutons.setStyleSheet('color: rgb(255,255,255);background-color: rgb(0,128,0);border: none; border-radius: 4px;')

	def Solution(self):
		if(self.label3Present!=False):
			self.label3.deleteLater()
			self.label3Present=False

		self.a.expand(self.a.aStar,0)
		self.solution = self.a.end[-1].path[self.nbCoupsJoues+1:len(self.a.end[-1].path)]
		self.label3 = QLabel("Solution : _ %s"%(self.solution),self)
		self.label3.setFont(self.font)
		self.label3.move(50,400)
		self.label3.show()
		self.label3Present = True
		#print(a.end.path)
		print(self.nbCoupsJoues)
		print(self.a.end[-1].path[self.nbCoupsJoues+1:len(self.a.end[-1].path)])

			

	def selectionDimensions(self,texte):
		self.texte = texte
	def selectionMode(self,mode):       
		self.mode = mode
		

class __main__:
	app = QApplication.instance() 
	if not app:
		app = QApplication(sys.argv)

  
	fen = Fenetre('3','manual')
	fen.show()

	app.exec_()