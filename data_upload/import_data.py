from promo_db import PromoDB
from npt_uploader import upload_npt
from syntec_uploder import upload_syntec
from vcd_uploader import upload_vcd

# Init DB
db = PromoDB("promo_db", "us-east-1")

# Run NPT upload
upload_npt(db)
upload_syntec(db)
upload_vcd(db)