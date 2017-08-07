titles = set()
with open('promo_list.txt', 'r') as file:
    for line in file:
        titles.add(line)

# print(titles)
with open('promo_list_no_dup.txt', 'w') as file:
    for title in titles:
        file.write(title)