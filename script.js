document.addEventListener('DOMContentLoaded', () => {
    
    const actionButton = document.getElementById('action-btn');
    const mainTitle = document.getElementById('main-title');
    const outputText = document.getElementById('output-text');

    actionButton.addEventListener('click', () => {
        mainTitle.textContent = "Прекрасно!";
        
        const currentTime = new Date().toLocaleTimeString();
        outputText.textContent = `Кнопка успешно нажата в ${currentTime}. JavaScript работает!`;
        outputText.classList.remove('hidden');
        
        actionButton.textContent = "Готово";
        actionButton.style.background = "#28a745";
    });
});
