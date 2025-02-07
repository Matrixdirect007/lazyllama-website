<!-- Make sure to include ethers.js in your HTML head or before this script -->
<!-- <script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
  let walletConnected = false;
  let selectedRating = null;

  // Visitor counter
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

  // FAQ toggle functionality
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Back to Top button functionality
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

  // Wallet connection for "Join Now!" button with donation section reveal
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

  // Donation integration: Use custom donation input if provided, else use preset radio buttons
  const donateButton = document.getElementById('donateButton');
  if (donateButton) {
    donateButton.addEventListener('click', async () => {
      if (!walletConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      // Check for custom donation input
      const customDonationInput = document.getElementById('customDonation');
      let donationAmountEth = null;
      if (customDonationInput && customDonationInput.value) {
        donationAmountEth = customDonationInput.value; // use as string
      }
      // If no custom donation provided, check preset radio buttons
      if (!donationAmountEth) {
        const donationRadios = document.getElementsByName('donationAmount');
        donationRadios.forEach(radio => {
          if (radio.checked) {
            donationAmountEth = radio.value; // use as string
          }
        });
      }
      if (!donationAmountEth || parseFloat(donationAmountEth) <= 0) {
        alert("Please enter a valid donation amount in ETH.");
        return;
      }
      try {
        // Ensure ethers.js is available
        if (typeof ethers === 'undefined') {
          alert("Ethers.js is not available. Please include ethers.js in your project.");
          return;
        }
        // Convert donation amount in ETH (as string) to Wei using ethers.js utility
        const donationAmountWei = ethers.utils.parseEther(donationAmountEth.toString());
        
        const donationAddress = "0xc0C2196bBa2ac923564DBa39eb61A170d66620b1"; // ENS domain
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const fromAddress = accounts[0];
        const txParams = {
          from: fromAddress,
          to: donationAddress,
          // Convert the BigNumber to a hex string so that it is handled correctly in the transaction
          value: donationAmountWei.toHexString(),
          gas: '21000'
        };
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
        alert("Donation successful! Your " + donationAmountEth + " ETH donation is fueling the nap revolution. Transaction hash: " + txHash);
      } catch (error) {
        console.error(error);
        alert("Donation failed: " + error.message);
      }
    });
  }

  // Contact form: Build a mailto link on submit
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
      const mailtoLink = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
      window.location.href = mailtoLink;
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
</script>
