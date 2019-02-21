#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
ZetCode PyQt5 tutorial

This example shows a tooltip on
a window and a button.

Author: Jan Bodnar
Website: zetcode.com
Last edited: August 2017
"""

import sys
from PyQt5.QtWidgets import QMainWindow, QWidget, QToolTip, QMessageBox, QPushButton, QApplication, QDesktopWidget, QStatusBar
from PyQt5.QtGui import QFont


class Example(QWidget):

	def __init__(self):
		super().__init__()
		self.initUI()

	def initUI(self):

		QToolTip.setFont(QFont('Inter', 10))
		self.setToolTip('This is a <b>QWidget</b> widget')
		btn = QPushButton('Button', self)
		btn.setToolTip('This is a <b>QPushButton</b> widget')
		btn.resize(btn.sizeHint())
		btn.move(50, 50)

		# qbtn = QPushButton('Quit', self)
		# qbtn.clicked.connect(QApplication.instance().quit)
		# qbtn.resize(qbtn.sizeHint())
		# qbtn.move(100, 100)

		# cleardsfdsfsdfsdfsdfQStatusBar.setFont(QFont('Inter', 10))
		# cleardsfdsfsdfsdfsdfself.statusBar().showMessage('Ready')

		self.setGeometry(300, 300, 300, 200)
		self.center()
		self.setWindowTitle('Tooltips')
		self.show()

	def center(self):
		qr = self.frameGeometry()
		cp = QDesktopWidget().availableGeometry().center()
		qr.moveCenter(cp)
		self.move(qr.topLeft())

	def closeEvent(self, event):

		reply = QMessageBox.question(
			self, 'Message', "Are you sure to quit?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)

		if reply == QMessageBox.Yes:
			event.accept()
		else:
			event.ignore()


if __name__ == '__main__':

	app = QApplication(sys.argv)
	ex = Example()
	sys.exit(app.exec_())
