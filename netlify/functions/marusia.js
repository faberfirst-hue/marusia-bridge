const API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const request = JSON.parse(event.body);
    const userCommand = request.request.command || "Привет";
    
    const response = await require('node-fetch')("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: userCommand}],
        max_tokens: 150
      })
    });

    const data = await response.json();
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
          text: "Ошибка: " + error.message,
          end_session: false
        }
      })
    };
  }
};
