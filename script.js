
const DEADLINE = new Date(2026, 5, 18, 0, 0, 0);

function updateCountdown() {
  const diff = DEADLINE - Date.now();
  if (diff <= 0) {
    document.getElementById('countdown-timer').textContent = 'Closed!';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('countdown-timer').textContent =
    `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

const SUPABASE_URL = 'https://zmpnmozonofycyntsqih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcG5tb3pvbm9meWN5bnRzcWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjUwNTYsImV4cCI6MjA5MjEwMTA1Nn0.kZP6IM6ZljmcqVvDN0bZlBPxibcBEt_QFPW4yJPrj7c';

async function insertWaitlistEntry(data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Supabase insert failed');
  }

  return response.json();
}

function setStatus(message, type) {
  const el = document.getElementById('form-status');
  el.textContent = message;
  el.className = `form-status form-status--${type}`;
}

function setLoading(isLoading) {
  const btn = document.getElementById('submit-btn');
  btn.disabled = isLoading;
  btn.innerHTML = isLoading
    ? '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'
    : 'Join the Waitlist – It\'s Free <i class="fa-solid fa-arrow-right"></i>';
}

document.getElementById('waitlist-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const wantsAncientRootsAccess = document.getElementById('ancientroots').checked;

  if (!/^\d{10}$/.test(phone)) {
    setStatus('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  setLoading(true);

  try {
    await insertWaitlistEntry({
      phone: `+91${phone}`,
      email: email || null,
      wants_ancientroots: wantsAncientRootsAccess,
      joined_at: new Date().toISOString(),
    });

    setStatus('🎉 You\'re on the waitlist! Welcome to the movement 🌱', 'success');
    document.getElementById('waitlist-form').reset();
  } catch (err) {
    console.error(err);
    setStatus('Something went wrong. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
});
