# Portfolio

My personal portfolio site. It's plain HTML, CSS and JavaScript, with no build step.

## Edit

- `index.html` holds all the content.
- After changing `style.css` or `script.js`, raise the `?v=` number where `index.html` links to them. Browsers keep old copies for up to 10 minutes otherwise.
- `style.css` holds the colours (the variables at the top), layout and dark mode.
- To add a project, copy one `<article class="project">` block. Add `reverse` to its class to put the picture on the other side.

## Preview

Open `index.html` in a browser.

## Publish on GitHub Pages

1. Create a public repo named **`mikugh.github.io`** on GitHub.
2. Push this folder to it:
   ```
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/mikugh/mikugh.github.io.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages** and set the source to the `main` branch, `/ (root)`.
4. After a minute the site is live at **https://mikugh.github.io**.
