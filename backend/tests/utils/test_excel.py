import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from utils.excel import save_excel_temp

class DummyFileStorage:
    def __init__(self, content=b"test content"):
        self.content = content
        self.saved_path = None

    def save(self, path):
        with open(path, "wb") as f:
            f.write(self.content)
        self.saved_path = path

def test_save_excel_temp_creates_file_and_returns_path(tmp_path):

    dummy_file = DummyFileStorage(content=b"excel data")
    temp_path = save_excel_temp(dummy_file)

    assert os.path.exists(temp_path)
    with open(temp_path, "rb") as f:
        assert f.read() == b"excel data"

    # Cleanup
    os.remove(temp_path)

def test_save_excel_temp_returns_xlsx_suffix():

    dummy_file = DummyFileStorage()
    temp_path = save_excel_temp(dummy_file)

    assert temp_path.endswith('.xlsx')

    # Cleanup
    os.remove(temp_path)