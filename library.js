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

    let title = prompt("Title: ")
    let author = prompt("Author: ")
    let pages = prompt("Pages: ")
    if (typeof parseInt(pages, 10) !== 'number' || parseInt(pages, 10) < 0){
        pages = prompt("Please enter no. of pages: ")
    } 
    let read = prompt("Read?(y/n): ")
    if (read !== 'y' && read !== 'n' || typeof read !== 'string') {
        read = prompt("Read? Type 'y' or 'n': ")
    }
    if (read === 'y') {read = true}
    else {read = false}

    let book = new Book(title, author, pages, read);
    localStorage.setItem(localStorage.length, JSON.stringify(book));
    createTable(localStorage.length-1);
}

function createTable(j = 0) {
    // Create table if it doesn't exist and
    // add table headers
    if (document.querySelector('table') === null) {
        let newTable = document.createElement('table');
        document.querySelector('body').appendChild(newTable);
        let table = document.querySelector('table');

        let row = document.createElement('tr');
        let titleh = document.createElement('th');
        let authorh = document.createElement('th');
        let pagesh = document.createElement('th');
        let readh = document.createElement('th');
        titleh.textContent = 'Title';
        authorh.textContent = 'Author';
        pagesh.textContent = 'Pages';
        readh.textContent = 'Read';
        row.appendChild(titleh);
        row.appendChild(authorh);
        row.appendChild(pagesh);
        row.appendChild(readh);
        table.appendChild(row);
    }

    let table = document.querySelector('table');
    
    // Fill the table with data from
    // local storage
    for (let i = j; i < localStorage.length; i++) { 
        let book = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let row = document.createElement('tr');
        let title = document.createElement('td');
        title.textContent = book.title;
        let author = document.createElement('td');
        author.textContent = book.author;
        let pages = document.createElement('td');
        pages.textContent = book.pages;
        let read = document.createElement('td');
        read.textContent = book.read;
        let button = document.createElement('button');
        button.setAttribute('data-indexnum', `${localStorage.key(i)}`);
        button.textContent = 'DELETE';
        button.classList.add('delete');
        book = new Book(book.title, book.author, book.pages, book.read);
        row.appendChild(title)
        row.appendChild(author)
        row.appendChild(pages)
        row.appendChild(read)
        row.appendChild(button)
        table.appendChild(row);
    }
    document.querySelector('body').appendChild(table);

    // Event listener for delete buttons 
    document.querySelectorAll('.delete').forEach(btn => btn.addEventListener('click', deleteBook));
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

let button = document.createElement('button');
button.classList.add('addBook');
button.textContent = 'Add book'
document.querySelector('.addDiv').appendChild(button);
document.querySelector('.addBook').addEventListener('click', addBookToLibrary);


