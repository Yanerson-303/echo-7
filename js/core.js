// Sistema de Gamificación Automática
const game = {
    points: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,

    init() {
        this.load();
        this.checkStreak();
        this.updateUI();
        this.setupInput();
    },

    addPoints(amount, reason) {
        this.points += amount;
        
        // Subir de nivel cada 100 puntos
        if (this.points >= this.level * 100) {
            this.level++;
            this.showMessage(`🎉 ¡Nivel ${this.level} alcanzado!`);
        }
        
        this.save();
        this.updateUI();
        this.showMessage(`+${amount}pts por ${reason}`);
    },

    checkStreak() {
        const today = new Date().toDateString();
        if (this.lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.lastActiveDate === yesterday.toDateString()) {
                this.streak++;
            } else {
                this.streak = 1;
            }
            
            this.lastActiveDate = today;
            this.save();
        }
    },

    showMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        document.getElementById('output').appendChild(msg);
    },

    updateUI() {
        document.getElementById('points').textContent = this.points;
        document.getElementById('level').textContent = this.level;
        document.getElementById('streak').textContent = this.streak;
    },

    setupInput() {
        document.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = e.target.value.trim();
                if (text) this.processInput(text);
                e.target.value = '';
            }
        });
    },

    processInput(text) {
        // Reconocimiento automático de acciones
        if (text.includes('!')) {
            this.addPoints(10, 'tarea importante');
            this.showMessage(`✅ Tarea completada: "${text.replace('!', '')}"`);
        } 
        else if (text.startsWith('+')) {
            this.addPoints(5, 'acción positiva');
            this.showMessage(`🌱 Hábito registrado: "${text.substring(1)}"`);
        }
        else {
            this.addPoints(1, 'actividad');
            this.showMessage(`📝 Registrado: "${text}"`);
        }
    },

    save() {
        localStorage.setItem('echo7-game', JSON.stringify({
            points: this.points,
            level: this.level,
            streak: this.streak,
            lastActiveDate: this.lastActiveDate
        }));
    },

    load() {
        const data = JSON.parse(localStorage.getItem('echo7-game') || '{}');
        this.points = data.points || 0;
        this.level = data.level || 1;
        this.streak = data.streak || 0;
        this.lastActiveDate = data.lastActiveDate || null;
    }
};

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', () => game.init());