exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userCommand = request.request.command || (request.request.type === "SimpleUtterance" ? "Привет" : "Поприветствуй меня");
    
    // Бесплатный AI API без ключа
    const response = await require('node-fetch')("https://api.vsegpt.ru/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{role: "user", content: userCommand}],
        max_tokens: 150,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('AI API returned no choices: ' + JSON.stringify(data));
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
