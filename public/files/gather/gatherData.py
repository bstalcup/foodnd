import time
import requests
import json

f = open('projects.txt', 'r')
url = 'https://sourceforge.net/rest/p/'

w = open('output.txt', 'w')

lines = f.readlines()

f.close()

for line in lines:
	line = line.strip()
	r = requests.get(url + line)
	w.write(str(''.join([c for c in r.text if 32 <= ord(c) < 128])) + '\n')
	time.sleep(2)
