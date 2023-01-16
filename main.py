import os
import torch
import numpy as np
from PIL import Image, ImageOps

from diffusers import StableDiffusionImg2ImgPipeline

device = "cuda"
model_id_or_path = "../stable-diffusion-v1-5"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    model_id_or_path,
    revision="fp16",
    torch_dtype=torch.float16,
)

pipe = pipe.to(device)
img = Image.open('input_images/Celje-by-Mr.M-Marko-Tadic (Large).jpg')
init_image = img
init_image = ImageOps.contain(img, (512, 512))

environment = "street"
prompts = [
    f"A modern environmentally friendly {environment}, detailed, real photo",
    f"A {environment} during ice age, detailed, real photo",
    f"A {environment} completely covered in snow, detailed, real photo",
    f"A {environment} after a volcano eruption with lava, detailed, real photo",
    f"A {environment} overgrown with plants, detailed, real photo",
    f"A flooded {environment}, detailed, real photo",
    f"A {environment} after an earthquake, detailed, real photo",
    f"A {environment} on fire, detailed, real photo",
    f"A {environment} full of trash, detailed, real photo"
    f"A post apocalyptic {environment}, detailed, real photo",
    f"A futuristic {environment}, detailed, real photo",
    f"A futuristic {environment} with flying cars, detailed, real photo",
    f"A {environment} turned into a war zone, detailed, real photo"]
# Strength control the amount of noise that is added to the image
strengths = [i for i in np.arange(0.5, 0.7, 0.1)]

# Guidance scale determines how closely to follow the prompt

guidance_scales = [i for i in np.arange(12, 13.1, 0.5)]

for prompt in prompts:
    for strength in strengths:
        for guidance_scale in guidance_scales:
            file_name = f'output_images/{prompt.replace(" ", "_").split(",",1)[0]}/' \
                        f'{prompt.replace(" ", "_").split(",",1)[0]}_{round(strength, 1)}s_{guidance_scale}g.png'
            print(file_name)
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            images = pipe(prompt=prompt,
                          init_image=init_image,
                          strength=strength,
                          guidance_scale=guidance_scale).images
            images[0].save(file_name)