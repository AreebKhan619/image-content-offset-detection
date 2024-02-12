import { IParseImgRequest } from "../types/req";
import fs from "fs";
import path from "path";
import Jimp from "jimp";

const loadImgFromURI = (params: IParseImgRequest) => {
  console.log("Works", params);
};

const parseImgForEdgeContent = async () => {
  const imagesPath = path.join(__dirname, "../slider-test-images");
  const inputPath = imagesPath + "/1.png";

  // Read the image as a buffer
  const imageBuffer = fs.readFileSync(inputPath);

  const jimpProcessed = await Jimp.read(imageBuffer);
  const {
    background,
    bitmap: { height, width },
  } = jimpProcessed;

  let isTopOffsetFound = false;
  let isBottomOffsetFound = false;

  const offsets = {
    top: 0,
    bottom: 0,
    left: 0, // Will take care of horizontal offsets later
    right: 0,
  };

  for (let y = 0; y < height; y++) {
    if (isTopOffsetFound) break;
    for (let x = 0; x < width; x++) {
      // Get the RGB values of the current pixel
      const { a, r, g, b } = Jimp.intToRGBA(jimpProcessed.getPixelColor(x, y));

      // const isNotBg = r !== 255 || g !== 255 || b !== 255;
      const isNotBg = r < 250 || g < 250 || b < 250;

      if (isNotBg) {
        offsets.top = y;
        isTopOffsetFound = true;
        break;
      }
    }
  }

  for (let y = height; y > 0; y--) {
    if (isBottomOffsetFound) break;
    for (let x = width; x > 0; x--) {
      // Get the RGB values of the current pixel
      const { a, r, g, b } = Jimp.intToRGBA(jimpProcessed.getPixelColor(x, y));
      const isNotBg = r < 250 || g < 250 || b < 250;
      if (isNotBg) {
        offsets.bottom = y;
        // offsets.bottom = height - y;

        isBottomOffsetFound = true;
        break;
      }
    }
  }

  const distanceFromBottom = height - offsets.bottom;

  const cropStep = jimpProcessed.crop(
    0,
    offsets.top,
    width,
    height - offsets.top
  );

  const finalCropStep = cropStep.crop(
    0,
    0,
    cropStep.bitmap.width,
    cropStep.bitmap.height - distanceFromBottom
  );

  const croppedImg = await finalCropStep.getBase64Async(Jimp.MIME_PNG);

  return {
    uncroppedDetails: {
      ...offsets,
      scaleFactor: (offsets.top + offsets.bottom) / height,
    },
    croppedDetails: {
      croppedImg,
    },
  };
};

export { loadImgFromURI, parseImgForEdgeContent };
