exports.handler = async (event) => {
  const request = JSON.parse(event.body);
  const userCommand = (request.request.original_utterance || '').toLowerCase();
  
  // Локальные ответы для основных команд
  const responses = {
    'привет': 'Привет! Я Джарвис. Готов к работе.',
    'как дела': 'В оптимальном режиме. Чем могу помочь?',
    'что ты умеешь': 'Анализировать системы, искать решения, вести диалог.',
    'спасибо': 'Всегда к вашим услугам.',
    '': 'Здравствуйте! Я ваш ассистент.'
  };

  const aiResponse = responses[userCommand] || 
    `Получил команду: "${userCommand}". Обрабатываю...`;

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
};
