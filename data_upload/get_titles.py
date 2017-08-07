from npt_uploader import get_promo_list, get_npt_show_list
from vcd_uploader import get_vcd_promo_titles, get_vcd_show_titles
from syntec_uploder import get_syntec_titles, get_syntec_show_titles

npt_list = get_promo_list()
vcd_list = get_vcd_promo_titles()
syntec_list = get_syntec_titles()
# print(vcd_list)
npt_list = set(map(lambda item: item.upper(), npt_list))
vcd_list = set(map(lambda item: item.upper(), vcd_list))
syntec_list = set(map(lambda item: item.upper(), syntec_list))
print (len(npt_list), len(vcd_list), len(syntec_list))
promo_list = npt_list.union(vcd_list, syntec_list)
print(len(promo_list))
with open('promo_list.txt', 'w') as file:
    for promo_title in promo_list:
        file.write(promo_title + '\n')


npt_show = get_npt_show_list()
vcd_show = get_vcd_show_titles()
syntec_show = get_syntec_show_titles()

npt_show = set(map(lambda item: item.upper(), npt_show))
vcd_show = set(map(lambda item: item.upper(), vcd_show))
syntec_show = set(map(lambda item: item.upper(), syntec_show))
print (len(npt_show), len(vcd_show), len(syntec_show))

show_list = npt_show.union(vcd_show, syntec_show)
print(len(show_list))
with open('show_list.txt', 'w') as file:
    for show_title in show_list:
        file.write(show_title + '\n')