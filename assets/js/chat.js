  const textarea = document.getElementById('message-1');
  
  function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  }
  
  textarea.addEventListener('input', autoResize);
  
  textarea.addEventListener('focus', autoResize);
  textarea.addEventListener('change', autoResize);