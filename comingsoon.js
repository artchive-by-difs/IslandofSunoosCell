const countdownEl = document.getElementById('countdown');

// Set event start & end
const startDate = new Date('2026-06-23T15:00:00Z'); // 22:00 WIB or 00:00 KST 30 November 2025
const endDate = new Date('2026-07-24T15:00:00Z');   // 22:00 WIB or 00:00 KST 01 January 2026

function startCountdown(serverTime) {
  const clientStartTime = Date.now();

  function update() {
    const now = new Date(serverTime.getTime() + (Date.now() - clientStartTime));

    const currentPage = window.location.pathname;

    // If event ended → redirect only if NOT already on event-closed.html
    if (now >= endDate) {
      if (!currentPage.includes('event-closed.html')) {
        window.location.href = '/event-closed.html';
      }
      return;
    }

    // If event started → redirect only if NOT already in main page
    if (now >= startDate) {
      if (!currentPage.includes('/photobooth/photobooth.html')) {
        window.location.href = '/photobooth/photobooth.html';
      }
      return;
    }

    // If still before start → show countdown
    const diff = startDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (countdownEl) {
      countdownEl.innerHTML = `
        <div class="days">D-${days}</div>
        <div class="time-parts">
          <div class="time-part">${hours}<span class="label">Hour(s)</span></div>
          <div class="time-part">${minutes}<span class="label">Minute(s)</span></div>
          <div class="time-part">${seconds}<span class="label">Second(s)</span></div>
        </div>
      `;
    }
  }

  setInterval(update, 1000);
  update();
}

// Get server time (KST)
fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul')
  .then(res => res.json())
  .then(data => startCountdown(new Date(data.utc_datetime)))

  .catch(() => startCountdown(new Date())); // fallback local


