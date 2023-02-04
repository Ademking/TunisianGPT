import './style.css'
import DOMPurify from 'dompurify'
import Fuse from 'fuse.js'
import { removeBadWords, emojifiText, guid, sleep, blurKeyboard, scrollToBottomDoc, isSpecialMessage, runCommand } from './utils'
import { FUSE_CONFIG, MAX_RESULTS, I_DONT_UNDERSTAND_MSGS, DEFAULT_TEXT_SIZE, TYPING_SPEED } from './config'
import myData from './data.json' assert { type: 'json' }

if (document.readyState == "complete") {
  // remove loading overlay
 document.querySelector("#loading-overlay").remove();
}else{
  window.addEventListener("load", function() {
    document.querySelector("#loading-overlay").remove();
  }, false);
}

const getAnswer = question => {
  const fuse = new Fuse(myData, FUSE_CONFIG)
  const result = fuse.search(question)
  console.log('total results: ', result.length)
  if (result.length > 0) {
    let maxIndex = Math.min(result.length, MAX_RESULTS) - 1
    let randomIndex = Math.floor(Math.random() * (maxIndex + 1))
    console.log('Random selected index: ', randomIndex)
    console.log('Random selected item: ', result[randomIndex].item.output)

    return result[randomIndex].item.output
  }
  let randomIndex = Math.floor(Math.random() * I_DONT_UNDERSTAND_MSGS.length)
  return I_DONT_UNDERSTAND_MSGS[randomIndex].replace('{MSG}', question) // return random message when no answer found, and replace {MSG} with the question asked to make it more natural
}

const messageInput = document.getElementById('message-input')
const sendButton = document.getElementById('send-button')

// scroll to bottom
const scrollToBottom = () => {
  const el = document.getElementById('messages')
  el.scrollTop = el.scrollHeight
}

const sendUserMessage = message => {
  let cleanMsg = formatMessage(DOMPurify.sanitize(message)) // sanitize message
  const html = `
  <div class="chat-message">
  <div class="flex items-end justify-end">
    <div class="flex flex-col space-y-2 ${DEFAULT_TEXT_SIZE} max-w-xs mx-2 order-1 items-end">
      <div><span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">${cleanMsg}</span></div>
    </div>
  </div>
</div>
  `
  document.getElementById('messages').innerHTML += html

  scrollToBottom()
}

// bot message
// isStaticMsg is used to send a static message without asking the bot for an answer (like the welcome message)
const sendBotMessage = async (message, isStaticMsg = false) => {
  // check if message is a special message
  if (isSpecialMessage(message) && !isStaticMsg) {
    isStaticMsg = true
    message = await runCommand(message)
  }

  let i = 0
  let text = isStaticMsg ? message : formatMessage(getAnswer(DOMPurify.sanitize(message))) // sanitize message
  let speed = TYPING_SPEED
  let randomElementId = guid()

  const html = `
  <div class="chat-message">
  <div class="flex items-end">
    <div class="flex flex-col space-y-2 ${DEFAULT_TEXT_SIZE} max-w-xs mx-2 order-2 items-start">
      <div><span id="${randomElementId}" class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"></span></div>
    </div>
    <img
      src="./chatbot.png"
      alt="TunisianGPT" class="w-6 h-6 rounded-full order-1">
  </div>
</div>
  `
  document.getElementById('messages').innerHTML += html
  // type writer effect
  for (i = 0; i < text.length; i++) {
    let mychar = text[i]
    setTimeout(() => {
      let elem = document.getElementById(randomElementId)
      elem.innerHTML += mychar
      scrollToBottom()
    }, speed * i)
  }
  scrollToBottom()
}

// format message before sending
const formatMessage = message => {
  message = removeBadWords(message)
  message = emojifiText(message)
  return message
}

// send message on btn click
sendButton.addEventListener('click', async () => {
  const message = messageInput.value
  if (message) {
    blurKeyboard()
    messageInput.value = ''
    sendUserMessage(message)
    await sleep(200)
    sendBotMessage(message)
  }
})

// send message on enter key
messageInput.addEventListener('keyup', async e => {
  if (e.key === 'Enter') {
    const message = messageInput.value
    if (message) {
      blurKeyboard()
      messageInput.value = ''
      sendUserMessage(message)
      await sleep(200)
      sendBotMessage(message)
    }
  }
})

// send initial message
setTimeout(async () => {
  scrollToBottomDoc()
  sendBotMessage('عسلامة صديقي', true)
  await sleep(1000)
  sendBotMessage('كيفاش إنجم نعاونك؟', true)
  // await sleep(1500)
  // sendBotMessage('باش تعرف أكثر معلومات إكتب', true)
  // await sleep(1000)
  // sendBotMessage('/help', true)
}, 500)
