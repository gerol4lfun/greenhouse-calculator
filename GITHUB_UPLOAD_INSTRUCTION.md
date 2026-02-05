# 📤 Подробная инструкция: Загрузка проекта на GitHub

**Для не-программистов** - пошаговое руководство с картинками и объяснениями.

---

## 📋 ШАГ 1: Проверка установки Git

### 1.1. Откройте Терминал (Terminal)

**На Mac:**
- Нажмите `Cmd + Пробел` (откроется поиск Spotlight)
- Введите `Terminal` и нажмите Enter
- Или найдите в папке "Программы" → "Утилиты" → "Терминал"

### 1.2. Проверьте, установлен ли Git

В Терминале введите команду:
```bash
git --version
```

**Если Git установлен:**
- Вы увидите что-то вроде: `git version 2.39.0` или похожее
- ✅ **Переходите к ШАГУ 2**

**Если Git НЕ установлен:**
- Вы увидите: `command not found: git`
- ❌ **Нужно установить Git:**
  1. Откройте браузер
  2. Перейдите на https://git-scm.com/download/mac
  3. Скачайте и установите Git для Mac
  4. После установки перезапустите Терминал
  5. Проверьте снова: `git --version`

---

## 📋 ШАГ 2: Создание репозитория на GitHub

### 2.1. Войдите в GitHub

1. Откройте браузер
2. Перейдите на https://github.com
3. Войдите в свой аккаунт (если не вошли)

### 2.2. Создайте новый репозиторий

1. Нажмите на **зеленую кнопку "New"** (или кнопку "+" в правом верхнем углу → "New repository")
2. Заполните форму:
   - **Repository name:** `greenhouse-calculator` (или любое другое название)
   - **Description:** `Калькулятор стоимости теплиц` (опционально)
   - **Visibility:** выберите **Public** (публичный) или **Private** (приватный)
   - ❌ **НЕ СТАВЬТЕ галочки** на:
     - "Add a README file"
     - "Add .gitignore"
     - "Choose a license"
   - (Мы загрузим все файлы сами)
3. Нажмите **зеленую кнопку "Create repository"**

### 2.3. Скопируйте URL репозитория

После создания репозитория вы увидите страницу с инструкциями. **Скопируйте URL** (он будет выглядеть так):
```
https://github.com/ваш-username/greenhouse-calculator.git
```

**Сохраните этот URL** - он понадобится позже!

---

## 📋 ШАГ 3: Подготовка проекта на компьютере

### 3.1. Откройте Терминал

(Если еще не открыт)

### 3.2. Перейдите в папку проекта

В Терминале введите:
```bash
cd /Users/pavelkulcinskij/Downloads/main
```

Нажмите Enter.

**Проверка:** Вы должны увидеть что-то вроде:
```
pavelkulcinskij@MacBook main %
```

### 3.3. Проверьте, что вы в правильной папке

Введите:
```bash
ls
```

Вы должны увидеть список файлов: `index.html`, `js/`, `css/`, `README.md` и т.д.

---

## 📋 ШАГ 4: Инициализация Git репозитория

### 4.1. Инициализируйте Git

В Терминале введите:
```bash
git init
```

Вы увидите:
```
Initialized empty Git repository in /Users/pavelkulcinskij/Downloads/main/.git
```

✅ **Репозиторий создан!**

### 4.2. Настройте Git (если еще не настроен)

Введите команды (замените на свои данные):
```bash
git config user.name "Ваше Имя"
git config user.email "ваш-email@example.com"
```

**Пример:**
```bash
git config user.name "Pavel Kulcinskij"
git config user.email "pavel@example.com"
```

---

## 📋 ШАГ 5: Добавление файлов в репозиторий

### 5.1. Добавьте все файлы

В Терминале введите:
```bash
git add .
```

(Точка означает "все файлы в текущей папке")

**Ничего не произойдет визуально** - это нормально! Команда выполнилась успешно.

### 5.2. Проверьте, что файлы добавлены

Введите:
```bash
git status
```

Вы увидите список файлов зеленым цветом - это файлы, которые будут загружены.

---

## 📋 ШАГ 6: Создание первого коммита

### 6.1. Создайте коммит

В Терминале введите:
```bash
git commit -m "Initial commit: калькулятор теплиц v147"
```

Вы увидите что-то вроде:
```
[main (root-commit) abc1234] Initial commit: калькулятор теплиц v147
 X files changed, Y insertions(+)
```

