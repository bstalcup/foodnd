import time
import json

f = open('projects.txt', 'r')

lines = f.readlines()

f.close()

for line in lines:
	line = line.strip()
	print json.loads(line)
	time.sleep(2)
