import boto3
from boto3.dynamodb.conditions import Key, Attr

from dynamodb_utils.base_dynamodb import BaseDynamoDB

"""
    Cols: project_id (Project Id), approval_date (Approval Date), show_name (Show Name),
          source (Source), video_title (Video Title), length (Length), status (Status),
          watch (Watch), sunset_date (Sunset Date), music (Music), music_info (Music Info),
          promo_code (Promo Code), notes (Notes), pr (PR), on_air_date (On-Air Date),
          digital_date (Digital Date), digital_platform (Digital Platform), social (Social),
          off_air (Off Air)
"""

class VCDDB(BaseDynamoDB):
    
    def __init__(self, table_name, region_name):
        BaseDynamoDB.__init__(self, table_name, region_name)

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
                    'AttributeName': 'show_name',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'video_title',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'show_name',
                    'AttributeType': 'S'  # String
                },
                {
                    'AttributeName': 'video_title',
                    'AttributeType': 'S'  # String
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )