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

def get_promo_list(input_file = "npt.xlsx"):
    promo_list = set()
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
            segment_type = item['SegmentType']
            if segment_type in 'PROMO':
                promo_list.add(item['DESCRIPTION'].split(',')[1][1:-2])
            # print(item)
            # db.add(item)
    return promo_list


def get_npt_show_list(input_file = "npt.xlsx"):
    show_list = set()
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
            segment_type = item['SegmentType']
            if segment_type in 'PROMO':
                show = (item['DESCRIPTION'].split(',')[1][1:-2]).split(':')
                if len(show) > 0:
                    show_list.add(show[0])
            # print(item)
            # db.add(item)
    return show_list

# db = NPTDB("npt_data", "us-east-1")
# upload_npt(db)
# promo_list = get_promo_list()
# print(promo_list)