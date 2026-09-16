# Comeiin Works catalogue and image records

Source: Copy of Comeiin Works Product Review.xlsx, read without changing the original.

Selection: include client-approved Launch first rows and any additional non-removed rows with client-added technical details or images. Existing description, Request quote, On request and inherited Website reference links do not count as new client detail. No additional non-launch rows meet that criterion. Remove takes precedence over Launch first (CW-016); CW-027 is also removed. CW-032 Laboratory Safety Gear remains because the client separately approved it.

21 source groups produce 22 catalogue entries. CW-001-SLIDES is derived from J6/K6 and kept separate from microscopes. CW-017, CW-023 and CW-033 use the product details supplied within their original group rows. Original names, listing types and exact values remain in review-source.json. Categories are navigation groupings assigned during implementation, not client-supplied classifications. No prices, brands, model numbers or missing technical specifications are invented.

The embedded image spans P37:P39 but visually shows a fridge/freezer thermometer. It is associated with CW-033 (row 38) based on its subject. It is client supplied; the workbook does not separately record final image approval.

image-register.json records each catalogue image's stable ID, file, origin, source row, version, dimensions, SHA-256, prompt, generation date and approval fields. generated-images.json preserves full prompts and original generation paths. Blank approval fields mean approval has not been recorded. The browser review is image-register.html; it is a review display, not an approval database.

Existing mismatched links are replaced: CW-029 previously used syringes; CW-030 used collection tubes; CW-031 used mixers; CW-033 used balances; CW-034 used plasticware. CW-023 receives a swab-specific illustration. CW-001-SLIDES gets its own illustration. Similar client-approved groups retain distinct references even where they share a source mockup.

For image replacements, retain the previous file, create a v2 filename, update the catalogue path and append the prior record to image-history.json before regenerating the register. Keep generation prompts with the version they created. Never mark an image approved merely because it was generated or placed on the site.

Product images are illustrative except the client photo. Final specifications, models, pricing and availability still require confirmation. Source review notes and image approval details are kept out of the customer catalogue.

The quote list lasts for the current browser session and includes capacity choices and box quantities. Email submission opens a draft; it does not send an enquiry automatically. This remains a local preview with indexing disabled.

Dynamic catalogue update: expandable category navigation, combined category/search/listing-type filters, alphabetical sorting and removable filter chips. Filter state is encoded in the catalogue URL. Quick view retains specifications and capacity selection. The quote drawer confirms additions and supports continuing browsing. Related items use explicit companion links first, then the same category. Subtle product reveals, hover transitions and panel animations respect reduced-motion preferences. No additional product, stock, pricing or image claims were introduced.
