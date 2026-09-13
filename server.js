const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// مرکز ذخیره داده‌های موقت
let adminCredentials = {
    secretCode: "arash",
    password: "arash"
};

let activeAdminSessions = 0;
let users = [];

// API ورود ادمین
app.post('/api/admin/login', (req, res) => {
    const { secretCode, password } = req.body;

    if (secretCode !== adminCredentials.secretCode || password !== adminCredentials.password) {
        return res.status(401).json({ error: 'کد مخفی یا رمز عبور ادمین اشتباه است.' });
    }

    if (activeAdminSessions >= 2) {
        return res.status(403).json({ error: 'ظرفیت ورود ادمین‌ها تکمیلی است (حداکثر ۲ ادمین همزمان).' });
    }

    activeAdminSessions++;
    res.json({ success: true, message: 'ورود با موفقیت انجام شد.' });
});

// API خروج ادمین
app.post('/api/admin/logout', (req, res) => {
    if (activeAdminSessions > 0) activeAdminSessions--;
    res.json({ success: true });
});

// دریافت لیست کاربران توسط ادمین
app.get('/api/admin/users', (req, res) => {
    res.json(users);
});

// ساخت کاربر جدید توسط ادمین
app.post('/api/admin/create-user', (req, res) => {
    const { username, password, configLink, gb, days, userCount } = req.body;

    if (!username || !password || !configLink) {
        return res.status(400).json({ error: 'نام کاربری، رمز عبور و لینک کانفیگ الزامی هستند.' });
    }

    const newUser = {
        id: Date.now().toString(),
        username,
        password,
        configLink,
        gb: gb || '۵۰ گیگابایت',
        days: days || '۳۰ روز',
        userCount: userCount || '۲ کاربره',
        isLocked: false
    };

    users.push(newUser);
    res.json({ success: true, user: newUser });
});

// تغییر وضعیت/حذف کاربر
app.post('/api/admin/user-action', (req, res) => {
    const { userId, action } = req.body;
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) return res.status(404).json({ error: 'کاربر یافت نشد.' });

    if (action === 'delete') {
        users.splice(index, 1);
    } else if (action === 'toggleLock') {
        users[index].isLocked = !users[index].isLocked;
    }

    res.json({ success: true });
});

// بروزرسانی رمز و کد مخفی ادمین
app.post('/api/admin/update-credentials', (req, res) => {
    const { newSecretCode, newPassword } = req.body;
    if (newSecretCode) adminCredentials.secretCode = newSecretCode;
    if (newPassword) adminCredentials.password = newPassword;
    res.json({ success: true, message: 'اطلاعات ادمین آپدیت شد.' });
});

// ورود کاربر عادی
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'نام کاربری یا رمز عبور اشتباه است.' });
    }

    if (user.isLocked) {
        return res.status(403).json({ error: 'حساب کاربری شما مسدود شده است.' });
    }

    res.json({ success: true, user });
});

// تغییر رمز توسط خود کاربر
app.post('/api/user/change-password', (req, res) => {
    const { username, newPassword } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) return res.status(404).json({ error: 'کاربر یافت نشد.' });

    user.password = newPassword;
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
