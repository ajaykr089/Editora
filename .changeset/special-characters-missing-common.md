---
"@editora/special-characters": patch
---

Add several commonly-needed characters that were entirely missing from the picker - not just missing a search description, but absent from every category and the "All" tab: em dash (—), en dash (–), horizontal ellipsis (…), middle dot (·), infinity (∞), square root (√), fraction characters (¼ ½ ¾), superscript digits (¹ ² ³), micro sign (µ), and not sign (¬). A "Special Characters" picker that included dozens of obscure mathematical comparison operators but not an em dash was missing some of the most frequently needed punctuation for ordinary writing.

Also added search descriptions for characters that were already present but unsearchable by name, including the common accented vowels (é, è, ê, ë and their uppercase forms) and the remaining quotation mark variants.

Found via live testing: searching "em dash", "ellipsis", "infinity", or "e acute" all returned no results, and the characters weren't reachable from any tab either. Verified live that all of the above now appear in search and insert correctly.
