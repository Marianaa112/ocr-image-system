import cv2
import numpy as np


def _find_ticket_contour(edged):
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)

    for contour in contours:
        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
        if len(approx) == 4:
            return approx

    return None


def _order_points(pts):
    pts = pts.reshape(4, 2).astype("float32")
    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left
    rect[2] = pts[np.argmax(s)]   # bottom-right

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # top-right
    rect[3] = pts[np.argmax(diff)]  # bottom-left

    return rect


def _warp_perspective(image, contour):
    rect = _order_points(contour)
    tl, tr, br, bl = rect

    width = int(max(
        np.linalg.norm(br - bl),
        np.linalg.norm(tr - tl)
    ))
    height = int(max(
        np.linalg.norm(tr - br),
        np.linalg.norm(tl - bl)
    ))

    dst = np.array([
        [0, 0],
        [width - 1, 0],
        [width - 1, height - 1],
        [0, height - 1],
    ], dtype="float32")

    matrix = cv2.getPerspectiveTransform(rect, dst)
    return cv2.warpPerspective(image, matrix, (width, height))


def preprocess(image_path: str) -> np.ndarray:
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"No se pudo leer la imagen: {image_path}")

    h, w = image.shape[:2]
    min_area = w * h * 0.1  # el contorno debe cubrir al menos 10% de la imagen

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 75, 200)

    contour = _find_ticket_contour(edged)

    if contour is not None and cv2.contourArea(contour) > min_area:
        cropped = _warp_perspective(image, contour)
        gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)

    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return binary
