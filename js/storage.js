// Sistema de almacenamiento ultra-minimalista
window.echo7Storage = {
    save(key, value) {
        localStorage.setItem(`echo7_${key}`, JSON.stringify(value));
    },
    
    load(key) {
        return JSON.parse(localStorage.getItem(`echo7_${key}`) || 'null');
    }
};