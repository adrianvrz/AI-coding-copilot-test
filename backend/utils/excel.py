import tempfile

def save_excel_temp(file_storage):
    # Create a temporary file with .xlsx extension that won't be deleted automatically
    temp = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
    # Save the uploaded file to the temporary file's path
    file_storage.save(temp.name)
    # Return the path to the temporary file
    return temp.name