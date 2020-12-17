INSERT INTO users(id, username, password_hash)
VALUES(1, 'John Doe','password1'),
      (2, 'David Wright','password2');

INSERT INTO todos(description, done, created_at, user_id)
VALUES ('task1', false, '2020-10-10 12:20', 1),
  ('task2', true, '2020-10-10 12:21', 1),
  ('task3', false, '2020-10-10 12:22', 2),
  ('task4', true, '2020-10-10 12:23', 2);
