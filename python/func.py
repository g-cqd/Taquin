def extend(l,cs):
	while len(cs) > 0:
		c = cs.pop(0)
		i = 0
		j = 0
		n = len(l)
		if n > 0:
			while (j < n):
				if c.f > l[i].f: i += 1
				elif c.f == l[i].f and c.inv > l[i].inv: i += 1
				else: j = n
				j += 1
		l.insert(i,c)