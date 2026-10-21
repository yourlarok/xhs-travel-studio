# Research program

Combine traveler, moment, place, and decision axes rather than relying on one broad keyword. Generate Chinese queries for local operational detail and global-English queries for international traveler experience. Keep the original query attached to every result.

Sampling modes:

- **Daily radar:** 12–20 queries, up to 30 visible results per query; deduplicate by canonical URL.
- **Topic deep dive:** 20–40 focused queries across platforms and official sources; stop when two consecutive batches add less than 10% new themes.
- **Monitoring:** revisit selected topics weekly and compare new posts, recent reviews, and official changes.

Sampling size is a ceiling. Respect rate limits and account safeguards. Use Tripadvisor Content or Terra API for scaled access; do not scrape around API limits.

Extract structured features rather than copied prose: traveler job, friction, place/time/price/transport/food/queue/booking/language entities, traveler type, public engagement, recency, confidence, and contradictions. Cluster near-duplicates before counting demand.

