import sys
from PySide2.QtWidgets import QApplication, QLabel

app = QApplication(sys.argv)
#label = QLabel("Hello World!")
label = QLabel("<h1 style='color:red'>Hello World!</h1>")
label.show()
app.exec_()
