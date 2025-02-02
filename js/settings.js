class SettingsPanel {
    constructor() {
        this.groupList = document.getElementById('groupList');
        this.addGroupBtn = document.getElementById('addGroupBtn');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.resetVotesBtn = document.getElementById('resetVotesBtn');
        this.pageTitleInput = document.getElementById('pageTitle');
        this.selfGroupTitleInput = document.getElementById('selfGroupTitle');
        this.voteGroupTitleInput = document.getElementById('voteGroupTitle');
        this.initialize();
    }

    initialize() {
        this.loadGroups();
        this.loadTexts();
        this.addGroupBtn.addEventListener('click', () => this.addGroup());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetVotesBtn.addEventListener('click', () => this.resetVotes());
    }

    loadGroups() {
        const savedGroups = localStorage.getItem('voting_system_groups');
        const groups = savedGroups ? JSON.parse(savedGroups) : CONFIG.groups;
        
        this.groupList.innerHTML = '';
        
        groups.forEach((group, index) => {
            this.addGroupElement(group, index);
        });
    }

    loadTexts() {
        const texts = CONFIG.texts;
        this.pageTitleInput.value = texts.pageTitle;
        this.selfGroupTitleInput.value = texts.selfGroupTitle;
        this.voteGroupTitleInput.value = texts.voteGroupTitle;
    }

    addGroupElement(groupName = '', index) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'group-input';
        input.value = groupName;
        input.placeholder = '请输入组名';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn danger';
        deleteBtn.textContent = '删除';
        deleteBtn.onclick = () => groupDiv.remove();
        
        groupDiv.appendChild(input);
        groupDiv.appendChild(deleteBtn);
        this.groupList.appendChild(groupDiv);
    }

    addGroup() {
        this.addGroupElement();
    }

    saveSettings() {
        const inputs = this.groupList.querySelectorAll('.group-input');
        const newGroups = Array.from(inputs).map(input => input.value.trim()).filter(value => value);
        
        if (newGroups.length === 0) {
            alert('请至少添加一个组！');
            return;
        }

        const newTexts = {
            pageTitle: this.pageTitleInput.value.trim() || CONFIG.texts.pageTitle,
            selfGroupTitle: this.selfGroupTitleInput.value.trim() || CONFIG.texts.selfGroupTitle,
            voteGroupTitle: this.voteGroupTitleInput.value.trim() || CONFIG.texts.voteGroupTitle
        };

        localStorage.setItem('voting_system_groups', JSON.stringify(newGroups));
        localStorage.setItem('voting_system_texts', JSON.stringify(newTexts));
        
        Object.values(CONFIG.storageKeys).forEach(key => {
            if (key !== CONFIG.storageKeys.groups && key !== CONFIG.storageKeys.texts) {
                localStorage.removeItem(key);
            }
        });

        alert('设置已保存！');
        
        if (window.opener) {
            window.opener.location.reload();
        }
        window.location.reload();
    }

    resetVotes() {
        if (confirm('确定要重置所有投票数据吗？此操作不可恢复！')) {
            const keysToReset = [
                CONFIG.storageKeys.hasVoted,
                CONFIG.storageKeys.selfGroup,
                CONFIG.storageKeys.votedGroup,
                CONFIG.storageKeys.results
            ];
            
            keysToReset.forEach(key => {
                localStorage.removeItem(key);
            });

            alert('投票数据已重置！');
            
            if (window.opener) {
                window.opener.location.reload();
            }
            window.location.reload();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SettingsPanel();
}); 