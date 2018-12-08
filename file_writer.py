import numpy as np
import cv2

cap = cv2.VideoCapture(0)
frameNo = 0

while(True):
    ret, frame = cap.read()
    frameNo +=1
    #cv2.imshow('frame',frame)
    cv2.imwrite('./Data/frame-'+str(frameNo)+'.jpg',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()