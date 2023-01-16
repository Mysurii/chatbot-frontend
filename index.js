const token = document.currentScript.getAttribute('data-token')
const chatbotName = document.currentScript.getAttribute('data-name')
const nameColor = document.currentScript.getAttribute('data-name-color')
const closeColor = document.currentScript.getAttribute('data-close')
const headerColor = document.currentScript.getAttribute('data-header')
const selfBubbleColor = document.currentScript.getAttribute('data-bubble-user')
const botBubble = document.currentScript.getAttribute('data-bubble-bot')
const sendButtonColor = document.currentScript.getAttribute('data-send-button')
const textUser = document.currentScript.getAttribute('data-text-user')
const textBot = document.currentScript.getAttribute('data-text-bot')
const avatarURL = document.currentScript.getAttribute('data-avatar')

const STANDARD_AVATAR_URL = 'https://images-platform.99static.com/jwnEu5C8vt1HATQ5ikjw_zxN3Lw=/0x1:1563x1564/500x500/top/smart/99designs-contests-attachments/95/95977/attachment_95977640'

function createChatbotLayout() {
  // chat box
  const chatBox = document.createElement('div')
  chatBox.classList.add('chatbot__container')
  chatBox.id = 'chat-box'

  //header
  const header = document.createElement('div')
  header.classList.add('chatbot__header')

  header.style.background = headerColor

  const closeBtn = document.createElement('div')
  closeBtn.innerHTML = '&#10006'
  closeBtn.classList.add('chatbot__header__close')
  closeBtn.style.color = closeColor

  closeBtn.addEventListener('click', () => {
    avatar.style.opacity = 1
    chatBox.style.opacity = 0
  })

  const chatbotNameSpan = document.createElement('span')
  chatbotNameSpan.classList.add('chatbot__header__description')
  chatbotNameSpan.innerHTML = chatbotName || 'Chatbot'
  chatbotNameSpan.style.color = nameColor

  header.appendChild(chatbotNameSpan)
  header.appendChild(closeBtn)

  //body
  const messagesListContainer = document.createElement('div')
  messagesListContainer.classList.add('chatbot__messageslist__container')

  const chatLogs = document.createElement('div')
  chatLogs.classList.add('chatbot__messageslist')

  messagesListContainer.appendChild(chatLogs)

  // Start message
  createMessage('Hello, I am the virtual assistant of this website. How can I help you?', true)

  // Input
  const inputContainer = document.createElement('form')
  inputContainer.classList.add('chatbot__input__container')
  const inputField = document.createElement('input')
  inputField.classList.add('chatbot__input')
  inputField.placeholder = 'Type message..'

  const sendButton = document.createElement('button')
  sendButton.type = 'submit'
  sendButton.innerText = 'Send'
  sendButton.classList.add('chatbot__send__button')
  sendButton.style.color = `${closeColor} !important`

  sendButton.addEventListener('click', async (e) => {
    e.preventDefault()

    const message = inputField.value
    if (message === '') return
    createMessage(message)
    inputField.value = ''
    scrollBottom()
    inputField.focus()

    try {
      const response = await getResponse(message)
      console.log(response)
       console.log(response.response)
      if (response.status == 'success' && Array.isArray(response.response)) {
        console.log('is array!')

        response.forEach((r) => {
          console.log('in response')
          console.log(r)
        })
     
        response.response.forEach((r) => {
          console.log(r)
          console.log(r.text)
          setTimeout(() => {
            createMessage(r.text, true)
            scrollBottom()
          }, 500)
        })
      }

       
    } catch (err) {
      setTimeout(() => {
        createMessage('Something went wrong with the server. Please try again later.', true)
        scrollBottom()
      }, 500)
    }
  })

  inputContainer.appendChild(inputField)
  inputContainer.appendChild(sendButton)

  chatBox.appendChild(header)
  chatBox.appendChild(messagesListContainer)
  chatBox.appendChild(inputContainer)

  const avatar = document.createElement('div')
  avatar.classList.add('avatar__container')
  const avatarImg = document.createElement('img')
  avatarImg.src = avatarURL || STANDARD_AVATAR_URL
  avatarImg.classList.add('chatbot__avatar')
  avatar.appendChild(avatarImg)

  avatarImg.addEventListener('click', () => {
    avatar.style.opacity = 0
    chatBox.style.opacity = 1
  })

  document.body.appendChild(chatBox)
  document.body.appendChild(avatar)

  const scrollBottom = () =>
    chatLogs.scrollTo({
      top: chatLogs.scrollHeight,
      behavior: 'smooth',
    })

  function createMessage(message, is_bot = false) {
    const container = document.createElement('div')
    container.classList.add('chatbot__bubble__container')
    container.style.justifyContent = is_bot ? 'flex-start' : 'flex-end'

    const textContainer = document.createElement('div')
    textContainer.classList.add('chatbot__text__container')

    const bubble = document.createElement('div')
    if (is_bot) {
      bubble.classList.add('chatbot__bot__bubble')
      if (botBubble && textBot) {
        bubble.style.background = botBubble
        bubble.style.color = textBot
      }
    } else {
      bubble.classList.add('chatbot__self__bubble')
      if (selfBubbleColor && textUser) {
        bubble.style.background = selfBubbleColor
        bubble.style.color = textUser
      }
    }

    bubble.append(message)

    const time = document.createElement('div')
    time.classList.add('chatbot__time')
    time.style.textAlign = is_bot ? 'left' : 'right'

    const now = new Date()
    now.innerText = `${now.getHours()}:${now.getMinutes()}`

    textContainer.appendChild(bubble)
    textContainer.appendChild(time)

    container.appendChild(textContainer)
    chatLogs.appendChild(container)
  }
}

async function getResponse(message) {
  const response = await fetch(`http://localhost:8080/chatbots/response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `$Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  })
  const res = await response.json()

  return res
}

// requestStylesheet(
//   "https://cdn.jsdelivr.net/gh/mysurii/chatbot-frontend@vv16/styles.css"
// );

if (token) createChatbotLayout()
