exports.handler = async (event) => {
  const request = JSON.parse(event.body);
  const userText = request.request.original_utterance || '';
  const isFirstLaunch = request.session.new;
  
  let responseText = '';
  
  if (isFirstLaunch || !userText) {
    responseText = 'Привет! Я Джарвис. Готов к работе.';
  } else {
    const userCommand = userText.toLowerCase();
    
    const commandResponses = {
      'привет': 'Привет! Чем могу помочь?',
      'как дела': 'Работаю в штатном режиме. Ваш проект ожидает анализа.',
      'что ты умеешь': 'Помогать находить системные решения и автоматизировать процессы.',
      'спасибо': 'Всегда рад помочь.',
      'джарвис': 'Слушаю вас.',
      'найди золотую жилу': 'Анализирую ваши уникальные навыки... Продолжаем диалог в основном чате.'
    };
    
    responseText = commandResponses[userCommand] || `Команда "${userText}" принята. Обрабатываю...`;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      version: request.version,
      session: request.session,
      response: {
        text: responseText,
        end_session: false
      }
    })
  };
};
