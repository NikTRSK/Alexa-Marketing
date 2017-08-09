# Replaces all the serach_value occurenses in an array with replace_with
# Modifies the input_list in place
def find_and_replace_list_item_in_place(input_list, search_value, replace_with):
    for i, val in enumerate(input_list):
        if val == search_value:
            input_list[i] = replace_with