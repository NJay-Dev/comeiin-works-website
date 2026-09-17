# Comeiin Works Website

Static request-for-quotation website for Comeiin Works laboratory equipment and consumables.

## Open in VS Code

1. Open VS Code.
2. Choose **File → Open Folder**.
3. Select this `Comeiin Works Website` folder.
4. Open the Command Palette and run **Tasks: Run Task → Preview website**.
5. Visit [http://127.0.0.1:8765](http://127.0.0.1:8765).

The recommended Live Server extension can also serve the `dist` folder on port `8765`.

## Project structure

- `dist/` — the complete public website deployed to hosting.
- `dist/products/` — full product pages.
- `dist/assets/` — logos, landing-page visuals and product imagery.
- `content/` — catalogue and image records used by the build tools.
- `tools/` — catalogue import and page-generation scripts.
- `source-files/` — local client source material; excluded from Git.
- `image-generation/` — generation records and selected source images.
- `.vscode/` — shared VS Code settings and tasks.
- `.github/workflows/` — GitHub Pages deployment workflow.

## Main files

- `dist/index.html` — homepage.
- `dist/catalogue.html` — full product catalogue.
- `dist/about.html` — About Us page.
- `dist/privacy.html` — privacy policy.
- `dist/style.css` — base styling.
- `dist/future.css` — current visual theme and responsive layouts.
- `dist/app.js` — catalogue and quotation interactions.
- `dist/future.js` — animated background, navigation and WhatsApp widget.

## Code formatting

The project keeps its HTML, CSS, JavaScript and Python files expanded and consistently indented for review in VS Code. The recommended Prettier extension formats the web files whenever you save them.

`dist/vanta.net.min.js` is the only intentionally compressed source file. It is the third-party Vanta NET animation library and should not be edited directly.

## Catalogue tools

Install the optional Python dependencies:

```sh
python3 -m pip install -r requirements.txt
```

Rebuild the catalogue and product pages:

```sh
python3 tools/build_catalogue.py
```

The original workbook remains unchanged. Importing a new workbook replaces extracted catalogue data, so review changes before rebuilding:

```sh
python3 tools/import_review.py
python3 tools/build_catalogue.py
```

## GitHub setup

This folder is initialized as a Git repository using the `main` branch. To connect it to a new GitHub repository:

```sh
git remote add origin https://github.com/YOUR-USERNAME/comeiin-works-website.git
git push -u origin main
```

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the publishing source. Every push to `main` will publish the contents of `dist/`. The internal image-review page and local source workbook are excluded from the published site.

## Website scope

The site supports product browsing and quotation requests. It does not include checkout, online payments, an inventory backend or automatic email delivery. The quotation form prepares an email draft for the visitor to review and send.
