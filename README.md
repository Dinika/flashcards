# Tab Notes

This repository contains the source code for the browser extension "Tab Notes" which aids memorize notes, words, answers, anything you'd like to memorize using the [flashcards technique](https://en.wikipedia.org/wiki/Flashcard).

It also fetches a new word of the day using the [WordNik api](https://www.wordnik.com/word-of-the-day) to show as a flashcard everyday the extension is used.

The extension is inspired by the really good extension I have used and loved called [FlashTabs](https://chromewebstore.google.com/detail/flashtabs/gcgdbnfebnhdbffnohjibaomkiepmfnb?pli=1).
I wanted to extend it to fetch a word of the day daily for me. At the time of writing, the FlashTabs extension is available in Firefox, Chrome, and Edge so please check it out if you don't need the "word of the day" feature.

## Building extension

1. `npm run build`
2. Modify build output:

```
After building your React app, the index.html file will reference JavaScript and CSS files with hashed names. You need to ensure these files are correctly loaded in the extension.

Open the build/index.html file.
Replace all relative paths (e.g., src="/static/...) with relative paths suitable for extensions (e.g., src="./static/...).
```

3. Package the Extension

```
1. Copy the following files into a new folder (e.g., firefox-extension):

The contents of the build folder.
The manifest.json file.
icon.png

firefox-extension/
├── assets/
├── index.html
├── manifest.json
├── icon.png
```

4. Build zip file

```
zip -r firefox-extension.zip ./manifest.json assets/ index.html  icon.png
```

## License

The code and the extension(s) are licensed under GNU GENERAL PUBLIC LICENSE Version 3.

Feel free to clone, modify, fork it but the modified copy of this code MUST be made free and open and should give suitable attributions to the original authors (me - 😇🫣).
m
