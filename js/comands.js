// Sistema de puntos
const pointSystem = {
    points: 0,
    level: 1,
    xpToNextLevel: 100,
    lastHabitDates: {},

    addPoints(action, value = null) {
        const pointValues = {
            'comando': 1,
            'tarea': 5,
            'habito': 10,
            'error': -2,
            'custom': value || 0
        };

        this.points += pointValues[action] || 0;
        this.checkLevelUp();
        this.saveProgress();
        updatePointsDisplay();
    },

    checkLevelUp() {
        if (this.points >= this.xpToNextLevel) {
            this.level++;
            this.points -= this.xpToNextLevel;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
            echo7.addToOutput('<div class="level-up">¡Nivel ' + this.level + ' alcanzado!</div>');
        }
    },

    saveProgress() {
        echo7Storage.save('pointSystem', {
            points: this.points,
            level: this.level,
            xpToNextLevel: this.xpToNextLevel,
            lastHabitDates: this.lastHabitDates
        });
    },

    loadProgress() {
        const data = echo7Storage.load('pointSystem');
        if (data) {
            this.points = data.points || 0;
            this.level = data.level || 1;
            this.xpToNextLevel = data.xpToNextLevel || 100;
            this.lastHabitDates = data.lastHabitDates || {};
        }
        updatePointsDisplay();
    }
};

// Comandos principales
function processCommand(command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    const params = args.slice(1);

    switch(cmd) {
        case 'ayuda':
            pointSystem.addPoints('comando');
            showHelp();
            break;
            
        case 'tarea':
            pointSystem.addPoints('tarea');
            handleTask(params);
            break;

        case 'habito':
            handleHabit(params);
            break;

        case 'puntos':
            showPoints();
            break;

        case 'limpiar':
            pointSystem.addPoints('comando');
            echo7.clearOutput();
            break;

        default:
            pointSystem.addPoints('error');
            echo7.addToOutput('<div class="error-message">ERROR: Comando no reconocido</div>');
    }
}

// Comandos de gamificación
function handleHabit(params) {
    const subcmd = params[0]?.toLowerCase();
    const habitName = params.slice(1).join(' ');

    if (!subcmd) {
        echo7.addToOutput('<div class="error-message">Uso: habito [add|complete] [nombre]</div>');
        return;
    }

    const today = new Date().toDateString();

    if (subcmd === 'add') {
        echo7Storage.save(`habit_${habitName}`, { created: new Date() });
        echo7.addToOutput(`<div class="success-message">Hábito "${habitName}" añadido</div>`);
        pointSystem.addPoints('habito');
    } 
    else if (subcmd === 'complete') {
        if (pointSystem.lastHabitDates[habitName] === today) {
            echo7.addToOutput('<div class="warning-message">Ya completaste este hábito hoy</div>');
            return;
        }

        pointSystem.lastHabitDates[habitName] = today;
        pointSystem.addPoints('habito');
        pointSystem.saveProgress();
        echo7.addToOutput(`<div class="success-message">+10 puntos por "${habitName}"</div>`);
    }
}

function showPoints() {
    echo7.addToOutput(`
        <div class="system-message">
        <strong>Tu progreso:</strong><br>
        - Puntos: ${pointSystem.points}<br>
        - Nivel: ${pointSystem.level}<br>
        - Siguiente nivel: ${pointSystem.xpToNextLevel - pointSystem.points} puntos
        </div>
    `);
}

// Ayuda actualizada
function showHelp() {
    const helpText = `
<div class="system-message">
<strong>Comandos disponibles:</strong><br>
- ayuda: Muestra esta ayuda<br>
- tarea [add|complete] [descripción]: Gestiona tareas (+5pts)<br>
- habito [add|complete] [nombre]: Gestiona hábitos (+10pts/día)<br>
- puntos: Muestra tu progreso<br>
- limpiar: Limpia la terminal<br>
</div>
    `;
    echo7.addToOutput(helpText);
}

// Inicializar al cargar
pointSystem.loadProgress();