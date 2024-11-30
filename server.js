const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/compile", (req, res) => {
  const code = req.body.code;

  const tempFilePath = "./temp_code.txt";
  fs.writeFileSync(tempFilePath, code);

  exec(
    `java -Dfile.encoding=UTF-8 -jar glyph.jar ${tempFilePath}`,
    (error, stdout, stderr) => {
      if (stderr) {
        return res.json({ output: stderr, isError: true });
      }
      res.json({ output: stdout, isError: false });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
