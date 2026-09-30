# Privát Kutya Admin

Teljes, privát kutyatenyésztési, kennel-, kölyökkutya-átadási, egészségügyi, értékesítési és pénzügyi adminisztrációs webalkalmazás Next.js + Supabase/PostgreSQL alapon.

## Funkciók
- privát email/jelszó admin belépés, védett `/admin/*` útvonalak és kijelentkezés
- központi kutyaadatbázis: egy kutya = egy rekord, státuszváltással
- kölykök, elérhető/foglalt/eladott/felnőtt nézetek
- anya- és kan kutyák közös központi rekordból
- tüzelési ciklusok, automatikus időtartam
- pároztatások, automatikus 63 napos ellési becslés
- vemhességek és almok
- oltások, féreghajtások, egészségügyi események
- kennelkezelés pontosan 6 kennellel
- kennel-hozzárendelési előzmények
- minden kennelhez külön napi checklist és történeti rekord
- kennel naptár
- kölyökkutya átadási checklist 0–100% készültséggel
- vevők és érdeklődők
- eladások, foglalók, további befizetések, kiadások, egyenleg
- dokumentum/fotó/videó feltöltés privát Supabase Storage-ba
- tenyésztési naptár
- dashboard és következő 14 napos teendők
- CSV export a kutyalistából
- mobilbarát kezelőfelület, magyar nyelvű UI

## Telepítés
1. Hozz létre Supabase projektet.
2. SQL Editorban futtasd a `supabase/schema.sql` teljes fájlt.
3. Authentication / Providers / Email alatt használj admin felhasználót és kapcsold ki a nyilvános Sign Up lehetőséget.
4. `.env.example` → `.env.local`, majd töltsd ki a Supabase URL-t és anon kulcsot.
5. `npm install`
6. `npm run dev`

## Biztonság
- middleware védi az admin oldalakat.
- minden üzleti tábla RLS-t használ és csak hitelesített sessionnel olvasható/írható.
- a média bucket privát.
- pontosan 6 kennel seedelődik; a kennel ID 1–6 tartományra van korlátozva.
- a napi kennel checklist kulcsa `(kennel_id, task_date, task_key)`, így a hat kennel adatai nem keverednek.
- egy kutya egy időben legfeljebb egy aktív kennel-hozzárendelésben szerepelhet.
- a törlés helyett a kutyák státusza archiválható, így a kapcsolatok megmaradnak.
  
