import csv
import os, sys
from syntec_db import SyntecDB

def upload_syntec(db, input_dir = ".\data\syntec\\"):
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
              db.add(item)
              # print(item)

def get_syntec_titles(input_dir = ".\data\syntec\\"):
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

def get_syntec_show_titles(input_dir = ".\data\syntec\\"):
    show_list = set()
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
              show_list.add(item['SHOW_TITILE'])
              # print(item)
    return show_list

# db = SyntecDB("syntec_data", "us-east-1")
# upload_syntec(db)
# get_syntec_titles()