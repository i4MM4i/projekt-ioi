import base64
import io
import json

import torch
from PIL import Image, ImageOps
from diffusers import StableDiffusionImg2ImgPipeline
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# load the pipeline
device = "cuda"
model_id_or_path = "../stable-diffusion-v1-5"
seed = 1
# generator = torch.Generator(device="cuda")
# generator = generator.manual_seed(seed)
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    model_id_or_path,
    revision="fp16",
    torch_dtype=torch.float16,
    # generator=generator
)

pipe = pipe.to(device)


@app.route("/upload", methods=['POST'])
def hello_world():
    # check if the post request has the file part
    if 'image_file' not in request.files:
        return "image_file not provided", 400
    if 'prompt' not in request.values:
        return "prompt form data not provided", 400
    if request.values['prompt'] is None:
        return "prompt form data empty", 400
    file = request.files['image_file']
    img = Image.open(file.stream)

    print("Prompt", request.values['prompt'])

    # img = img.resize((512, 512))
    img = ImageOps.contain(img, (512, 512))
    images = pipe(prompt=request.values['prompt'],
                  init_image=img,
                  strength=0.6,
                  guidance_scale=13).images
    img = images[0]

    buffer = io.BytesIO()
    img.save(buffer, 'png')
    buffer.seek(0)

    data = buffer.read()
    data = base64.b64encode(data).decode()

    # return f'<img src="data:image/png;base64,{data}">'
    return json.dumps({"image": data})
