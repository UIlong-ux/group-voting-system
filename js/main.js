import { voteStorage } from './storage.js';

class VotingSystem {
    constructor() {
        this.form = document.getElementById('voteForm');
        this.submitButton = document.getElementById('submitVote');
        this.votedMessage = document.getElementById('votedMessage');
        this.initialize();
    }

    async initialize() {
        if (await voteStorage.hasVoted()) {
            this.showVotedMessage();
            return;
        }

        this.initializeRadioGroups();
        this.submitButton.addEventListener('click', () => this.handleVoteSubmission());
    }

    initializeRadioGroups() {
        const selfGroupContainer = document.getElementById('selfGroupContainer');
        const voteGroupContainer = document.getElementById('voteGroupContainer');
        
        CONFIG.groups.forEach(group => {
            selfGroupContainer.innerHTML += this.createRadioButton('selfGroup', group);
            voteGroupContainer.innerHTML += this.createRadioButton('voteGroup', group);
        });
    }

    createRadioButton(name, value) {
        return `
            <label class="radio-label">
                <input type="radio" name="${name}" value="${value}">
                ${value}
            </label>
        `;
    }

    async handleVoteSubmission() {
        const selfGroup = document.querySelector('input[name="selfGroup"]:checked')?.value;
        const votedGroup = document.querySelector('input[name="voteGroup"]:checked')?.value;

        if (!selfGroup || !votedGroup) {
            alert('请完成所有选择！');
            return;
        }

        if (selfGroup === votedGroup) {
            alert('不能投票给自己的组！');
            return;
        }

        const success = await voteStorage.saveVote(selfGroup, votedGroup);
        if (success) {
            this.showVotedMessage();
        } else {
            alert('投票失败，请重试！');
        }
    }

    showVotedMessage() {
        this.form.style.display = 'none';
        this.votedMessage.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VotingSystem();
}); 