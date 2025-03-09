async function downloadVideo() {
  const url = document.getElementById("tiktokUrl").value;
  if (!url) return alert("Masukkan URL dulu!");

  try {
    const res = await fetch(`/download?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.video) {
      const a = document.createElement("a");
      a.href = data.video;
      a.download = "tiktokdownloader.by.kenz.mp4";  // Nama file hasil download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert("Gagal mengambil video!");
    }
  } catch (err) {
    alert("Terjadi kesalahan!");
  }
}