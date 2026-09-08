"use strict";const form=document.querySelector("#entry-form"),status=document.querySelector("#form-status"),button=form.querySelector('[type="submit"]'),phone=form.elements.phone;let requestId=crypto.randomUUID(),sending=!1;const submissionModal = document.querySelector('#submission-modal');
const submissionTitle = document.querySelector('#submission-title');
const submissionClose = submissionModal.querySelector('.submission-modal__close');
submissionModal.addEventListener('cancel', event => {
    if (submissionModal.dataset.state !== 'error') event.preventDefault();
});
submissionModal.addEventListener('close', () => {
    document.body.classList.remove('submission-modal-open');
    button.focus();
});
submissionClose.addEventListener('click', () => submissionModal.close());
function showStatus(message, type = '') {
    const state = type || 'loading';
    submissionModal.dataset.state = state;
    submissionTitle.textContent = state === 'success' ? 'Muvaffaqiyatli yuborildi!' : state === 'error' ? 'Yuborish tasdiqlanmadi' : 'Yuborilmoqda...';
    status.textContent = message;
    submissionClose.hidden = state !== 'error';
    if (!submissionModal.open) {
        submissionModal.showModal();
        document.body.classList.add('submission-modal-open');
        submissionTitle.focus();
    }
    if (state === 'error') submissionClose.focus();
}
const phoneCountries={UZ:{code:"998",groups:[2,3,2,2]},KZ:{code:"7",groups:[3,3,2,2]},KG:{code:"996",groups:[3,3,3]},TJ:{code:"992",groups:[2,3,2,2]},TM:{code:"993",groups:[2,3,3]},AF:{code:"93",groups:[2,3,4]},RU:{code:"7",groups:[3,3,2,2]},CN:{code:"86",groups:[3,4,4]},PK:{code:"92",groups:[3,3,4]},IR:{code:"98",groups:[3,3,4]},AZ:{code:"994",groups:[2,3,2,2]},AM:{code:"374",groups:[2,3,3]},GE:{code:"995",groups:[3,2,2,2]},TR:{code:"90",groups:[3,3,2,2]},IN:{code:"91",groups:[5,5]}},countrySelect=form.elements.phoneCountry;function formatPhoneDigits(e,t){const o=[];let n=0;for(const a of t){if(n>=e.length)break;o.push(e.slice(n,n+a)),n+=a}return o.join(" ")}function updatePhone(e){const t=phone.value;let o=t.slice(0,phone.selectionStart??t.length).replace(/\D/g,"").length,n=t.replace(/\D/g,""),a=phoneCountries[countrySelect.value];if(/^\s*(\+|00)/.test(t)){/^\s*00/.test(t)&&(n=n.slice(2),o-=2);const e=Object.entries(phoneCountries).filter(([,e])=>n.startsWith(e.code)),r=e.find(([e])=>e===countrySelect.value)||e[0];if(!r)return void phone.setCustomValidity("Ushbu davlat kodi ro‘yxatda yo‘q. Davlatni tanlab, raqamni kiriting.");countrySelect.value=r[0],a=r[1],n=n.slice(a.code.length),o-=a.code.length}const r=a.groups.reduce((e,t)=>e+t,0);if(n=n.slice(0,r),phone.value=formatPhoneDigits(n,a.groups),phone.placeholder=formatPhoneDigits("0".repeat(a.groups.reduce((e,t)=>e+t,0)),a.groups),phone.setCustomValidity(""),e&&document.activeElement===phone){let e=0,t=0;for(;e<phone.value.length&&t<o;)/\d/.test(phone.value[e])&&t++,e++;phone.setSelectionRange(e,e)}}phone.addEventListener("input",updatePhone),phone.addEventListener("beforeinput",e=>{const t=phone.selectionStart,o=phoneCountries[countrySelect.value].groups.reduce((e,t)=>e+t,0),n=phone.value.slice(t,phone.selectionEnd).replace(/\D/g,"").length;"insertText"===e.inputType&&e.data&&/^\d+$/.test(e.data)&&phone.value.replace(/\D/g,"").length-n+e.data.length>o?e.preventDefault():phone.selectionStart===phone.selectionEnd&&("deleteContentBackward"===e.inputType&&t>0&&" "===phone.value[t-1]&&phone.setSelectionRange(t-1,t),"deleteContentForward"===e.inputType&&" "===phone.value[t]&&phone.setSelectionRange(t,t+1))}),countrySelect.addEventListener("change",()=>{updatePhone(),requestId=crypto.randomUUID()}),updatePhone(),form.addEventListener("input",()=>{sending||(requestId=crypto.randomUUID())});const preparedImages=new WeakMap;function prepareImage(e){if(!preparedImages.has(e)){const t=withDeadline(encodeImage(e),15000,"Rasmni tayyorlab bo‘lmadi. Boshqa rasm tanlang.").then(e=>({photo:e}),t=>(preparedImages.delete(e),{error:t}));preparedImages.set(e,t)}return preparedImages.get(e)}for(const e of form.querySelectorAll('[type="file"]'))e.addEventListener("change",()=>{const t=e.files[0];e.setCustomValidity(""),t&&(!["image/jpeg","image/png","image/webp"].includes(t.type)||t.size>5242880)&&(e.setCustomValidity("JPG, PNG yoki WebP rasm tanlang. Hajmi 5 MB dan oshmasin."),e.reportValidity()),e.parentElement.querySelector("span").textContent=t?t.name:`${e.name.slice(-1)}-rasmni yuklang${e.required?"":" (ixtiyoriy)"}`,e.parentElement.classList.toggle("entry-form__upload--selected",Boolean(t)&&e.validity.valid),t&&e.validity.valid&&prepareImage(t)});async function encodeImage(file) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    try {
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    } finally { bitmap.close(); }
    const compress = quality => new Promise((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Rasmni tayyorlab bo‘lmadi.')), 'image/jpeg', quality);
    });
    let blob = await compress(.78);
    if (blob.size > 250 * 1024) blob = await compress(.65);
    const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = () => reject(new Error('Rasmni o‘qib bo‘lmadi.'));
        reader.readAsDataURL(blob);
    });
    return { data, mimeType: 'image/jpeg' };
}
form.addEventListener("submit",async e=>{if(e.preventDefault(),sending)return;updatePhone();const t=phoneCountries[countrySelect.value],o=phone.value.replace(/\D/g,""),n=t.groups.reduce((e,t)=>e+t,0);if(phone.validity.customError)return void phone.reportValidity();phone.setCustomValidity(o.length===n?"":`Davlat kodisiz ${n} ta raqam kiriting. Masalan: ${phone.placeholder}`);const a=t.code+o;if(form.elements.fullName.setCustomValidity(form.elements.fullName.value.trim().length>=3?"":"Ism-familiyangizni kiriting."),!form.reportValidity())return;const r=window.APP_CONFIG?.scriptUrl;if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(r||""))return void showStatus("Ro‘yxatdan o‘tish hozircha ulanmagan. Iltimos, tashkilotchiga murojaat qiling.","error");const s={requestId:requestId,fullName:form.elements.fullName.value.trim(),phone:"+"+a,phoneCountry:countrySelect.value,instagram:"@"+form.elements.instagram.value.replace(/^@/,""),attendance:form.elements.attendance.value,bringDress:form.elements.bringDress.value,photos:[]};sending=!0,button.disabled=!0,form.setAttribute("aria-busy","true");const i=[...form.querySelectorAll("input, select")];i.forEach(e=>{e.disabled=!0}),showStatus("Rasmlar tayyorlanmoqda…");try{const e=await Promise.all([...form.querySelectorAll('[type="file"]')].map(e=>e.files[0]?prepareImage(e.files[0]):Promise.resolve({photo:null}))),t=e.find(e=>e.error);if(t)throw t.error;s.photos=e.map(e=>e.photo),showStatus("Ma’lumotlar yuborilmoqda. Iltimos, kuting…");const {response:o,result:n}=await sendApplication(r,s);if(!o.ok||!0!==n.ok)throw new Error(n.message||"Saqlash amalga oshmadi.");form.reset(),updatePhone();for(const e of form.querySelectorAll('[type="file"]'))e.parentElement.classList.remove("entry-form__upload--selected"),e.parentElement.querySelector("span").textContent=`${e.name.slice(-1)}-rasmni yuklang${e.required?"":" (ixtiyoriy)"}`;requestId=crypto.randomUUID();window.location.assign("thankYou.html")}catch(e){showStatus("Yuborish tasdiqlanmadi. Internetni tekshirib, qayta urinib ko‘ring. "+e.message,"error")}finally{sending=!1,button.disabled=!1,i.forEach(e=>{e.disabled=!1}),form.removeAttribute("aria-busy")}}),form.elements.fullName.addEventListener("input",()=>form.elements.fullName.setCustomValidity(""));

function withDeadline(task, milliseconds, message, onTimeout = () => {}) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new Error(message));
            onTimeout();
        }, milliseconds);
    });
    return Promise.race([task, timeout]).finally(() => clearTimeout(timer));
}

async function sendApplication(url, payload) {
    const controller = new AbortController();
    const task = (async () => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            redirect: 'follow',
            signal: controller.signal
        });
        let result;
        try { result = await response.json(); }
        catch (_) { throw new Error('Serverdan noto‘g‘ri javob keldi. Apps Script deploymentini tekshiring.'); }
        return { response, result };
    })();
    return withDeadline(task, 45000,
        'Server javobi kechikdi. Ariza saqlangan bo‘lishi mumkin. Shu sahifada qayta urinib ko‘ring.',
        () => controller.abort());
}
