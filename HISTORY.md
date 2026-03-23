# WEB2.0 — HISTORY

Reverse-chronological log of all work on the KernPost Portal (WEB2.0).

---

## 2026-03-20 — Production Deployment (Claude Terminal)

**Tasks completed:**
1. **Wired Supabase credentials** — replaced `YOUR_SUPABASE_URL` / `YOUR_SUPABASE_ANON_KEY` placeholders with real values from Vercel env vars
2. **Fixed asset paths** — copied 22 PNGs from `OfficeUI/transperent_croped/` into `WEB2.0/office-assets/`, copied `kernbox-hero.png` from `PROTOTYPE ART/transperent/`, replaced all `../OfficeUI/transperent_croped/` references with `./office-assets/`
3. **Created GitHub repo** — `fabletech-studios/kernpost-portal`, initial commit `378b9ff`, pushed to main
4. **Deployed to Vercel** — project `kernpost-portal` (`prj_eZiCojS75JwWJWLM3fakdJdRPB7Y`), alias `kernpost-portal.vercel.app`, added `SUPABASE_URL` and `SUPABASE_ANON_KEY` env vars
5. **Verification** — page loads, auth screen renders, Supabase client initializes, all 22 office-asset PNGs return HTTP 200

**Live URL:** https://kernpost-portal.vercel.app
**GitHub:** https://github.com/fabletech-studios/kernpost-portal

**Needs manual testing:**
- Signup/signin flow with real Supabase Auth
- Agent assignment, rename, remove, pose toggle
- Mobile Agent Cards layout on 390px viewport
- Chat send functionality
- Tier selector + locked desk states

---

## 2026-03-19 — Portal Rebuild (Gemini)

- Built standalone portal from scratch (~2,090 lines)
- Clean TE/Nothing palette (--void, --base, --sage, --rose, --rust)
- Dynamic desk rendering from OFFICE_SLOT_COORDS with fillDx/fillDy calibration
- Full tier system (Spark/Core/Elite)
- Agent context modal, standing variant support, name labels
- Mission board, chat panel
- Mobile Agent Cards interface (swipeable cards, bottom sheets, carousel)
- Mock auth fallback for local development
