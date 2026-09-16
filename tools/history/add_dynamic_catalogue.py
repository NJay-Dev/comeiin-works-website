from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'dist/index.html';s=p.read_text()
s=s.replace('<a href="#catalogue">Our range</a>','<button class="browse-toggle" aria-expanded="false" aria-controls="category-menu">Our range <span aria-hidden="true">⌄</span></button>')
s=s.replace('</header>','<div id="category-menu" class="category-menu" hidden><div class="menu-heading"><p class="eyebrow">EXPLORE OUR RANGE</p><button class="menu-close" aria-label="Close categories">×</button></div><div id="category-links"></div><a class="text-link" href="index.html#catalogue">Browse all products ↗</a></div></header>',1)
s=s.replace('<p id="results" class="result-count" aria-live="polite"></p>','<div class="catalogue-meta"><p id="results" class="result-count" aria-live="polite"></p><div class="refinements"><label>Show<select id="listing-type"><option value="all">Products & ranges</option><option value="product">Individual products</option><option value="range">Supply ranges</option></select></label><label>Sort by<select id="sort-order"><option value="review">Catalogue order</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div></div><div id="active-filters" class="active-filters" hidden></div>')
s=s.replace('<h2>Let’s put your quote together.</h2>','<h2>Your quote list.</h2><button class="continue-shopping">← Continue browsing</button>')
s=s.replace('<script src="catalogue.js">','<div id="notice" class="notice" role="status" aria-live="polite"></div><script src="catalogue.js">')
p.write_text(s)