✅ **Коммит создан!**

---

## 📋 ШАГ 7: Подключение к GitHub

### 7.1. Добавьте удаленный репозиторий

В Терминале введите (замените URL на ваш):
```bash
git remote add origin https://github.com/ваш-username/greenhouse-calculator.git
```

**Пример:**
```bash
git remote add origin https://github.com/pavelkulcinskij/greenhouse-calculator.git
```

### 7.2. Проверьте подключение

Введите:
```bash
git remote -v
```

Вы должны увидеть ваш URL дважды (для fetch и push).

---

## 📋 ШАГ 8: Загрузка файлов на GitHub

### 8.1. Отправьте файлы

В Терминале введите:
```bash
git push -u origin main
```

**Если это первый раз:**
- GitHub может попросить авторизацию
- Введите ваш **username** (имя пользователя GitHub)
- Введите ваш **пароль** (или Personal Access Token, если включена двухфакторная аутентификация)

**Если появилась ошибка про пароль:**
- GitHub больше не принимает обычные пароли
- Нужно создать **Personal Access Token**:
  1. Перейдите на https://github.com/settings/tokens
  2. Нажмите "Generate new token" → "Generate new token (classic)"
  3. Название: `greenhouse-calculator`
  4. Выберите срок действия (например, 90 дней)
  5. Отметьте галочку `repo` (полный доступ к репозиториям)
  6. Нажмите "Generate token"
  7. **Скопируйте токен** (он показывается только один раз!)
  8. Используйте этот токен вместо пароля

### 8.2. Дождитесь завершения

Вы увидите что-то вроде:
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Writing objects: 100% (150/150), 2.5 MiB | 1.2 MiB/s, done.
To https://github.com/ваш-username/greenhouse-calculator.git
 * [new branch]      main -> main
Branch 'main' set up to track 'remote branch 'main' from 'origin'.
```

✅ **Файлы загружены!**

---

## 📋 ШАГ 9: Проверка на GitHub

### 9.1. Откройте ваш репозиторий

1. Перейдите на https://github.com/ваш-username/greenhouse-calculator
2. Обновите страницу (F5 или Cmd+R)

### 9.2. Проверьте файлы

Вы должны увидеть все файлы проекта:
- `index.html`
- `js/`
- `css/`
- `README.md`
- и т.д.

✅ **Готово! Проект на GitHub!**

---

## 🔄 Дальнейшие обновления

Когда вы внесете изменения в файлы и захотите обновить GitHub:

1. Перейдите в папку проекта в Терминале:
   ```bash
   cd /Users/pavelkulcinskij/Downloads/main
   ```

2. Добавьте измененные файлы:
   ```bash
   git add .
   ```

3. Создайте коммит:
   ```bash
   git commit -m "Описание изменений"
   ```

4. Отправьте на GitHub:
   ```bash
   git push
   ```

---

## ❓ Частые проблемы и решения

### Проблема: "fatal: not a git repository"
**Решение:** Вы не в той папке. Убедитесь, что выполнили `cd /Users/pavelkulcinskij/Downloads/main`

### Проблема: "remote origin already exists"
**Решение:** Репозиторий уже подключен. Это нормально, продолжайте.

### Проблема: "Permission denied"
**Решение:** 
- Проверьте правильность URL репозитория
- Убедитесь, что используете Personal Access Token вместо пароля

### Проблема: "branch 'main' does not exist"
**Решение:** Используйте:
```bash
git push -u origin master
```
(вместо `main`)

---

## 📝 Краткая шпаргалка команд

```bash
# Перейти в папку проекта
cd /Users/pavelkulcinskij/Downloads/main

# Проверить статус
git status

# Добавить все файлы
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить на GitHub
git push
```

---

## ✅ Чек-лист перед загрузкой

- [ ] Git установлен (`git --version` работает)
- [ ] Репозиторий создан на GitHub
- [ ] URL репозитория скопирован
- [ ] Вы в правильной папке (`cd /Users/pavelkulcinskij/Downloads/main`)
- [ ] Git инициализирован (`git init`)
- [ ] Файлы добавлены (`git add .`)
- [ ] Коммит создан (`git commit`)
- [ ] Репозиторий подключен (`git remote add origin`)
- [ ] Файлы отправлены (`git push -u origin main`)

---

**Удачи! 🚀**

Если что-то не получается - скопируйте текст ошибки из Терминала, и я помогу разобраться.
