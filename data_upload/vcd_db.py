import boto3
from boto3.dynamodb.conditions import Key, Attr

from db_base import BaseDynamoDB

class VCDDB(BaseDynamoDB):
    
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


    # def get_person(self, person_name):
    #     """Queries the table for all entries for a person.
    #     Returns a scan/query response dict.
    #     http://boto3.readthedocs.io/en/latest/reference/services/dynamodb.html#DynamoDB.Table.query
    #     """
    #     return self.table.query(
    #         KeyConditionExpression=Key('person').eq(person_name)
    #     )

    # def get_event(self, event_name):
    #     """Scans the table for all entries for an event.
    #     Returns a scan/query response dict.
    #     http://boto3.readthedocs.io/en/latest/reference/services/dynamodb.html#DynamoDB.Table.scan
    #     """
    #     return self.table.scan(
    #         FilterExpression=Key('event').eq(event_name)
    #     )

    # def get_person_at_event(self, person_name, event_name):
    #     """Performs a table get_item for a person at an event.
    #     Returns a get_item response dict. Note that key 'Item' will not be in the response dict if an item
    #     with the specified event and person was not found in the table.
    #     http://boto3.readthedocs.io/en/latest/reference/services/dynamodb.html#DynamoDB.Table.get_item
    #     """
    #     return self.table.get_item(
    #         Key={
    #             'person': person_name,
    #             'event': event_name
    #         }
    #     )

    def create_table(self):
        self.table = self.dynamodb.create_table(
            TableName = self.table_name,
            KeySchema=[
                {
                    'AttributeName': 'Show Name',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'Video Title',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'Show Name',
                    'AttributeType': 'S'  # String
                },
                {
                    'AttributeName': 'Video Title',
                    'AttributeType': 'S'  # String
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )