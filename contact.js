(() => {
  'use strict';

  const form = document.getElementById('inquiryForm');
  if (!form) return;

  const TYPE_MAP = {
    document: '資料請求',
    apply: '加盟申し込み',
    consult: '掲載について相談する',
  };

  /* Pre-select inquiry type from ?type= query param */
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const typeSelect = document.getElementById('inquiryType');

  if (type && TYPE_MAP[type] && typeSelect) {
    typeSelect.value = TYPE_MAP[type];
  }

  const formPanel = document.getElementById('formPanel');
  const thanksPanel = document.getElementById('thanksPanel');
  const thanksType = document.getElementById('thanksType');
  const submitBtn = document.getElementById('submitBtn');
  const formError = document.getElementById('formError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.reportValidity()) return;

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    if (formError) formError.hidden = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('submission failed');

        if (thanksType) thanksType.textContent = typeSelect.value || 'お問い合わせ';
        if (formPanel) formPanel.hidden = true;
        if (thanksPanel) {
          thanksPanel.hidden = false;
          thanksPanel.setAttribute('tabindex', '-1');
          thanksPanel.focus();
          thanksPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      })
      .catch(() => {
        if (formError) formError.hidden = false;
      })
      .finally(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      });
  });
})();
