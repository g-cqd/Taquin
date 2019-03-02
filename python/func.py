def update(d,t):
	d.update({t.path:t})

def extend(l,cs):
	for c in cs:
		length = len(l)
		if length > 0:
			i = 0
			while (i < length):
				if c.f > l[i].f:
					i += 1
				elif c.f == l[i].f:
					if c.inv > l[i].inv:
						i += 1
					else:
						l.insert(i,c)
						i = length
				else:
					l.insert(i,c)
					i = length
		else:
			l.append(c)
