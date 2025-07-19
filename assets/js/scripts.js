// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeLoading()
  initializeNavigation()
  initializeCarousel()
  initializeScrollEffects()
  initializeAnimations()
  initializeProductCards()
  initializeCart()
  initializeMobileMenu()
  initializeProductDetail()
  initializeProductDetailCart() // Add this line
  initializeContact()
  initializeZoom()
  initializeSearch()
  initializeCategoryNavigation()
  initializeCategoryFilter()
})

// Loading Screen
function initializeLoading() {
  const loadingScreen = document.getElementById("loading-screen")

  if (loadingScreen) {
    // Hide loading screen after 2.5 seconds
    setTimeout(() => {
      loadingScreen.classList.add("hidden")

      // Remove loading screen from DOM after animation completes
      setTimeout(() => {
        loadingScreen.remove()
      }, 500)
    }, 2500)
  }
}

// Navigation
function initializeNavigation() {
  const header = document.querySelector(".header")
  const navLinks = document.querySelectorAll(".nav-link")

  // Header scroll effect
  window.addEventListener(
    "scroll",
    debounce(() => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }, 10),
  )

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")

      // Only prevent default for anchor links
      if (href.startsWith("#")) {
        e.preventDefault()

        const targetSection = document.querySelector(href)

        if (targetSection) {
          const headerHeight = header.offsetHeight
          const targetPosition = targetSection.offsetTop - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Update active nav link
          updateActiveNavLink(link)
        }
      }
    })
  })

  // Update active nav link on scroll
  window.addEventListener(
    "scroll",
    debounce(() => {
      updateActiveNavOnScroll()
    }, 100),
  )
}

function updateActiveNavLink(activeLink) {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => link.classList.remove("active"))
  activeLink.classList.add("active")
}

function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")
  const headerHeight = document.querySelector(".header").offsetHeight

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active")
    }
  })
}

// Category Filter
function initializeCategoryFilter() {
  const filterBtns = document.querySelectorAll(".category-filter-btn")
  const productCards = document.querySelectorAll(".product-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category

      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filter products
      productCards.forEach((card) => {
        const productCategory = card.dataset.category

        if (category === "all" || productCategory === category) {
          card.style.display = "block"
          card.style.animation = "fadeIn 0.5s ease"
        } else {
          card.style.display = "none"
        }
      })

      // Show notification
      const categoryName = category === "all" ? "All Products" : btn.textContent
      window.showNotification(`Showing ${categoryName}`)
    })
  })

  // Handle URL parameters for category filtering
  const urlParams = new URLSearchParams(window.location.search)
  const categoryParam = urlParams.get("category")

  if (categoryParam) {
    const targetBtn = document.querySelector(`[data-category="${categoryParam}"]`)
    if (targetBtn) {
      targetBtn.click()
    }
  }
}

// Carousel
function initializeCarousel() {
  const slides = document.querySelectorAll(".carousel-slide")
  const indicators = document.querySelectorAll(".indicator")
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (!slides.length) return

  let currentSlide = 0
  const totalSlides = slides.length

  function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active"))
    indicators.forEach((indicator) => indicator.classList.remove("active"))

    // Add active class to current slide and indicator
    slides[index].classList.add("active")
    if (indicators[index]) {
      indicators[index].classList.add("active")
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides
    showSlide(currentSlide)
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    showSlide(currentSlide)
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide)
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide)
  }

  // Indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index
      showSlide(currentSlide)
    })
  })

  // Auto-play carousel
  setInterval(nextSlide, 5000)

  // Touch/swipe support
  let startX = 0
  let endX = 0

  const carousel = document.querySelector(".carousel-container")
  if (carousel) {
    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    carousel.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      handleSwipe()
    })

    function handleSwipe() {
      const swipeThreshold = 50
      const diff = startX - endX

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide()
        } else {
          prevSlide()
        }
      }
    }
  }
}

// Scroll Effects
function initializeScrollEffects() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-on-scroll", "animated")
      }
    })
  }, observerOptions)

  // Observe elements for scroll animations
  const animateElements = document.querySelectorAll(
    ".product-card, .feature-card, .category-card, .contact-card, .faq-item",
  )
  animateElements.forEach((el) => {
    el.classList.add("animate-on-scroll")
    observer.observe(el)
  })
}

