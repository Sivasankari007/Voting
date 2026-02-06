/**
 * VoxRoyal Core Application Logic
 */

const App = {
    state: {
        user: null,
        currentView: 'view-landing',
        elections: [
            {
                id: 1,
                title: 'Global Environmental Council 2026',
                status: 'active',
                description: 'Election for the primary council responsible for environmental policy across all member regions.',
                candidates: ['Dr. Elara Vance', 'Silas Montgomery', 'Anya Sokolov']
            },
            {
                id: 2,
                title: 'Urban Redevelopment Initiative',
                status: 'upcoming',
                description: 'Community-led vote on the allocation of funds for the downtown metropolitan project.',
                candidates: ['Pro-Redevelopment', 'Status Quo']
            },
            {
                id: 3,
                title: 'Regional Tech Advancement Board',
                status: 'active',
                description: 'Selecting members for the regional technology advisory committee.',
                candidates: ['Jiro Tanaka', 'Elena Moretti', 'Robert Blake']
            }
        ]
    },

    init() {
        this.bindEvents();
        this.renderElections();
    },

    bindEvents() {
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showAuth('login');
        });
    },

    showAuth(mode) {
        const modal = document.getElementById('authModal');
        const title = document.getElementById('modalTitle');
        title.innerText = mode === 'login' ? 'Welcome Back' : 'Create Account';
        modal.classList.add('active');
    },

    closeAuth() {
        document.getElementById('authModal').classList.remove('active');
    },

    handleAuth() {
        // Mock authentication
        this.state.user = { name: 'Royal Voter' };
        this.closeAuth();
        this.navigate('view-dashboard');
    },

    navigate(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
        this.state.currentView = viewId;
    },

    renderElections() {
        const list = document.getElementById('electionList');
        if (!list) return;

        list.innerHTML = this.state.elections.map(election => `
            <div class="election-card glass" style="padding: 2rem;">
                <span class="status status-${election.status}">${election.status}</span>
                <h3 style="margin-bottom: 1rem; color: var(--secondary-light);">${election.title}</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem;">${election.description}</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
                    ${election.candidates.map(c => `<span class="glass" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; border-radius: 4px;">${c}</span>`).join('')}
                </div>
                <button class="btn btn-primary" style="width: 100%;" ${election.status !== 'active' ? 'disabled' : ''} onclick="App.startVoting(${election.id})">
                    ${election.status === 'active' ? 'Cast Your Vote' : 'Starts Soon'}
                </button>
            </div>
        `).join('');
    },

    startVoting(id) {
        const election = this.state.elections.find(e => e.id === id);
        if (!election) return;

        this.state.activeElection = election;
        this.state.selectedCandidate = null;

        document.getElementById('votingTitle').innerText = election.title;
        const list = document.getElementById('candidatesList');
        list.innerHTML = election.candidates.map(candidate => `
            <div class="candidate-option glass" onclick="App.selectCandidate('${candidate}', this)">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 8px;"></div>
                    <span style="font-weight: 600;">${candidate}</span>
                </div>
                <div class="radio-circle"></div>
            </div>
        `).join('');

        this.navigate('view-voting');
    },

    selectCandidate(name, element) {
        this.state.selectedCandidate = name;
        document.querySelectorAll('.candidate-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
    },

    handleVote() {
        if (!this.state.selectedCandidate) {
            alert('Please select a candidate first.');
            return;
        }

        alert(`Success! Your vote for ${this.state.selectedCandidate} has been encrypted and recorded.`);
        this.showResults(this.state.activeElection.id);
    },

    showResults(id) {
        const election = this.state.elections.find(e => e.id === id);
        this.navigate('view-results');

        const content = document.getElementById('resultsContent');
        content.innerHTML = `
            <h3 style="margin-bottom: 2rem; color: var(--secondary);">${election.title}</h3>
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${election.candidates.map((c, i) => {
            const percentage = [45, 30, 25][i] || 50; // Mock data
            return `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span style="font-weight: 600;">${c}</span>
                                <span style="color: var(--secondary);">${percentage}%</span>
                            </div>
                            <div style="height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: hidden;">
                                <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); transition: width 1s ease-out;"></div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
            <p style="margin-top: 3rem; font-size: 0.9rem; color: var(--text-muted); text-align: center;">
                Certified and Encrypted by VoxRoyal Cryptographic Engine
            </p>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    document.getElementById('submitVoteBtn').addEventListener('click', () => App.handleVote());
});
