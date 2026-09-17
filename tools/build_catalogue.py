"""Generate detail routes and an image register from the shared catalogue."""

import pathlib, json, hashlib, html, datetime, re
from PIL import Image

R = pathlib.Path(__file__).resolve().parents[1]
D = R / "dist"
products = json.loads((R / "content/catalogue.json").read_text())
for product in products:
    generated_path = f"assets/products/{product['id']}-generated-v2.png"
    if (D / generated_path).exists():
        product["image"] = generated_path
        product["imageSource"] = (
            "Built-in image generation — unified professional catalogue set"
        )
        product["imageOrigin"] = "AI-generated product image"
        product["imageStatus"] = (
            "Generated catalogue photography; client approval pending"
        )
generation_file = R / "content/generated-images.json"
generation = json.loads(generation_file.read_text()) if generation_file.exists() else {}
register_file = R / "content/image-register.json"
prior = (
    {a["assetId"]: a for a in json.loads(register_file.read_text())}
    if register_file.exists()
    else {}
)
assets = []
for p in products:
    file = D / p["image"]
    if file.exists():
        im = Image.open(file)
        width, height = im.size
        if p["imageOrigin"] == "AI-generated illustration":
            p["imageStatus"] = "Generated; client approval pending"
        checksum = hashlib.sha256(file.read_bytes()).hexdigest()
    else:
        width = height = 0
        checksum = ""
        print("MISSING", p["image"])
    version = int(re.search(r"-v(\d+)\.", p["image"]).group(1))
    assets.append(
        {
            "assetId": p["id"] + "-v" + str(version),
            "productId": p["id"],
            "sourceReference": p["reference"],
            "name": p["name"],
            "path": p["image"],
            "origin": p["imageOrigin"],
            "approvalStatus": p["imageStatus"],
            "source": p["imageSource"] or "Built-in image generation",
            "sourceCell": f'Products to review!A{p["sourceRow"]}:S{p["sourceRow"]}',
            "sha256": checksum,
            "width": width,
            "height": height,
            "version": version,
            "prompt": generation.get(p["id"], {}).get("prompt", ""),
            "generatedAt": generation.get(p["id"], {}).get("generatedAt", ""),
            "approvedBy": "",
            "approvedAt": "",
            "notes": p["note"],
        }
    )
for asset in assets:
    old = prior.get(asset["assetId"])
    if old and old["sha256"] == asset["sha256"]:
        for field in ["approvalStatus", "approvedBy", "approvedAt"]:
            asset[field] = old.get(field, asset[field])
    elif old:
        raise ValueError(
            "An existing image version was overwritten. Save a new version and retain the prior record: "
            + asset["assetId"]
        )
register_file.write_text(json.dumps(assets, indent=2, ensure_ascii=False))
(D / "catalogue.js").write_text(
    "window.COMEIIN_PRODUCTS = "
    + json.dumps(products, ensure_ascii=False, indent=2)
    + ";\n"
)
(D / "products").mkdir(exist_ok=True)
template = (D / "index.html").read_text()
for p in products:
    page = template.replace("<head>\n", '<head>\n    <base href="../" />\n', 1).replace(
        "<body>", '<body data-product="' + p["id"] + '">', 1
    )
    start = page.index("<title>")
    end = page.index("</title>", start) + 8
    page = (
        page[:start]
        + "<title>"
        + html.escape(p["name"])
        + " | Comeiin Works</title>"
        + page[end:]
    )
    (D / "products" / f'{p["id"]}.html').write_text(page)
cards = []
for a in assets:
    cards.append(
        f"""    <article>
      <img src="{a["path"]}" alt="{html.escape(a["name"])}" loading="lazy" />
      <div class="body">
        <small>{a["assetId"]}</small>
        <h2>{html.escape(a["name"])}</h2>
        <p><b>{html.escape(a["origin"])}</b></p>
        <p>{html.escape(a["approvalStatus"])}</p>
        <p>{a["width"]} × {a["height"]} · Version {a["version"]}</p>
        <a href="{a["path"]}" download>Download image</a>
        <details>
          <summary>Source & generation details</summary>
          <p>{html.escape(a["sourceCell"])}</p>
          <p>{html.escape(a["source"])}</p>
          <p>{html.escape(a["prompt"] or "No new generation prompt — existing image.")}</p>
          <p>SHA-256: {a["sha256"]}</p>
        </details>
      </div>
    </article>"""
    )
cards_markup = "\n".join(cards)
review = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Comeiin Works — Image Register</title>
    <style>
      body {{ margin: 0; background: #f1f4f6; color: #13283b; font: 16px/1.5 Arial, sans-serif; }}
      header {{ padding: 35px 5%; background: #102133; color: white; }}
      main {{ padding: 30px 5%; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }}
      h1 {{ font-size: 30px; }}
      h2 {{ font-size: 19px; }}
      article {{ background: white; border: 1px solid #d4dee5; border-radius: 5px; overflow: hidden; }}
      img {{ width: 100%; height: 230px; object-fit: contain; background: #fafafa; }}
      .body {{ padding: 22px; }}
      small {{ font-size: 13px; }}
      a {{ color: #24578f; }}
      details {{ margin-top: 20px; font-size: 14px; overflow-wrap: anywhere; }}
      summary {{ cursor: pointer; }}
      header a {{ color: white; }}
    </style>
  </head>
  <body>
    <header>
      <a href="index.html">← Website preview</a>
      <h1>Product image register</h1>
      <p>22 catalogue entries · unified generated studio catalogue set</p>
      <p>Internal review copy. Inclusion in the catalogue does not record client image approval. Approval fields are maintained in the project image register.</p>
    </header>
    <main>
{cards_markup}
    </main>
  </body>
</html>
"""
(D / "image-register.html").write_text(review)
print("Built", len(products), "detail pages and", len(assets), "image records")
