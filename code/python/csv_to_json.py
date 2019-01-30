"""
Name: Thomas Reus
Student-id: 11150041

Project: dataprocessing

This program does:
- Creates a dictionary from a
  .csv file
- Creates a .json file from the
  dictionary
"""

import csv
import json

# name of the input file
INPUT_NAME = "Bodemgebruik_data"


def create_dictionary(input_csv):
    """
    Creates a dictionary from a
    .csv file.
    Input: .csv file (input_csv)
    Output: dictionary (csv_dict)
    """

    # create empty csv dictionary
    csv_dict = {}

    # open CSV file and load into list
    dictionary = []
    with open(input_csv, newline='') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for item in reader:
            dictionary.append(item)

    # create index names
    vars = []
    for name in dictionary[0]:
        vars.append(name)

    # fill the csv dict with a dictionary per item
    for item in dictionary:
        csv_dict[item[vars[1]].split(" ")[0]] = {}

    for item in dictionary:
        province = item[vars[1]].split(" ")[0]
        csv_dict[province][item[vars[0]]] = {}

        for var in vars[2:]:
            csv_dict[province][item[vars[0]]][var] = item[var].strip()

    # return dictionary
    return csv_dict


# main function
if __name__ == "__main__":

    # create dictionary from csv file
    dictionary = create_dictionary(f"../data/{INPUT_NAME}.csv")

    # create json file from the dictionary
    with open(f"../data/{INPUT_NAME}.json", 'w') as fp:
        json.dump(dictionary, fp, indent=4)
