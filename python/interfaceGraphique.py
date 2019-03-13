#!/usr/local/bin/python3
# -*-coding:utf-8 -*
import sys
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton,QLabel,QComboBox,QCheckBox,QMessageBox,QRadioButton,QButtonGroup
from PyQt5.QtGui import QFontDatabase,QFont
from PyQt5.QtCore import QSize,Qt
from random import shuffle
from math import sqrt,ceil
from collections import OrderedDict
import time
from taquin import *


def InterFont(weight,size):
	if weight == "Light":
		weight = 25
	elif weight == "Regular":
		weight = 50
	elif weight == "Medium":
		weight = 63
	elif weight == "Bold":
		weight = 75
	elif weight == "Black":
		weight = 87
	return QFont("Inter",weight=weight,pointSize=size)


class Fenetre(QWidget):

	def __init__(self,texte,mode):
		QWidget.__init__(self)
		self.texte = texte
		self.box = []
		self.mode = mode
		self.label3Present = False
		self.labelCoupsPresent = False
		self.LabelManhattanPresent = False
		self.LabelInvPresent = False
		self.LabelDisPresent = False
		self.heuristiques = [5]
		self.boutonEnCouleur = None
		self.algoUtilise = "Rocky"




		self.setWindowTitle("Taquin")
		self.resize(1000,500)
		self.setStyleSheet('background-color: rgb(252,252,252)')


		# Label
		reglage = QLabel('Réglages ', self)
		reglage.setFont(InterFont("Bold",24))
		reglage.move(50,42)

		largeur = QLabel('Largeur ',self)
		largeur.setFont(InterFont("Medium", 14))
		largeur.move(50,102)


		mode = QLabel('Mode ',self)
		mode.setFont(InterFont("Medium", 14))
		mode.move(50,142)

		heuristiques = QLabel('Heuristiques ',self)
		heuristiques.setFont(InterFont("Medium", 14))
		heuristiques.move(50,182)

		algoDeRecherche = QLabel('Algorithme',self)
		algoDeRecherche.setFont(InterFont("Medium", 14))
		algoDeRecherche.move(50,290)


		# ComboBox side length
		ComboBox = QComboBox(self)
		ComboBox.addItem("3 ")
		ComboBox.addItem("4 ")
		ComboBox.addItem("5 ")
		ComboBox.setStyleSheet('color: rgb(0,0,0);background-color: rgb(232,232,232);selection-background-color: rgb(255,255,255);')
		ComboBox.setFont(InterFont("Medium", 14))
		ComboBox.setFixedSize(QSize(85,20))
		ComboBox.move(150,102)
		ComboBox.activated[str].connect(self.selectionDimensions)
		#combo box choix Mode :
		ComboBoxM = QComboBox(self)
		ComboBoxM.addItem("Manuel")
		ComboBoxM.addItem("Pilote")
		ComboBoxM.setStyleSheet('color: rgb(0,0,0);background-color: rgb(232,232,232);selection-background-color: rgb(255,255,255)')
		ComboBoxM.setFixedSize(QSize(85,20))
		ComboBoxM.move(150,142)
		ComboBoxM.activated[str].connect(self.selectionMode)


		#Generate Button
		generate = QPushButton('Nouveau',self)
		generate.setFont(InterFont("Medium", 14))
		generate.setFixedSize(QSize(90,30))
		generate.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
		generate.move(700,320)
		generate.clicked.connect(self.appuiBoutonGenerate)


		#Bouton solution
		BoutonSolution = QPushButton('Solution',self)
		BoutonSolution.setFont(InterFont("Medium", 15))
		BoutonSolution.setFixedSize(QSize(115,30))
		BoutonSolution.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
		BoutonSolution.move(805,320)
		BoutonSolution.clicked.connect(self.Solution)

		#Check box des heuristiques :
		h1 = QCheckBox('H.1',self)
		h1.setFont(InterFont("Bold", 14))
		h1.move(150,182)
		h1.stateChanged.connect(self.selectionH1)

		h2 = QCheckBox('H.2',self)
		h2.setFont(InterFont("Bold", 14))
		h2.move(150,207)
		h2.stateChanged.connect(self.selectionH2)

		h3 = QCheckBox('H.3',self)
		h3.setFont(InterFont("Bold", 14))
		h3.move(150,232)
		h3.stateChanged.connect(self.selectionH3)

		h4 = QCheckBox('H.4',self)
		h4.setFont(InterFont("Bold", 14))
		h4.move(195,182)
		h4.stateChanged.connect(self.selectionH4)

		h5 = QCheckBox('H.5',self)
		h5.setFont(InterFont("Bold", 14))
		h5.move(195,207)
		h5.setChecked(True)
		h5.stateChanged.connect(self.selectionH5)

		h6 = QCheckBox('H.6',self)
		h6.setFont(InterFont("Bold", 14))
		h6.move(195,232)
		h6.stateChanged.connect(self.selectionH6)

		desordre = QCheckBox('Désordre',self)
		desordre.setFont(InterFont("Bold", 14))
		desordre.move(150,257)
		desordre.stateChanged.connect(self.selectionDesordre)

		#Radio boutons :

		AStar = QRadioButton('Rocky - A*',self)
		AStar.setFont(InterFont("Bold", 14))
		AStar.move(150,290)
		AStar.setChecked(True)
		AStar.toggled.connect(lambda:self.RadioBouttonState(AStar))

		IdA = QRadioButton('Charlotte - IDA*',self)
		IdA.setFont(InterFont("Bold", 14))
		IdA.move(150,315)

		self.show()

	def positionDansListe(self,liste,numero):
		"""Renvoie la position d'un élément dans une liste donnée si l'élément est présent dans la liste"""
		pos = 0
		for item in liste:
			if (item == numero):
				return pos
			pos+=1
		return None

	def ok(self):
		"""Renvoie les différents coups possibles (Right,Left,Down,Up) associés à la tuile à bouger sous forme de liste de liste [numéro de la tuile, coup]"""
		numeros = []
		cp = self.a.moves[-1].findMoves(True)
		print(cp)
		positionO = self.positionDansListe(self.a.moves[-1].sequence,0)

		for item in cp:
			if (item =="R"):
				numeros.append([self.a.moves[-1].sequence[positionO-1],'R'])
			if (item =="L"):
				numeros.append([self.a.moves[-1].sequence[positionO+1],'L'])
			if (item =="D"):
				numeros.append([self.a.moves[-1].sequence[positionO-int(self.texte)],'D'])
			if (item =="U"):
				numeros.append([self.a.moves[-1].sequence[positionO+int(self.texte)],'U'])
		return numeros


	def isItTheEnd(self):
		"""
		Vérifie si on est dans un état final
		Cette fonction renvoie un booléen
		"""
		i = 0
		ok = True
		while(i<len(self.a.moves[-1].sequence)-1):
			if((i+1)!=self.a.moves[-1].sequence[i]):
				ok = False
			i+=1
		return ok

	def operationColoration(self):
		"""Cette fonction colore la case associée au meilleur prochain coup dans le mode 'pilot'"""

		if(self.boutonEnCouleur!=None):
			self.boutonEnCouleur.setStyleSheet('color: rgb(170,170,170);background-color: rgb(238,238,238);border: none; border-radius: 4px;')
			self.boutonEnCouleur = None
		if(self.algoUtilise == "Rocky"):
			self.a.expand(self.a.aStar,0)
		else:
			self.a.expand(self.a.charlotte,0)
		caseAColorer = self.a.end[-1].path[self.nbCoupsJoues+1]
		verif = self.ok()
		i = 0
		while(i<len(verif)):
			if((self.mode == 'Pilote')and(caseAColorer==verif[i][1])):
				numeroAColorer = verif[i][0]
			i+=1
		for item in self.box:
			if(int(item.text())==numeroAColorer):
				self.boutonEnCouleur = item
				self.boutonEnCouleur.setStyleSheet('color: rgb(255,255,255);background-color: rgb(135,206,250);border: none; border-radius: 4px;')


	def traductionEnFleches(self,codeATraduire):
		"""
		Traduit une solution en flèches :
		- U (up) devient ↑
		- D (down) devient ↓
		- R (right) devient →
		- L (left) devient ←
		"""
		trad = ""
		for item in codeATraduire:
			if(item == 'R'):
				trad += '→'
			if(item == 'L'):
				trad+= '←'
			if(item =='U'):
				trad+='↑'
			if(item =='D'):
				trad+='↓'
		return trad

	def couic(self,chaineADecouper,nbCaracteres):
		""" Place des retour à la ligne dans une chaîne de caractères (chaineADecouper) tous les nbCaractères"""
		nouvelleChaine = ""
		k = 0
		while(k<len(chaineADecouper)):
			if(k<(len(chaineADecouper)-nbCaracteres)):
				nouvelleChaine += chaineADecouper[k:(k+nbCaracteres)]+"\n"
			else:
				nouvelleChaine += chaineADecouper[k:len(chaineADecouper)]
			k+=nbCaracteres
		return nouvelleChaine

	def appuiBoutonGenerate(self):
		if((len(self.heuristiques)!=0)and((self.mode=='Pilote' and int(self.texte) == 3)or(self.mode=='Manuel'))):
			self.coupsJoues = ""
			self.nbCoupsJoues = 0
		#On supprime l'ancienne génération de taquin :
			if(self.label3Present!=False):
				self.label3.deleteLater()
				self.label3Present = False
		#On regarde si le label de coups est présent, si oui on le delete
			if(self.labelCoupsPresent!=False):
				self.labelNbCoupsJoues.clear()
				self.labelCoupsPresent = False
		#On regarde si le label Manhattan est présent, si oui on le delete
			if(self.LabelManhattanPresent!=False):
				self.LabelManhattan.clear()
				self.LabelManhattanPresent = False
		#On regarde si le label Inv est présent, si oui on le delete
			if(self.LabelInvPresent!=False):
				self.LabelInv.clear()
				self.LabelInvPresent = False
		#On regarde si le label Dis est présent, si oui on le delete
			if(self.LabelDisPresent!=False):
				self.LabelDis.clear()
				self.LabelDisPresent = False

		#On delete les boutons précédents du taquin :
			for k in self.box:
				k.deleteLater()

			self.box = []
			self.fin= False
			DimTaquin = int(self.texte)

			self.a = Environment(DimTaquin,self.heuristiques)
			i = 0
			x = 0
			y = 0
	   #On génère les boutons du Taquin :
			while(i<(DimTaquin*DimTaquin)):
				if(i%DimTaquin==0):
					x = 0
					y+=42
				if(self.a.moves[-1].sequence[i]!=0):
					BoutonGrille = QPushButton(str(self.a.moves[-1].sequence[i]),self)
					BoutonGrille.setFont(InterFont("Bold", 18))
					BoutonGrille.setFixedSize(QSize(40,40))
					BoutonGrille.setStyleSheet('color: rgb(170,170,170);background-color: rgb(238,238,238);border: none; border-radius: 4px;')
					BoutonGrille.move(700+x*42,1*y)
					self.box.append(BoutonGrille)
				x+=1
				i+=1

			for item in self.box:
				item.clicked.connect(self.appuiBoutonsTaquin)
				item.show()

			self.start_time = time.time()

			if(self.mode =='Pilote'):
				self.operationColoration()

			if(int(self.texte)==3):
				if(self.algoUtilise == "Rocky"):
					self.a.expand(self.a.aStar,0)
				if(self.algoUtilise == "Charlotte"):
					self.a.expand(self.a.charlotte,0)
				self.nbCoupsOpti = self.a.end[-1].g
				self.listeCoupsOpti = self.couic(self.traductionEnFleches(self.a.end[-1].path),20)

		elif(len(self.heuristiques)==0) :
			QMessageBox.critical(self, 'Erreur', "Choisissez une heuristique", QMessageBox.Ok)
		elif(self.mode=='Pilote' and int(self.texte) != 3):
			QMessageBox.critical(self, 'Erreur', "Mode 'Pilote' n'est pas compatible avec une taille de Taquin supérieure à 3.", QMessageBox.Ok)





	def appuiBoutonsTaquin(self):
		if(self.fin!=True):
			#Nombre de coups effectues :
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

				if(verif[i][1]=='R'):
					BoutonClique.move(x+42,y)
					move = "R"
				if(verif[i][1]=='L'):
					BoutonClique.move(x-42,y)
					move = "L"
				if(verif[i][1]=='U'):
					BoutonClique.move(x,y-42)
					move = "U"
				if(verif[i][1]=='D'):
					BoutonClique.move(x,y+42)
					move ="D"
				self.a.play(move)
				self.coupsJoues+=move
				self.nbCoupsJoues +=1


			#Label nombre de coups joués
			self.labelNbCoupsJoues = QLabel("Coups\n %d"%(self.a.moves[-1].g),self)
			self.labelNbCoupsJoues.setFont(InterFont("Medium",14))
			self.labelNbCoupsJoues.setStyleSheet('background-color: rgb(238,238,238); border-radius: 4px;')
			self.labelNbCoupsJoues.setAlignment(Qt.AlignCenter)
			self.labelNbCoupsJoues.setFixedSize(QSize(110,50))
			self.labelNbCoupsJoues.move(50,355)
			self.labelNbCoupsJoues.show()
			self.labelCoupsPresent = True

			#Label Manhattan :
			self.LabelManhattan = QLabel("Manhattan\n%d"%(self.a.moves[-1].man),self)
			self.LabelManhattan.setFont(InterFont("Medium",14))
			self.LabelManhattan.setStyleSheet('color:rgb(0,0,0);background-color: rgb(238,238,238); border-radius:4px;')
			self.LabelManhattan.setAlignment(Qt.AlignCenter)
			self.LabelManhattan.setFixedSize(QSize(110,50))
			self.LabelManhattan.move(320,355)
			self.LabelManhattan.show()
			self.LabelManhattanPresent = True

			#Label Inv :
			self.LabelInv = QLabel("Inversions\n %d"%(self.a.moves[-1].inv),self)
			self.LabelInv.setFont(InterFont("Medium",14))
			self.LabelInv.setStyleSheet('color:rgb(0,0,0);background-color:rgb(238,238,238); border-radius: 4px;')
			self.LabelInv.setAlignment(Qt.AlignCenter)
			self.LabelInv.setFixedSize(QSize(110,50))
			self.LabelInv.move(455,355)
			self.LabelInv.show()
			self.LabelInvPresent = True

			#Label Dis :
			self.LabelDis = QLabel("Désordre\n %d"%(self.a.moves[-1].dis),self)
			self.LabelDis.setFont(InterFont("Medium",14))
			self.LabelDis.setStyleSheet('color:rgb(0,0,0);background-color: rgb(238,238,238); border-radius: 4px;')
			self.LabelDis.setAlignment(Qt.AlignCenter)
			self.LabelDis.setFixedSize(QSize(110,50))
			self.LabelDis.move(185,355)
			self.LabelDis.show()
			self.LabelDisPresent = True

			#On vérifie si on est dans l'état final :
			if(self.isItTheEnd()==True):
				self.fin = True
				for boutons in self.box:
					boutons.setStyleSheet('color: rgb(255,255,255);background-color: rgb(60,179,113);border: none; border-radius: 4px;')
					#perfs pour résoudre un taquin par le joueur:
				nbCoupsJoueur = self.nbCoupsJoues
				tempsMinute = int((time.time() - self.start_time)/60)
				tempsSecondes = int(time.time() - self.start_time)-tempsMinute*60
				coups = self.couic(self.traductionEnFleches(self.coupsJoues),20)
				if(int(self.texte)>3):
					QMessageBox.information(self, 'FELICITATION', "CONGRATULATIONS \nVous avez résolu le taquin en : \n- %d mouvements\n- %d minutes et %d secondes\n- mouvements : %s"%(int(nbCoupsJoueur),int(tempsMinute),int(tempsSecondes),coups), QMessageBox.Ok)
				else:
					QMessageBox.information(self, 'FELICITATION', "CONGRATULATIONS \nVous avez résolu le taquin en : \n- %d mouvements\n- %d minutes et %d secondes\n- mouvements : %s\n\n Chemin minimal : \n- %d mouvements\n- chemin : \n%s"%(int(nbCoupsJoueur),int(tempsMinute),int(tempsSecondes),coups,int(self.nbCoupsOpti),self.listeCoupsOpti), QMessageBox.Ok)

			else:
				if(self.mode == 'Pilote'):
					self.operationColoration()


	def Solution(self):
		if(len(self.box)!=0):
			if(self.label3Present!=False):
				self.label3.deleteLater()
				self.label3Present=False
			if(self.algoUtilise == "Rocky"):
				self.a.expand(self.a.aStar,0)
			else:
				self.a.expand(self.a.charlotte,0)
			self.solution = self.a.end[-1].path[self.nbCoupsJoues+1:len(self.a.end[-1].path)]
			self.solution = self.traductionEnFleches(self.solution)
			if(len(self.solution)>45):
				self.solution = self.couic(self.solution,60)

			self.label3 = QLabel("Solution : %s"%(self.solution),self)
			self.label3.setFont(InterFont("Medium",14))
			self.label3.setStyleSheet('color:rgb(0,0,0);background-color: rgb(238,238,238); padding: 1em; border-radius: 4px;')
			self.label3.move(50,430)
			self.label3.show()

			self.label3Present = True

		else:
			QMessageBox.critical(self, 'Erreur', "Générez un taquin", QMessageBox.Ok)


	def selectionDimensions(self,texte):
		self.texte = texte
	def selectionMode(self,mode):
		self.mode = mode

	def selectionH1(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(1)
		elif state != Qt.Checked:
			self.heuristiques.remove(1)

	def selectionH2(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(2)
		elif state != Qt.Checked:
			self.heuristiques.remove(2)

	def selectionH3(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(3)
		elif state != Qt.Checked:
			self.heuristiques.remove(3)

	def selectionH4(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(4)
		elif state != Qt.Checked:
			self.heuristiques.remove(4)

	def selectionH5(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(5)
		elif state != Qt.Checked:
			self.heuristiques.remove(5)

	def selectionH6(self,state):
		if state == Qt.Checked:
			self.heuristiques.append(6)
		elif state != Qt.Checked:
			self.heuristiques.remove(6)
	def selectionDesordre(self, state):
		if state == Qt.Checked:
			self.heuristiques.append(7)
		elif state != Qt.Checked:
			self.heuristiques.remove(7)

	def RadioBouttonState(self,Boutton):
		if Boutton.text() == "Rocky - A*":
			if Boutton.isChecked() == True:
				self.algoUtilise = "Rocky"
			else:
				self.algoUtilise = "Charlotte"
		print(self.algoUtilise)




class __main__:
	app = QApplication.instance()
	if not app:
		app = QApplication(sys.argv)


	fen = Fenetre('3','Manuel')
	fen.show()

	app.exec_()