// Menu toggle functionality
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Set active nav link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Tab functionality
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabGroup = btn.parentElement;
            const tabsContainer = btn.closest('.tabs-container') || document;
            const tabId = btn.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabsContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetTab = tabsContainer.querySelector(`#${tabId}`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initMenuToggle();
    setActiveNavLink();
    initTabs();
});


(function () {
  function copyTextToClipboard(text) {
    // Modern browsers
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback for older browsers
    return new Promise(function (resolve, reject) {
      var textArea = document.createElement("textarea");
      textArea.value = text;

      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }

      document.body.removeChild(textArea);
    });
  }

  function createCopyButton(codeEl) {
    var button = document.createElement("button");
    // Use a visible emoji fallback instead of depending on an external sprite path
    button.innerHTML = '📋 Copy code';
    button.setAttribute("aria-label", "Copy code");

    button.style.position = "absolute";
    button.style.top = "8px";
    button.style.right = "8px";
    button.style.padding = "4px 8px";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.background = "rgba(0,0,0,0.6)";
    button.style.color = "#fff";
    button.style.zIndex = "10";

    button.addEventListener("click", function () {
      var text = codeEl.innerText;

      copyTextToClipboard(text)
        .then(function () {
          button.innerHTML = "✓";
          setTimeout(function () {
            button.innerHTML = "📋 Copy code";
          }, 1500);
        })
        .catch(function () {
          alert("Failed to copy");
        });
    });

    return button;
  }

  function initCopyCodeBlocks() {
    var blocks = document.querySelectorAll("pre code");

    blocks.forEach(function (codeEl) {
      var pre = codeEl.parentElement;

      // avoid duplicate buttons
      if (pre.querySelector(".copy-code-btn")) return;

      pre.style.position = "relative";

      var button = createCopyButton(codeEl);
      button.className = "copy-code-btn";

      pre.appendChild(button);
    });
  }

  // Run on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyCodeBlocks);
  } else {
    initCopyCodeBlocks();
  }

  // Optional: expose global re-init if dynamic content is added
  window.initCopyCodeBlocks = initCopyCodeBlocks;
})();
