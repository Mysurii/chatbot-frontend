const submitBtn = document.getElementById("chat-submit");
const messageList = document.getElementById("chat-logs");
const input = document.getElementById("chat-input");

console.log("HELLO FROM INDEXJS");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (input.value === "") return;

  createMessage(input.value);

  input.value = "";
  scrollBottom();

  const response = await getResponse(input.value);
  console.log(response);
  if (response.status == "success")
    setTimeout(() => {
      createMessage(response.message, true);
      scrollBottom();
    }, 500);
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
  messageList.appendChild(container);
}

async function getResponse(message) {
  const response = await fetch(
    "http://localhost:5000/api/chatbot/response/testing",
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

const scrollBottom = () =>
  messageList.scrollTo({
    top: messageList.scrollHeight,
    behavior: "smooth",
  });
