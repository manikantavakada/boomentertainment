
# Boom Entertainment

This is the official monorepo for Boom Entertainment, containing both the React Native Mobile App and Backend API.

## Project Structure

boomentertainment/
├── Mobile/ # React Native app
├── Backend/ # Backend (Node.js/Express or other)
├── .gitignore
└── README.md

**Backend API**

Setup Instructions
Navigate to the backend folder:
  cd Backend
  
Install dependencies:
  npm install
to run Application 
  node server.js

**Data base setup**

# create Database using this script

  CREATE DATABASE <DatabaseName>
  
# create Data base tables below scripts

  # Users Table Script
  
-- Table: public.users

-- DROP TABLE IF EXISTS public.users;
CREATE SEQUENCE users_id_seq;
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO root;

# Videos Table Script

-- Table: public.videos

-- DROP TABLE IF EXISTS public.videos;
create sequence videos_id_seq;
CREATE TABLE IF NOT EXISTS public.videos
(
    id integer NOT NULL DEFAULT nextval('videos_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    video_url text COLLATE pg_catalog."default" NOT NULL,
    thumbnail text COLLATE pg_catalog."default" NOT NULL,
    likes integer DEFAULT 0,
    user_id integer,
    CONSTRAINT videos_pkey PRIMARY KEY (id),
    CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.videos
    OWNER to postgres;

GRANT ALL ON TABLE public.videos TO postgres;

GRANT ALL ON TABLE public.videos TO root;
  
In .env folder change your database credentials



## Mobile App (React Native)

### Setup Instructions

1. Navigate to the mobile folder:

   
cd Mobile
Install dependencies:
  npm install (if any conflicts with versions use npm install --force)
  
To run the App
Android:
  npx react-native run-android
iOS (Mac only):
  npx react-native run-ios


Steps 1: Register with Email and Password 
Step 2: Login with credentials
Step 3: Upload videos
Step 4 : Start using the Reels
