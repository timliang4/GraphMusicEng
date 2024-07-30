from flask import Flask
from flask import request
import rustworkx as rx
import pickle

model = None
with open("recommendation_graph.pkl", 'rb') as f:
    model = pickle.load(f)

uriToData = None
with open("uriToData.pkl", 'rb') as f:
    uriToData = pickle.load(f)

app = Flask(__name__)

@app.route("/music")
def makeRecommendations():
    try:
        url = request.args["url"]
        if not valid_url(url):
            return {'recommendations': 'invalid url'}
        recs = get_recommendations(url, 10) 
        return {"recommendations": recs}
    except:
        return {'recommendations': 'track not in database'}

def valid_url(url):
    if len(url) != 53 or url[:31] != 'https://open.spotify.com/track/':
        return False
    return True

def get_uri(url):
    parts = url.split('/')
    return parts[len(parts) - 1]

def get_recommendations(url, numRecs=5):
    trackIdx = uriToData[get_uri(url)][0]
    recommendations = sorted(dict(model.incident_edge_index_map(trackIdx)).items(), key=lambda x: x[1][2], reverse=True)
    result = []
    for i in range(len(recommendations)):
        if i >= numRecs:
            break
        result.append((uriToData[model[recommendations[i][1][1]]][1], model[recommendations[i][1][1]], recommendations[i][1][2]))
    return result
