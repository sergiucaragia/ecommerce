-- ─── Migrazione: categorie sportswear femminili DYA ACTIVE ──────────────────
-- Sostituisce le categorie generiche (T-Shirt, Felpe, Pantaloni, Giacche)
-- con le categorie specifiche per abbigliamento sportivo femminile.
--
-- I prodotti esistenti con category_id collegato alle vecchie categorie
-- avranno category_id = NULL (ON DELETE SET NULL nella FK).
--
-- Eseguire in Supabase SQL Editor:
--   • Progetto DEV:  https://supabase.com/dashboard/project/ynucjmhkmfwbycfauads
--   • Progetto PROD: https://supabase.com/dashboard/project/oslhffnnfrttvkzddoet
-- ────────────────────────────────────────────────────────────────────────────

DELETE FROM categories;

INSERT INTO categories (name, slug) VALUES
  ('Topuri & Bustiere',          'topuri-bustiere'),
  ('Tricouri & Tank Top-uri',    'tricouri-tank-top'),
  ('Legging-uri & Colanți',      'leggings-colanti'),
  ('Joggeri & Pantaloni comozi', 'joggeri-pantaloni'),
  ('Hanorace & Jachete',         'hanorace-jachete'),
  ('Seturi Sport',               'seturi-sport'),
  ('Rochii & Fuste sport',       'rochii-fuste-sport');
