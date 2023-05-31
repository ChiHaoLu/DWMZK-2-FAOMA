import cv2 
from imwatermark import WatermarkEncoder
from PIL import Image
import numpy as np
# import os
# os.chdir(r'<path to test.png>')

bgr = cv2.imread(r'test.png')
# wm = 'hello my friend'
wm = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

encoder = WatermarkEncoder()
encoder.set_watermark('bytes', wm.encode('utf-8'))
bgr_encoded = encoder.encode(bgr, 'dwtDctSvd')

cv2.imwrite('test_w.png', bgr_encoded)


# def put_watermark(img, wm_encoder=None):
#     if wm_encoder is not None:
#         img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
#         img = wm_encoder.encode(img, 'dwtDct')
#         img = Image.fromarray(img[:, :, ::-1])
#     return img