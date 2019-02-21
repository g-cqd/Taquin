#!/usr/bin/python3
# -*- coding: utf-8 -*-


import sys
import os
from PyQt5.QtWidgets import QApplication, QWidget
from PyQt5.QtGui import QIcon, QPixmap


class Example(QWidget):

	def __init__(self):
		super().__init__()

		self.initUI()

	def initUI(self):
		self.setGeometry(300, 300, 300, 220)
		self.setWindowTitle('Icon')
		#path = os.path.join(os.path.dirname(sys.modules[__name__].__file__),'inc/media/logo.png')
		self.setWindowIcon(QIcon(QPixmap('inc/media/logo.png')))
		self.show()


if __name__ == '__main__':

	app = QApplication(sys.argv)
	ex = Example()
	sys.exit(app.exec_())
