document.addEventListener('DOMContentLoaded', () => {
  // Global flags for wallet connection and feedback rating
  let walletConnected = false;
  let selectedRating = null;
  
  // Update visitor counter using CountAPI
  fetch('https://api.countapi.xyz/hit/lazyllamademo.com/visits')
    .then(res => res.json())
    .then(data => {
      const counter = document.getElementById('visitCounter');
      if (counter) {
        counter.innerText = data.value;
      }
    })
    .catch(err => {
      console.error(err);
      const counter = document.getElementById('visitCounter');
      if (counter) {
        counter.innerText = 'N/A';
      }
    });
  
  // Hamburger menu toggle for mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Navigation: Show selected section on click
  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      const target = this.getAttribute('href');
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });
  
  // CTA Buttons in More section navigate to respective sections
  document.querySelectorAll('#more a.cta-button').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      const target = this.getAttribute('href');
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // FAQ toggle functionality
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
  
  // Back to top button functionality
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Wallet connection for "Join Now!" button
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]);
        alert("Wallet connected: " + accounts[0]);
        walletConnected = true;
        const feedbackSection = document.getElementById('feedbackSection');
        if (feedbackSection) {
          feedbackSection.style.display = 'block';
        }
      } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Connection request rejected or failed.");
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to join the revolution.");
    }
  }
  const joinWalletButton = document.getElementById('joinWalletButton');
  if (joinWalletButton) {
    joinWalletButton.addEventListener('click', connectWallet);
  }
  
  // Extra CTA Buttons – Popup messages
  const startNappingButton = document.getElementById('startNappingButton');
  if (startNappingButton) {
    startNappingButton.addEventListener('click', () => {
      alert("Under Development");
    });
  }
  const getChillCurrencyButton = document.getElementById('getChillCurrencyButton');
  if (getChillCurrencyButton) {
    getChillCurrencyButton.addEventListener('click', () => {
      alert("Coming Soon");
    });
  }
  const startStakingButton = document.getElementById('startStakingButton');
  if (startStakingButton) {
    startStakingButton.addEventListener('click', () => {
      alert("Coming Soon");
    });
  }
  const shopNowButton = document.getElementById('shopNowButton');
  if (shopNowButton) {
    shopNowButton.addEventListener('click', () => {
      alert("Coming Soon");
    });
  }
  
  // RSVP Buttons: Navigate to the Contact section
  document.querySelectorAll('.rsvpButton').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  
  // Feedback: Thumbs Up/Down and Comment Submission
  const thumbsUp = document.getElementById('thumbsUp');
  const thumbsDown = document.getElementById('thumbsDown');
  const submitFeedback = document.getElementById('submitFeedback');
  
  if (thumbsUp && thumbsDown) {
    thumbsUp.addEventListener('click', () => {
      selectedRating = 'up';
      thumbsUp.classList.add('selected');
      thumbsDown.classList.remove('selected');
      thumbsUp.setAttribute('aria-pressed', 'true');
      thumbsDown.setAttribute('aria-pressed', 'false');
    });
    thumbsDown.addEventListener('click', () => {
      selectedRating = 'down';
      thumbsDown.classList.add('selected');
      thumbsUp.classList.remove('selected');
      thumbsDown.setAttribute('aria-pressed', 'true');
      thumbsUp.setAttribute('aria-pressed', 'false');
    });
  }
  
  if (submitFeedback) {
    submitFeedback.addEventListener('click', () => {
      if (!walletConnected) {
        alert('Please connect your wallet to leave feedback.');
        return;
      }
      const comment = document.getElementById('comment').value;
      if (!selectedRating) {
        alert('Please select thumbs up or thumbs down.');
        return;
      }
      if (!comment) {
        alert('Please enter a comment.');
        return;
      }
      alert('Feedback submitted!\nRating: ' + (selectedRating === 'up' ? '👍' : '👎') + '\nComment: ' + comment);
      document.getElementById('comment').value = '';
      selectedRating = null;
      thumbsUp.classList.remove('selected');
      thumbsDown.classList.remove('selected');
      thumbsUp.setAttribute('aria-pressed', 'false');
      thumbsDown.setAttribute('aria-pressed', 'false');
    });
  }
});
