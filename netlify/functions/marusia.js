exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userCommand = request.request.original_utterance || "Привет";
    
    // Полностью бесплатный API без ключей
    const response = await require('node-fetch')('https://chatgpt-api.shn.hk/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: userCommand}],
        max_tokens: 100
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
            text: 'Привет! Чем могу помочь?',
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
          text: "Здравствуйте! Задайте ваш вопрос.",
          end_session: false
        }
      })
    };
  }
};
