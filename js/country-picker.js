'use strict';
(() => {
    const select = document.querySelector('[name="phoneCountry"]');
    const container = select.closest('.entry-form__phone');
    const toggle = container.querySelector('.entry-form__country-toggle');
    const menu = container.querySelector('.entry-form__country-menu');
    const flag = container.querySelector('.entry-form__country-flag');
    const code = container.querySelector('.entry-form__dial-code');
    const input = container.querySelector('[name="phone"]');
    const countryFlag = iso => [...iso].map(char => String.fromCodePoint(127397 + char.charCodeAt(0))).join('');
    const options = [...select.options];
    function close(focus = false) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (focus) toggle.focus();
    }
    function sync() {
        const option = select.selectedOptions[0];
        flag.textContent = countryFlag(option.value);
        code.textContent = option.textContent.match(/\+\d+/)[0];
        toggle.setAttribute('aria-label', `${option.textContent}. Davlatni o‘zgartirish`);
        toggle.disabled = select.disabled;
        for (const item of menu.children) item.setAttribute('aria-pressed', String(item.dataset.country === select.value));
        if (select.disabled) close();
    }
    options.forEach(option => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'entry-form__country-option';
        item.dataset.country = option.value;
        const name = document.createElement('span');
        name.className = 'entry-form__country-name';
        name.textContent = option.textContent.replace(/\s*\(.*\)/, '');
        const dial = document.createElement('span');
        dial.className = 'entry-form__country-option-code';
        dial.textContent = option.textContent.match(/\+\d+/)[0];
        const icon = document.createElement('span');
        icon.className = 'entry-form__country-flag';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = countryFlag(option.value);
        item.append(name, dial, icon);
        item.addEventListener('click', () => {
            if (select.disabled) return;
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            sync();
            close();
            input.focus();
        });
        menu.append(item);
    });
    function open() {
        if (select.disabled) return;
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        menu.querySelector('[aria-pressed="true"]').focus();
    }
    toggle.addEventListener('click', () => menu.hidden ? open() : close());
    toggle.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') { event.preventDefault(); open(); }
    });
    menu.addEventListener('keydown', event => {
        const items = [...menu.children];
        let index = items.indexOf(document.activeElement);
        if (event.key === 'ArrowDown') index = (index + 1) % items.length;
        else if (event.key === 'ArrowUp') index = (index - 1 + items.length) % items.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = items.length - 1;
        else return;
        event.preventDefault();
        items[index].focus();
    });
    container.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); }
    });
    document.addEventListener('click', event => { if (!container.contains(event.target)) close(); });
    container.addEventListener('focusout', event => { if (!container.contains(event.relatedTarget)) close(); });
    select.addEventListener('change', sync);
    input.addEventListener('input', sync);
    select.form.addEventListener('reset', () => queueMicrotask(sync));
    new MutationObserver(sync).observe(select, { attributes: true, attributeFilter: ['disabled'] });
    sync();
})();
