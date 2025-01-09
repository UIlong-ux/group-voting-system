// 初始化 Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.x.x/firebase-database.js';

const app = initializeApp(CONFIG.firebaseConfig);
const db = getDatabase(app);

export const VoteService = {
    // 检查是否已投票
    async hasVoted(userId) {
        const snapshot = await get(ref(db, `votes/${userId}`));
        return snapshot.exists();
    },

    // 保存投票
    async saveVote(userId, selfGroup, votedGroup) {
        await set(ref(db, `votes/${userId}`), {
            selfGroup,
            votedGroup,
            timestamp: Date.now()
        });
    },

    // 获取投票结果
    async getResults() {
        const snapshot = await get(ref(db, 'votes'));
        return snapshot.val() || {};
    }
}; 