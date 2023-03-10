# projekt-ioi

## Requirements
### Python dependencies
Run `pip install -r requirements.txt` to install python dependencies.

## Stable Diffusion
Download the model folder, so it's placed at the same level as this project:
```shell
git lfs install
git clone https://huggingface.co/runwayml/stable-diffusion-v1-5
```

## Reference
Running `main.py` will generate images for a list with difference strengths and guidance scales, this can be used as a
reference for setting the strength and guidance in `api.py`.

## Api
To run the `api.py` use the following command: `flask -app api.py run`, a Flask app wil be served at 
`http://127.0.0.1:5000`.

## Frontend
To run the frontend angular app, move into the `angular-app` directory. First use `npm install` then `ng serve`.
An Angular app wil be served at `http://localhost:4200/`.

