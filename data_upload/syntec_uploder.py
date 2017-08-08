import csv
import os, sys
from syntec_db import SyntecDB
from helpers import find_and_replace_list_item_in_place

def upload_syntec(db, input_dir = ".\data\syntec\\"):
    files = os.listdir(input_dir)
    for file in files:
      with open(input_dir + file, newline='') as csv_file:
          print("Reading: " + file)
          csv_reader = csv.reader(csv_file, delimiter='\t')
          header = next(csv_reader)
          header = process_header(header)
          num_cols = len(header)
          for row in csv_reader:
              item = {}
              for i in range(0, num_cols):
                  if row[i] is '':
                      row[i] = 'unknown'
                  item[header[i]] = row[i]
              item['VIDEO_LINK'] = 'n/a' # n/a means the source doesn't provide the data
              item['PROJECT_ID'] = 'n/a'
              item['APPROVAL_DATE'] = 'n/a'
              item['STATUS'] = 'n/a'
              item['DIGITAL_AIR_DATE'] = 'n/a'
              item['DIGITAL_PLATFORM'] = 'n/a'
              item['SOURCE_DB'] = 'SYNTEC'
            #   print(list(item.keys()))
              db.add(item)

def process_header(header):    
    mappings = { 'NETWORK_NAME': 'NETWORK', 'PROMO_AIR_DATE': 'AIR_DATE',
                 'SHOW_TITILE': 'SHOW_TITLE', 'PROMO_AIRED_TIME': 'AIR_TIME' }
    
    for key, value in mappings.items():
        find_and_replace_list_item_in_place(header, key, value)

    return header

# key = 'PROMO_TITLE' | 'SHOW_TITLE'
def get_syntec_titles(key, input_dir = ".\data\syntec\\"):
    promo_list = set()
    files = os.listdir(input_dir)
    for file in files:
      with open(input_dir + file, newline='') as csv_file:
          print("Reading: " + file)
          csv_reader = csv.reader(csv_file, delimiter='\t')
          header = next(csv_reader)
          # header = list(map((lambda item: item.replace(" ", "_")), header))
          print(header)
          num_cols = len(header)
          for row in csv_reader:
              item = {}
              for i in range(0, num_cols):
                  if row[i] is '':
                      row[i] = 'n/a'
                  item[header[i]] = row[i]
            #   db.add(item)
              promo_list.add(item['PROMO_TITLE'])
              # print(item)
    return promo_list

# db = SyntecDB("syntec_data", "us-east-1")
# upload_syntec(None)
# get_syntec_titles()