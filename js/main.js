'use strict';
const form = document.querySelector('#entry-form');
const status = document.querySelector('#form-status');
const button = form.querySelector('[type="submit"]');
const phone = form.elements.phone;
let requestId = crypto.randomUUID();
let sending = false;
function showStatus(message, type = '') {
  status.hidden = false;
  status.textContent = message;
  status.className = `entry-form__status${type ? ` entry-form__status--${type}` : ''}`;
}
const phoneCountries = {"UZ": {"code": "998", "groups": [2, 3, 2, 2]}, "KZ": {"code": "7", "groups": [3, 3, 2, 2]}, "KG": {"code": "996", "groups": [3, 3, 3]}, "TJ": {"code": "992", "groups": [2, 3, 2, 2]}, "TM": {"code": "993", "groups": [2, 3, 3]}, "AF": {"code": "93", "groups": [2, 3, 4]}, "RU": {"code": "7", "groups": [3, 3, 2, 2]}, "CN": {"code": "86", "groups": [3, 4, 4]}, "PK": {"code": "92", "groups": [3, 3, 4]}, "IR": {"code": "98", "groups": [3, 3, 4]}, "AZ": {"code": "994", "groups": [2, 3, 2, 2]}, "AM": {"code": "374", "groups": [2, 3, 3]}, "GE": {"code": "995", "groups": [3, 2, 2, 2]}, "TR": {"code": "90", "groups": [3, 3, 2, 2]}, "IN": {"code": "91", "groups": [5, 5]}};
const countrySelect = form.elements.phoneCountry;
function formatPhoneDigits(digits, groups) {
  const parts = [];
  let offset = 0;
  for (const size of groups) {
    if (offset >= digits.length) break;
    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }
  return parts.join(' ');
}
function updatePhone(event) {
  const raw = phone.value;
  let caretDigits = raw.slice(0, phone.selectionStart ?? raw.length).replace(/\D/g, '').length;
  let digits = raw.replace(/\D/g, '');
  let selected = phoneCountries[countrySelect.value];
  if (/^\s*(\+|00)/.test(raw)) {
    if (/^\s*00/.test(raw)) { digits = digits.slice(2); caretDigits -= 2; }
    const matches = Object.entries(phoneCountries).filter(([, c]) => digits.startsWith(c.code));
    const match = matches.find(([iso]) => iso === countrySelect.value) || matches[0];
    if (match) {
      countrySelect.value = match[0];
      selected = match[1];
      digits = digits.slice(selected.code.length);
      caretDigits -= selected.code.length;
    } else {
      phone.setCustomValidity('Ushbu davlat kodi ro‘yxatda yo‘q. Davlatni tanlab, raqamni kiriting.');
      return;
    }
  }
  const maxDigits = selected.groups.reduce((total, size) => total + size, 0);
  digits = digits.slice(0, maxDigits);
  phone.value = formatPhoneDigits(digits, selected.groups);
  phone.placeholder = formatPhoneDigits('0'.repeat(selected.groups.reduce((a, b) => a + b, 0)), selected.groups);
  phone.setCustomValidity('');
  if (event && document.activeElement === phone) {
    let position = 0, seen = 0;
    while (position < phone.value.length && seen < caretDigits) {
      if (/\d/.test(phone.value[position])) seen++;
      position++;
    }
    phone.setSelectionRange(position, position);
  }
}
phone.addEventListener('input', updatePhone);
phone.addEventListener('beforeinput', event => {
  const at = phone.selectionStart;
  const maxDigits = phoneCountries[countrySelect.value].groups.reduce((total, size) => total + size, 0);
  const selectedDigits = phone.value.slice(at, phone.selectionEnd).replace(/\D/g, '').length;
  if (event.inputType === 'insertText' && event.data && /^\d+$/.test(event.data) &&
      phone.value.replace(/\D/g, '').length - selectedDigits + event.data.length > maxDigits) {
    event.preventDefault();
    return;
  }
  if (phone.selectionStart !== phone.selectionEnd) return;
  if (event.inputType === 'deleteContentBackward' && at > 0 && phone.value[at - 1] === ' ') phone.setSelectionRange(at - 1, at);
  if (event.inputType === 'deleteContentForward' && phone.value[at] === ' ') phone.setSelectionRange(at, at + 1);
});
countrySelect.addEventListener('change', () => {
  updatePhone();
  requestId = crypto.randomUUID();
});
updatePhone();
form.addEventListener('input', () => { if (!sending) requestId = crypto.randomUUID(); });
// Prepare locally when selected; reuse the exact File on submit and retries.
const preparedImages = new WeakMap();
function prepareImage(file) {
  if (!preparedImages.has(file)) {
    const task = encodeImage(file).then(
      photo => ({ photo }),
      error => { preparedImages.delete(file); return { error }; }
    );
    preparedImages.set(file, task);
  }
  return preparedImages.get(file);
}
for (const input of form.querySelectorAll('[type="file"]')) {
  input.addEventListener('change', () => {
    const file = input.files[0];
    input.setCustomValidity('');
    if (file && (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      input.setCustomValidity('JPG, PNG yoki WebP rasm tanlang. Hajmi 5 MB dan oshmasin.');
      input.reportValidity();
    }
    input.parentElement.querySelector('span').textContent = file ? file.name : `${input.name.slice(-1)}-rasmni yuklang`;
    input.parentElement.classList.toggle('entry-form__upload--selected', Boolean(file) && input.validity.valid);
    if (file && input.validity.valid) void prepareImage(file);
  });
}
async function encodeImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { data: canvas.toDataURL('image/jpeg', .85).split(',')[1], mimeType: 'image/jpeg' };
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending) return;
  updatePhone();
  const selectedCountry = phoneCountries[countrySelect.value];
  const nationalPhone = phone.value.replace(/\D/g, '');
  const expectedLength = selectedCountry.groups.reduce((a, b) => a + b, 0);
  if (phone.validity.customError) { phone.reportValidity(); return; }
  phone.setCustomValidity(nationalPhone.length === expectedLength ? '' : `Davlat kodisiz ${expectedLength} ta raqam kiriting. Masalan: ${phone.placeholder}`);
  const normalizedPhone = selectedCountry.code + nationalPhone;
  form.elements.fullName.setCustomValidity(form.elements.fullName.value.trim().length >= 3 ? '' : 'Ism-familiyangizni kiriting.');
  if (!form.reportValidity()) return;
  const url = window.APP_CONFIG?.scriptUrl;
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url || '')) {
    showStatus('Ro‘yxatdan o‘tish hozircha ulanmagan. Iltimos, tashkilotchiga murojaat qiling.', 'error');
    return;
  }
  const payload = {
    requestId, fullName: form.elements.fullName.value.trim(), phone: '+' + normalizedPhone, phoneCountry: countrySelect.value,
    instagram: '@' + form.elements.instagram.value.replace(/^@/, ''),
    attendance: form.elements.attendance.value, bringDress: form.elements.bringDress.value, photos: []
  };
  sending = true;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  const controls = [...form.querySelectorAll('input, select')];
  controls.forEach(input => { input.disabled = true; });
  showStatus('Rasmlar tayyorlanmoqda…');
  try {
    const prepared = await Promise.all(
      [...form.querySelectorAll('[type="file"]')].map(input => prepareImage(input.files[0]))
    );
    const failed = prepared.find(item => item.error);
    if (failed) throw failed.error;
    payload.photos = prepared.map(item => item.photo);
    showStatus('Ma’lumotlar yuborilmoqda. Iltimos, kuting…');
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error(result.message || 'Saqlash amalga oshmadi.');
    showStatus('Arizangiz qabul qilindi! Siz bilan tez orada bog‘lanamiz.', 'success');
    form.reset();
    updatePhone();
    for (const input of form.querySelectorAll('[type="file"]')) {
      input.parentElement.classList.remove('entry-form__upload--selected');
      input.parentElement.querySelector('span').textContent = `${input.name.slice(-1)}-rasmni yuklang`;
    }
    requestId = crypto.randomUUID();
    window.location.assign('thankYou.html');
  } catch (error) {
    showStatus('Yuborish tasdiqlanmadi. Internetni tekshirib, qayta urinib ko‘ring. ' + error.message, 'error');
  } finally {
    sending = false;
    button.disabled = false;
    controls.forEach(input => { input.disabled = false; });
    form.removeAttribute('aria-busy');
  }
});
form.elements.fullName.addEventListener('input', () => form.elements.fullName.setCustomValidity(''));
