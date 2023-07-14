const socket = io();

// Actualizar lista de productos:
function updateProducts(products) {
  const ul = document.querySelector("ul");
  ul.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = product.title;
    li.className = "real-time-item";
    ul.appendChild(li);
  });
}

// Recibir productos:
socket.on("products", (products) => {
  updateProducts(products);
});

// Chat:
let user;
let chatBox = document.querySelector(".input-text");

// Alerta para solicitar y guardar mail:
Swal.fire({
  title: "Welcome",
  text: "Please enter your email",
  input: "text",
  inputValidator: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.match(regex)) {
      return `You must to complete with a valid email.`;
    }
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("user", { user, message: "Join the chat." });
});

// Listener para los mensajes:
socket.on("messagesDB", (data) => {
  let messagesContainer = document.getElementById("messages");
  let messages = "";
  data.forEach((message) => {
    messages += `<p><strong>${message.user}</strong>: ${message.message}</p>`;
  });
  messagesContainer.innerHTML = messages;
});

// Listener del botón de enviar:
const sendButton = document.getElementById("send-button");
sendButton.addEventListener("click", () => {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  if (message.trim().length > 0) {
    socket.emit("message", { user, message });
    messageInput.value = "";
  }
});
