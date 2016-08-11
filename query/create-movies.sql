CREATE TABLE `Movies` (
  id              INT            PRIMARY KEY    AUTO_INCREMENT,
  title           VARCHAR(140)   NOT NULL,
  director_name   VARCHAR(140)   NOT NULL,
  summary         TEXT           NULL
) ENGINE = INNODB;

INSERT INTO `Movies` (title, director_name, summary)
  VALUES
  (
    '밀정',
    '김지운',
    '무장독립운동 단체 의열단과 조선인 출신 일본경찰의 이야기'
  );
INSERT INTO `Movies` (title, director_name, summary)
  VALUES (
    '사랑과 어둠의 이야기',
    '나탈리 포트만',
    '파니아, 아리에, 아모스 가족이 전쟁으로 고통받는 이야기'
  );
INSERT INTO `Movies` (title, director_name, summary)
  VALUES (
    '서바이벌리스트',
    '스티븐 핑글턴',
    '지구 종말 상황에서 만난 남자와 한 모녀의 이야기'
  );
