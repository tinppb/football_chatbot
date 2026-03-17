export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server chưa cấu hình GROQ_API_KEY.' });
    return;
  }

  try {
    const { system, messages, useSearch } = req.body;
    let extraContext = '';

    // Nếu cần search, dùng DuckDuckGo instant answer (miễn phí, không cần key)
    if (useSearch && messages.length > 0) {
      const lastMsg = messages[messages.length - 1].content;
      try {
        const query = encodeURIComponent(lastMsg + ' bóng đá 2025 2026');
        const searchRes = await fetch(
          `https://api.duckduckgo.com/?q=${query}&format=json&no_html=1&skip_disambig=1`,
          { headers: { 'User-Agent': 'FootballBotVN/1.0' } }
        );
        const searchData = await searchRes.json();
        const abstract = searchData.AbstractText || '';
        const relatedTopics = (searchData.RelatedTopics || [])
          .slice(0, 3)
          .map(t => t.Text || '')
          .filter(Boolean)
          .join(' | ');
        if (abstract || relatedTopics) {
          extraContext = `\n\n[Thông tin tìm kiếm]: ${abstract} ${relatedTopics}`;
        }
      } catch (_) {}
    }

    const groqMessages = [];
    if (system) groqMessages.push({ role: 'system', content: system + extraContext });

    messages.forEach((m, i) => {
      // Nếu là tin nhắn cuối và có context search, thêm vào
      if (i === messages.length - 1 && extraContext && m.role === 'user') {
        groqMessages.push({ role: 'user', content: m.content });
      } else {
        groqMessages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content });
      }
    });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'Lỗi Groq API' });
      return;
    }

    const text = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
}
