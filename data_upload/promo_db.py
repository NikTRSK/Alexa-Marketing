import boto3
from boto3.dynamodb.conditions import Key, Attr

from db_base import BaseDynamoDB

class PromoDB(BaseDynamoDB):
    
    def __init__(self, table_name, region_name):
        BaseDynamoDB.__init__(self, table_name, region_name)
        try:
            self.create_table()
        except:
            print ("Table exists. Connecting to table")
            self.table = self.dynamodb.Table(table_name)

    def create_table(self):
        self.table = self.dynamodb.create_table(
            TableName = self.table_name,
            KeySchema=[
                {
                    'AttributeName': 'PROMO_TITLE',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'SHOW_TITLE',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'PROMO_TITLE',
                    'AttributeType': 'S'  # String
                },
                {
                    'AttributeName': 'SHOW_TITLE',
                    'AttributeType': 'S'  # String
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )