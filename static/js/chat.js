const textarea = document.getElementById('message-1');

function autoResize() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

textarea.addEventListener('input', autoResize);
textarea.addEventListener('focus', autoResize);
textarea.addEventListener('change', autoResize);

function validate(){
  const areatextarea = document.querySelector("#message-1");
  const areatext = document.querySelector("#message-1").value.length;
  const textcount = document.querySelector("#char-count");
  const textlimit = document.querySelector("#char-limit");
  textcount.innerHTML = areatext;

  if(areatext > 250){
      textlimit.classList.add("text-danger");
      areatextarea.classList.add("textarea_danger");
  }else{
      textlimit.classList.remove("text-danger");
      areatextarea.classList.remove("textarea_danger");
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('message-1');
  const sendButton = document.getElementById('send-button');
  
  sendButton.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  // Start conversation
  window.setTimeout(() => {
    appendMessage("bot", "Hi there! I'm your college program advisor. Let me ask you a few questions to help recommend suitable college programs for you.");
    getBotResponse("start", true);
  }, 1000);

  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
      appendMessage("user", message);
      chatbotInput.value = '';
      getBotResponse(message);
    }
  }

  function appendMessage(sender, message, isMarkdown = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
  
    if (sender === 'bot' && isMarkdown) {
      messageElement.innerHTML = window.marked.parse(message);
    } else {
      messageElement.textContent = message;
    }
  
    chatbotMessages.appendChild(messageElement);
    scrollToBottom();
  }
  
  function scrollToBottom() {
    // Add a small delay to ensure content is fully rendered
    setTimeout(() => {
      // Scroll the chatbot messages container
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      
      // Also check if we need to scroll the parent container
      const chatbotBody = document.getElementById('chatbot-body');
      if (chatbotBody) {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
      }
      
      // And check the outer overflow container
      const overflowContainer = document.querySelector('.overflow-auto');
      if (overflowContainer) {
        overflowContainer.scrollTop = overflowContainer.scrollHeight;
      }
    }, 50);
  }

  async function getBotResponse(message, resetConversation = false) {
    appendMessage("bot", "...");
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: message,
          reset: resetConversation,
          generating: false // Default is false
        })
      });
  
      const data = await response.json();
      chatbotMessages.removeChild(chatbotMessages.lastChild);
  
      // Show the intermediate message
      appendMessage("bot", data.response);
      
      // If we need to generate recommendations, make another request
      if (data.needsRecommendations) {
        // Wait a moment to let the user see the message
        setTimeout(async () => {
          appendMessage("bot", "Analyzing your profile and generating recommendations...");
          
          const recommendationsResponse = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              message: "",
              reset: false,
              generating: true // Signal we want recommendations
            })
          });
          
          const recommendationsData = await recommendationsResponse.json();
          
          // Add the final recommendations with markdown formatting
          appendMessage("bot", recommendationsData.response, true);
          
          // Determine if this is the final message
          const isFinal = recommendationsData.response.includes("### 1.");
          if (isFinal) {
            disableUserInput();
          }
        }, 1500); // Wait 1.5 seconds before requesting recommendations
      }
    } catch (error) {
      chatbotMessages.removeChild(chatbotMessages.lastChild);
      appendMessage("bot", "Sorry, I couldn't connect to the server.");
      console.error('Error:', error);
    }
  }

  function disableUserInput() {
    chatbotInput.disabled = true;
    sendButton.disabled = true;
    chatbotInput.placeholder = "Conversation ended.";
  }
});