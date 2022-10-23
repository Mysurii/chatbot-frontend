function createChatbotLayout() {
  // chat box
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";

  //header
  const header = document.createElement("div");
  header.classList.add("chat-box-header");
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("chat-box-toggle");

  closeBtn.addEventListener("click", () => {
    avatar.style.opacity = 1;
    chatBox.style.opacity = 0;
  });

  const chatbotName = document.createElement("span");
  chatbotName.innerText = "Chatbot";
  header.appendChild(chatbotName);
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
    console.log("BTN CLICKED!");
    e.preventDefault();
    if (inputField.value === "") return;

    createMessage(inputField.value);

    inputField.value = "";
    scrollBottom();
    inputField.focus();

    const response = await getResponse(inputField.value);
    console.log(response);
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
  avatarImg.src =
    "https://static.vecteezy.com/ti/gratis-vector/t1/2275847-male-avatar-profile-icon-of-smiling-blanke-man-vector.jpg";
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
    messageSpan.innerText = message;

    const timeSpan = document.createElement("span");
    const now = new Date();
    timeSpan.innerText = `${now.getHours()}:${now.getMinutes()}`;
    timeSpan.classList.add("chatbot__send__time");

    container.appendChild(messageSpan);
    container.appendChild(timeSpan);
    chatLogs.appendChild(container);
  }
}

async function getResponse(message) {
  const response = await fetch(
    "http://localhost:5000/api/chatbot/response/v-assistance",
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

createChatbotLayout();
