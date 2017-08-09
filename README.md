# Alexa-Marketing

## DATA UPLOAD
### File Structure
```
├── data_upload             # All the data upload code and the sample flat files
│   ├── data                # Holds all the flat files used by the database
│   ├── db_base.py          # Abstract base class Used by all the .._db.py classes
│   ├── get_titles.py       # Extracts and stores the unique promo and show titles to their own files
│   ├── helpers.py          # Helper functions
│   ├── import_data.py      # Entry point for the data import. This uploads the data to DynamoDB
│   ├── npt_uploader.py     # Parser and uploader for NPT data
│   ├── promo_db.py         # DynamoDB connector used by all the .._uploader.py files
│   ├── syntec_uploader.py  # Parser and uploader for Syntec data
│   └── vcd_uploader.py     # Parser and uploader for VCD data  
```

### Prerequisites for data upload
* Setup `AWS CLI`: follow the **AWS login: AWS Command Line Interface** section from `docs\Amazon AWS Sandbox Information.docx` or use your own account
* Python 3 and up
* Install Python packages: `pip install abc boto3 openpyxl csv`

### To upload all the data to the `promo_db` table run `python import_data.py` from the `data_upload` folder

### To extract all the promo and show titles run `python get_titles.py` from the `data_upload` folder

## SKILL
### File Structure
```
├── skill                   # All the source code for the skill
│   ├── node_modules        # npm modules used by the skill
│   ├── db_util.js          # DynamoDB query calls used by the skill
│   ├── index.js            # The intent handlers. The entry point for the skill
│   ├── package.json        # Holds the dependency list
│   └── send_mail.js        # Wrapper for the nodemailer package
```

The skill is divided in 3 logical pieces:
* DigitalPromoIntent
* OnAirPromoListingIntent
* ShowLengthIntent

## DEPLOYMENT
The skill is currently setup on the `bot.support@nbcuni.com` Amazon account. To access it connect an Echo to the above account.

### DEPLOYMENT STEPS

#### Create the lambda function
1. Go to `https://aws.amazon.com/`
2. Follow the screenshots

![Screenshot](/docs/screenshots/aws-1.png?raw=true)
![Screenshot](/docs/screenshots/aws-2.png?raw=true)
![Screenshot](/docs/screenshots/aws-3.png?raw=true)
![Screenshot](/docs/screenshots/aws-4.png?raw=true)
For the Name use something `PromoSkill` or something else that's descriptive
![Screenshot](/docs/screenshots/aws-5.png?raw=true)
Zip the `node_modules`, `db_util.js`, `index.js`, `send_email.js` files/directories and upload them to lambda.
![Screenshot](/docs/screenshots/aws-6.png?raw=true)
Store the ARN of the function. The ARN is needed for the skill in the next step.
![Screenshot](/docs/screenshots/aws-7.png?raw=true)

Save the **ARN** somewhere. You will need it in step 3 (Amazon Developer)


#### Setup the skill on Amazon Developer

1. Go to `https://developer.amazon.com/edw/home.html#/skills`
2. Follow the screenshots

![Screenshot](/docs/screenshots/dev-1.png?raw=true)
For the Name use `Promo Skill` and for invocation name use `Promo Guide`. The invocation name is what's used to open the skill on an Echo.
![Screenshot](/docs/screenshots/dev-2.png?raw=true)
Launch the **Skill Builder** from the **Interaction Model** menu.
![Screenshot](/docs/screenshots/dev-3.png?raw=true)
Go to the **Code Editor** 
![Screenshot](/docs/screenshots/dev-4.png?raw=true)

Copy the code from `speech_data\interaction_model.json` in the code editor. You can also drag and drop the file in the skill builder.

Click **Build Model**. The build might take a couple of minutes.

![Screenshot](/docs/screenshots/dev-5.png?raw=true)
Go to the Configre menu
![Screenshot](/docs/screenshots/dev-6.png?raw=true)
Here use the **ARN** of the Lambda function from step 2
![Screenshot](/docs/screenshots/dev-7.png?raw=true)

After creating the skill make sure to update the `APP_ID` variable in `index.js`