import { renderTopBar } from './home.js';
import { renderLeftSidebar } from './leftside.js';

async function getRoomId(user2, room_name) {
  try {
    const roomsResponse = await fetch(
      `/backend/api/rooms/${user2}`,
      {
        credentials: "include",
      }
    );

    if (!roomsResponse.ok) {
      throw new Error(`HTTP error! status: ${roomsResponse.status}`);
    }

    const room = await roomsResponse.json();

    if (room.room_name === room_name) {
      return room.id;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
///////////////////////
export async function fetch_users(username) {

  const response = await fetch(`/backend/users/${username}`,
    {   
      method: 'GET',
      credentials: 'include'
  });
  
  const data = await response.json();
  if (!response.ok) {
    return (data);
  }
  return data;
}



function getRoomName(user1, user2) {
  if (user1 === user2) {
    throw new Error("User1 and User2 cannot be the same");
  }

  const [username1, username2] = [user1, user2].sort();
  const roomName = `${username1}_${username2}`;
  return roomName;
}


export async function renderChatContent(appContainer, username) {
  
  const data1 = JSON.parse(localStorage.getItem("me"));
  const data2 = await fetch_users(username);
  const user1 = data1.username;
  const user2 = data2.user.username;
  const targetRoomName = getRoomName(user1, user2);
  const targetRoomId = await getRoomId(user2, targetRoomName);
  const socketURL = `wss://${window.location.host}/backend/ws/messages/${targetRoomName}/`;
  const socket = new WebSocket(socketURL);

  const chatViewHTML = `
  <div class="chat-container">
  <div class="chat-header">
  <div class="" style="position: relative;">
  <img class="friend-avatar" src="${data2.user.profile_picture}" alt="${data2.user.username} avatar" width="40" height="40">
  <div class="online-indicator"></div>
  <div class="friend-info">
  <div class="friend-name"></div>
  <div class="friend-status">${data2.user.username}</div>

  </div>
  </div>
  </div>    
  <div class="chat-messages">
  <div class="chats-container" id="chats-container"></div>
  </div>
  <div class="chat-input">  
        <form id="msg-form" action="/" method="post"> 
        <input id="messageInput" type="text" placeholder="Type your message...">
        <button class="send-btn">Send</button>
        </div>
        </div>
        `;
  document.getElementById("mainContent").innerHTML = chatViewHTML;
  try {
    const roomsResponse = await fetch(`backend/api/rooms/${user2}`, {
      credentials: "include",
      method: "GET",
    });

    const rooms = await roomsResponse.json();
    if (!rooms.room_name) {
      throw new Error("Room name not found in rooms response.");
    }

    const messagesResponse = await fetch(`/backend/api/messages/${rooms.room_name}`, {
      credentials: "include",
      method: "GET",
    });

    const messages = await messagesResponse.json();
    const filteredMessages = messages.filter(
      (msg) =>
        msg.room === targetRoomId &&
        (msg.sender === user1 || msg.sender === user2)
    );
  
    // // Render filtered messages to the chat container
    let chatContainer = document.getElementById("chats-container");
    chatContainer.innerHTML = ``;
  
    filteredMessages.forEach((msg) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("message");
      if (msg.sender === user1) {
        newDiv.classList.add("message-sent");
        newDiv.innerHTML = `
          <p class="msg-body">${msg.message}</p>
          <span class="sender">Me</span>
        `;
      } else {
        newDiv.classList.add("received");
        newDiv.innerHTML = `
          <p class="msg-body">${msg.message}</p>
          <span class="sender">${msg.sender}</span>
        `;
      }
      chatContainer.appendChild(newDiv);
    });
  } catch (err) {
    console.error("Error in fetching rooms or messages:", err);
  }
  const messageForm = document.getElementById("msg-form");

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (messageText && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          message: messageText,
          room_name: targetRoomName,
          sender: user1,
        })
      );
      messageInput.value = "";
    }
  });
  const chatsDiv = document.getElementById("chats-container");
  const scrollToBottom = () => {
    chatsDiv.scrollTop = chatsDiv.scrollHeight;
  };
  socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data)["message"];

    let sender = data["sender"];
    let message = data["message"];

    if (sender === user1) {
      const messageInput = document.getElementById("messageInput");
      if (messageInput) {
        messageInput.value = "";
      }
      chatsDiv.innerHTML += `<div class="message message-sent">
        <p class="msg-body">${message}</p>
        <span class="sender">Me</span>
        </div>`;
    } else {
      chatsDiv.innerHTML += `<div class="message message-received">
        <p class="msg-body">${message}</p>
        <span class="sender">${sender}</span>
        </div>`;
    }
    scrollToBottom();
  });
}

  function initializeChatHandlers() {
    const input = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');

    function sendMessage() {
      const message = input.value.trim();
      if (message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message message-sent';
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }





  export function renderChatView(appContainer, username) {
    // Set up the main structure with placeholders
    // const response = await fetch_users('me');
    // const userData = response.user;
    appContainer.innerHTML = `
        <div id="topBar" class="top-bar"></div>
        <div id="mainContent" class="bodyElement"></div>
        <div id="leftSidebar" class="bodyElement"></div>
    `;
    // Render top bar, main content, and user profile into placeholders
    renderTopBar(appContainer);
    renderLeftSidebar(appContainer);
    renderChatContent(appContainer, username);
    // renderUserProfile(appContainer);
}