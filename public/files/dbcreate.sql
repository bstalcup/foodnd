CREATE TABLE users(
  user_id VARCHAR(20) NOT NULL, 
  name VARCHAR(32) NOT NULL, 
  password VARCHAR(41) NOT NULL,
  primary key(user_id)
)

CREATE TABLE software(
  software_id VARCHAR(20) NOT NULL, 
  name VARCHAR() NOT NULL, 
  shortname, 
  url, 
  summary, 
  description
)

developer(dev_id, software_id, name, username, url)
comment(comment_id, user_id, text, time, rank)
vote(vote_id, comment_id, user_id, rank)

