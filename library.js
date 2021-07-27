createTable();

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    let readString = "read.";
    if (!this.read) {readString = "not read yet."}
    return this.title + " by " + this.author + ", " + this.pages + " pages, " + readString
}

function addBookToLibrary() {
    // Prompt the user for data,
    // add the book to local storage
    // and add it to the table
    
    let title = document.forms['form-container']['title'].value;
    if (title === "") {
        alert("Please enter valid title.");
        return false;};

    let author = document.forms['form-container']['author'].value;
    if (author === '') {
        alert("Please enter valid author.");
        return false;};

    let pages = document.forms['form-container']['pages'].value;
    if (isNaN(pages) || parseInt(pages, 10) < 0 || pages === ''){
        alert("Please enter valid No. of pages.");
        return false;};

    let read = document.querySelector('#custom').checked;
    
    let book = new Book(title, author, pages, read);
    localStorage.setItem(findFreeIndex(), JSON.stringify(book));
    let table = document.querySelector('table');
    document.querySelector('body').removeChild(table);
    createTable();
    return true;
}

function createTable() {
    // Create table if it doesn't exist and
    // add table headers
    if (document.querySelector('table') === null) {
        let newTable = document.createElement('table');
        newTable.classList.add('table', 'table-bordered', 'table-dark');
        document.querySelector('body').appendChild(newTable);
        let table = document.querySelector('table');

        let row = document.createElement('tr');
        let titleh = document.createElement('th');
        let authorh = document.createElement('th');
        let pagesh = document.createElement('th');
        let readh = document.createElement('th');
        let btnh = document.createElement('th');
        titleh.textContent = 'Title';
        authorh.textContent = 'Author';
        pagesh.textContent = 'Pages';
        readh.textContent = 'Read';
        row.appendChild(titleh);
        row.appendChild(authorh);
        row.appendChild(pagesh);
        row.appendChild(readh);
        row.appendChild(btnh);
        table.appendChild(row);
    }

    let table = document.querySelector('table');
    
    // Fill the table with data from
    // local storage and create buttons
    // for 'read' switch and 'delete'
    for (let i = 0; i < localStorage.length; i++) { 
        let book = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let row = document.createElement('tr');

        let title = document.createElement('td');
        title.textContent = book.title;

        let author = document.createElement('td');
        author.textContent = book.author;

        let pages = document.createElement('td');
        pages.textContent = book.pages;

        let read = document.createElement('td');

        // create bootstrap 'checkbox' button
        let togDiv = document.createElement('div');
        togDiv.classList.add('custom-control', 'custom-switch');
        let input = document.createElement('input')
        input.type='checkbox';
        input.classList.add("custom-control-input");
        input.id = `customSwitch${localStorage.key(i)}`;
        if (book.read === true) {input.checked = true}
        else {input.checked = false};
        let label = document.createElement('label');
        label.classList.add('custom-control-label');
        label.setAttribute('for', `customSwitch${localStorage.key(i)}`);

        togDiv.appendChild(input);
        togDiv.appendChild(label);
        read.appendChild(togDiv);

        let button = document.createElement('button');
        button.setAttribute('data-indexnum', `${localStorage.key(i)}`);
        button.textContent = 'DELETE';
        button.classList.add('delete', 'btn', 'btn-danger');
        book = new Book(book.title, book.author, book.pages, book.read);

        let btn = document.createElement('td');
        btn.appendChild(button);

        row.appendChild(title)
        row.appendChild(author)
        row.appendChild(pages)
        row.appendChild(read)
        row.appendChild(btn)
        table.appendChild(row);
    }
    document.querySelector('body').appendChild(table);

    // Event listener for delete buttons 
    document.querySelectorAll('.delete').forEach(btn => btn.addEventListener('click', deleteBook));
    document.querySelectorAll('.custom-control-input').forEach(btn => btn.addEventListener('change', updateRead));
}

function deleteBook() {
    // Get the index for item in local storage,
    // delete it and create new table
    let index = this.dataset.indexnum;
    localStorage.removeItem(index);
    let table = document.querySelector('table');
    document.querySelector('body').removeChild(table);
    createTable();
}

function updateRead() {
    let index = this.getAttribute('id');
    index = index.substr(12);
    index = parseInt(index);
    let book = localStorage.getItem(index);
    book = JSON.parse(book);
    if (this.checked) {book['read'] = true}
    else {book['read'] = false};
    book = JSON.stringify(book);
    localStorage.setItem(index, book);
}

function findFreeIndex() {
    for (let i = 0; i < localStorage.length; i++) {
        let curKey = localStorage.getItem(i);
        if (curKey === null) {return i}
    }
    return localStorage.length
}

let button = document.createElement('button');
button.classList.add('addBook', 'btn', 'btn-primary');
button.textContent = 'Add book'
document.querySelector('.addDiv').appendChild(button);
document.querySelector('.addBook').addEventListener('click', function() {
    document.querySelector('.form-popup').classList.toggle('form-popup-hide');
    let table = document.querySelector('table');
    table.querySelectorAll('input').forEach(inp => inp.disabled = true);
    table.querySelectorAll('button').forEach(btn => btn.disabled = true);
    document.querySelector('.addBook').disabled = true;
});

document.querySelector('.add').addEventListener('click', function() {
    if (!addBookToLibrary()) {
        return;
    }
    let table = document.querySelector('table');
    table.querySelectorAll('input').forEach(inp => inp.disabled = false);
    table.querySelectorAll('button').forEach(btn => btn.disabled = false);
    document.querySelector('.addBook').disabled = false;
    document.querySelector('.form-popup').classList.toggle('form-popup-hide');
});

document.querySelector('.cancel').addEventListener('click', function() {
    let table = document.querySelector('table');
    table.querySelectorAll('input').forEach(inp => inp.disabled = false);
    table.querySelectorAll('button').forEach(btn => btn.disabled = false);
    document.querySelector('.addBook').disabled = false;
    document.forms['form-container']['title'].value = '';
    document.forms['form-container']['author'].value = '';
    document.forms['form-container']['pages'].value = '';
    document.getElementById('custom').checked = false;
    document.querySelector('.form-popup').classList.toggle('form-popup-hide');
    
});



