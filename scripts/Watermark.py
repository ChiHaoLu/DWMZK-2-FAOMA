import cv2 
from imwatermark import WatermarkEncoder

bgr = cv2.imread(r'test.png')
wm = 'hell'

encoder = WatermarkEncoder()
encoder.set_watermark('bytes', wm.encode('utf-8'))
bgr_encoded = encoder.encode(bgr, 'dwtDct')

cv2.imwrite('test_w.png', bgr_encoded)