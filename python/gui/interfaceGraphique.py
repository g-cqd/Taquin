#!/usr/local/bin/python3
# -*-coding:utf-8 -*
import sys
from PyQt5 import QtGui, QtWidgets,QtCore
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QVBoxLayout,QLabel,QComboBox,QListWidget
from PyQt5.QtGui import QPainter, QFont, QColor, QPen,QFontDatabase
from PyQt5.QtCore import QSize,Qt

class Fenetre(QWidget):
    def __init__(self,texte):
        self._texte = texte
        #self.maliste = QListWidget()
        #self.box = []
        #Chargement de la police inter bold
        #id = QFontDatabase.addApplicationFont("/Users/melaniemarques/Downloads/Inter-3/Inter (TTF)/Inter-Bold.ttf")
        id = QFontDatabase.addApplicationFont("/Users/guillaumecoquard/Library/Fonts/Inter-Bold.ttf")
        fontstr = QFontDatabase.applicationFontFamilies(id)[0]
        self.font = QFont(fontstr, 18)
        
        QWidget.__init__(self)

        self.setWindowTitle("Taquin")
        self.resize(1000,500)
        self.setStyleSheet('background-color: #FFFFFF;')


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
        
        #Generate Button
        generate = QPushButton('Generate',self)
        generate.setFont(QFont(fontstr, 15))
        generate.setFixedSize(QSize(90,30))
        generate.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
        generate.move(700,320)
        
        generate.clicked.connect(self.appuiBoutonGenerate)
        

        #Clear console
        clear = QPushButton('Clear Console',self)
        clear.setFont(QFont(fontstr, 15))
        clear.setFixedSize(QSize(115,30))
        clear.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
        clear.move(805,320) 
        

        

        self.show()
    

    def getTexte(self):
        return self._texte
    def setTexte(self,texte):
        self._texte = texte

    def getDimensions(self):
        return self._dimensions
    def setDimensions(self,dimensions):
        self._dimensions = dimensions

    def appuiBoutonGenerate(self):
        print("Appui sur le bouton")
        
        texte = self.getTexte()
        var = int(texte)
        i = 0
        x = 0
        y = 0
        
        
        self.box = [0]*(var*var)
        while(i<(var*var-1)):
            if(i%var==0):
                x = 0
                y+=42
            
            kk = QPushButton(str(i+1),self)
            kk.setFont(self.font)
            kk.setFixedSize(QSize(40,40))
            kk.setStyleSheet('color: rgb(179,179,179);background-color: rgb(232,232,232);border: none; border-radius: 4px;')
            kk.move(700+x*42,1*y)
            kk.show()
            #item = QtGui.QListWidgetItem(kk)
            #self.maliste.addItem(item)

            
            x+=1
            i+=1
        
        
    def appui_bouton2(self):
        print("Appui sur le bouton 2")
    
    def selectionDimensions(self,texte):
        #app.setFont(font)
        self.setTexte(texte)
        

        

class __main__ : 
    app = QApplication.instance() 
    if not app:
        app = QApplication(sys.argv)

  
    fen = Fenetre('3')
    fen.show()
    app.exec_()