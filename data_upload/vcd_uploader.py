import csv
from vcd_db import VCDDB
from helpers import find_and_replace_list_item_in_place

def upload_vcd(db, input_file = "vcd.csv"):
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        # header = list(map((lambda item: item.replace(" ", "_")), header))
        # print(header)        
        header = process_header(header)
        print(header)
        # return
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                if row[i] is '':
                    row[i] = 'unknown'
                item[header[i]] = row[i]
            item.pop('Source')
            item.pop('Sunset Date')
            item.pop('Music Info')
            item.pop('Notes')
            item.pop('PR')
            item.pop('Off Air')
            item.pop('Social')
            item.pop('Music')
            item['NETWORK'] = 'n/a'
            item['AIR_TIME'] = 'n/a'
            item['CHANNEL_TIME_ZONE'] = 'n/a'
            item['SHOW_AIR_TIME'] = 'n/a'
            item['SOURCE_DB'] = 'VCD'
            db.add(item)

def process_header(header):    
    mappings = { 'On-Air Date': 'AIR_DATE', 'Video Title': 'PROMO_TITLE',
                 'Show Name': 'SHOW_TITLE', 'Length': 'PROMO_LENGTH', 'Project Id': 'PROJECT_ID',
                 'Promo Code': 'PROMO_ID', 'Watch': 'VIDEO_LINK', 'Digital Date': 'DIGITAL_AIR_DATE',
                 'Status': 'STATUS', 'Approval Date': 'APPROVAL_DATE', 'Digital Platform': 'DIGITAL_PLATFORM'}
    
    for key, value in mappings.items():
        find_and_replace_list_item_in_place(header, key, value)

    return header

def get_vcd_promo_titles(input_file = "vcd.csv"):
    promo_titles = set()
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        header = list(map((lambda item: item.replace(" ", "_")), header))
        # print(header)
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                if row[i] is '':
                    row[i] = 'n/a'
                item[header[i]] = row[i]
            # db.add(item)
            # print(item)
            promo_titles.add(item['Video_Title'])
    return promo_titles

def get_vcd_show_titles(input_file = "vcd.csv"):
    show_titles = set()
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        header = list(map((lambda item: item.replace(" ", "_")), header))
        # print(header)
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                if row[i] is '':
                    row[i] = 'n/a'
                item[header[i]] = row[i]
            # db.add(item)
            # print(item)
            show_titles.add(item['Show_Name'])
    return show_titles

# db = VCDDB("vcd_data", "us-east-1")
# upload_vcd(db)
# get_vcd_promo_titles()
# res = db.get_promo_by_name("outsider")
# print(res)
# print(len(res))
# upload_vcd(None)