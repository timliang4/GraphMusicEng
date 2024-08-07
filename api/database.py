from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from model import Track
import os

engine = create_engine(
    f'mysql+pymysql://{os.environ.get("RDS_USERNAME", "username")}:{os.environ.get("RDS_PASSWORD", "password")}@{os.environ.get("RDS_HOSTNAME", "hostname")}:{os.environ.get("RDS_PORT", "port")}/{os.environ.get("RDS_DB_NAME", "db_name")}?charset=utf8mb4',
    echo=True
)
Session = sessionmaker(bind=engine)
session = scoped_session(Session)
