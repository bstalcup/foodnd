import time
import json

f = open('output.txt', 'r')

lines = f.readlines()

f.close()

for line in lines:
	line = line.strip()
	print json.loads(line)
	time.sleep(2)
