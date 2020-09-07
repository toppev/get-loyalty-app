#!/usr/bin/env python

# Generate QR codes for testing.
# You can use the output file in virtual device.

from pathlib import Path

import qrcode

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
