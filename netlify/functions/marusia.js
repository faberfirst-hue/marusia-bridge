exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      version: "1.0",
      session: event.session,
      response: {
        text: 'Привет от Netlify!',
        end_session: false
      }
    })
  };
};
