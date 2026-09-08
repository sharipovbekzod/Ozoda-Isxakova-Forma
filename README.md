# Ozoda Isxakova — ro‘yxatdan o‘tish

HTML, CSS va oddiy JavaScript. HTML classlari BEM uslubida. Berilgan speaker.avif, btn.avif va arrow.svg ishlatilgan. Maket 440 px kenglik asosida, kichik ekranlarga moslangan.

## Google Sheets ulash

1. Kerakli Google Sheets faylida **Extensions → Apps Script** oching.
2. Eski kod o‘rniga `apps-script/Code.gs` kodini to‘liq qo‘ying.
3. `initialSetup` funksiyasini bir marta ishga tushiring va Google ruxsatlarini bering. U shu spreadsheet ID sini saqlaydi, Drive papkasini va `Lead`, `Unical Leads` varaqlarini yaratadi. Mavjud ustunlar o‘chirilmaydi, yangilari oxiriga qo‘shiladi.
4. **Deploy → New deployment → Web app**: **Execute as: Me**, **Who has access: Anyone**. `/exec` bilan tugagan URL ni oling.
5. `js/config.js` ichidagi `scriptUrl` qiymatiga shu URL ni qo‘ying.
6. Kod keyinchalik o‘zgarsa, **Manage deployments → Edit → New version → Deploy** qiling.
7. Lokal ishga tushirish: `python3 -m http.server 8000`, so‘ng `http://localhost:8000`. Saytni HTTPS orqali joylashtiring.

Rasmiy yo‘riqnoma: https://developers.google.com/apps-script/guides/web

## Ustunlar

Ikkala yangi varaq bir xil tartibda yaratiladi:

| Ustun | Sarlavha |
| --- | --- |
| A | Ism |
| B | Telefon raqam |
| C | Instagram |
| D | Nonushtaga kelishi |
| E | 1-rasm URL |
| F | 2-rasm URL |-
| G | 3-rasm URL |
| H | 4-rasm URL |
| I | 5-rasm URL |
| J | Libos olib kelishi |
| K | sana |
| L | vaqt |
| M | Ariza ID |

Eski jadvaldagi Tarif, Oferta, Check URL yangi maketda yo‘q; ularga to‘qima qiymat yozilmaydi. Mavjud jadvalda ular saqlanadi va yangi arizalarda bo‘sh qoladi. Yuqoridagi aynan A–M tartibi bo‘sh yangi varaqlarga tegishli. Mavjud ustunlarni joyini o‘zgartirish mumkin, sarlavhalarini aynan saqlang. Eski qat’iy data validation qoidalari yangi formaga mos kelishi kerak.

`Lead`: barcha yangi arizalar. `Unical Leads`: normalizatsiya qilingan telefon bo‘yicha faqat birinchi ariza. +998 90 123 45 67 va 901234567 bir xil hisoblanadi. Alohida yangi ariza Lead ga tushadi; tarmoq xatosidan so‘ng aynan bir arizani qayta yuborish Ariza ID orqali takror yozilmaydi. Sahifa yangilansa yangi ID yaratiladi. Avvalgi tarixiy Lead qatorlari avtomatik ko‘chirilmaydi.

Barcha maydonlar va beshta rasm brauzerda ham, serverda ham majburiy. Radio javoblarning birinchisi maketdagidek tanlangan. JPG/PNG/WebP har biri 5 MB gacha; yuborishda 1600 px gacha JPEG formatiga kichraytiriladi. Original to‘liq o‘lchamdagi fayl saqlanmaydi. Sana/vaqt serverda Asia/Tashkent bo‘yicha yoziladi. Rasmlar Drive papkasida, Sheets da ularning havolalari saqlanadi. Ularni ko‘radigan hamkasblarga Drive papkasidan kirish bering.

## Tekshirish

- Bo‘sh formani, noto‘g‘ri telefonni va rasmsiz formani yuborish bloklanishi kerak.
- Besh rasm va to‘liq ma’lumot bilan yuboring: Lead va Unical Leads da bittadan qator, Drive da besh rasm bo‘lsin.
- Xuddi shu telefon bilan yangi ariza: Lead da yana bir qator, Unical Leads da o‘sha bitta qator.
- Boshqa telefon: ikkala varaqda yangi qator.
- Drive havolalarini ochib tekshiring. Internet uzilsa muvaffaqiyat ko‘rsatilmasligi kerak.

Haqiqiy /exec URL va hisobga kirish berilmagani uchun jonli Sheets/Drive sinovi hali bajarilmagan. Papkada font fayllari topilmadi: hozir Google Fonts Anton/Poppins ishlatiladi; aynan maket shriftlari berilsa lokal ulash mumkin. Barcha rasmlar mahalliy. In-app browser vositasi ushbu sessiyada mavjud bo‘lmagani uchun vizual brauzer tekshiruvi bajarilmagan.

## Telefon davlatlari va formatlash

Telefon maydonida 15 ta hududiy tanlov bor: O‘zbekiston, Qozog‘iston, Qirg‘iziston, Tojikiston, Turkmaniston, Afg‘oniston, Rossiya, Xitoy, Pokiston, Eron, Ozarbayjon, Armaniston, Gruziya, Turkiya, Hindiston. Bu aniq geografik masofa reytingi emas, yaqin mintaqalardan tanlangan ro‘yxat.

Davlat kodi tanlanadi, milliy raqam bo‘shliqlar bilan formatlanadi. `+` yoki `00` bilan xalqaro raqam qo‘yilganda kod ajratiladi. Rossiya va Qozog‘iston +7 kodini bo‘lishadi: amaldagi tanlov saqlanadi, boshqa davlatdan +7 qo‘yilganda Qozog‘iston tanlanadi. Ichki shaharlararo 0/8 prefiksisiz raqam kiriting. Raqamlar soni tanlangan davlatga mos cheklanadi; yozishda ortiqcha raqam bloklanadi, paste qilinganda ortiqcha raqamlar kesiladi. Tekshiruv odatiy raqam uzunligiga asoslangan; barcha maxsus/xizmat raqamlarini yoki raqam ishlashini tasdiqlamaydi.

Sheets ga `+998901234567` kabi xalqaro raqam yoziladi. Ustunlar o‘zgarmaydi. **Yangi Code.gs kodini Apps Script ga ko‘chirib, deploymentni New version bilan yangilang**, aks holda eski server chet el raqamlarini qabul qilmaydi.

Kodlar manbasi: [ITU National Numbering Plans](https://www.itu.int/oth/T0202.aspx?parent=T0202).
# Ozoda-Isxakova-Forma
