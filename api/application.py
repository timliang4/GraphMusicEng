from flask import Flask
from flask import request
import rustworkx as rx
import pickle
from database import session
from model import Track
from flask_cors import CORS

model = None
with open("recommendation_graph.pkl", 'rb') as f:
    model = pickle.load(f)

application = Flask(__name__)
CORS(application)

@application.route("/")
def root():
    return "Test"

@application.route("/track")
def searchTracks():
    try:
        search = request.args["search"]
        tracksFound = session.query(Track).filter(Track.name_and_artist.like(f"%{search}%")).limit(10).all()
        return {"tracksFound": [{"name_and_artist": track.name_and_artist} for track in tracksFound]}
    except:
        return {"tracksFound": 'invalid parameters'}

@application.route("/music")
def makeRecommendations():
    try:
        track = request.args["track"]
        tracksFound = session.query(Track).filter(Track.name_and_artist.like(f"%{track}%")).limit(5).all()
        return {'recommendations': [get_recommendations(track) for track in tracksFound]}
    except:
        return {'recommendations': 'track not in database'}


def get_recommendations(track, numRecs=10):
    trackIdx = track.graph_index 
    recommendations = sorted(dict(model.incident_edge_index_map(trackIdx)).items(), key=lambda x: x[1][2], reverse=True)
    result = []
    for i in range(len(recommendations)):
        if i >= numRecs:
            break
        recTrack = session.query(Track).filter(Track.graph_index.like(recommendations[i][1][1])).one()
        result.append({"name": recTrack.name, "artist": recTrack.artist, 'frequency': recommendations[i][1][2], "uri": recTrack.uri})
    originalTrack = session.query(Track).filter(Track.graph_index.like(trackIdx)).one()
    return {"name": originalTrack.name, "artist": originalTrack.artist, "uri": originalTrack.uri, "recommendations": result}

@application.teardown_appcontext
def shutdown_session(exception=None):
    session.remove()  

if __name__ == '__main__':
    application.run()
