export const removeBadWords = message => {
  const badWords = ['zebi', 'zeb', 'zab', 'zib', 'sourm', 'term', 'zabour', 'rabek', 'rbk', '9a7ba', '9ahba', '9hab', 'miboun', 'kahba', 'asba', 'ommok', 'omek', 'terma', 'nik', 'nayek', 'reyek', 'عصب', 'قحب', 'زبي', 'ميبون', 'ربك', 'نيك', 'الترم']
  badWords.forEach(badWord => {
    message = message.replaceAll(badWord, '****')
  })
  return message
}

export const emojifiText = message => {
  let mapping = {
    ':D': '😃',
    ':)': '🙂',
    ':(': '🙁',
    ':p': '😛',
    ':o': '😮',
    ':O': '😮',
    ':*': '😘',
    ':/': '😕',
    ":'(": '😢',
    '&lt;3': '❤️',
    '&lt;/3': '💔',
    '(y)': '👍',
    '(Y)': '👍'
  }
  if (message) {
    for (let key in mapping) {
      // replace all occurences
      message = message.replaceAll(key, mapping[key])
    }
  }
  return message
}

export const guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const sleep = async ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isSpecialMessage = message => {
  if (message.startsWith('/') || message === 'help') {
    return true
  }
  return false
}

export const runCommand = async message => {
  switch (message) {
    case '/clear':
      clearMessages()
      return 'Messages cleared.'
    case '/help':
    case 'help':
    case 'info':
    case '/info':
      return "Hi! I'm Adem. I built this website for fun! To be clear: This website does not actually use ChatGPT or any other form of AI. It's just a static website that uses a random selection of answers from a JSON file. Hope you enjoy it!"

    default:
      return 'No such command.'
  }
}

const clearMessages = () => {
  document.getElementById('messages').innerHTML = ''
}
