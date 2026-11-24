# Thmanyah font (ثمانية)

The Arabic text on the site uses the Thmanyah typeface. Its license allows use on
websites but **forbids redistributing the font files**, so they are not committed.

1. Download the font from Thmanyah's official page:
   https://ask.thmanyah.com/hc/en-001/articles/45993930027281-Thmanyah-Font-for-Everyone
2. Copy the OTF files into this folder, keeping their original names.
3. In `src/app/globals.css`, point each `@font-face` `src:` at the matching file
   (Sans Regular 400, Sans Medium 500, Sans Bold 700, Serif Display for headings).

Until the files are present, Arabic falls back to Tajawal (body) and Reem Kufi
(headings). The `@font-face` rules live in `src/app/globals.css`.
