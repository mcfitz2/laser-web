from PIL import Image
import io, traceback, sys, json
#import zerorpc
import logging, base64
from flask import Flask, request, jsonify

app = Flask(__name__)

logging.basicConfig()
class Generator(object):
    def bitmap_to_gcode(self, image, output_file, feed_rate_on, feed_rate_off, power, start_code, end_code, pixels_per_mm=0.1,
                        offset=(0, 0), final_dimensions=None):

        final_dimensions_px = tuple(map(lambda x: int(x / pixels_per_mm), final_dimensions))
        start_code = start_code % power
        xo, yo = offset
        im = Image.open(io.BytesIO(image))
        im = im.resize(final_dimensions_px)
        im = im.transpose(Image.FLIP_TOP_BOTTOM)
        im = im.convert("RGBA")
        canvas = Image.new('RGBA', im.size, (255, 255, 255, 255))  # Empty canvas colour (r,g,b,a)
        canvas.paste(im, mask=im)
        gray = canvas.convert('L')
        bw = gray.point(lambda x: 0 if x < 128 else 255, '1')
        pixels = bw.load()  # this is not a list, nor is it list()'able
        width, height = im.size
        BLACK = 0
        output_file.write(u"G0 X%d Y%d\n" % offset)
        for y in range(height - 1, 0, -1):
            output_file.write(u"G0 Y%.2f\n" % ((y * pixels_per_mm) + yo))
            startx = None
            if y % 2 == 0:
                for x in range(width):
                    cpixel = pixels[x, y]
                    if cpixel == BLACK:
                        if startx is None:
                            startx = x
                            output_file.write(u"G0 X%.2f F%d\n" % ((x * pixels_per_mm) + xo, feed_rate_off))
                        else:
                            # still black
                            continue
                    else:
                        if startx is None:  # still not black
                            continue
                        else:
                            output_file.write(u"%s\n" % start_code)
                            output_file.write(u"G0 X%.2f F%d\n" % ((x * pixels_per_mm) + xo, feed_rate_on))
                            output_file.write(u"%s\n" % end_code)
                            startx = None
            else:
                for x in range(width - 1, 0, -1):
                    cpixel = pixels[x, y]
                    if cpixel == BLACK:
                        if startx is None:
                            startx = x
                            output_file.write(u"G0 X%.2f F%d\n" % ((x * pixels_per_mm) + xo, feed_rate_off))
                        else:
                            # still black
                            continue
                    else:
                        if startx is None:  # still not black
                            continue
                        else:
                            output_file.write(u"%s\n" % start_code)
                            output_file.write(u"G0 X%.2f F%d\n" % ((x * pixels_per_mm) + xo, feed_rate_on))
                            output_file.write(u"%s\n" % end_code)
                            startx = None
        return output_file
    def generate(self, image, machine, material, final_dimensions, offset=[0,0]):
        img = base64.b64decode(image["base64"])

        output_file = io.StringIO()
        output_file.write(machine["prefix"])
        output_file = self.bitmap_to_gcode(img, output_file, material["feed_rate"],
                                      machine["travel_rate"], material["power"],
                                      machine["start_code"], machine["end_code"],
                                      machine["dot_size"], tuple(offset), tuple(final_dimensions))
        output_file.write(machine["postfix"])

        return output_file.getvalue()



@app.route("/generate", methods=["POST"])
def generate():
    settings = request.get_json()
    app.logger.info(settings)
    g = Generator()
    gcode = g.generate(settings["image"], settings["machine"], settings["material"],  settings["final_dimensions"], settings["offset"])
    app.logger.info(gcode)
    return jsonify(gcode=gcode)
    

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=5000)
