export async function POST(request) {
  try {
    const { message } = await request.json();
    console.log('Message:', message); // Vercel logs
    
    const aiUrl = process.env.AI_SERVICE_URL || 'https://finlitbotapi.onrender.com';
    console.log('AI URL:', aiUrl);
    
    const aiRes = await fetch(`${aiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    console.log('AI Status:', aiRes.status);
    
    const data = await aiRes.json();
    return Response.json({ 
      response: data.response || 'AI working!',
      sources: data.sources || []
    });
  } catch (error) {
    console.error('Backend error:', error);
    return Response.json({ 
      error: error.message,
      response: 'Backend error - check logs'
    }, { status: 500 });
  }
}
