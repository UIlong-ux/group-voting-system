export const CONFIG = {
    // 获取组别配置
    get groups() {
        const savedGroups = localStorage.getItem('voting_system_groups');
        if (savedGroups) {
            return JSON.parse(savedGroups);
        }
        // 默认组别
        const defaultGroups = [
            "第一组",
            "第二组",
            "第三组",
            "第四组",
            "第五组"
        ];
        // 保存默认组别
        localStorage.setItem('voting_system_groups', JSON.stringify(defaultGroups));
        return defaultGroups;
    },
    
    // 获取文本配置
    get texts() {
        const savedTexts = localStorage.getItem('voting_system_texts');
        if (savedTexts) {
            return JSON.parse(savedTexts);
        }
        // 默认文本
        const defaultTexts = {
            pageTitle: "组间互评投票",
            selfGroupTitle: "你是哪一组的？",
            voteGroupTitle: "你认为哪一组表现最好？"
        };
        // 保存默认文本
        localStorage.setItem('voting_system_texts', JSON.stringify(defaultTexts));
        return defaultTexts;
    },
    
    // localStorage 键名
    storageKeys: {
        hasVoted: 'voting_system_has_voted',
        selfGroup: 'voting_system_self_group',
        votedGroup: 'voting_system_voted_group',
        results: 'voting_system_results',
        groups: 'voting_system_groups',
        texts: 'voting_system_texts'
    },

    // 管理员IP（部署时请修改为实际IP）
    adminIps: ['127.0.0.1', 'localhost', '您的实际IP'],

    // GitHub 仓库信息
    github: {
        owner: 'UIlong-ux',          
        repo: 'group-voting-system', 
        issueNumber: 1               
    }
}; 