import mysql.connector

#Define database variables
DATABASE_USER = 'root'
DATABASE_HOST = '127.0.0.1'
DATABASE_NAME = 'foodND'

#Create connection to MySQL
cnx = mysql.connector.connect(user=DATABASE_USER, host=DATABASE_HOST)
cursor = cnx.cursor()

###################################
## Create DB if it doesn't exist ##
###################################

createDB = (("CREATE DATABASE IF NOT EXISTS %s DEFAULT CHARACTER SET latin1") % (DATABASE_NAME))
cursor.execute(createDB)

#########################
## Switch to foodnd DB ##
#########################

useDB = (("USE %s") % (DATABASE_NAME))
cursor.execute(useDB)

###########################
## Drop all tables first ##
###########################

#Users
dropTableQuery = ("DROP TABLE IF EXISTS users")
cursor.execute(dropTableQuery)

#Software
dropTableQuery = ("DROP TABLE IF EXISTS software")
cursor.execute(dropTableQuery)

#Developer
dropTableQuery = ("DROP TABLE IF EXISTS developer")
cursor.execute(dropTableQuery)

#Comment
dropTableQuery = ("DROP TABLE IF EXISTS comment")
cursor.execute(dropTableQuery)

#Vote
dropTableQuery = ("DROP TABLE IF EXISTS vote")
cursor.execute(dropTableQuery)

########################
## Create tables next ##
########################

#Users
createTableQuery = ('''CREATE TABLE users (
                                                user_id INT NOT NULL AUTO_INCREMENT,
                                                user_name VARCHAR(32) NOT NULL,
                                                user_pwd VARCHAR(41) NOT NULL,
                                                PRIMARY KEY(user_id));'''

                   )
cursor.execute(createTableQuery)

#Software
createTableQuery = ('''CREATE TABLE software (
                                                s_id INT NOT NULL AUTO_INCREMENT,
                                                s_name VARCHAR(32) NOT NULL,
                                                s_shortname VARCHAR(10),
                                                s_url VARCHAR(50),
                                                s_sum VARCHAR(200),
                                                s_desc VARCHAR(500),
                                                PRIMARY KEY(s_id));'''
                   )
cursor.execute(createTableQuery)

#Developer
createTableQuery = ('''CREATE TABLE developer (
                                                dev_id INT NOT NULL AUTO_INCREMENT,
                                                dev_name VARCHAR(32) NOT NULL,
                                                s_id INT,
                                                dev_user VARCHAR(32),
                                                dev_url VARCHAR(50),
                                                PRIMARY KEY(dev_id),
                                                FOREIGN KEY(s_id)
                                                REFERENCES software(s_id)
                                                ON DELETE CASCADE);'''
                   )
cursor.execute(createTableQuery)


#Comment
createTableQuery = ('''CREATE TABLE comment (
                                                com_id INT NOT NULL AUTO_INCREMENT,
                                                user_id INT NOT NULL,
                                                com_text VARCHAR(150) NOT NULL,
                                                com_time VARCHAR(41) NOT NULL,
                                                com_rank INT NOT NULL,
                                                PRIMARY KEY(com_id),
                                                FOREIGN KEY (user_id)
                                                REFERENCES users(user_id)
                                                ON DELETE CASCADE);'''
                   )
cursor.execute(createTableQuery)

#Vote
createTableQuery = ('''CREATE TABLE vote (
                                                vote_id INT NOT NULL AUTO_INCREMENT,
                                                com_id INT NOT NULL,
                                                user_id INT NOT NULL,
                                                rank INT NOT NULL,
                                                PRIMARY KEY(vote_id),
                                                FOREIGN KEY(com_id)
                                                REFERENCES comment(com_id)
                                                ON DELETE CASCADE,
                                                FOREIGN KEY(user_id)
                                                REFERENCES users(user_id)
                                                ON DELETE CASCADE);'''
                   )
cursor.execute(createTableQuery)
cnx.commit()
cnx.close()
