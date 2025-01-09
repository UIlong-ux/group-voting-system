import { CONFIG } from './config.js';
import { voteStorage } from './storage.js';

class AdminPanel {
    constructor() {
        this.initialize();
    }

    async initialize() {
        // 检查是否是管理员IP
        if (!this.checkAdminAccess()) {
            document.body.innerHTML = '<div class="container"><h1>访问被拒绝</h1><p>您没有权限访问此页面</p></div>';
            return;
        }

        await this.displayResults();
    }

    checkAdminAccess() {
        // 在开发环境中总是允许访问
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return true;
        }
        return CONFIG.adminIps.includes(window.location.hostname);
    }

    async displayResults() {
        const results = await voteStorage.getResults();
        const resultsTable = document.getElementById('results-table');
        
        // 创建表格
        let html = `
            <table class="results-table">
                <thead>
                    <tr>
                        <th>组别</th>
                        <th>获得票数</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 添加每个组的结果
        CONFIG.groups.forEach(group => {
            html += `
                <tr>
                    <td>${group}</td>
                    <td>${results[group] || 0}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="total-votes">
                总投票数: ${Object.values(results).reduce((a, b) => a + b, 0)}
            </div>
        `;

        resultsTable.innerHTML = html;
    }
}

// 初始化管理面板
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
}); 