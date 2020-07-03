from tensorflow.keras.models import load_model
from numpy import array, argmax
from tensorflow.keras import backend as K
K.clear_session()

model = load_model('./projects/keras_mnist.h5')
class_names = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


def guess(num):
    num = array(num).T
    num = array([num])
    predictions = model.predict(num)
    return class_names[argmax(predictions[0])]
