const API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userCommand = request.request.command || "Привет";
    
    const response = await require('node-fetch')("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{role: "user", content: userCommand}],
        max_tokens: 150
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('DeepSeek API returned no choices');
    }
    
    const aiResponse = data.choices[0].message?.content || 'Нет ответа';

    return {
      statusCode: 200,
      body: JSON.stringify({
        version: request.version,
        session: request.session,
        response: {
          text: aiResponse,
          end_session: false
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        version: "1.0",
        session: event.session,
        response: {
          text: "Ошибка: " + error.message,
          end_session: false
        }
      })
    };
  }
};
