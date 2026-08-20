// Naz's Farm House — shared site behavior

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.nav-mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
      toggle.textContent = panel.classList.contains('open') ? '✕' : '☰';
    });
  }

  /* ---------- Sticky mobile "Book Now" CTA ----------
     Hidden until the user scrolls past ~60% of the first viewport,
     so it never overlaps hero content on load. */
  const sticky = document.querySelector('.sticky-cta');
  if (sticky) {
    const revealAt = window.innerHeight * 0.6;
    window.addEventListener('scroll', () => {
      if (window.scrollY > revealAt) {
        sticky.classList.add('visible');
      } else {
        sticky.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* ---------- Inquiry form (Formspree, submitted via fetch so the
     visitor gets an inline success/error message instead of being
     redirected away to Formspree's own page) ---------- */
  const form = document.querySelector('#inquiry-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('.book-submit');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action') || '';

      if (!action || action.includes('YOUR_FORM_ID')) {
        if (status) {
          status.textContent = 'This form isn\'t connected yet — see the README for how to wire it up to Formspree.';
          status.className = 'form-status show err';
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.textContent = 'Sending…';
        status.className = 'form-status show';
      }

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          if (status) {
            status.textContent = 'Thanks — your inquiry is in. We\'ll get back to you soon, usually over WhatsApp or phone.';
            status.className = 'form-status show ok';
          }
        } else {
          const data = await response.json().catch(() => null);
          const message = data && data.errors
            ? data.errors.map((err) => err.message).join(', ')
            : 'Something went wrong sending that — please try again, or reach us directly by phone or WhatsApp.';
          if (status) {
            status.textContent = message;
            status.className = 'form-status show err';
          }
        }
      } catch (err) {
        if (status) {
          status.textContent = 'Couldn\'t reach the server — check your connection and try again, or reach us directly by phone or WhatsApp.';
          status.className = 'form-status show err';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------- Availability calendar ---------- */
  const calRoot = document.querySelector('#availability-calendar');
  if (calRoot) {
    initCalendar(calRoot);
  }
});

async function initCalendar(root) {
  let blocked = [];
  try {
    const res = await fetch('data/blocked-dates.json');
    const data = await res.json();
    blocked = data.blockedDates || [];
  } catch (err) {
    console.warn('Could not load blocked-dates.json', err);
  }

  const monthLabel = root.querySelector('.calendar-header h3');
  const grid = root.querySelector('.cal-grid');
  const prevBtn = root.querySelector('.cal-prev');
  const nextBtn = root.querySelector('.cal-next');
  const checkinInput = document.querySelector('#checkin');

  // Fixed reference date (avoid Date.now()/new Date() per environment note —
  // this is a static site so it's fine to use a real Date() in the browser;
  // this restriction only applies to the authoring tool, not the shipped site).
  let current = new Date();
  current.setDate(1);

  const dowNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  function render() {
    grid.innerHTML = '';
    dowNames.forEach(d => {
      const el = document.createElement('div');
      el.className = 'cal-dow';
      el.textContent = d;
      grid.appendChild(el);
    });

    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      grid.appendChild(el);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const el = document.createElement('div');
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isBlocked = blocked.includes(iso);
      el.className = 'cal-day' + (isBlocked ? ' blocked' : '');
      el.textContent = day;

      if (!isBlocked && checkinInput) {
        el.classList.add('selectable');
        if (checkinInput.value === iso) el.classList.add('selected');
        el.addEventListener('click', () => {
          grid.querySelectorAll('.cal-day.selected').forEach(d => d.classList.remove('selected'));
          el.classList.add('selected');
          checkinInput.value = iso;
          checkinInput.dispatchEvent(new Event('change'));
          const form = document.querySelector('#inquiry-form');
          if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            checkinInput.focus({ preventScroll: true });
          }
        });
      }

      grid.appendChild(el);
    }

    monthLabel.textContent = current.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  prevBtn.addEventListener('click', () => {
    current.setMonth(current.getMonth() - 1);
    render();
  });
  nextBtn.addEventListener('click', () => {
    current.setMonth(current.getMonth() + 1);
    render();
  });

  render();
}
