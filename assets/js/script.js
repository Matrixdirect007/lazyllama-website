document.addEventListener('DOMContentLoaded', () => {
  let walletConnected = false;
  let selectedRating = null;

  // Visitor Counter: Fetch visitor count from CountAPI.
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

  // Menu Toggle (Mobile Navigation using the word "Menu")
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
  }

  // Navigation: Smooth scrolling and active state.
  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      // Remove active class from all sections and nav links
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('.nav-links li a').forEach(navLink => navLink.classList.remove('active'));
      
      const target = this.getAttribute('href');
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
      this.classList.add('active');
      
      // Close mobile nav if open.
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  // "More" Section Buttons: Act like nav links.
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

  // RSVP Buttons: Open mail client with prefilled details.
  document.querySelectorAll('.rsvpButton').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = encodeURIComponent("RSVP for Event");
      const body = encodeURIComponent("Hi LazyLlama Team,\n\nI would like to RSVP for your event.\n\nThanks,\n[Your Name]");
      window.location.href = "mailto:lazyllama@lazyllama.co?subject=" + subject + "&body=" + body;
    });
  });

  // Under Development Buttons: Show a custom modal popup.
  const underDevButtons = ['startNappingButton', 'getChillCurrencyButton', 'startStakingButton', 'shopNowButton'];
  underDevButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        showModal("Under development. Stay tuned for updates!");
      });
    }
  });

  // Function to show modal popup with a custom message
  function showModal(message) {
    const modal = document.getElementById('modalPopup');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.innerText = message;
    modal.classList.remove('hidden');
  }

  // Close modal when the close button is clicked
  const modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('modalPopup').classList.add('hidden');
    });
  }

  // FAQ Toggle Functionality.
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

  // FAQ Search Functionality
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const questionText = item.querySelector('.faq-question').innerText.toLowerCase();
        if (questionText.includes(searchTerm)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // Tab functionality for How It Works section
  const tabButtons = document.querySelectorAll('.tab-buttons li');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all tab buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Get tab data attribute
      const tabId = this.getAttribute('data-tab');
      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      // Show corresponding tab content
      const activeContent = document.getElementById(tabId);
      if(activeContent) {
          activeContent.classList.add('active');
      }
    });
  });

  // Back to Top Button: Show when scrolled down.
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

  // Wallet Connection for "Join Now!" Button.
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]);
        alert("Wallet connected successfully!");
        walletConnected = true;
        // Show donation and feedback sections.
        document.getElementById('donationSection').classList.remove('hidden');
        document.getElementById('feedbackSection').style.display = 'block';
        // Update dashboard (within More section) with dummy nap stats
        updateDashboard();
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

  // Dummy Dashboard Update (simulate blockchain integration)
  function updateDashboard() {
    // In a real app, replace with actual API calls or blockchain queries.
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

  // ENS Resolution Helper (Optional)
  async function resolveENS(ensName) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const resolvedAddress = await provider.resolveName(ensName);
      console.log("Resolved ENS Address:", resolvedAddress);
      return resolvedAddress;
    } catch (error) {
      console.error("ENS resolution failed:", error);
      return null;
    }
  }

  // Donation Integration: Handle donation submission using ethers.js.
  const donateButton = document.getElementById('donateButton');
  if (donateButton) {
    donateButton.addEventListener('click', async () => {
      if (!walletConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      if (typeof ethers === 'undefined') {
        alert("Ethers.js library is not loaded. Please check your network connection.");
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

  // Contact Form Submission: Construct a mailto link.
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
      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message
      );
      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
    });
  }

  // Feedback Submission: Handle thumbs up/down and comment.
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

