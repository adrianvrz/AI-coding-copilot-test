import smtplib
from email.message import EmailMessage

def send_excel_email(recipient_email, excel_path):
    # Replace with your actual email and app password
    EMAIL_ADDRESS = 'your_gmail@gmail.com'
    EMAIL_PASSWORD = 'your_app_password'

    msg = EmailMessage()
    msg['Subject'] = 'Your Bucks2Bar Excel Data'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = recipient_email
    msg.set_content('Attached is your Bucks2Bar Excel data.')

    # Attach the Excel file
    with open(excel_path, 'rb') as f:
        file_data = f.read()
        file_name = 'bucks2bar-data.xlsx'
    msg.add_attachment(file_data, maintype='application', subtype='vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename=file_name)

    # Send the email
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)