import csv

def upload_vcd(input_file = "vcd.csv"):
    with open(input_file, newline='') as csv_file:
        csv_reader = csv.reader(csv_file)
        header = next(csv_reader)
        print(header)
        num_cols = len(header)
        for row in csv_reader:
            item = {}
            for i in range(0, num_cols)
            # print(row)
            # break

upload_vcd()