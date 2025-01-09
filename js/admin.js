class AdminPanel {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.showResults();
        // 每30秒自动刷新一次结果
        setInterval(() => this.showResults(), 30000);
    }

    showResults() {
        const results = JSON.parse(localStorage.getItem(CONFIG.storageKeys.results) || '{}');
        
        // 对结果进行排序
        const sortedResults = CONFIG.groups
            .map(group => ({
                name: group,
                votes: results[group] || 0
            }))
            .sort((a, b) => b.votes - a.votes);  // 按票数从高到低排序

        let resultsHtml = '<table class="results-table">';
        resultsHtml += '<tr><th>排名</th><th>组别</th><th>得票数</th></tr>';
        
        sortedResults.forEach((result, index) => {
            resultsHtml += `<tr>
                <td>${index + 1}</td>
                <td>${result.name}</td>
                <td>${result.votes}</td>
            </tr>`;
        });
        
        resultsHtml += '</table>';
        
        document.getElementById('results-table').innerHTML = resultsHtml;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
}); 