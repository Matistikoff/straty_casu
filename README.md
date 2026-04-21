# Straty času 🕐

Firefox rozšírenie, ktoré blokuje prístup na vybrané webové stránky — jednoducho zatvorí kartu, keď sa na ne pokúsiš prejsť.

## Ako to funguje?

1. **Klikneš na ikonku rozšírenia** v paneli nástrojov Firefoxu
2. **Napíšeš doménu** (napr. `reddit.com`) a klikneš **Pridať**
3. Odteraz, keď otvoríš stránku s touto doménou, **karta sa okamžite zavrie**

Rozšírenie funguje aj na:
- **subdomény** — ak zablokuješ `reddit.com`, blokuje aj `www.reddit.com`, `old.reddit.com` atď.
- **podcesty** — blokuje `youtube.com/watch?v=...`, `reddit.com/r/Slovakia` a všetky ďalšie cesty
- **presmerovanie (redirecty)** — ak ťa stránka presmeruje na zablokovanú doménu, karta sa tiež zavrie

## Inštalácia pre vývojárov (dočasná)

1. Otvor Firefox a prejdi na `about:debugging#/runtime/this-firefox`
2. Klikni **Načítať dočasný doplnok...**
3. Vyber súbor `manifest.json` z tohto repozitára
4. Rozšírenie sa objaví v paneli nástrojov

> ⚠️ Dočasné rozšírenie sa odstráni po reštarte Firefoxu. Pre trvalú inštaláciu ho treba publikovať na AMO (viď nižšie).

## Štruktúra projektu

```
straty_casu/
├── manifest.json          # Hlavný konfiguračný súbor rozšírenia
├── background.js          # Beží na pozadí, sleduje karty a zatvára blokované
├── popup/
│   ├── popup.html         # HTML štruktúra popup okna
│   ├── popup.js           # Logika popup okna (pridávanie/odstraňovanie stránok)
│   └── popup.css          # Vizuálny štýl popup okna
├── icons/
│   └── icon.svg           # Ikonka rozšírenia (nahraď vlastnou)
└── README.md
```

### Čo robí každý súbor?

#### `manifest.json`
Toto je "občiansky preukaz" rozšírenia. Firefox ho prečíta ako prvý a dozvie sa z neho:
- **name/version** — názov a verzia rozšírenia
- **permissions** — aké oprávnenia rozšírenie potrebuje (`tabs` na sledovanie kariet, `storage` na ukladanie zoznamu stránok)
- **browser_action** — definuje popup okno, ktoré sa otvorí po kliknutí na ikonku
- **background** — skript, ktorý beží na pozadí celý čas
- **browser_specific_settings** — ID pre Firefox Add-ons (AMO)

#### `background.js`
Tento skript beží nepretržite na pozadí. Sleduje udalosť `tabs.onUpdated` — vždy, keď sa zmení URL v niektorej karte, skontroluje či patrí na zablokovanú doménu. Ak áno, zavolá `browser.tabs.remove()` a karta sa zavrie.

Tiež počúva zmeny v `storage` — keď v popup okne pridáš alebo odoberieš stránku, background skript sa o tom okamžite dozvie.

#### `popup/popup.html` + `popup.js` + `popup.css`
Popup okno je vlastne mini webstránka. HTML definuje štruktúru (input pole, tlačidlo, zoznam), CSS ho štylizuje a JS obsahuje logiku:
- **normalizeDomain()** — vyčistí vstup (odstráni `https://`, `www.`, lomky)
- **addSite()** — pridá doménu do `browser.storage.local`
- **removeSite()** — odstráni doménu
- **renderSites()** — vykreslí aktuálny zoznam

Údaje sa ukladajú cez `browser.storage.local` — toto je trvalé úložisko rozšírenia, dáta prežijú reštart prehliadača.

## Vlastná ikonka

Ak chceš nahradiť dočasnú ikonku vlastnou:

1. Priprav si SVG alebo PNG súbor (odporúčané veľkosti: 48×48 a 96×96 px)
2. Nahraď súbor `icons/icon.svg` svojím
3. Ak používaš PNG, uprav `manifest.json`:

```json
"icons": {
  "48": "icons/icon-48.png",
  "96": "icons/icon-96.png"
},
"browser_action": {
  "default_icon": {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png"
  }
}
```

## Publikovanie na Firefox Add-ons (AMO)

1. Zabaľ rozšírenie do ZIP súboru (všetky súbory, nie priečinok):
   ```bash
   cd straty_casu
   zip -r straty-casu.zip manifest.json background.js popup/ icons/
   ```
2. Choď na [addons.mozilla.org](https://addons.mozilla.org/sk/developers/)
3. Klikni **Odoslať nový doplnok**
4. Nahraj ZIP súbor
5. Vyplň popis a nahraj snímky obrazovky
6. Odošli na kontrolu — Mozilla ho skontroluje a schváli (zvyčajne do pár dní)

## Licencia

Voľne použiteľné.
