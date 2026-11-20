/**
 * Website Roast: kleine interacties.
 * - hero-mockup kantelt mee met de muis
 * - URL uit de hero gaat mee naar het aanvraagformulier
 * - aanvraagformulier verstuurt naar /api/roast-aanvraag (e-mailverificatie),
 *   met Web3Forms als terugval zolang de sleutels niet ingesteld zijn
 */
(function () {
  'use strict';

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Kantelende mockup
  var tilt = document.querySelector('[data-tilt]');
  if (tilt && !reduceMotion) {
    var base = 'perspective(1200px) ';
    tilt.addEventListener('mousemove', function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform =
        base +
        'rotateX(' + Math.round(-y * 14) + 'deg) rotateY(' + Math.round(x * 14) + 'deg) rotate(-2.5deg)';
    });
    tilt.addEventListener('mouseleave', function () {
      tilt.style.transform = base + 'rotate(-2.5deg)';
    });
  }

  // 2. URL uit de hero meenemen
  var heroForm = document.querySelector('[data-roast-hero]');
  var heroInput = document.getElementById('roast-url');
  var formUrl = document.getElementById('f-url');
  function carryUrl(e) {
    if (e) e.preventDefault();
    if (heroInput && formUrl && heroInput.value.trim()) {
      formUrl.value = heroInput.value.trim();
    }
    var target = document.getElementById('aanvraag');
    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    var next = document.getElementById(
      formUrl && formUrl.value ? 'f-mail' : 'f-url'
    );
    if (next) next.focus({ preventScroll: true });
  }
  if (heroForm) heroForm.addEventListener('submit', carryUrl);
  var go = document.querySelector('[data-roast-go]');
  if (go) go.addEventListener('click', carryUrl);

  // 3. Aanvraagformulier
  var form = document.querySelector('[data-roast-form]');
  if (!form) return;
  var status = form.querySelector('[data-roast-status]');
  var button = form.querySelector('button[type="submit"]');
  var buttonLabel = button ? button.textContent : '';
  var loadedAt = Date.now();

  function say(message, ok) {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.style.background = ok ? '#FFE94A' : '#FFFFFF';
    status.style.color = ok ? '#111111' : '#B00020';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;

    // simpele spamrem: bots vullen het formulier binnen de twee seconden in
    if (Date.now() - loadedAt < 2000) return;

    var data = new FormData(form);
    if (data.get('botcheck')) return;
    data.set('subject', 'Roast-aanvraag: ' + (data.get('website') || ''));

    if (button) {
      button.disabled = true;
      button.textContent = 'Even geduld...';
    }

    // Eerst ons eigen eindpunt, dat de aanvraag bewaart. Drie uitkomsten:
    // - 503: nog niet ingesteld, alles gaat via Web3Forms
    // - verificatie aan: de aanvrager krijgt een bevestigingslink
    // - verificatie uit: bewaard, en Web3Forms meldt de aanvraag aan Steven
    var velden = {};
    data.forEach(function (waarde, sleutel) {
      velden[sleutel] = waarde;
    });

    fetch('/api/roast-aanvraag', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(velden),
    })
      .then(function (res) {
        if (res.status === 503) {
          return fetch(form.action, { method: 'POST', body: data }).then(
            function (direct) {
              if (!direct.ok) throw new Error('status ' + direct.status);
              return 'direct';
            }
          );
        }
        if (!res.ok) {
          return res.json().then(function (antwoord) {
            var fout = new Error('status ' + res.status);
            fout.bericht = antwoord && antwoord.bericht;
            throw fout;
          });
        }
        return res.json().then(function (antwoord) {
          if (antwoord && antwoord.verificatie) return 'verificatie';
          // Bewaard zonder verificatie: de melding per mail mag mislukken.
          return fetch(form.action, { method: 'POST', body: data }).then(
            function () {
              return 'direct';
            },
            function () {
              return 'direct';
            }
          );
        });
      })
      .then(function (manier) {
        form.reset();
        say(
          manier === 'verificatie'
            ? 'Bijna klaar. Check je mailbox en klik op de link om je aanvraag te bevestigen.'
            : 'Aanvraag ontvangen. Je hoort snel van ons, met je rapport en je voorstel.',
          true
        );
      })
      .catch(function (fout) {
        say(
          (fout && fout.bericht) ||
            'Het versturen is niet gelukt. Probeer het opnieuw of mail je URL naar hi@ai-studio44.com.',
          false
        );
      })
      .then(function () {
        if (button) {
          button.disabled = false;
          button.textContent = buttonLabel;
        }
      });
  });
})();
