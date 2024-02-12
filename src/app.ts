import express from "express";
import { IParseImgRequest } from "./types/req";
import * as imgUtils from "./utils/imgUtils";
const app = express();
const port = 3000;

app.get<IParseImgRequest>("/", async (req, res) => {
  imgUtils.loadImgFromURI(req.params);
  const details = await imgUtils.parseImgForEdgeContent();
  res.json(details);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
