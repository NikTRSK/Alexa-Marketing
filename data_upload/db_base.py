from abc import ABCMeta, abstractmethod

import boto3
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError


class BaseDynamoDB(metaclass=ABCMeta):

    def __init__(self, table_name, region_name):
        self.table_name = table_name
        self.region_name = region_name
        self.dynamodb = boto3.resource('dynamodb', region_name=self.region_name)
        self.table = self.dynamodb.Table(table_name)

    def add(self, item):
        self.table.put_item(Item=item)

    @abstractmethod
    def create_table(self):
        """Create a DynamoDB table with the appropriate schema."""