import json
from flask import jsonify
from flask import render_template
from flask import redirect
from flask import request
from flask import url_for
from wordle import wordle
import pprint

from app import app

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/run', methods=['POST'])
def run():
    if request.method == 'POST':
        data = request.get_json()
        greys = [g['letter']for g in data['misses'] if g['color'] == 'grey-sq']
        yellows = [(g['letter'], int(g['index'])) for g in data['hits'] if g['color'] == 'yellow-sq']
        greens = [(g['letter'], int(g['index'])) for g in data['hits'] if g['color'] == 'green-sq']

        matches_list = wordle.main(greys, yellows, greens)

    return jsonify(matches=matches_list, success=True), 200
