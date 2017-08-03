import csv
from vcd_db import VCDDB

def upload_vcd(db, input_file = "vcd.csv"):
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
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

db = VCDDB("vcd_data", "us-east-1")
# upload_vcd(db)

res = db.get_promo_by_name("outsider")
print(res)
print(len(res))