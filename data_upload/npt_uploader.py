import datetime
import openpyxl
from npt_db import NPTDB

def upload_npt(db, input_file = "npt.xlsx"):
    workbook = openpyxl.load_workbook(input_file)
    sheet_names = workbook.get_sheet_names()
    for sheet_name in sheet_names:
        worksheet = workbook.get_sheet_by_name(sheet_name)
        header = get_header(worksheet)
        row_count = worksheet.max_row
        column_count = worksheet.max_column
        print("Uploading NPT data for " + sheet_name)
        for row in range(11, row_count):
            item = {}
            for col in range(1, column_count):
                val = worksheet.cell(row=row, column=col).value
                if isinstance(val, datetime.datetime):
                    val = str(val)
                item[header[col-1]] = val
            # print(item)
            db.add(item)

def get_header(worksheet):
    header = []
    for i in range(1, 8):
        header.append(worksheet.cell(row=10, column=i).value)
    return header

db = NPTDB("npt_data", "us-east-1")
upload_npt(db)