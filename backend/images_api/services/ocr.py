import pytesseract
import numpy as np


def extract_text(binary_image: np.ndarray) -> str:
    config = r"--oem 3 --psm 6"
    text = pytesseract.image_to_string(binary_image, lang="spa", config=config)
    return text.strip()
