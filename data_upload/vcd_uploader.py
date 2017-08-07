import csv
from vcd_db import VCDDB

def upload_vcd(db, input_file = "vcd.csv"):
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        header = list(map((lambda item: item.replace(" ", "_")), header))
        print(header)
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols):
                if row[i] is '':
                    row[i] = 'n/a'
                item[header[i]] = row[i]
            db.add(item)
            print(item)

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