// Animations
function initializeAnimations() {
  // Floating elements animation
  const floatingElements = document.querySelectorAll(".decorative-arch")
  floatingElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.2
    const amplitude = 10 + index * 5

    function animate() {
      const time = Date.now() * 0.001
      const y = Math.sin(time * speed) * amplitude
      const rotation = Math.sin(time * speed * 0.5) * 2

      element.style.transform = `translateY(${y}px) rotate(${rotation}deg)`
      requestAnimationFrame(animate)
    }

    animate()
  })

  // Model cards hover effect
  const modelCards = document.querySelectorAll(".model-card")
  modelCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform += " scale(1.05)"
      card.style.zIndex = 10
    })

    card.addEventListener("mouseleave", () => {
      // Reset to original transform
      const transforms = [
        "translateX(-120px) translateY(-20px) rotate(-5deg)",
        "translateX(-40px) translateY(10px) rotate(2deg)",
        "translateX(40px) translateY(-10px) rotate(-2deg)",
        "translateX(120px) translateY(20px) rotate(5deg)",
      ]

      card.style.transform = transforms[index % 4]
      card.style.zIndex = 4 - index
    })
  })
}

// Product Cards
function initializeProductCards() {
  const productCards = document.querySelectorAll(".product-card")
  const quickViewBtns = document.querySelectorAll(".quick-view-btn")
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
  const wishlistBtns = document.querySelectorAll(".wishlist-btn")
  const zoomBtns = document.querySelectorAll(".zoom-btn")

  // Add hover effects to product cards
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)"
    })

    // Click to zoom effect
    card.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        window.zoomProductCard(card)
      }
    })
  })

  // Quick view functionality
  quickViewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()

      const productCard = btn.closest(".product-card")
      const productId = productCard.dataset.product

      if (productId) {
        window.location.href = `product-detail.html?id=${productId}`
      } else {
        window.showProductModal(productCard)
      }
    })
  })

  // Add to cart functionality
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      window.addToCart(btn)
    })
  })

  // Wishlist functionality
  wishlistBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      window.toggleWishlist(btn)
    })
  })

  // Zoom functionality
  zoomBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      window.openZoomModal(btn)
    })
  })
}

function zoomProductCard(card) {
  // Create overlay
  const overlay = document.createElement("div")
  overlay.className = "zoom-overlay"
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `

  // Clone the card
  const clonedCard = card.cloneNode(true)
  clonedCard.style.cssText = `
        transform: scale(1.5);
        max-width: 400px;
        width: 90%;
        animation: zoomIn 0.3s ease;
    `

  overlay.appendChild(clonedCard)
  document.body.appendChild(overlay)

  // Show overlay
  setTimeout(() => {
    overlay.style.opacity = "1"
  }, 10)

  // Close on click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(overlay)
      }, 300)
    }
  })

  // Close on escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      overlay.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(overlay)
      }, 300)
      document.removeEventListener("keydown", handleEscape)
    }
  }

  document.addEventListener("keydown", handleEscape)
}

function showProductModal(productCard) {
  const productTitle = productCard.querySelector(".product-title").textContent
  const productPrice = productCard.querySelector(".product-price").textContent

  // Simple modal for demo
  const modal = document.createElement("div")
  modal.className = "product-modal"
  modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h3>${productTitle}</h3>
            <p class="modal-price">${productPrice}</p>
            <div class="modal-actions">
                <button class="btn btn-primary">Add to Cart</button>
                <button class="btn btn-secondary">View Details</button>
            </div>
        </div>
    `

  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `

  const modalContent = modal.querySelector(".modal-content")
  modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        position: relative;
    `

  document.body.appendChild(modal)

  // Close modal
  const closeModal = () => {
    document.body.removeChild(modal)
  }

  modal.querySelector(".modal-close").addEventListener("click", closeModal)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal()
  })
}

