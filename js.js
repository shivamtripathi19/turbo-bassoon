let contactsData = []; // Assume this is fetched from the API

// Function to render contacts list
function renderContacts(filteredContacts=[]) {
  contactList.innerHTML = "";
  filteredContacts.forEach((contact, idx) => {
    const listItem = document.createElement("li");
    listItem.textContent = contact.title;
    listItem.setAttribute("contactId", contact.id)
    listItem.addEventListener('click', ()=>{
      renderChatWindow(contact);
      setActiveContact(idx)
    })
    contactList.appendChild(listItem);
  });
}

// Function to render chat window for selected contact
function renderChatWindow(contact) {
  chatHeader.textContent = contact.title;
  chatMessages.innerHTML = ""; // Clear previous messages
  chatHeader.dataset.contactId = contact.id;

  // Render previous messages for the selected contact
  contact.messageList.forEach(message => {
    renderMessage(message);
  });
}

// Function to render a single message
function renderMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message.message;
  chatMessages.appendChild(messageElement);
}

// Function to set active contact
function setActiveContact(index) {
  const listItems = document.querySelectorAll("#contactList li");
  listItems.forEach(item => {
    item.classList.remove("active-contact");
  });
  listItems[index].classList.add("active-contact");
}

// Event listener for search input
searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredContacts = contactsData.filter(contact =>
    contact.title.toLowerCase().includes(searchTerm)
  );
  console.log(filteredContacts)
  renderContacts(filteredContacts);
});

// Event listener for sending a message
sendMessageBtn.addEventListener("click", function () {
const messageText = messageInput.value.trim();
if (messageText !== "") {
  const contactId = parseInt(chatHeader.dataset.contactId, 10);
  const newMessage = {
    messageId: `msg${Date.now()}`,
    message: messageText,
    messageType: "text"
  };
  renderMessage(newMessage);
  
  // Update message list in localStorage
  contactsData.forEach(contact => {
    if (contact.id === contactId) {
      contact.messageList.push(newMessage);
    }
  });
  console.log(contactsData);
  localStorage.setItem("contactsData", JSON.stringify(contactsData));
  
  messageInput.value = ""; // Clear the message input
}
});

attachFileBtn.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  if (file) {
    console.log(file);
    const reader = new FileReader();
    reader.onload = function (event) {
      const attachment = {
        type: file.type.split("/")[0], // "image", "video", "application", etc.
        name: file.name,
        data: event.target.result
      };
      sendMessageWithAttachment(attachment);
    };
    reader.readAsDataURL(file);
  }
});

// Function to send message with attachment
function sendMessageWithAttachment(attachment) {
  const contactId = parseInt(chatHeader.dataset.contactId, 10);
  const newMessage = {
    messageId: `msg${Date.now()}`,
    message: attachment.name,
    attachment: attachment,
    messageType: "attachment"
  };
  renderMessage(newMessage);

  // Update message list in localStorage
  contactsData.forEach(contact => {
    if (contact.id === contactId) {
      contact.messageList.push(newMessage);
    }
  });
  localStorage.setItem("contactsData", JSON.stringify(contactsData));
}


// Fetch contacts data from localStorage
const storedContacts = localStorage.getItem("contactsData");
if (storedContacts) {
  contactsData = JSON.parse(storedContacts);
  renderContacts(contactsData);
} else {
  // Sample data if localStorage is empty
  contactsData = [
    {
      id: 1,
      title: "John Doe",
      imageURL: "someUrl",
      orderId: "OD123",
      messageList: [
        { messageId: "msg1", message: "Hi", messageType: "text" },
        { messageId: "msg2", message: "need assistance", messageType: "text" }
      ]
    },
    {
      id: 2,
      title: "Jane Smith",
      imageURL: "someUrl2",
      orderId: "OD1234",
      messageList: []
    }
  ];
  localStorage.setItem("contactsData", JSON.stringify(contactsData));
  renderContacts(contactsData);
}

// Show initial chat window (first contact)
if (contactsData.length > 0) {
  renderChatWindow(contactsData[0]);
}