from flask import Blueprint, request, jsonify
from services.email_services import send_excel_email
from utils.excel import save_excel_temp

# Create a Blueprint for email-related routes
email_bp = Blueprint('email', __name__)

# Define a route to send an Excel file via email
@email_bp.route('/send-excel', methods=['POST'])
def send_excel():
    # Get the recipient email and uploaded file from the request
    email = request.form.get('email')
    file = request.files.get('file')
    # Validate that both email and file are provided
    if not email or not file:
        return jsonify({'error': 'Missing email or file'}), 400

    # Save the uploaded Excel file to a temporary location
    temp_path = save_excel_temp(file)
    # Send the Excel file as an email attachment
    send_excel_email(email, temp_path)
    # Return a success message
    return jsonify({'message': 'Email sent!'})