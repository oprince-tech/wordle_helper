from flask import jsonify
from flask import make_response
from flask import render_template
from flask import request

from app import app
from wordle_helper import wordle


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/run', methods=['POST'])
def run():
    if request.method == 'POST':
        data = request.get_json()
        greys = [g['letter']for g in data['misses'] if g['color'] == 'grey-sq']
        yellows = [
            (g['letter'], int(g['index']))
            for g in data['hits'] if g['color'] == 'yellow-sq'
        ]
        greens = [
            (g['letter'], int(g['index']))
            for g in data['hits'] if g['color'] == 'green-sq'
        ]
        try:
            matches_list = wordle.main(greys, yellows, greens)
            return jsonify(matches=matches_list, success=True), 200
        except:
            return make_response("An error occured. Please try again.", 500)
