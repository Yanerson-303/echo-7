document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    
    // Cargar historial y progreso
    loadHistory();
    
    terminal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminal.value.trim();
            if (command) {
                addToOutput(`<span class="command-history">> ${command}</span>`);
                processCommand(command);
                saveCommandToHistory(command);
                terminal.value = '';
            }
        }
    });
    
    function addToOutput(content) {
        const div = document.createElement('div');
        div.innerHTML = content;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }
    
    // Exponer funciones al sistema de comandos
    window.echo7 = {
        addToOutput,
        clearOutput: () => { output.innerHTML = ''; },
        getStorage: (key) => echo7Storage.load(key),
        setStorage: (key, value) => echo7Storage.save(key, value),
        updatePointsDisplay: updatePointsDisplay
    };
});

function updatePointsDisplay() {
    const display = document.getElementById('points-display');
    if (display) {
        display.textContent = `Puntos: ${pointSystem.points} | Nivel: ${pointSystem.level}`;
    }
}