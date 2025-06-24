from flask import Flask, send_from_directory
from routes.email import email_bp
import os

# Create Flask app, set static folder to frontend directory
app = Flask(
    __name__,
    static_folder='../frontend',      # Serve static files from frontend/
    static_url_path=''                # Serve at root URL
)

# Register email blueprint for API routes
app.register_blueprint(email_bp)

# Serve index.html at root URL
@app.route('/')
def index():
    # Send index.html from the static folder
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files (CSS, JS, images, etc.)
@app.route('/<path:path>')
def static_proxy(path):
    # Send requested file from the static folder
    return send_from_directory(app.static_folder, path)

# Run the app in debug mode if executed directly
if __name__ == "__main__":
    app.run(debug=True)