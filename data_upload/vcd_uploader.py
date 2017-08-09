import csv
from vcd_db import VCDDB
from helpers import find_and_replace_list_item_in_place

def upload_vcd(db, input_file = ".\\data\\vcd.csv"):
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        # Get header of the document. Used for the table column names
        header = next(csv_reader)
        header = process_header(header)
        num_cols = len(header)
        # Parse all the data rows and add it to the database
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                if row[i] is '':
                    row[i] = 'unknown'
                item[header[i]] = row[i]
            # Remove extra fields
            item.pop('Source')
            item.pop('Sunset Date')
            item.pop('Music Info')
            item.pop('Notes')
            item.pop('PR')
            item.pop('Off Air')
            item.pop('Social')
            item.pop('Music')
            # Add in the extra fields in to the table entry
            item['NETWORK'] = 'n/a'
            item['AIR_TIME'] = 'n/a'
            item['CHANNEL_TIME_ZONE'] = 'n/a'
            item['SHOW_AIR_TIME'] = 'n/a'
            item['SOURCE_DB'] = 'VCD'
            # Add the item to the database
            db.add(item)

# Remap the header to match the database
def process_header(header):    
    mappings = { 'On-Air Date': 'AIR_DATE', 'Video Title': 'PROMO_TITLE',
                 'Show Name': 'SHOW_TITLE', 'Length': 'PROMO_LENGTH', 'Project Id': 'PROJECT_ID',
                 'Promo Code': 'PROMO_ID', 'Watch': 'VIDEO_LINK', 'Digital Date': 'DIGITAL_AIR_DATE',
                 'Status': 'STATUS', 'Approval Date': 'APPROVAL_DATE', 'Digital Platform': 'DIGITAL_PLATFORM'}
    
    for key, value in mappings.items():
        find_and_replace_list_item_in_place(header, key, value)

    return header

# Returns a list of all the promo titles in VCD
# key = 'Video_Title' | 'Show_Name'
def get_vcd_titles(key, input_file = ".\\data\\vcd.csv"):
    promo_titles = set()
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        header = list(map((lambda item: item.replace(" ", "_")), header))
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                item[header[i]] = row[i]
            promo_titles.add(item[key])
    return promo_titles