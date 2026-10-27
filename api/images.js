// Vercel 서버리스 함수: GET /api/images?q=검색어
// Pixabay 키는 Vercel 환경변수 PIXABAY_API_KEY 에서만 읽습니다.
module.exports = async (req, res) => {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'PIXABAY_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const q = String(req.query.q || '').trim().slice(0, 100);
  if (!q) {
    return res.status(400).json({ error: '검색어(q)를 입력하세요.' });
  }

  const url =
    'https://pixabay.com/api/?key=' + encodeURIComponent(key) +
    '&q=' + encodeURIComponent(q) +
    '&image_type=photo&safesearch=true&per_page=10';

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(502).json({ error: 'Pixabay 요청 실패 (' + r.status + ')' });
    }
    const data = await r.json();
    const images = data.hits.map((h) => ({
      url: h.webformatURL,
      tags: h.tags,
      page: h.pageURL,
    }));
    return res.status(200).json({ images });
  } catch (e) {
    return res.status(502).json({ error: 'Pixabay에 연결하지 못했습니다.' });
  }
};
