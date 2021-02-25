document.querySelectorAll('.toolbar a').forEach(aEl => aEl.addEventListener('click', function (e) {
    e.preventDefault(); 
    const command = aEl.dataset.command;  
  
    if (command == 'h1' || command == 'h2' || command == 'h3' || command == 'p') { 
        document.execCommand('formatBlock', false, command);
    } else {
        document.execCommand(command); 
    }
}))

document.getElementById('fontSize').addEventListener('change', function (e) {
    document.execCommand('fontSize', false, e.target.value); 
})