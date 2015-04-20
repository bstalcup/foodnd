#Use this script to populate the |restaurant| table of the database

import mysql.connector
import json
from decimal import *
import random
import os,binascii
import re


#Define database variables
DATABASE_USER = 'foodnd'
DATABASE_HOST = '127.0.0.1'
DATABASE_NAME = 'foodnd'
DATABASE_PASSWORD = 'foodnd'

#Create connection to MySQL
cnx = mysql.connector.connect(user=DATABASE_USER, host=DATABASE_HOST, database=DATABASE_NAME, password=DATABASE_PASSWORD)
cursor = cnx.cursor()

#Load json file
inputFile = open('restaurantData.json','r')
restaurantDict = json.load(inputFile)
inputFile.close()


#Loop through the restaurants and add info and menu to database
for key, restaurant in restaurantDict.iteritems():
	print restaurant, key	
	###############################
	## Add restaurant info first ##
	###############################
'''
	inputDict = {
		'restId' : key,
		'name' : restaurant['name'],
		'address' : restaurant['street_address'],
		'city' : restaurant['locality'],
		'state' : restaurant['region'],
		'zip' : restaurant['postal_code'],
		'phone' : restaurant['phone'],
		'lat' : restaurant['lat'],
		'lng' : restaurant['long'],
		'url' : restaurant['website_url']
	}

	

	#Insert this info into the database
	addRestaurant = ("INSERT INTO restaurants (restId, name, address, city, state, zip, phone, lat, lng, url) VALUES (%(restId)s,  %(name)s, %(address)s, %(city)s, %(state)s, %(zip)s, %(phone)s, %(lat)s, %(lng)s, %(url)s)")
	cursor.execute(addRestaurant,inputDict)
'''
#Insert hours (hardcoded) for some restaurants
'''
        for i in restaurant['open_hours']:
		for j in restaurant['open_hours'][i]:
			dayz = ''
			dayz = i[0]
			if i == 'Thursday' or i == 'Sunday':
				dayz = i[:2]
			hourz = j.split(' - ')
			hoursDict = {
				'restId': key,
				'day': dayz,
				'open': hourz[0],
				'close': hourz[1]
			}
			addHours = ("insert into hours (restId, day, open, close) values (%(restId)s,%(day)s,%(open)s,%(close)s)")
			cursor.execute(addHours, hoursDict)	
	#iterate through the different menus of each restaurant
	for i in restaurant['menus']:
		for j in i['sections']:
			#generate section key
			sectKey = binascii.b2a_hex(os.urandom(10))
			#insert new section into DB
			if 'section_name' not in j or j['section_name'] == '':
				continue
			sectionDict = {
				'sectId' : sectKey,
				'restId' : key,
				'name' : j['section_name'].encode('ascii','ignore')
			}
			addSection = ("insert into sections (sectId, restId, name) VALUES (%(sectId)s, %(restId)s, %(name)s)")
			cursor.execute(addSection,sectionDict)
			for k in j['subsections']:
				for c in k['contents']:
					if 'name' not in c:
						continue
					dishKey = binascii.b2a_hex(os.urandom(10))
					dishDict = {
						'dishId': dishKey,
						'name': c['name'],
						'sectId': sectKey
					}
					if 'description' in c:
						dishDict['description'] = c['description']
					if 'price' in c:
						dishDict['price'] = c['price']
					addDish = ""
					if 'description' in dishDict and 'price' in dishDict:
						addDish = ("insert into dishes (dishId, name, sectId, description, price) values (%(dishId)s, %(name)s, %(sectId)s, %(description)s, %(price)s)")
					elif 'description' in dishDict:
						addDish = ("insert into dishes (dishId, name, sectId, description) values (%(dishId)s, %(name)s, %(sectId)s, %(description)s)")
					elif 'price' in dishDict:
						addDish = ("insert into dishes (dishId, name, sectId, price) values (%(dishId)s, %(name)s, %(sectId)s, %(price)s)")
					else:
						addDish = ("insert into dishes (dishId, name, sectId) values (%(dishId)s, %(name)s, %(sectId)s)")
					cursor.execute(addDish,dishDict)
					
cnx.commit()
cnx.close()
'''

