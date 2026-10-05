import { calculateRoi, PACKAGE_MONTHLY_FEE } from './roi.js';

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.12 },
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------- ROI Calculator ----------
const fmt = (n) => Math.round(n).toLocaleString('en-US');

const inputs = {
  hours: document.getElementById('hoursInput'),
  rate: document.getElementById('rateInput'),
  pct: document.getElementById('pctInput'),
};
const outputs = {
  hours: document.getElementById('hoursVal'),
  rate: document.getElementById('rateVal'),
  pct: document.getElementById('pctVal'),
  cost: document.getElementById('monthlyCost'),
  save: document.getElementById('monthlySave'),
  net: document.getElementById('annualNet'),
};

// Smoothly animate a number toward a target value
const animators = new Map();
function animateNumber(el, target) {
  const from = parseFloat(el.textContent.replace(/,/g, '')) || 0;
  cancelAnimationFrame(animators.get(el));
  const start = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - start) / 350);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (target - from) * eased);
    if (p < 1) animators.set(el, requestAnimationFrame(step));
  };
  animators.set(el, requestAnimationFrame(step));
}

function recalc() {
  const hours = +inputs.hours.value;
  const rate = +inputs.rate.value;
  const pct = +inputs.pct.value;

  outputs.hours.textContent = hours;
  outputs.rate.textContent = rate;
  outputs.pct.textContent = pct;

  const result = calculateRoi({
    hoursPerWeek: hours,
    hourlyRate: rate,
    automatablePct: pct / 100,
    monthlyFee: PACKAGE_MONTHLY_FEE,
  });

  animateNumber(outputs.cost, result.monthlyCost);
  animateNumber(outputs.save, result.monthlySavings);
  animateNumber(outputs.net, result.annualNet);
  outputs.net.parentElement.classList.toggle('loss', result.annualNet < 0);
  outputs.net.parentElement.classList.toggle('gain', result.annualNet >= 0);

  // Personalize the hero headline
  const heroHours = document.getElementById('heroHours');
  if (heroHours) heroHours.textContent = `${hours} hours`;
}

Object.values(inputs).forEach((el) => el.addEventListener('input', recalc));
recalc();

// ---------- Package pre-fill on contact form ----------
document.querySelectorAll('[data-package]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('packageField').value = btn.dataset.package;
    const textarea = document.querySelector('.contact-form textarea');
    if (textarea && !textarea.value) {
      textarea.value = `I'm interested in the ${btn.dataset.package} package.`;
    }
  });
});

// ---------- FAQ: close others when one opens ----------
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item[open]').forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }),
);

// ---------- Template preview modal ----------
const TEMPLATE_INFO = {
  'new-patient-intake': {
    title: 'New Patient Intake',
    steps: [
      'Patient fills out your online intake form',
      'Their record is created in your patient sheet automatically',
      'They instantly receive a welcome email with a first-visit checklist',
      'Your front desk gets a notification with their details',
    ],
  },
  'appointment-reminders': {
    title: 'Appointment Reminders',
    steps: [
      'Every hour, the system checks tomorrow’s schedule',
      'Patients with appointments in the next 24h get an SMS reminder',
      'The message requests C or R replies; handling those replies is not implemented',
      'Credentials, duplicate prevention, time bounds, and reply routing need implementation',
    ],
  },
  'invoice-sync': {
    title: 'Weekly Invoice Sync',
    steps: [
      'Every Friday at 9am, the week’s treatments are pulled automatically',
      'Invoices are created and matched in your accounting tool',
      'Unpaid balances are flagged in one email to the office manager',
      'The graph needs field mapping, reconciliation, and error handling before use',
    ],
  },
};

const overlay = document.getElementById('modalOverlay');
document.querySelectorAll('[data-template]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const info = TEMPLATE_INFO[btn.dataset.template];
    document.getElementById('modalTitle').textContent = info.title;
    document.getElementById('modalSteps').innerHTML = info.steps
      .map((s) => `<li>${s}</li>`)
      .join('');
    document.getElementById('modalDownload').href = `templates/dental/${btn.dataset.template}.json`;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
const closeModal = () => {
  overlay.hidden = true;
  document.body.style.overflow = '';
};
document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => e.target === overlay && closeModal());
document.getElementById('modalCta').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => e.key === 'Escape' && !overlay.hidden && closeModal());
