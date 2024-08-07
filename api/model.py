from sqlalchemy import Column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import Integer, String

Base = declarative_base()


class Track(Base):

    __tablename__ = "tracks"

    uri = Column(String(22), primary_key=True)
    name = Column(String(300), nullable=False)
    artist = Column(String(300), nullable=False)
    graph_index = Column(Integer, nullable=False)
    name_and_artist = Column(String(600), nullable=False)

    def __repr__(self):
        return f"<Track {self.name_and_artist}: {self.uri}>"