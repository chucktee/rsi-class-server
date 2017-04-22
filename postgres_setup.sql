CREATE USER appuser WITH PASSWORD 'appuserpass1' LOGIN;
CREATE DATABASE "richwood-scentific";
\c "richwood-scentific";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO appuser;




