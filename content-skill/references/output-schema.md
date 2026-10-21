# Production output schema

Return structured JSON when material feeds an app or automation.

```json
{
  "editorial_angle": {
    "traveler": "first-time independent visitor",
    "moment": "first morning after arrival",
    "decision": "how to ease into Chengdu without rushing",
    "promise": "a calm route with one memorable local ritual"
  },
  "plan_coordinates": {
    "duration": {"min_hours": 3, "max_hours": 5, "buffer_percent": 20},
    "budget": {"currency": "CNY", "min": 80, "max": 150, "basis": "per_person", "includes": ["local transport", "breakfast", "tea"]},
    "execution": {"level": "easy", "score": 3, "main_friction": "saving Chinese addresses before departure"}
  },
  "titles": ["three compact English options"],
  "caption": {
    "hook": "one natural opening",
    "body": ["short paragraphs with rhythm"],
    "save_line": "a useful, restrained call to save"
  },
  "cards": [
    {
      "page": 1,
      "role": "cover",
      "layout": "full_bleed_photo",
      "eyebrow": "CHENGDU · FIRST MORNING",
      "headline": "Your First Slow Morning",
      "subhead": "Tea, breakfast, and an easy walk after landing.",
      "facts": [],
      "image_prompt": "no embedded text",
      "image_alt": "accessible description"
    }
  ],
  "tags": ["five to eight relevant tags"],
  "sources": [
    {"claim": "...", "url": "...", "checked": "YYYY-MM-DD", "status": "official"}
  ],
  "generation_notes": {
    "visual_system": "palette, type mood, recurring motif",
    "uncertainties": ["claims needing review"],
    "ai_image_disclosure": true
  }
}
```

Every card needs a distinct role and layout. Keep factual text out of generated bitmaps so it can be edited after research updates.
