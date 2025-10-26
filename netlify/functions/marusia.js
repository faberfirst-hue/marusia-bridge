exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userCommand = request.request.original_utterance || "Привет";
    
    // Бесплатный API без ключей
    const response = await require('node-fetch')('https://api.vsegpt.ru/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MarusiaBot/1.0'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{role: 'user', content: userCommand}],
        max_tokens: 100,
        temperature: 0.7,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          version: request.version,
          session: request.session,
          response: {
            text: 'Привет! Я ваш ассистент. Чем могу помочь?',
            end_session: false
          }
        })
      };
    }
    
    const aiResponse = data.choices[0].message.content;

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
          text: "Привет! Рад вас слышать.",
          end_session: false
        }
      })
    };
  }
};
