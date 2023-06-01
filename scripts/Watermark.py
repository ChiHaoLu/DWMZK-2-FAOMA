import cv2 
from imwatermark import WatermarkEncoder

# import os
# os.chdir(r'<path to test.png>')

bgr = cv2.imread(r'../image/test.png')
# words to be encode
wm = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' 

encoder = WatermarkEncoder()
encoder.set_watermark('bytes', wm.encode('utf-8'))
bgr_encoded = encoder.encode(bgr, 'dwtDctSvd')

cv2.imwrite(r'../image/test_w.png', bgr_encoded)
