--

CREATE TABLE IF NOT EXISTS `played_timeshift`(
  `id` int NOT NULL auto_increment,
  `ch_id` int NOT NULL default 0,
  `uid` int NOT NULL default 0,
  `length` int NOT NULL default 0,
  `playtime` timestamp,
  PRIMARY KEY (`id`)
);

--//@UNDO