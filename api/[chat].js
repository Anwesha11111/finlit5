export async function POST(request) {
  try {
    const { message } = await request.json();
    
    // Forward to your Render AI
    const aiRes = await fetch(`${process.env.AI_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!aiRes.ok) throw new Error('AI service down');
    
    const data = await aiRes.json();
    return Response.json({ response: data.response || 'AI service OK' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
