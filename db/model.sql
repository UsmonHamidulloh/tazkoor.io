create table avatars(
  id serial not null primary key,
  color varchar(256),
  is_deleted boolean default false
);

insert into
  avatars(color)
values
  ('#DAF7A6'),
  ('#FFC300'),
  ('#900C3F');

CREATE TABLE plans(
  id SERIAL PRIMARY KEY,
  name varchar(255),
  book_count integer,
  theme_count integer,
  words_count integer,
  users_count integer,
  ads BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE
);

insert into
  plans(name, book_count, theme_count, users_count, ads)
values
  ('basic', 2, 10, 3, true),
  ('pro', 50, 100, 100, false),
  ('enterprise', 100, 1000, 5000, false);

CREATE TABLE languages(
  id SERIAL PRIMARY KEY,
  icon varchar(255),
  title varchar(255),
  abbreviation varchar(10),
  is_deleted boolean default false
);

insert into
  languages(icon, title, abbreviation)
values
  ('🇺🇸', 'English', 'en'),
  ('🇷🇺', 'Russian', 'ru'),
  ('🇺🇿', 'Uzbek', 'uz');

create table users(
  id serial primary key,
  name varchar(255),
  email varchar(255),
  avatar int references users(id),
  password varchar(255),
  plan int references plans(id) not null default 1,
  is_verified boolean default false,
  is_deleted boolean default false,
  is_blocked boolean default false,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

create table admins(
  id serial primary key,
  user_id int references users(id),
  is_deleted boolean default false,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

CREATE TABLE verifications (
  id SERIAL NOT NULL PRIMARY KEY,
  email varchar(255) NOT NULL NOT NULL,
  code varchar(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

create table partsofspeechs(
  id serial primary key,
  title varchar(255)
);

insert into partsofspeechs(title) values ('other'), ('noun'), ('adjective'), ('verb');

create table partsofspeech_translations(
  id serial primary key,
  partsofspeech_id int references partsofspeechs(id),
  language_id int references languages(id),
  title varchar(255)
);

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  title varchar(255),
  language_native int references languages(id),
  language_translate int references languages(id),
  user_id int references users(id),
  is_deleted boolean default false,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

CREATE TABLE themes(
  id SERIAL PRIMARY KEY,
  title varchar(255),
  book int references books(id),
  user_id int references users(id),
  is_deleted boolean default false,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

CREATE TABLE words(
  id SERIAL PRIMARY KEY,
  title varchar(255),
  title_translate varchar(255),
  partsofspeech int references partsofspeechs(id),
  theme int references themes(id),
  book int references books(id),
  user_id int references users(id),
  is_deleted boolean default false,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

create table roles(
  id serial primary key,
  created_at timestamptz default current_timestamp,
  name varchar(128)
);

insert into
  roles(name)
values
  ('Viewer'),
  ('Admin'),
  ('Owner');

create table permissions(
  id serial primary key,
  created_at timestamptz default current_timestamp,
  name varchar(128)
);

insert into
  permissions(name)
values
  ('create_theme'),
  ('update_theme'),
  ('delete_theme'),
  ('see_theme'),
  ('see_words'),
  ('play_cards'),
  ('play_test'),
  ('see_words'),
  ('delete_book'),
  ('update_book'),
  ('create_words'),
  ('update_words'),
  ('delete_words');

create table role_permissions(
  id serial primary key,
  created_at timestamptz default current_timestamp,
  role_id int references roles(id),
  permission_id int references permissions(id)
);

insert into
  role_permissions(role_id, permission_id)
values
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (2, 4),
  (2, 5),
  (2, 6),
  (2, 7),
  (2, 1),
  (2, 2),
  (2, 3),
  (2, 13),
  (2, 12),
  (2, 11),
  (3, 4),
  (3, 5),
  (3, 6),
  (3, 7),
  (3, 1),
  (3, 2),
  (3, 3),
  (3, 13),
  (3, 12),
  (3, 11),
  (3, 10),
  (3, 8);

create table if not exists user_roles(
  id serial primary key,
  created_at timestamptz default current_timestamp,
  role_id int references roles(id),
  user_id int references users(id),
  book_id int references books(id)
);

create table game_stats(
  id serial primary key not null,
  user_id int references users(id),
  words text[][] not null,
  book int references books(id),
  theme int references themes(id),
  is_deleted boolean default false
);
