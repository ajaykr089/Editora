---
"@editora/emojis": patch
---

Fix emoji search returning "No emojis found" for most of the picker's own content. Search matches against a hand-maintained `descriptions` map, but it only covered 56 of the 247 emoji actually in the picker (77% had no description at all) - including the entire basic smiley family, every animal, every food item, every vehicle, every building, and all 17 flags. Since the emoji character itself is never a readable string, an undescribed emoji was completely unsearchable by any term, including its own name.

Found via live testing: searching "cat", "dog", "fire", "pizza", "smile", or any country flag name returned no results, even though those emoji are all in the "All"/category tabs.

Fixed by adding accurate descriptions for all 191 missing emoji, plus a few common colloquial synonyms ("smile", "happy", "love", "angry", "cool", "sad", "lol") on top of the formal Unicode names so everyday search terms work, not just the official CLDR wording. Verified live: every previously-failing term now returns the expected emoji, and insertion still works correctly end-to-end.
