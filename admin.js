document.addEventListener('DOMContentLoaded', () => {
    const ordersBody = document.getElementById('ordersBody');
    const emptyState = document.getElementById('emptyState');
    const clearDataBtn = document.getElementById('clearDataBtn');

    // Theme Toggle Logic (Shared)
    const themeToggleBtn = document.getElementById('themeToggle');
    const iconSun = themeToggleBtn ? themeToggleBtn.querySelector('.fa-sun') : null;
    const iconMoon = themeToggleBtn ? themeToggleBtn.querySelector('.fa-moon') : null;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (iconSun && iconMoon) {
            iconSun.style.display = 'block';
            iconMoon.style.display = 'none';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            let theme = 'dark';
            if (document.body.classList.contains('light-theme')) {
                theme = 'light';
                iconSun.style.display = 'block';
                iconMoon.style.display = 'none';
            } else {
                iconSun.style.display = 'none';
                iconMoon.style.display = 'block';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Load Orders from LocalStorage
    const loadOrders = () => {
        const orders = JSON.parse(localStorage.getItem('crown_orders')) || [];

        if (orders.length === 0) {
            ordersBody.innerHTML = '';
            emptyState.style.display = 'block';
            document.getElementById('ordersTable').style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        document.getElementById('ordersTable').style.display = 'table';
        ordersBody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');

            const reqPreview = order.requirements.length > 50
                ? order.requirements.substring(0, 50) + '...'
                : order.requirements;

            const contactHtml = order.delivery === 'whatsapp'
                ? `<i class="fab fa-whatsapp" style="color: #10b981;"></i> ${order.phone}<br><small>${order.email}</small>`
                : `<i class="fas fa-envelope" style="color: var(--primary-accent);"></i> ${order.email}`;

            tr.innerHTML = `
                <td style="font-weight: 600;">${order.id}</td>
                <td style="color: var(--text-secondary);">${order.date}</td>
                <td><span style="color: white; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${order.service}</span></td>
                <td>
                    <strong>Scope:</strong> ${order.scope}<br>
                    <strong>Timeline:</strong> <span style="color: ${order.urgency === 'rush' ? '#ef4444' : 'inherit'}">${order.urgency}</span>
                </td>
                <td>${contactHtml}</td>
                <td title="${order.requirements}" style="color: var(--text-secondary); font-size: 0.9rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${reqPreview}</td>
                <td><span class="status-badge">${order.status}</span></td>
            `;
            ordersBody.appendChild(tr);
        });
    };

    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to delete all simulated order data? This cannot be undone.")) {
                localStorage.removeItem('crown_orders');
                loadOrders();
            }
        });
    }

    loadOrders();
});
