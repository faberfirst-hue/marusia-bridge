const API_KEY = process.env.OPENAI_API_KEY;

exports.handler = async (event) => {
  try {
    const testResponse = await require('node-fetch')("https://api.openai.com/v1/models", {
      method: "GET", 
      headers: {"Authorization": `Bearer ${API_KEY}`}
    });
    
    const testData = await testResponse.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        version: "1.0",
        session: {},
        response: {
          text: "Моделей: " + (testData.data?.length || 0),
          end_session: false
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        version: "1.0",
        session: {},
        response: {
          text: "Ошибка: " + error.message,
          end_session: false
        }
      })
    };
  }
};
