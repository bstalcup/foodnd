#Use this script to create the database tables
#This script does NOT populate the tables with any data

import mysql.connector

#Define database variables
DATABASE_USER = 'rest'
DATABASE_HOST = '127.0.0.1'
DATABASE_NAME = 'rest'
DATABASE_PASSWORD = 'rest'

#Create connection to MySQL
cnx = mysql.connector.connect(user=DATABASE_USER, host=DATABASE_HOST, password=DATABASE_PASSWORD)
cursor = cnx.cursor()

###################################
## Create DB if it doesn't exist ##
###################################

createDB = (("CREATE DATABASE IF NOT EXISTS %s DEFAULT CHARACTER SET latin1") % (DATABASE_NAME))
cursor.execute(createDB)

#########################
## Switch to feednd DB ##
#########################

useDB = (("USE %s") % (DATABASE_NAME))
cursor.execute(useDB)

###########################
## Drop all tables first ##
###########################

dropTableQuery = ("DROP TABLE IF EXISTS dishes")
cursor.execute(dropTableQuery)

dropTableQuery = ("DROP TABLE IF EXISTS sections")
cursor.execute(dropTableQuery)


#Hours
dropTableQuery = ("DROP TABLE IF EXISTS hours")
cursor.execute(dropTableQuery)


#Restaurants
dropTableQuery = ("DROP TABLE IF EXISTS restaurants")
cursor.execute(dropTableQuery)


########################
## Create tables next ##
########################


#Restaurants
createTableQuery = ('''CREATE TABLE restaurants (
						restId VARCHAR(20) NOT NULL,
						name VARCHAR(45) NOT NULL,
						address VARCHAR(100) NOT NULL,
						city VARCHAR(45) NOT NULL,
						state VARCHAR(20) NOT NULL,
						zip VARCHAR(10) NOT NULL,
						phone VARCHAR(20) NOT NULL,
						lat DECIMAL(10,8) NOT NULL,
						lng DECIMAL(11,8) NOT NULL,
                                                url VARCHAR(100),
						PRIMARY KEY (restId));'''
                    )
cursor.execute(createTableQuery)

#Hours
createTableQuery = ('''CREATE TABLE hours (
						restId VARCHAR(20) NOT NULL,
                                                day enum ('M','T','W','TH','F','S','SU') not null,
                                                open TIME NOT NULL,
                                                close TIME NOT NULL,
                                                PRIMARY KEY(restId,day,open),
                                                FOREIGN KEY(restId)
                                                REFERENCES restaurants(restId)
                                                ON DELETE CASCADE
                                          )'''
                    )
cursor.execute(createTableQuery)

createTableQuery = (
			'''
			CREATE TABLE sections (
				sectId VARCHAR(20) NOT NULL,
				restId VARCHAR(20) NOT NULL,
				name VARCHAR(100) NOT NULL,
				PRIMARY KEY(sectId),
				FOREIGN KEY(restId) REFERENCES restaurants(restId) ON DELETE CASCADE
			);
			'''
)
cursor.execute(createTableQuery)

createTableQuery = ('''
	CREATE TABLE dishes(
		dishId VARCHAR(20) NOT NULL,
		name VARCHAR(100) NOT NULL,
		sectId VARCHAR(20) NOT NULL,
		description VARCHAR(255),
		price FLOAT(5,2),
		PRIMARY KEY(dishId),
		FOREIGN KEY(sectId) REFERENCES sections(sectId)
	);
''')
cursor.execute(createTableQuery)



#Commit the data and close the connection to MySQL
cnx.commit()
cnx.close()
