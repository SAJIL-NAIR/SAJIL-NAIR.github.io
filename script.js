const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

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
