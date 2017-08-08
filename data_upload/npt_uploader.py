import datetime
import openpyxl
from npt_db import NPTDB
from promo_db import PromoDB
from helpers import find_and_replace_list_item_in_place

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
            if item['SegmentType'] == 'PROMO':
                item.pop('SegmentType')
                hyperlink = item['PROMO_TITLE'].split('","')
                promo_title = hyperlink[1][:-2]
                hyperlink = hyperlink[0].replace('=HYPERLINK("', '')
                item['PROMO_TITLE'] = promo_title
                item['VIDEO_LINK'] = hyperlink
                item['SHOW_TITLE'] = 'n/a' # n/a means the source doesn't provide the data
                item['PROMO_ID'] = 'n/a'
                item['CHANNEL_TIME_ZONE'] = 'n/a'
                item['PROJECT_ID'] = 'n/a'
                item['APPROVAL_DATE'] = 'n/a'
                item['STATUS'] = 'n/a'
                item['DIGITAL_AIR_DATE'] = 'n/a'
                item['DIGITAL_PLATFORM'] = 'n/a'
                item['SHOW_AIR_TIME'] = 'n/a'
                item['SOURCE_DB'] = 'NPT'
                # print(list(item.keys()))
                db.add(item)

def get_header(worksheet):
    header = []
    for i in range(1, 8):
        header.append(worksheet.cell(row=10, column=i).value)
    
    mappings = { 'Network': 'NETWORK', 'Date': 'AIR_DATE', 'DESCRIPTION': 'PROMO_TITLE',
                 'DURATION': 'PROMO_LENGTH', 'StartTime': 'AIR_TIME' }
    
    for key, value in mappings.items():
        find_and_replace_list_item_in_place(header, key, value)

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

# db = PromoDB("promo_db", "us-east-1")
# upload_npt(None)
