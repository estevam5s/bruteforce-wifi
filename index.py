

from flask import Flask, render_template, request, Response
import subprocess
import os

app = Flask(__name__)

# Define the path to the WifiBF.py script
WIFIBF_SCRIPT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'WifiBF.py')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/crack', methods=['POST'])
def crack():
    ssid = request.form.get('ssid')
    wordlist_path = request.form.get('wordlist')

    if not ssid or not wordlist_path:
        return Response("SSID and wordlist path are required.", status=400)

    if not os.path.exists(wordlist_path):
        return Response(f"Wordlist file not found: {wordlist_path}", status=400)

    def generate_output():
        """Runs the script and yields its output line by line."""
        command = ['python3', WIFIBF_SCRIPT_PATH, '-s', ssid, '-w', wordlist_path]
        
        # Start the subprocess
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )

        # Yield each line of output from the subprocess
        for line in process.stdout:
            yield f"data: {line}\n\n"
        
        process.wait()
        yield "data: <end-of-stream>\n\n"

    return Response(generate_output(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')

