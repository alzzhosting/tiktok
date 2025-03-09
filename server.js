const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "index.html")));

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL diperlukan!" });

  try {
    // 1. Coba ambil dari API TikWM
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (data && data.data && data.data.play) {
      return res.json({ video: data.data.play });
    }

    // 2. Kalau API gagal, coba scraping pakai Cheerio
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const videoSrc = $('video source').attr("src");

    if (videoSrc) return res.json({ video: videoSrc });

    res.status(404).json({ error: "Video tidak ditemukan!" });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil video!" });
  }
});

app.listen(PORT, () => console.log(`Server jalan di http://localhost:${PORT}`));
