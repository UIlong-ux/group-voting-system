class VotingSystem {
    constructor() {
        this.selfGroupDiv = document.getElementById('selfGroup');
        this.voteGroupDiv = document.getElementById('voteGroup');
        this.submitButton = document.getElementById('submitVote');
        this.votingForm = document.getElementById('voting-form');
        this.votedMessage = document.getElementById('voted-message');
        
        this.initialize();
        this.updateTexts();
    }

    initialize() {
        if (this.hasVoted()) {
            this.showVotedMessage();
            return;
        }

        this.initializeRadioGroups();
        this.submitButton.addEventListener('click', () => this.handleVoteSubmission());
    }

    initializeRadioGroups() {
        // 创建第一组单选按钮
        CONFIG.groups.forEach(group => {
            const option = this.createRadioOption('selfGroup', group);
            this.selfGroupDiv.appendChild(option);
        });

        // 监听第一组的选择变化
        this.selfGroupDiv.addEventListener('change', () => this.updateVoteOptions());
    }

    createRadioOption(name, value) {
        const div = document.createElement('div');
        div.className = 'radio-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.id = `${name}_${value}`;

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = value;

        div.appendChild(input);
        div.appendChild(label);
        return div;
    }

    updateVoteOptions() {
        const selectedGroup = document.querySelector('input[name="selfGroup"]:checked')?.value;
        
        // 清空第二组选项
        this.voteGroupDiv.innerHTML = '';
        
        // 添加新的选项（排除自己的组）
        CONFIG.groups
            .filter(group => group !== selectedGroup)
            .forEach(group => {
                const option = this.createRadioOption('voteGroup', group);
                this.voteGroupDiv.appendChild(option);
            });
    }

    handleVoteSubmission() {
        const selfGroup = document.querySelector('input[name="selfGroup"]:checked')?.value;
        const votedGroup = document.querySelector('input[name="voteGroup"]:checked')?.value;

        if (!selfGroup || !votedGroup) {
            alert('请完成所有选择！');
            return;
        }

        this.saveVote(selfGroup, votedGroup);
        this.showVotedMessage();
    }

    saveVote(selfGroup, votedGroup) {
        localStorage.setItem(CONFIG.storageKeys.hasVoted, 'true');
        localStorage.setItem(CONFIG.storageKeys.selfGroup, selfGroup);
        localStorage.setItem(CONFIG.storageKeys.votedGroup, votedGroup);

        let results = JSON.parse(localStorage.getItem(CONFIG.storageKeys.results) || '{}');
        results[votedGroup] = (results[votedGroup] || 0) + 1;
        localStorage.setItem(CONFIG.storageKeys.results, JSON.stringify(results));
    }

    hasVoted() {
        // 检查当前IP是否在管理员列表中
        const currentHost = window.location.hostname;
        if (currentHost === '61.152.208.241' || currentHost === '127.0.0.1' || currentHost === 'localhost') {
            console.log('管理员IP，允许重复投票');
            return false;
        }
        return localStorage.getItem(CONFIG.storageKeys.hasVoted) === 'true';
    }

    showVotedMessage() {
        this.votingForm.style.display = 'none';
        this.votedMessage.style.display = 'block';
    }

    updateTexts() {
        const texts = CONFIG.texts;
        // 更新页面标题
        document.querySelector('h1').textContent = texts.pageTitle;
        // 更新第一个问题标题
        document.querySelector('#selfGroupTitle').textContent = texts.selfGroupTitle;
        // 更新第二个问题标题
        document.querySelector('#voteGroupTitle').textContent = texts.voteGroupTitle;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VotingSystem();
}); 