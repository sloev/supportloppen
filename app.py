import asyncio
from sanic import Sanic
from sanic.exceptions import NotFound
from sanic.response import text, json, html
import time
import logging


app = Sanic(__name__)
app.config["SERVER_NAME"] = "localhost:443"

app.static("/static", "./static")

app.static("/", "./index.html", content_type="text/html; charset=utf-8")


@app.route("/image", methods=["POST",])
async def new_image(request):
    with open(f"./{int(time.time())}.png", "wb") as f:
        f.write(request.files["upimage"][0].body)
    await asyncio.sleep(2)
    return text("lolcat")


@app.exception(NotFound)
async def ignore_404s(request, exception):
    logging.warning("not found")
    return text("error", 404)

if __name__ == "__main__":
    try:
        ssl = {"cert": "./ssl/cert.pem", "key": "./ssl/key.pem"}

        app.run(host="0.0.0.0", port=443, debug=True, ssl=ssl)
    except:
        logging.exception("fuck")

