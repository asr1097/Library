import uniqid from "uniqid";
import "./library.css";

import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc
}
from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAUFCeLmtnDpK6vBOi4gxfZoI72nWLKpJ4",
    authDomain: "library-8f57c.firebaseapp.com",
    projectId: "library-8f57c",
    storageBucket: "library-8f57c.appspot.com",
    messagingSenderId: "975354937594",
    appId: "1:975354937594:web:273f895432d06adcda4943"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore();



class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.index = uniqid();
    }

    info() {
        let readString = "read.";
        if (!this.read) {readString = "not read yet."}
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + readString;
    }
}


async function addBookToLibrary() {
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

    await dbAddBook(book)
    let table = document.querySelector('table');
    document.querySelector('body').removeChild(table);
    createTable();
    return true;
}

const dbAddBook = async(book) => {
    try {
        const docRef = await setDoc(doc(db, "books", book.index), {
          title: book.title,
          author: book.author,
          pages: book.pages,
          read: book.read,
          index: book.index
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

const dbGetBooks = async() => {
    let books = [];
    const querySnapshot = await getDocs(collection(db, "books"));

    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    books.push(doc.data());
    });
    return books;
}

async function createTable() {
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
    let books = await dbGetBooks();
    
    for (let i = 0; i < books.length; i++) { 
        let row = document.createElement('tr');

        let title = document.createElement('td');
        title.textContent = books[i].title;

        let author = document.createElement('td');
        author.textContent = books[i].author;

        let pages = document.createElement('td');
        pages.textContent = books[i].pages;

        let read = document.createElement('td');

        // create bootstrap 'checkbox' button
        let togDiv = document.createElement('div');
        togDiv.classList.add('custom-control', 'custom-switch');
        let input = document.createElement('input')
        input.type='checkbox';
        input.classList.add("custom-control-input");
        input.id = `${books[i].index}`;
        if (books[i].read === true) {input.checked = true}
        else {input.checked = false};
        let label = document.createElement('label');
        label.classList.add('custom-control-label');
        label.setAttribute('for', `${books[i].index}`);

        togDiv.appendChild(input);
        togDiv.appendChild(label);
        read.appendChild(togDiv);

        let button = document.createElement('button');
        button.setAttribute('data-indexnum', `${books[i].index}`);
        button.textContent = 'DELETE';
        button.classList.add('delete', 'btn', 'btn-danger');
        
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

const dbDeleteBook = async(index) => {
    await deleteDoc(doc(db, "books", index))
}

async function deleteBook() {
    // Get the index for item in local storage,
    // delete it and create new table
    let index = this.dataset.indexnum;
    await dbDeleteBook(index);
    let table = document.querySelector('table');
    document.querySelector('body').removeChild(table);
    createTable();
}

const dbUpdateBook = async(index, value) => {
    const bookRef = doc(db, "books", index)
    await updateDoc(bookRef, {
        read: value
    });
}

function updateRead() {
    let value;
    if (this.checked) {value = true}
    else {value = false};
    let index = this.getAttribute('id');
    dbUpdateBook(index, value);
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

createTable();


