from pathlib import Path
from PIL import Image, ImageDraw

base = Path(__file__).resolve().parents[1] / 'src' / 'assets'
(base / 'icon').mkdir(parents=True, exist_ok=True)
(base / 'images').mkdir(parents=True, exist_ok=True)

img = Image.new('RGBA', (400, 400), (0, 0, 0, 255))
draw = ImageDraw.Draw(img)
draw.ellipse((40, 40, 360, 360), fill=(0, 255, 102, 255))
draw.rounded_rectangle((95, 115, 305, 285), radius=35, fill=(0, 0, 0, 255))
draw.text((112, 140), 'AUST', fill=(255, 255, 255, 255))
draw.text((130, 206), 'PC', fill=(0, 255, 102, 255))
img.save(base / 'icon' / 'austpc.png')

for idx, color in enumerate([(20, 20, 20), (0, 255, 102), (80, 80, 80)], start=1):
    canvas = Image.new('RGB', (1600, 900), color)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, 1600, 900), fill=color)
    draw.ellipse((180, 140, 1420, 760), fill=(255, 255, 255, 20))
    draw.rectangle((220, 220, 1380, 680), outline=(0, 255, 102, 255), width=10)
    draw.text((420, 390), f'Photography Club {idx}', fill=(255, 255, 255, 255))
    canvas.save(base / 'images' / f'{idx}.jpg')
