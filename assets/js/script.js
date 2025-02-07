document.addEventListener('DOMContentLoaded', () => {
  let walletConnected = false;
  let selectedRating = null;

  // Visitor Counter
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

  // Hamburger Menu Toggle for Mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Navigation: Smooth scroll and update active section for main nav-links
  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Remove 'active' class from all sections
      document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
      // Remove 'active' class from all nav links
      document.querySelectorAll('.nav-links li a').forEach(navLink => navLink.classList.remove('active'));

      const target = this.getAttribute('href'); // e.g. "#more", "#nap-to-earn", etc.
      const targetSection = document.querySelector(target);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Mark this nav link as active
      this.classList.add('active');
      // Hide mobile nav if open
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
      }
    });
  });

  // Additional binding for "More" section buttons (outside main nav)
  document.querySelectorAll('#more a.cta-button').forEach(link => {
    link.addEventListener('click', function(e) {
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

  // Bind RSVP Now buttons to open a mailto link to lazyllama@lazyllama.co
  document.querySelectorAll('.rsvpButton').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = encodeURIComponent("RSVP for Event");
      const body = encodeURIComponent("Hi LazyLlama Team,\n\nI would like to RSVP for your event.\n\nThanks,\n[Your Name]");
      window.location.href = "mailto:lazyllama@lazyllama.co?subject=" + subject + "&body=" + body;
    });
  });

  // Bind "Under Development" messages to primary action buttons
  const underDevButtons = [
    'startNappingButton',
    'getChillCurrencyButton',
    'startStakingButton',
    'shopNowButton'
  ];
  underDevButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        alert("Under development. Stay tuned for updates!");
      });
    }
  });

  // FAQ Toggle Functionality
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Back to Top Button Functionality
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

  // Wallet Connection for "Join Now!" Button with Donation Section Reveal
  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected account:", accounts[0]); // For debugging only
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

  // Helper: Resolve ENS Name
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

  // Donation Integration: Use custom donation input if provided, else use preset radio buttons
  const donateButton = document.getElementById('donateButton');
  if (donateButton) {
    donateButton.addEventListener('click', async () => {
      if (!walletConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      // Check for custom donation input
      let donationAmountEth = parseFloat(document.getElementById('customDonation')?.value) || null;
      // If no custom donation provided, check preset radio buttons
      if (!donationAmountEth) {
        const donationRadios = document.getElementsByName('donationAmount');
        donationRadios.forEach(radio => {
          if (radio.checked) donationAmountEth = parseFloat(radio.value);
        });
      }
      if (!donationAmountEth || donationAmountEth <= 0) {
        alert("Please enter a valid donation amount in ETH.");
        return;
      }
      try {
        // Convert ETH to Wei using ethers.js
        const donationAmountWei = ethers.utils.parseEther(donationAmountEth.toString());
        
        // Resolve the ENS name for LazyLlama wallet
        const donationAddress = await resolveENS("lazyllama.eth");
        if (!donationAddress) {
          alert("Failed to resolve ENS name. Please try again later.");
          return;
        }
        
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const fromAddress = accounts[0];
        const txParams = {
          from: fromAddress,
          to: donationAddress,
          value: donationAmountWei.toHexString(), // Convert to hex string for MetaMask
          gas: '21000'
        };
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
        alert(`Donation successful! Your ${donationAmountEth} ETH donation is fueling the nap revolution. Transaction hash: ${txHash}`);
      } catch (error) {
        console.error(error);
        alert("Donation failed: " + error.message);
      }
    });
  }

  // Contact Form: Build a mailto link on submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const inquiryType = document.getElementById('inquiryType').value;
      const message = document.getElementById('message').value;
      let recipient = "info@lazyllama.co"; // Default: General Inquiries
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

  // Feedback: Thumbs up/down and comment submission
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
