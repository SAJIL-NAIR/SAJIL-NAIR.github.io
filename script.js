const root = document.documentElement;
root.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const themeSymbol = themeToggle ? themeToggle.querySelector(".theme-symbol") : null;

const applyTheme = (theme) => {
  const safeTheme = theme === "dark" ? "dark" : "light";
  root.setAttribute("data-theme", safeTheme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", safeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("aria-pressed", String(safeTheme === "dark"));
    if (themeSymbol) {
      themeSymbol.textContent = safeTheme === "dark" ? "⏾" : "☀︎";
    }
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", safeTheme === "dark" ? "#0f141a" : "#f5f7fa");
  }

  try {
    localStorage.setItem("theme", safeTheme);
  } catch (error) {
    // Ignore storage issues and keep the current session theme.
  }
};

const storedTheme = (() => {
  try {
    return localStorage.getItem("theme");
  } catch (error) {
    return null;
  }
})();

applyTheme(storedTheme === "dark" ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-resume-download]").forEach((link) => {
  link.addEventListener("click", () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = link.href;
    downloadLink.download = "RESUME.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  });
});

const copyResumeLink = document.querySelector("#copy-resume-link");
const resumeLinkStatus = document.querySelector("#resume-link-status");

if (copyResumeLink && resumeLinkStatus) {
  const resumePdfUrl = "https://sajil-nair.github.io/resume/RESUME.pdf";

  copyResumeLink.addEventListener("click", async () => {
    const copyWithFallback = () => {
      const fallbackInput = document.createElement("textarea");
      fallbackInput.value = resumePdfUrl;
      fallbackInput.setAttribute("readonly", "");
      fallbackInput.style.position = "fixed";
      fallbackInput.style.opacity = "0";
      document.body.appendChild(fallbackInput);

      try {
        fallbackInput.select();
        return document.execCommand("copy");
      } catch {
        return false;
      } finally {
        fallbackInput.remove();
      }
    };

    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(resumePdfUrl);
        copied = true;
      } catch {
        copied = copyWithFallback();
      }
    } else {
      copied = copyWithFallback();
    }

    if (copied) {
      resumeLinkStatus.textContent = "Copied!";
    } else {
      resumeLinkStatus.textContent = "Unable to copy. Please copy the PDF link manually.";
    }

    window.setTimeout(() => {
      resumeLinkStatus.textContent = "";
    }, 3000);
  });
}
