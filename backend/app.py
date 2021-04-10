import os
from flask import Flask, request
from flask_cors import CORS,cross_origin

from autoCite import cite
from siteScore import site_score

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/cite')
@cross_origin()
def auto_cite():
    url = request.args.get('url')
    citation = cite(url)
    return citation
@app.route('/credibility')
@cross_origin()
def rate_credibility():
    url = request.args.get('url')
    score = site_score(url)
    return score


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)