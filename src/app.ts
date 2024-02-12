import express from "express";
import { IParseImgRequest } from "./types/req";
import { loadImgFromURI } from "./utils/imgUtils";
const app = express();
const port = 3000;

app.get<IParseImgRequest>("/", (req, res) => {
  loadImgFromURI(req.params);
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
