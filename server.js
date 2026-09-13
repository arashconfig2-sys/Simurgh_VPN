async function submitLogin() {
    if (isLockedOut) return;

    hideError();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();

    if (!username || !password) {
        return showError('لطفاً تمامی کادرهای نام کاربری و رمز عبور را پر کنید.');
    }

    if (isAdminMode) {
        const secretCode = document.getElementById('inputSecretCode').value.trim();
        if (!secretCode) return showError('لطفاً کد مخفی ادمین را وارد کنید.');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretCode, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                failedAttempts = 0;
                showPanel('adminDashboard');
                fetchAdminUsersList();
            } else {
                handleFailedAttempt(data.error || 'کد مخفی یا رمز عبور ادمین اشتباه است.');
            }
        } catch (err) {
            showError('خطا در ارتباط با سرور. لطفا لایو لوگ (Logs) در Railway را بررسی کنید.');
        }
    } else {
        try {
            const res = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                failedAttempts = 0;
                userData = data.user;
                renderUserDashboard();
                showPanel('userDashboard');
            } else {
                handleFailedAttempt(data.error || 'نام کاربری یا رمز عبور اشتباه است.');
            }
        } catch (err) {
            showError('خطا در ارتباط با سرور.');
        }
    }
}
