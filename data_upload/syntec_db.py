import boto3
from boto3.dynamodb.conditions import Key, Attr

from db_base import BaseDynamoDB

class SyntecDB(BaseDynamoDB):
    
    def __init__(self, table_name, region_name):
        BaseDynamoDB.__init__(self, table_name, region_name)
        try:
            self.create_table()
        except:
            print ("Table exists. Connecting to table")
            self.table = self.dynamodb.Table(table_name)

    def get_promo_by_name(self, promo_name):
        """ Queries the table for a promo name by video_title """
        response = self.table.scan()
        data = response["Items"]
        # return data
        search_results = filter(lambda item: item['Video Title'].lower() == promo_name.lower(), data)
        return list(search_results)

    def create_table(self):
        self.table = self.dynamodb.create_table(
            TableName = self.table_name,
            KeySchema=[
                {
                    'AttributeName': 'NETWORK_NAME',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'SHOW_TITILE',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'NETWORK_NAME',
                    'AttributeType': 'S'  # String
                },
                {
                    'AttributeName': 'SHOW_TITILE',
                    'AttributeType': 'S'  # String
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )