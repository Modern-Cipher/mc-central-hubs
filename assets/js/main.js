document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  // Initialize AOS
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 100
  });

  // --- START: CONFIGURATION ---
  const BUY_SUBSCRIPTION_PAGE_URL = "assets/views/pricing.html"; 
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwp8Zrpgi4pMXFWHgobLYqrx1e8wZzdBDcaJSon1JTd5bB8Y2crIeMvSTZqvZ3FheBc/exec";
  const TOTAL_STORAGE_GB = 15;
  
  // --- LOCAL DATA (BASE STRUCTURE WITH DYNAMIC COLORS) ---
  let brands = [
    { 
      id: "HUBS141289", 
      image: "assets/images/rakjard.png", 
      filter: "rakjard", 
      buttonLabel: "RAKJARD 1",
      colors: {
        primary: '#1d9b03',
        hoverGradient: 'linear-gradient(to right, #1d9b03, #ffc107)'
      }
    },
    { 
      id: "HUBS717566", 
      image: "assets/images/ronshe-dragons.png", 
      filter: "ronshe-dragons", 
      buttonLabel: "RONSHE DRAGONS",
      colors: {
        primary: '#800000',
        hoverGradient: 'linear-gradient(to right, #800000, #cdaa36)'
      }
    },
    { 
      id: "HUBS915173", 
      image: "assets/images/dragon-angels.png", 
      filter: "dragon-angels", 
      buttonLabel: "DRAGON ANGELS",
      colors: {
        primary: '#a9862a',
        hoverGradient: 'linear-gradient(45deg, #cdaa36, #fcf6ba, #cdaa36)',
        hoverTextColor: '#3d2b03'
      }
    },
    { 
      id: "HUBS597995", 
      image: "assets/images/chicha-crush.png", 
      filter: "chicha-crush", 
      buttonLabel: "CHICHA CRUSH",
      colors: {
        primary: '#ffc107',
        hoverGradient: 'linear-gradient(to right, #fd7e14, #ffc107)'
      }
    },
    { 
      id: "HUBS567705", 
      image: "assets/images/flavoMix.png", 
      filter: "flavomix", 
      buttonLabel: "FLAVO MIX PH",
      colors: {
        primary: '#57200b',
        hoverGradient: 'linear-gradient(to right, #57200b, rgb(133, 71, 47))'
      }
    },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
    { id: "", image: "assets/images/folder.png", filter: "available-slot", buttonLabel: "Available Slot" },
  ];
  // --- END: LOCAL DATA ---

  const brandContainer = document.getElementById("brand-container");
  let iso;

  function initializePage(syncedBrands) {
    if (!brandContainer) return;
    brandContainer.innerHTML = ''; 

    syncedBrands.forEach((brand, index) => {
      const isLocked = !brand.url;
      const cardCol = document.createElement("div");
      const driveName = brand.driveName || brand.buttonLabel;
      
      cardCol.className = `col-12 col-sm-6 col-lg-3 isotope-item ${brand.filter}`;
      cardCol.classList.add('card-initial-load');
      cardCol.style.animationDelay = `${index * 80}ms`;
      cardCol.addEventListener('animationend', () => cardCol.classList.remove('card-initial-load'), { once: true });

      const buttonIcon = isLocked ? 'fa-lock' : 'fa-external-link-alt';
      const buttonText = isLocked ? 'Unlock' : driveName;
      
      cardCol.innerHTML = `
        <div class="brand-card h-100" data-filter-name="${driveName.toLowerCase()}">
          <span class="card-brand-tag">${driveName}</span>
          <i class="fas fa-info-circle info-icon" 
             data-bs-toggle="modal" data-bs-target="#statsModal"
             data-brand-name="${driveName}"
             data-last-activity="${brand.lastActivityTimestamp || ''}"
             data-subscription-start-date="${brand.subscriptionStartDate || ''}"
             data-storage-used-raw="${brand.totalSize || '0 MB'}"
             data-subscription="${brand.subscription || 'N/A'}"
             data-days="${brand.days || 0}"></i>
          <div class="image-container">
            <div class="shimmer-placeholder"></div>
            <img src="${brand.image}" class="card-img-top loading" alt="${driveName} Logo" />
          </div>
          <div class="card-body d-flex flex-column">
            <button class="btn btn-outline-custom mt-auto ${isLocked ? "btn-locked-brand" : "btn-dynamic-color"}">
              <span class="btn-text">${buttonText}</span><i class="fas ${buttonIcon}"></i>
            </button>
          </div>
        </div>`;
      brandContainer.appendChild(cardCol);

      const button = cardCol.querySelector("button");
      
      if (!isLocked && brand.colors) {
        const originalColor = brand.colors.primary;
        const hoverGradient = brand.colors.hoverGradient;
        const hoverTextColor = brand.colors.hoverTextColor || '#fff';

        button.style.color = originalColor;
        button.style.borderColor = originalColor;

        button.addEventListener('mouseover', () => {
          button.style.color = hoverTextColor;
          button.style.backgroundImage = hoverGradient;
          button.style.borderColor = 'transparent';
        });

        button.addEventListener('mouseout', () => {
          button.style.color = originalColor;
          button.style.backgroundImage = '';
          button.style.borderColor = originalColor;
        });
      }
      
      const imageEl = cardCol.querySelector('.card-img-top');
      imageEl.onload = () => { imageEl.previousElementSibling.style.opacity = '0'; imageEl.classList.remove('loading'); };
      imageEl.onerror = () => { imageEl.src = 'assets/images/folder.png'; imageEl.previousElementSibling.style.opacity = '0'; imageEl.classList.remove('loading'); };

      button.addEventListener("click", (e) => {
        e.preventDefault();
        if (isLocked) {
          Swal.fire({
            icon: 'info', title: 'Unlock Slot', text: 'Purchase a subscription to unlock and use this slot.',
            showCancelButton: true, confirmButtonText: 'View Plans', confirmButtonColor: '#0d6efd', cancelButtonText: 'Later',
          }).then((result) => { 
            if (result.isConfirmed) window.location.href = BUY_SUBSCRIPTION_PAGE_URL; 
          });
        } else {
          window.open(brand.url, "_blank");
        }
      });
    });

    iso = new Isotope(brandContainer, { itemSelector: ".isotope-item", layoutMode: "fitRows" });
  }

  function renderSkeletonLoaders() {
    if (!brandContainer) return;
    brandContainer.innerHTML = '';

    for (let i = 0; i < 8; i++) {
      const skeletonCol = document.createElement("div");
      skeletonCol.className = `col-12 col-sm-6 col-lg-3 isotope-item`;
      skeletonCol.innerHTML = `
        <div class="brand-card h-100 skeleton-card">
          <div class="skeleton skeleton-tag"></div>
          <div class="image-container">
            <div class="shimmer-placeholder"></div>
          </div>
          <div class="card-body d-flex flex-column">
            <div class="skeleton skeleton-button mt-auto"></div>
          </div>
        </div>`;
      brandContainer.appendChild(skeletonCol);
    }
  }

  async function syncData() {
    if (!brandContainer) return;
    renderSkeletonLoaders();

    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error(`Network Error: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const sheetDataMap = new Map(result.data.map(item => [item.id, item]));

      const syncedBrands = brands.map(localBrand => {
        if (localBrand.id && sheetDataMap.has(localBrand.id)) {
          const sheetBrand = sheetDataMap.get(localBrand.id);
          const isSubscriptionActive = sheetBrand.subscription && sheetBrand.subscription !== 'Pending';
          return { ...localBrand, ...sheetBrand, url: isSubscriptionActive ? sheetBrand.sharedLink : "" };
        }
        return { ...localBrand, url: "" }; 
      });

      initializePage(syncedBrands);

    } catch (error) {
      brandContainer.innerHTML = `<p class="text-center text-danger w-100">Data Sync Failed: ${error.message}. Using local data only.</p>`;
      initializePage(brands.map(b => ({...b, url: b.id ? "" : ""})));
    }
  }

  const statsModal = document.getElementById('statsModal');
  if (statsModal) {
    statsModal.addEventListener('show.bs.modal', (event) => {
      const icon = event.relatedTarget;
      const brandName = icon.getAttribute('data-brand-name');
      const lastActivityStr = icon.getAttribute('data-last-activity');
      const subStartDateStr = icon.getAttribute('data-subscription-start-date');
      const storageUsedRaw = icon.getAttribute('data-storage-used-raw');
      const subscription = icon.getAttribute('data-subscription');
      const totalDuration = parseInt(icon.getAttribute('data-days'), 10);
      
      const today = new Date();
      let daysRemainingText = "";
      
      if (subStartDateStr && totalDuration > 0) {
        const startDate = new Date(subStartDateStr);
        const timeDiff = today.getTime() - startDate.getTime();
        const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
        const daysRemaining = Math.max(0, totalDuration - daysPassed);
        if (daysRemaining > 0) {
          daysRemainingText = `You have <strong>${daysRemaining} days</strong> remaining in your <strong>${subscription}</strong> subscription.`;
        } else {
          daysRemainingText = `Your <strong>${subscription}</strong> subscription has expired.`;
        }
      } else if (subscription !== 'N/A' && subscription !== 'Pending' && subscription) {
        daysRemainingText = `This is a lifetime <strong>${subscription}</strong> subscription.`;
      } else {
        daysRemainingText = `This slot is inactive. Unlock it to get a subscription.`;
      }
      
      const [storageValue, storageUnit] = storageUsedRaw.split(" ");
      const storageUsedNum = parseFloat(storageValue) || 0;
      let storageUsedGB = (storageUnit && storageUnit.toUpperCase() === 'MB') ? storageUsedNum / 1024 : storageUsedNum;
      
      const storagePercentage = (storageUsedGB / TOTAL_STORAGE_GB) * 100;
      let finalWidth = storagePercentage;
      if (storageUsedGB > 0 && storagePercentage < 3) {
        finalWidth = 3; 
      }

      statsModal.querySelector('#statsModalBrandName').textContent = `${brandName} Stats`;
      statsModal.querySelector('#statsModalTrialInfo').innerHTML = daysRemainingText;
      
      const lastUpdateEl = statsModal.querySelector('#statsModalLastUpdate');
      if(lastUpdateEl) lastUpdateEl.remove();
      if(lastActivityStr) {
        statsModal.querySelector('.modal-body').insertAdjacentHTML('beforeend', `<small class="text-muted mt-3 d-block" id="statsModalLastUpdate">Last Activity: ${new Date(lastActivityStr).toLocaleString()}</small>`);
      }
      
      const progressBar = statsModal.querySelector('#statsModalProgressBar');
      progressBar.style.width = `${finalWidth}%`;
      progressBar.textContent = storageUsedRaw;
      statsModal.querySelector('#statsModalStorageText').textContent = `${storageUsedRaw} used of ${TOTAL_STORAGE_GB} GB`;
    });
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (iso) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        iso.arrange({
          filter: (itemElem) => {
            const brandTag = itemElem.querySelector(".card-brand-tag");
            return brandTag ? brandTag.textContent.toLowerCase().includes(searchTerm) : false;
          }
        });
      }
    });
  }
  
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
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));

  syncData();
});