from npt_uploader import get_npt_titles
from vcd_uploader import get_vcd_titles
from syntec_uploder import get_syntec_titles

""" WARNING: Works fine but most of the title functions need refactoring to cleanup the code """

# Get all the show and promo titles
npt_promo_list, npt_show_list = get_npt_titles()
vcd_promo_list = get_vcd_titles('Video_Title')
vcd_show_list = get_vcd_titles('Show_Name')
syntec_promo_list = get_syntec_titles('PROMO_TITLE')
syntec_show_list = get_syntec_titles('SHOW_TITILE')

# Covert all the promo titles to uppercase
npt_promo_list = set(map(lambda item: item.upper(), npt_promo_list))
vcd_promo_list = set(map(lambda item: item.upper(), vcd_promo_list))
syntec_promo_list = set(map(lambda item: item.upper(), syntec_promo_list))

# Merge all the promo titles in one set
promo_list = npt_promo_list.union(vcd_promo_list, syntec_promo_list)

# Export the set to a file (of unique titles)
with open('promo_list.txt', 'w') as file:
    for promo_title in promo_list:
        file.write(promo_title + '\n')

# Covert all the show titles to uppercase
npt_show_list = set(map(lambda item: item.upper(), npt_show_list))
vcd_show_list = set(map(lambda item: item.upper(), vcd_show_list))
syntec_show_list = set(map(lambda item: item.upper(), syntec_show_list))

# Merge all the promo titles in one set
show_list = npt_show_list.union(vcd_show_list, syntec_show_list)

# Export the set to a file (of unique titles)
with open('show_list.txt', 'w') as file:
    for show_title in show_list:
        file.write(show_title + '\n')