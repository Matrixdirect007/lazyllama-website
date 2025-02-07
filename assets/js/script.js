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

// Donation integration: Use custom donation input if provided, else use preset radio buttons.
const donateButton = document.getElementById('donateButton');
  
if (donateButton) {
  donateButton.addEventListener('click', async () => {
    // Check if the Ethereum provider (e.g., MetaMask) is available
    if (!window.ethereum) {
      alert("Ethereum wallet is not available. Please install MetaMask.");
      return;
    }

    // Get connected accounts
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      alert("Please connect your wallet first.");
      return;
    }
    const fromAddress = accounts[0];

    // Determine donation amount from either custom input or radio buttons
    let donationAmountEth = null;
    const customDonationInput = document.getElementById('customDonation');
    if (customDonationInput && customDonationInput.value.trim() !== "") {
      donationAmountEth = customDonationInput.value.trim();
    } else {
      const donationRadios = document.getElementsByName('donationAmount');
      // Use a for loop to check for the checked radio button
      for (const radio of donationRadios) {
        if (radio.checked) {
          donationAmountEth = radio.value;
          break;
        }
      }
    }

    // Validate the donation amount
    if (!donationAmountEth || isNaN(donationAmountEth) || parseFloat(donationAmountEth) <= 0) {
      alert("Please enter a valid donation amount in ETH.");
      return;
    }

    try {
      // Convert the donation amount from ETH to Wei using ethers.js
      // This handles large numbers and avoids floating-point precision issues.
      const donationAmountWei = ethers.utils.parseUnits(donationAmountEth, 'ether');
      
      // Define the donation address (ensure this is the correct mainnet address)
      const donationAddress = "0xc0C2196bBa2ac923564DBa39eb61A170d66620b1";

      // Prepare the transaction parameters.
      // Note: For a simple ETH transfer, 21,000 gas is typically sufficient.
      const txParams = {
        from: fromAddress,
        to: donationAddress,
        // Convert the BigNumber to a hexadecimal string (if required by the provider)
        value: donationAmountWei.toHexString(),
        gas: '21000'
      };

      // Request the Ethereum provider to send the transaction.
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      alert(`Donation successful! Your ${donationAmountEth} ETH donation is fueling the nap revolution. Transaction hash: ${txHash}`);
    } catch (error) {
      console.error("Donation transaction failed:", error);
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



