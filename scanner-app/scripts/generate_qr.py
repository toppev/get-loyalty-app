#!/usr/bin/env python

# Generate QR codes for testing.
# You can use the output file in virtual device.
#
# User QR code: <userId>, example: 5f21ea5da23a5300189ae163
# User reward QR code: <userId>:<rewardId>, example: 5f21ea5da23a5300189ae163:5f3e52a5bf87b20018a88b95

import qrcode
from pathlib import Path

data = input("Data: ")

print("Generating QR code")
img = qrcode.make(data)

outDir = "test_resources/local"
Path(outDir).mkdir(parents=True, exist_ok=True)

name = outDir + "/" + data
if "." not in name:
    name = name + ".png"

saved = img.save(name)
print("Saved " + name)
