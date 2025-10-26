const API_KEY = 'sk-7c97e6b0173d48ec902c173e4d9cf80b'

exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userText = request.request.original_utterance || '';
    
    // Отправляем запрос в DeepSeek (этот чат)
    const response = await require('node-fetch')('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system', 
            content: 'Ты Джарвис. Помни всю историю диалога. Веди исследование "золотой жилы" пользователя.'
          },
          {
            role: 'user',
            content: userText
          }
        ],
        max_tokens: 500,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('API не ответил');
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
          text: "Связь с ИИ временно недоступна. Повторите запрос.",
          end_session: false
        }
      })
    };
  }
};
