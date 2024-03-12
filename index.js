document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const contactList = document.getElementById("contactList");
  const chatHeader = document.getElementById("chatHeader");
  const chatMessages = document.getElementById("chatMessages");
  const messageInput = document.getElementById("messageInput");
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  const fileInput = document.getElementById("fileInput");
  const attachFileBtn = document.getElementById("attachFileBtn");

  // state
  let data=[]; 
  let currIdx = null;

  function setCurrentUserIdx(idx){
    currIdx = idx;
    chatMessages.innerHTML="";

  }

  function renderMessage(message){
    const msg= document.createElement("div");
      msg.getAttribute("data-id", message.id);
      msg.innerText=message.message;
      chatMessages.appendChild(msg);
  }

  function renderMessages(userData){
    chatMessages.innerHTML="";
    userData?.messageList.forEach(message =>{
    renderMessage(message);
    })
  }
  function renderMessagePanel(){
    const userData= data.filter((item) => item?.id === currIdx)?.[0];
    chatHeader.innerText= userData.title
    renderMessages(userData);
  }

  function handleContactClick(e){
    const currUserId = parseInt(e.target.getAttribute("contact-id"), 10);
    setCurrentUserIdx(currUserId);
    renderMessagePanel();
  }

  function renderContact(contacts){
    contactList.innerHTML='';
    contacts.forEach(contact=>{
      const listItem= document.createElement("li");
      listItem.setAttribute("contact-id", contact.id);
      listItem.classList.add('listItem');
      listItem.innerText=contact.title;
      listItem.addEventListener('click', handleContactClick);
      contactList.append(listItem);
    });
  }

  function fetchData(){
    return contactsData = [
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
  }

  function postData({id, messageListItem }){
    const filterData= data.filter(user=> user.id==id);
    const findIndex = data.findIndex(user=>user.id==id);
    if(filterData?.length && findIndex!== -1){
      filterData[0]?.messageList.push(messageListItem)
      Object(data, {[findIndex]: filterData[0] })
    }
    renderContact(data);
    renderMessage(messageListItem);

  }

  function useEffect(){
    data = [...fetchData()];
    renderContact(data)
  }
  useEffect();

  function sendMessage(){
    const msg= messageInput.value;
    if(msg){
      postData({id:currIdx, messageListItem:{messageId: "msg3", message: msg, messageType: "text"} })
    }
    messageInput.value=""
  }

  sendMessageBtn.addEventListener("click", sendMessage)
  
});