const chatbotName = document.currentScript.getAttribute("name");
const primaryColor = document.currentScript.getAttribute("primary");
const bg = document.currentScript.getAttribute("bg");
const selfBubbleColor = document.currentScript.getAttribute("selfBubble");
const botBubble = document.currentScript.getAttribute("botBubble");
const selfBubbleBorderColor =
  document.currentScript.getAttribute("selfBubbleBorder");
const botBubbleBorderColor =
  document.currentScript.getAttribute("botBubbleBorder");
const closeColor = document.currentScript.getAttribute("close");
const avatarURL = document.currentScript.getAttribute("avatar");

const STANDARD_AVATAR_URL =
  "https://images-platform.99static.com/jwnEu5C8vt1HATQ5ikjw_zxN3Lw=/0x1:1563x1564/500x500/top/smart/99designs-contests-attachments/95/95977/attachment_95977640";

function createChatbotLayout() {
  // chat box
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";

  //header
  const header = document.createElement("div");
  header.classList.add("chat-box-header");
  header.style.background = bg;
  header.style.color = primaryColor;
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("chat-box-toggle");
  closeBtn.style.color = closeColor || primaryColor;

  closeBtn.addEventListener("click", () => {
    avatar.style.opacity = 1;
    chatBox.style.opacity = 0;
  });
  const chatbotNameSpan = document.createElement("span");
  chatbotNameSpan.innerHTML = chatbotName || "Chatbot";
  header.appendChild(chatbotNameSpan);
  header.appendChild(closeBtn);

  //body
  const chatLogs = document.createElement("div");
  chatLogs.classList.add("chat-logs");

  // Start message
  createMessage(
    "Hello, I am the virtual assistant of this website. How can I help you?",
    true
  );

  // Input
  const form = document.createElement("form");
  const inputContainer = document.createElement("div");
  inputContainer.classList.add("chatbot__input__container");
  const inputField = document.createElement("input");
  inputField.classList.add("chatbot__input");
  inputField.placeholder = "Type message..";

  const sendButton = document.createElement("button");
  sendButton.type = "submit";
  sendButton.innerText = "Send";
  sendButton.classList.add("chat-submit");

  sendButton.addEventListener("click", async (e) => {
    const message = inputField.value;

    e.preventDefault();
    if (message === "") return;
    createMessage(message);
    inputField.value = "";
    scrollBottom();
    inputField.focus();

    const response = await getResponse(message);

    if (response.status == "success")
      setTimeout(() => {
        createMessage(response.message, true);
        scrollBottom();
      }, 500);
  });

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(sendButton);
  form.appendChild(inputContainer);

  chatBox.appendChild(header);
  chatBox.appendChild(chatLogs);
  chatBox.appendChild(form);

  const avatar = document.createElement("div");
  avatar.classList.add("chatbot__avatar");
  const avatarImg = document.createElement("img");
  avatarImg.src = avatarURL || STANDARD_AVATAR_URL;
  avatarImg.classList.add("chatbot__avatar__image");
  avatar.appendChild(avatarImg);

  avatarImg.addEventListener("click", () => {
    avatar.style.opacity = 0;
    chatBox.style.opacity = 1;
  });

  document.body.appendChild(chatBox);
  document.body.appendChild(avatar);

  const scrollBottom = () =>
    chatLogs.scrollTo({
      top: chatLogs.scrollHeight,
      behavior: "smooth",
    });

  function createMessage(message, is_bot = false) {
    const container = document.createElement("div");
    if (!is_bot) container.classList.add("chatbot__self");
    container.classList.add("chatbot__message__container");

    const messageSpanClass = is_bot
      ? "chatbot__message__bot"
      : "chatbot__message__self";
    const messageSpan = document.createElement("span");
    messageSpan.classList.add(messageSpanClass);
    messageSpan.style.background = is_bot ? botBubble : selfBubbleColor;
    messageSpan.style.borderColor = is_bot
      ? botBubbleBorderColor
      : selfBubbleBorderColor;
    messageSpan.innerText = message;

    const timeSpan = document.createElement("span");
    const now = new Date();
    timeSpan.innerText = `${now.getHours()}:${now.getMinutes()}`;
    timeSpan.classList.add("chatbot__send__time");

    container.appendChild(messageSpan);
    container.appendChild(timeSpan);
    chatLogs.appendChild(container);
  };
}

function requestStylesheet(stylesheet_url) {
  stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.type = "text/css";
  stylesheet.href = stylesheet_url;
  stylesheet.media = "all";
  document.lastChild.firstChild.appendChild(stylesheet);
}

async function getResponse(message) {
  const response = await fetch(
    `http://localhost:5000/api/chatbot/response/${chatbotName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );
  const res = await response.json();

  return res;
}

requestStylesheet(
  "https://cdn.jsdelivr.net/gh/mysurii/chatbot-frontend@vv9/styles.css"
);
createChatbotLayout();
