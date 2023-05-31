import cv2
from imwatermark import WatermarkDecoder

# import os
# os.chdir(r'<path to test_w.png>')


bgr = cv2.imread(r'test_w.png')

decoder = WatermarkDecoder('bytes', 344) # 344 means the bytes number of the encoded message.
watermark = decoder.decode(bgr, 'dwtDctSvd')
print(watermark.decode('utf-8'))