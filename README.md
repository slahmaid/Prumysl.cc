# Prumysl — كاميرات شمسية (المغرب)

موقع ثابت عربي RTL لصفحات منتجات Prumysl (موكا، برو ماكس، العساس، غارد كور، الصقر).

## هيكل الموقع

| المسار | الملف |
|--------|--------|
| `/` | `index.html` |
| `/moka/` | `moka/index.html` |
| `/moka-pro-max/` | `moka-pro-max/index.html` |
| `/moka-lineup/` | `moka-lineup/index.html` |
| `/assas/` | `assas/index.html` |
| `/garde-corps/` | `garde-corps/index.html` |
| `/saqr/` | `saqr/index.html` |
| `/thank-you/` | `thank-you/index.html` |

ملفات مثل `moka.html` في الجذر هي **إعادة توجيه** فقط نحو المسارات أعلاه.

## الأصول

- `css/style.css` — أنماط مشتركة
- `css/desktop.css` — تحسينات سطح المكتب
- `js/` — طلبات Google Sheets، Meta Pixel
- `img/brand/` — شعار، واتساب
- `img/trust/` — توصيل، جودة، ضمان
- `img/lineup/` — بطاقات مقارنة موكا / برو ماكس
- `img/products/{moka,moka-pro-max,assas,garde-corps,saqr}/` — hero، features، gallery لكل منتج

## التشغيل محلياً

استخدم خادماً محلياً (مثلاً Live Server أو `npx serve`) لأن المسارات تبدأ بـ `/css/` و`/img/`.

```bash
npx --yes serve .
```

ثم افتح `http://localhost:3000/`

## النشر

GitHub Pages مع `CNAME` → `prumysl.cc`. تأكد من رفع مجلدات `css/` و`img/` كاملة مع كل `index.html`.
