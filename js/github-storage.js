const GITHUB_TOKEN = 'your_github_token'; // 请注意保护好 token
const REPO_OWNER = 'your_username';
const REPO_NAME = 'your_repo';
const ISSUE_NUMBER = 1; // 用于存储数据的 issue 编号

export const GithubStorage = {
    async saveVote(voteData) {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                body: JSON.stringify(voteData)
            })
        });
        return response.json();
    },

    async getVotes() {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`);
        const comments = await response.json();
        return comments.map(comment => JSON.parse(comment.body));
    }
}; 