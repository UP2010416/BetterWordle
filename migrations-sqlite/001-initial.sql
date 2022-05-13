-- Up

CREATE TABLE Words (
  id   int      PRIMARY KEY,
  word CHAR(5)     NOT NULL
);

INSERT INTO Words (id, word) VALUES
('1','grids'),
('2','rifer'),
('3','snaky'),
('4','fungi'),
('5','hurls'),
('6','floor'),
('7','helix'),
('8','loads'),
('9','fluky'),
('10','teaks'),
('11','mimic'),
('12','frost'),
('13','bolas'),
('14','lingo'),
('15','abuzz'),
('16','ramps'),
('17','diced'),
('18','foxes'),
('19','joins'),
('20','tempt'),
('21','epoch'),
('22','payer'),
('23','fakes'),
('24','spell'),
('25','jeeps'),
('26','lousy'),
('27','spine'),
('28','lilac'),
('29','crash'),
('30','valor'),
('31','embed'),
('32','tunic'),
('33','snack'),
('34','leads'),
('35','volts'),
('36','juice'),
('37','lasso'),
('38','legal'),
('39','books'),
('40','study'),
('41','prize'),
('42','evils'),
('43','couch'),
('44','storm'),
('45','otter'),
('46','hiker'),
('47','islet'),
('48','chair'),
('49','voice'),
 ('50','flood');

-- Down

DROP TABLE Words;
