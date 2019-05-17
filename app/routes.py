from flask import Flask, render_template, request, redirect, \
    send_from_directory
import re

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Temporary
#@app.route("/", methods=["GET", "POST"])
#def main_page():
#    return render_template('main_page.html')

@app.route("/explorer", methods=["GET", "POST"])
def explorer():
    return render_template('explorer_template.html')

@app.route("/player", methods=["GET", "POST"])
def player():
    return render_template('player_template.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
