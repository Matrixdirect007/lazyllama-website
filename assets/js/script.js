document.addEventListener('DOMContentLoaded', () => {
  let walletConnected = false;
  let selectedRating = null;

  // Visitor Counter
  fetch('https://api.countapi.xyz/hit/lazyllamademo.com/visits')
    .then(res => res.json())
    .then(data => {
      const counter = document.getElementById('visitCounter');
      if (counter) counter.innerText = data.value;
    })
    .catch(err => {
      console.error("Error fetching visitor count:", err);
      const counter = document.getElementById('visitCounter');
      if (counter) counter.innerText = 'N/A';
    });

  // Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
  }

  // Smooth Scrolling Navigation
  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('.nav-links li a').forEach(navLink => navLink.classList.remove('active'));
      const target = this.getAttribute('href');
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
      this.classList.add('active');
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  // "More" Section Buttons (for links within More tabs)
  document.querySelectorAll('#more a.cta-button').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      const target = this.getAttribute('href');
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // RSVP Buttons
  document.querySelectorAll('.rsvpButton').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = encodeURIComponent("RSVP for Event");
      const body = encodeURIComponent("Hi LazyLlama Team,\n\nI would like to RSVP for your event.\n\nThanks,\n[Your Name]");
      window.location.href = "mailto:lazyllama@lazyllama.co?subject=" + subject + "&body=" + body;
    });
  });

  // Under Development Buttons
  const underDevButtons = ['startNappingButton', 'getChillCurrencyButton', 'startStakingButton', 'shopNowButton'];
  underDevButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        showModal("Under development. Stay tuned for updates!");
      });
    }
  });

  // Show Modal Popup for Under Development messages
  function showModal(message) {
    const modal = document.getElementById('modalPopup');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerText = message;
    modal.classList.remove('hidden');
  }

  // Close Modal Popup
  const modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('modalPopup').classList.add('hidden');
    });
  }

  // FAQ Toggle
  document.querySelectorAll('.faq-item').forEach(item => {
    const toggleFaq = () => {
      const isActive = item.classList.toggle('active');
      item.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    };
    item.addEventListener('click', toggleFaq);
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleFaq();
      }
    });
  });

  // FAQ Search
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const questionText = item.querySelector('.faq-question').innerText.toLowerCase();
        item.style.display = questionText.includes(searchTerm) ? "block" : "none";
      });
    });
  }

  // Tab Functionality for How It Works section
  const tabButtons = document.querySelectorAll('.tab-buttons li');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      tabContents.forEach(content => content.classList.remove('active'));
      const activeContent = document.getElementById(tabId);
      if(activeContent) {
          activeContent.classList.add('active');
      }
    });
  });

  // Tab Functionality for More section (Reworked Like How It Works)
  const moreTabButtons = document.querySelectorAll('.more-tabs .tab-buttons li');
  const moreTabContents = document.querySelectorAll('.more-tabs .tab-content');
  moreTabButtons.forEach(button => {
    button.addEventListener('click', function() {
      moreTabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      moreTabContents.forEach(content => content.classList.remove('active'));
      const activeContent = document.getElementById(tabId);
      if(activeContent) {
          activeContent.classList.add('active');
      }
    });
  });

  // Back to Top Button
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

  // Wallet Connection for "Join Now!" Button
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]);
        alert("Wallet connected successfully!");
        walletConnected = true;
        const donationSection = document.getElementById('donationSection');
        if (donationSection) {
          donationSection.style.display = 'block';
        }
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

  // Donation Integration
  const donateButton = document.getElementById('donateButton');
  if (donateButton) {
    donateButton.addEventListener('click', async () => {
      if (!walletConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      if (typeof ethers === 'undefined') {
        alert("Ethers.js library is not loaded. Please check your network connection and script inclusion.");
        return;
      }
      let donationAmountEth = parseFloat(document.getElementById('customDonation')?.value) || null;
      if (!donationAmountEth) {
        const donationRadios = document.getElementsByName('donationAmount');
        Array.from(donationRadios).forEach(radio => {
          if (radio.checked) donationAmountEth = parseFloat(radio.value);
        });
      }
      if (!donationAmountEth || donationAmountEth <= 0) {
        alert("Please enter a valid donation amount in ETH.");
        return;
      }
      try {
        const donationAmountWei = ethers.utils.parseEther(donationAmountEth.toString());
        const donationAddress = "0xc0C2196bBa2ac923564DBa39eb61A170d66620b1";
        if (!donationAddress) {
          alert("Failed to resolve donation address. Please try again later.");
          return;
        }
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const fromAddress = accounts[0];
        const txParams = {
          from: fromAddress,
          to: donationAddress,
          value: donationAmountWei.toHexString(),
          gas: ethers.utils.hexlify(21000)
        };
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
        alert(`Donation successful! Your ${donationAmountEth} ETH donation is fueling the nap revolution. Transaction hash: ${txHash}`);
      } catch (error) {
        console.error("Donation error:", error);
        alert("Donation failed: " + error.message);
      }
    });
  }

  // Dummy Dashboard Update
  function updateDashboard() {
    const napStats = document.getElementById('napStats');
    const dummyData = {
      totalNaps: 42,
      chillaxiumEarned: 10.5,
      averageNapDuration: "45 minutes"
    };
    napStats.innerHTML = `
      Total Naps: ${dummyData.totalNaps}<br>
      Chillaxium Earned: ${dummyData.chillaxiumEarned}<br>
      Average Nap Duration: ${dummyData.averageNapDuration}
    `;
  }

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const inquiryType = document.getElementById('inquiryType').value;
      const message = document.getElementById('message').value;
      let recipient = "info@lazyllama.co";
      if (inquiryType === "support") {
        recipient = "lazyllama@lazyllama.co";
      } else if (inquiryType === "sales") {
        recipient = "chillbert@lazyllama.co";
      }
      const subject = encodeURIComponent("LazyLlama Inquiry (" + inquiryType + ")");
      const body = encodeURIComponent("Name: " + name + "\n" + "Email: " + email + "\n\n" + message);
      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
    });
  }

  // Feedback Submission
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

      // High-five overlay animation
      const highFiveOverlay = document.getElementById('highFiveOverlay');
      highFiveOverlay.classList.remove('hidden');
      setTimeout(() => {
        highFiveOverlay.classList.add('hidden');
      }, 2000);
    });
  }

  // Dynamic Time-Based Greeting
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) {
    const now = new Date();
    const hour = now.getHours();
    let greetingText = "";
    if (hour < 12) {
      greetingText = "Good Morning, Beautiful!";
    } else if (hour < 18) {
      greetingText = "Good Afternoon, Beautiful!";
    } else {
      greetingText = "Good Evening, Beautiful!";
    }
    greetingEl.textContent = greetingText;
  }

  // Disclaimer Modal: Show disclaimer popup when clicking disclaimer link
  const disclaimerLink = document.getElementById('disclaimerLink');
  const disclaimerModal = document.getElementById('disclaimerModal');
  const disclaimerClose = document.getElementById('disclaimerClose');
  if (disclaimerLink && disclaimerModal && disclaimerClose) {
    disclaimerLink.addEventListener('click', (e) => {
      e.preventDefault();
      disclaimerModal.classList.remove('hidden');
    });
    disclaimerClose.addEventListener('click', () => {
      disclaimerModal.classList.add('hidden');
    });
  }
});

