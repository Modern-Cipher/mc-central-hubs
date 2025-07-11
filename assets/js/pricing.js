document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  // Initialize AOS
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 100
  });

  // Social Links
  const socialLinks = {
    "facebook-link": "https://www.facebook.com/moderncipher/",
    "tiktok-link": "https://www.tiktok.com/@modern_cipher",
    "messenger-link": "https://m.me/moderncipher",
    "telegram-link": "https://t.me/modern_cipher",
    "viber-link": "viber://add?number=639764244902",
    "gmail-link": "mailto:mdctechservices@gmail.com",
    "website-link": "https://modern-cipher.github.io/services/",
  };

  Object.keys(socialLinks).forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        const url = socialLinks[id];
        if (url.startsWith("mailto:") || url.startsWith("viber:")) {
          window.location.href = url;
        } else {
          window.open(url, "_blank");
        }
      });
    }
  });

  // Tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

  // Pricing Button Handlers
  const pricingButtons = document.querySelectorAll(".pricing-card .btn");
  const freeTrialModal = new bootstrap.Modal(document.getElementById("freeTrialModal"));
  const paidPlanModal = new bootstrap.Modal(document.getElementById("paidPlanModal"));
  const selectedPlanName = document.getElementById("selectedPlanName");
  const qrCodeStep = document.getElementById("qrCodeStep");
  const formStep = document.getElementById("formStep");
  const nextToFormButton = document.getElementById("nextToForm");

  pricingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.getAttribute("data-plan");
      if (plan === "Free Trial") {
        freeTrialModal.show();
      } else {
        selectedPlanName.textContent = plan;
        qrCodeStep.style.display = "block";
        formStep.style.display = "none";
        paidPlanModal.show();
      }
    });
  });

  // Switch to Form Step in Paid Plan Modal
  nextToFormButton.addEventListener("click", () => {
    qrCodeStep.style.display = "none";
    formStep.style.display = "block";
  });

  // Free Trial Form Submission
  const freeTrialForm = document.getElementById("freeTrialForm");
  freeTrialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("freeEmail").value;
    const contact = document.getElementById("freeContact").value;
    const message = document.getElementById("freeMessage").value;

    const emailSubject = encodeURIComponent("Free Trial Request - Central Hubs");
    const emailBody = encodeURIComponent(
      `Plan: Free Trial\nEmail: ${email}\nContact Number: ${contact}\nMessage: ${message}`
    );
    const mailtoLink = `mailto:mdctechservices@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    window.location.href = mailtoLink;

    Swal.fire({
      icon: "success",
      title: "Request Submitted",
      text: "Your request has been sent. Please check your email client to complete the submission.",
    }).then(() => {
      freeTrialModal.hide();
      freeTrialForm.reset();
    });
  });

  // Paid Plan Form Submission
  const paidPlanForm = document.getElementById("paidPlanForm");
  paidPlanForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("paidEmail").value;
    const contact = document.getElementById("paidContact").value;
    const message = document.getElementById("paidMessage").value;
    const screenshot = document.getElementById("paymentScreenshot").files[0];
    const plan = selectedPlanName.textContent;

    const emailSubject = encodeURIComponent(`${plan} Plan Payment - Central Hubs`);
    let emailBody = `Plan: ${plan}\nEmail: ${email}\nContact Number: ${contact}\nMessage: ${message}\n\nPlease find the payment screenshot attached.`;

    if (screenshot) {
      emailBody += `\n\nNote: Screenshot is attached (Filename: ${screenshot.name}).`;
    } else {
      emailBody += `\n\nNote: No screenshot was attached.`;
    }

    const emailBodyEncoded = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:mdctechservices@gmail.com?subject=${emailSubject}&body=${emailBodyEncoded}`;

    window.location.href = mailtoLink;

    Swal.fire({
      icon: "success",
      title: "Payment Details Submitted",
      text: "Your payment details have been sent. Please attach the screenshot in your email client. We'll set up your slot within 24 hours.",
    }).then(() => {
      paidPlanModal.hide();
      paidPlanForm.reset();
    });
  });
});