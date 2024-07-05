const clearButton = document.getElementById('clear-button');
if (clearButton) {
    clearButton.addEventListener('click', () => {
        clearLocalStorage();
    })
}


export function addMessageToLocalStorage(message) {
    let discussions = JSON.parse(localStorage.getItem('discussions')) || [];

    discussions.push(message);

    localStorage.setItem('discussions', JSON.stringify(discussions));
}

export function downloadDiscussion() {
    return JSON.parse(localStorage.getItem('discussions')) || [];

}

export function clearLocalStorage() {
    localStorage.clear();
    location.reload();
    alert('Le localStorage a été effacé avec succès !');
}