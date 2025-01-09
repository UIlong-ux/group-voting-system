import { CONFIG } from './config.js';

class VoteStorage {
    constructor() {
        this.baseUrl = `https://api.github.com/repos/${CONFIG.github.owner}/${CONFIG.github.repo}/issues/${CONFIG.github.issueNumber}/comments`;
    }

    async saveVote(selfGroup, votedGroup) {
        const voteId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    body: JSON.stringify({
                        id: voteId,
                        selfGroup,
                        votedGroup,
                        timestamp: new Date().toISOString()
                    })
                })
            });
            
            if (response.ok) {
                localStorage.setItem('myVoteId', voteId);
                return true;
            }
            return false;
        } catch (error) {
            console.error('投票失败:', error);
            return false;
        }
    }

    async hasVoted() {
        const myVoteId = localStorage.getItem('myVoteId');
        if (!myVoteId) return false;

        try {
            const response = await fetch(this.baseUrl);
            const comments = await response.json();
            
            return comments.some(comment => {
                try {
                    const voteData = JSON.parse(comment.body);
                    return voteData.id === myVoteId;
                } catch {
                    return false;
                }
            });
        } catch (error) {
            console.error('检查投票状态失败:', error);
            return false;
        }
    }

    async getResults() {
        try {
            const response = await fetch(this.baseUrl);
            const comments = await response.json();
            
            const results = {};
            comments.forEach(comment => {
                try {
                    const vote = JSON.parse(comment.body);
                    results[vote.votedGroup] = (results[vote.votedGroup] || 0) + 1;
                } catch {}
            });
            return results;
        } catch (error) {
            console.error('获取结果失败:', error);
            return {};
        }
    }
}

export const voteStorage = new VoteStorage(); 