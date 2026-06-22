# ✦ Psyche App — Руководство по запуску

---

## Шаг 1 — У вас уже есть Supabase проект ✓

Из окна **Connect to your project** скопируйте два значения из блока `.env.local`:

- **URL** — строка после `NEXT_PUBLIC_SUPABASE_URL=`  
  Пример: `https://gczygvkpsbhbqilotde.supabase.co`

- **Key** — строка после `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`  
  Пример: `sb_publishable_TE_UeX6aRK2rMzkq--T1mA_pNwj7aam`

Сохраните их в блокноте — понадобятся на шаге 4.

---

## Шаг 2 — Создать таблицу в базе данных

1. В Supabase слева нажмите **SQL Editor**
2. Нажмите **New query** и вставьте весь код ниже:

```sql
create table characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text default '',
  birthdate text default '',
  behavior text default '',
  childhood text default '',
  fear text default '',
  desire text default '',
  wound text default '',
  mask text default '',
  image text,
  analyses jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table characters enable row level security;

create policy "Users manage own characters"
  on characters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

3. Нажмите **Run** (зелёная кнопка справа)
4. Должно написать: "Success. No rows returned"

---

## Шаг 3 — Загрузить код на GitHub

1. Зайдите на **https://github.com**
2. Нажмите **+** → **New repository**
3. Название: `psyche-app`, поставьте **Public**, нажмите **Create repository**
4. На следующей странице нажмите ссылку **uploading an existing file**
5. Перетащите ВСЕ файлы из папки `psyche-app` (все сразу)
6. Нажмите зелёную кнопку **Commit changes**

---

## Шаг 4 — Развернуть на Vercel

1. Зайдите на **https://vercel.com** → нажмите **Sign Up** → выберите **Continue with GitHub**
2. Нажмите **Add New → Project**
3. Найдите `psyche-app` в списке и нажмите **Import**
4. Раскройте раздел **Environment Variables** (он в самом низу страницы)
5. Добавьте первую переменную:
   - **Name:** `REACT_APP_SUPABASE_URL`
   - **Value:** ваш URL из шага 1 (например `https://gczygvkpsbhbqilotde.supabase.co`)
   - Нажмите **Add**
6. Добавьте вторую переменную:
   - **Name:** `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
   - **Value:** ваш Key из шага 1 (например `sb_publishable_TE_...`)
   - Нажмите **Add**
7. Нажмите **Deploy**
8. Подождите 2-3 минуты
9. Получите ссылку вида `psyche-app-xxxx.vercel.app` 🎉

---

## Шаг 5 — Последний шаг: настроить авторизацию

Чтобы регистрация работала правильно:

1. В Supabase слева → **Authentication** → **URL Configuration**
2. В поле **Site URL** введите вашу ссылку с Vercel:  
   `https://psyche-app-xxxx.vercel.app`
3. В разделе **Redirect URLs** нажмите **Add URL** и добавьте ту же ссылку
4. Нажмите **Save**

---

## Готово! 🎉

- Откройте вашу ссылку Vercel и зарегистрируйтесь
- Данные сохраняются автоматически (значок "✓ сохранено" в шапке)
- Поделитесь ссылкой с друзьями — каждый создаёт свой аккаунт
- При следующем входе все персонажи будут на месте

---

## Если что-то пошло не так

| Проблема | Решение |
|----------|---------|
| Белый экран | Проверьте переменные в Vercel → Settings → Environment Variables |
| Ошибка при входе | Проверьте Site URL в Supabase → Authentication |
| Не сохраняется | Убедитесь что SQL из шага 2 выполнен (кнопка Run нажата) |
| Письмо не приходит | Проверьте папку Спам |
