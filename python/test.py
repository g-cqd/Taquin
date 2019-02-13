from os import fork, getpid, getppid

#i = 0
#while i < 10:
#	pid = fork()
#	if pid == 0:
#		i += 1
#	else:
#		print(getpid())
#		break


for i in range(0, 10):
	pid = fork()
	if pid == 0:
		pass
	else:
		print(pid)
		break