// Enhanced Cart Functionality
function initializeCart() {
  const cartIcon = document.querySelector(".cart-icon")
  const cartCount = document.querySelector(".cart-count")
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

  // Update cart count display
  updateCartCount()

  function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    if (cartCount) {
      cartCount.textContent = totalItems
      cartCount.style.display = totalItems > 0 ? "flex" : "none"
    }

    // Update bottom nav cart count
    const bottomCartBadge = document.querySelector(".bottom-nav .nav-badge")
    if (bottomCartBadge) {
      bottomCartBadge.textContent = totalItems
      bottomCartBadge.style.display = totalItems > 0 ? "flex" : "none"
    }
  }

  // Cart click handler - show cart modal
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      showCartModal()
    })
  }

  // Bottom nav cart click
  const bottomCartItem = document.querySelector(".bottom-nav-item:last-child")
  if (bottomCartItem) {
    bottomCartItem.addEventListener("click", () => {
      showCartModal()
    })
  }

  // Global add to cart function
  window.addToCart = function addToCart(btn) {
    const productCard = btn.closest(".product-card")
    const productTitle = productCard.querySelector(".product-title").textContent
    const productPrice = productCard.querySelector(".product-price").textContent
    const productImage = productCard.querySelector(".product-image")
    const productId = productCard.dataset.product || Date.now().toString()

    // Get background image URL
    const backgroundImage = window.getComputedStyle(productImage).backgroundImage
    const imageUrl = backgroundImage.slice(4, -1).replace(/"/g, "")

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex((item) => item.id === productId)

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1
    } else {
      cartItems.push({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: imageUrl,
        quantity: 1,
      })
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    updateCartCount()

    // Add animation to cart icon
    if (cartIcon) {
      cartIcon.style.transform = "scale(1.2)"
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)"
      }, 200)
    }

    // Show cart notification
    showCartNotification(productTitle, productPrice, imageUrl)

    // Add loading state to button
    const originalText = btn.textContent
    btn.textContent = "Added!"
    btn.style.background = "#10b981"

    setTimeout(() => {
      btn.textContent = originalText
      btn.style.background = ""
    }, 1500)
  }

  function showCartNotification(title, price, image) {
    // Remove existing notification
    const existingNotification = document.querySelector(".cart-notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    const notification = document.createElement("div")
    notification.className = "cart-notification"
    notification.innerHTML = `
      <div class="cart-notification-header">
        <div class="cart-notification-icon">
          <i class="fas fa-check"></i>
        </div>
        <div class="cart-notification-title">Added to Cart!</div>
      </div>
      <div class="cart-notification-message">${title} - ${price}</div>
      <div class="cart-notification-actions">
        <button class="cart-notification-btn view-cart-btn">View Cart</button>
        <button class="cart-notification-btn continue-shopping-btn">Continue</button>
      </div>
    `

    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Add event listeners
    notification.querySelector(".view-cart-btn").addEventListener("click", () => {
      notification.remove()
      showCartModal()
    })

    notification.querySelector(".continue-shopping-btn").addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 300)
    })

    // Auto hide after 4 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.remove("show")
        setTimeout(() => {
          notification.remove()
        }, 300)
      }
    }, 4000)
  }

  function showCartModal() {
    // Remove existing modal
    const existingModal = document.querySelector(".cart-modal")
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement("div")
    modal.className = "cart-modal"
    modal.style.display = "flex"

    const totalAmount = cartItems.reduce((sum, item) => {
      const price = Number.parseFloat(item.price.replace(/[₹,]/g, ""))
      return sum + price * item.quantity
    }, 0)

    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h3 class="cart-modal-title">Shopping Cart (${cartItems.length})</h3>
          <button class="cart-close">&times;</button>
        </div>
        
        ${
          cartItems.length === 0
            ? `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h4>Your cart is empty</h4>
            <p>Add some products to get started!</p>
          </div>
        `
            : `
          <div class="cart-items">
            ${cartItems
              .map(
                (item, index) => `
              <div class="cart-item" data-index="${index}">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                  <div class="cart-item-title">${item.title}</div>
                  <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                  <button class="cart-qty-btn minus-btn">-</button>
                  <input type="number" class="cart-qty-input" value="${item.quantity}" min="1">
                  <button class="cart-qty-btn plus-btn">+</button>
                </div>
                <button class="remove-item" data-index="${index}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="cart-total">
            <div class="cart-total-amount">Total: ₹${totalAmount.toLocaleString()}</div>
            <div class="cart-actions">
              <button class="btn btn-secondary continue-shopping">Continue Shopping</button>
              <button class="btn btn-primary checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        `
        }
      </div>
    `

    document.body.appendChild(modal)

    // Add event listeners
    modal.querySelector(".cart-close").addEventListener("click", () => {
      modal.remove()
    })

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })

    // Continue shopping
    const continueBtn = modal.querySelector(".continue-shopping")
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        modal.remove()
      })
    }

    // Checkout
    const checkoutBtn = modal.querySelector(".checkout-btn")
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        modal.remove()
        window.showNotification("Redirecting to checkout... (Demo)", "info")
      })
    }

    // Quantity controls
    modal.querySelectorAll(".minus-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity -= 1
          updateCartAndModal()
        }
      })
    })

    modal.querySelectorAll(".plus-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        cartItems[index].quantity += 1
        updateCartAndModal()
      })
    })

    // Remove items
    modal.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number.parseInt(btn.dataset.index)
        cartItems.splice(index, 1)
        updateCartAndModal()
      })
    })

    // Quantity input changes
    modal.querySelectorAll(".cart-qty-input").forEach((input, index) => {
      input.addEventListener("change", () => {
        const newQuantity = Number.parseInt(input.value)
        if (newQuantity > 0) {
          cartItems[index].quantity = newQuantity
          updateCartAndModal()
        }
      })
    })

    function updateCartAndModal() {
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      updateCartCount()
      modal.remove()
      showCartModal() // Refresh modal
    }
  }
}

// Product Detail Cart Functionality
function initializeProductDetailCart() {
  const addToCartDetailBtn = document.querySelector(".add-to-cart-detail")

  if (addToCartDetailBtn) {
    addToCartDetailBtn.addEventListener("click", () => {
      const productTitle = document.querySelector(".product-title-detail").textContent
      const productPrice = document.querySelector(".product-price-detail").textContent
      const selectedSize = document.querySelector(".size-btn.active")?.textContent || "M"
      const quantity = Number.parseInt(document.querySelector(".qty-input").value) || 1
      const mainImage = document.getElementById("main-product-image")

      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

      const productId = `detail-${Date.now()}`

      // Add item to cart
      cartItems.push({
        id: productId,
        title: `${productTitle} (Size: ${selectedSize})`,
        price: productPrice,
        image: mainImage.src,
        quantity: quantity,
      })

      localStorage.setItem("cartItems", JSON.stringify(cartItems))

      // Update cart count
      const cartCount = document.querySelector(".cart-count")
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

      if (cartCount) {
        cartCount.textContent = totalItems
        cartCount.style.display = totalItems > 0 ? "flex" : "none"
      }

      // Show success message
      window.showNotification(`Added ${quantity} item(s) to cart!`)

      // Button animation
      const originalText = addToCartDetailBtn.textContent
      addToCartDetailBtn.textContent = "Added to Cart!"
      addToCartDetailBtn.style.background = "#10b981"

      setTimeout(() => {
        addToCartDetailBtn.textContent = originalText
        addToCartDetailBtn.style.background = ""
      }, 2000)
    })
  }
}

// Wishlist Functionality
function toggleWishlist(btn) {
  const wishlistIcon = document.querySelector(".wishlist-icon")
  const wishlistCount = document.querySelector(".wishlist-count")
  let wishlistItems = Number.parseInt(localStorage.getItem("wishlist") || "0")

  const isWishlisted = btn.classList.contains("wishlisted")

  if (isWishlisted) {
    btn.classList.remove("wishlisted")
    btn.style.color = ""
    wishlistItems = Math.max(0, wishlistItems - 1)
    window.showNotification("Removed from wishlist")
  } else {
    btn.classList.add("wishlisted")
    btn.style.color = "#e53e3e"
    wishlistItems++
    window.showNotification("Added to wishlist!")
  }

  localStorage.setItem("wishlist", wishlistItems.toString())

  if (wishlistCount) {
    wishlistCount.textContent = wishlistItems
    wishlistCount.style.display = wishlistItems > 0 ? "flex" : "none"
  }

  // Update bottom nav wishlist count
  const bottomWishlistBadge = document.querySelector(".bottom-nav .nav-badge")
  if (bottomWishlistBadge) {
    bottomWishlistBadge.textContent = wishlistItems
    bottomWishlistBadge.style.display = wishlistItems > 0 ? "flex" : "none"
  }

  // Add animation to wishlist icon
  if (wishlistIcon) {
    wishlistIcon.style.transform = "scale(1.2)"
    setTimeout(() => {
      wishlistIcon.style.transform = "scale(1)"
    }, 200)
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (!hamburger || !navMenu) return

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Animate hamburger
    const spans = hamburger.querySelectorAll("span")
    if (hamburger.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  })

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")

      const spans = hamburger.querySelectorAll("span")
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    })
  })
}

// Product Detail Page
function initializeProductDetail() {
  // Tab functionality
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab

      // Remove active class from all tabs and panes
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabPanes.forEach((p) => p.classList.remove("active"))

      // Add active class to clicked tab and corresponding pane
      btn.classList.add("active")
      const targetPane = document.getElementById(targetTab)
      if (targetPane) {
        targetPane.classList.add("active")
      }
    })
  })

  // Size selection
  const sizeBtns = document.querySelectorAll(".size-btn")
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
    })
  })

  // Quantity controls
  const qtyInput = document.querySelector(".qty-input")
  const minusBtn = document.querySelector(".qty-btn.minus")
  const plusBtn = document.querySelector(".qty-btn.plus")

  if (minusBtn && qtyInput) {
    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(qtyInput.value)
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1
      }
    })
  }

  if (plusBtn && qtyInput) {
    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(qtyInput.value)
      qtyInput.value = currentValue + 1
    })
  }

  // Thumbnail images
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImage = document.getElementById("main-product-image")

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach((t) => t.classList.remove("active"))
      thumb.classList.add("active")

      if (mainImage) {
        mainImage.src = thumb.src
      }
    })
  })
}

// Contact Page
function initializeContact() {
  // Contact form
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        window.showNotification("Message sent successfully! We'll get back to you soon.")
        contactForm.reset()

        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }

  // FAQ functionality
  const faqItems = document.querySelectorAll(".faq-item")
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Close all FAQ items
      faqItems.forEach((faq) => faq.classList.remove("active"))

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active")
      }
    })
  })
}

// Zoom Modal
function initializeZoom() {
  const zoomModal = document.getElementById("zoom-modal")
  const zoomImage = document.getElementById("zoom-image")
  const zoomClose = document.querySelector(".zoom-close")

  if (!zoomModal) return

  // Close modal
  const closeZoom = () => {
    zoomModal.style.display = "none"
  }

  if (zoomClose) {
    zoomClose.addEventListener("click", closeZoom)
  }

  zoomModal.addEventListener("click", (e) => {
    if (e.target === zoomModal) {
      closeZoom()
    }
  })

  // Global zoom function
  window.openZoomModal = function openZoomModal(btn) {
    const productCard = btn.closest(".product-card")
    const productImage = productCard.querySelector(".product-image")

    // For demo, use placeholder image
    const imageSrc = "/placeholder.svg?height=600&width=500"

    if (zoomImage) {
      zoomImage.src = imageSrc
    }

    zoomModal.style.display = "block"
  }

  // Zoom functionality for product detail page
  const zoomBtnDetail = document.querySelector(".zoom-btn-detail")
  if (zoomBtnDetail) {
    zoomBtnDetail.addEventListener("click", () => {
      const mainImage = document.getElementById("main-product-image")
      if (mainImage && zoomImage) {
        zoomImage.src = mainImage.src
        zoomModal.style.display = "block"
      }
    })
  }
}

// Search Functionality
function initializeSearch() {
  const searchIcon = document.querySelector(".search-icon")

  if (searchIcon) {
    searchIcon.addEventListener("click", () => {
      const searchTerm = prompt("Search for products:")
      if (searchTerm) {
        // Simple search demo
        const products = document.querySelectorAll(".product-card")
        let found = false

        products.forEach((product) => {
          const title = product.querySelector(".product-title")
          if (title && title.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            product.scrollIntoView({ behavior: "smooth" })
            product.style.border = "2px solid var(--primary-red)"
            found = true

            setTimeout(() => {
              product.style.border = "none"
            }, 3000)
          }
        })

        if (!found) {
          window.showNotification("No products found matching your search.")
        }
      }
    })
  }
}

// Category Navigation
function initializeCategoryNavigation() {
  const categoryCards = document.querySelectorAll(".category-card")

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category
      if (category) {
        // Navigate to products page with category filter
        window.location.href = `products.html?category=${category}`
      }
    })
  })
}

// Product Detail Navigation
function openProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`
}

// Notification System
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  const bgColor = type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Utility Functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Make functions globally available
window.showNotification = showNotification
window.toggleWishlist = toggleWishlist
window.openProductDetail = openProductDetail
