const books = [];
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function newBook() {
    const id = +new Date();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function createElementBook(bookObject) {
    const title = document.createElement('h3');
    title.innerText = bookObject.title;

    const author = document.createElement('p');
    author.innerText = bookObject.author;

    const year = document.createElement('p');
    year.innerText = bookObject.year;

    const readBook = document.createElement('button');
    if (!bookObject.isComplete) {
        readBook.innerText = 'Selesai dibaca';
        readBook.addEventListener('click', function () {
            moveToRead(bookObject.id);
        })
    } else {
        readBook.innerText = 'Belum selesai di Baca';
        readBook.addEventListener('click', function () {
            undoRead(bookObject.id);
        })
    }
    readBook.setAttribute('class', 'green');

    const deleteBook = document.createElement('button');
    deleteBook.innerText = 'Hapus buku';
    deleteBook.setAttribute('class', 'red');
    deleteBook.addEventListener('click', function () {
        removeBook(bookObject.id);
    });

    const actionDiv = document.createElement('div');
    actionDiv.setAttribute('class', 'action');
    actionDiv.append(readBook, deleteBook);

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(title, author, year, actionDiv);
    article.setAttribute('id', bookObject.id);

    return article;
}

document.addEventListener('renderElement', function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const book of books) {
        const bookItem = createElementBook(book);
        if (!book.isComplete) {
            incompleteBookshelfList.append(bookItem);
        } else {
            completeBookshelfList.append(bookItem);
        }
    }

});

document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    inputBook.addEventListener('submit', function (event) {
        event.preventDefault();
        const bookObject = newBook();
        books.push(bookObject);
        document.dispatchEvent(new Event('renderElement'));
        saveState();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function findBook(id) {
    for (const book of books) {
        if (book.id === id) {
            return book;
        }
    }
    return null;
}

function findBookIndex(id) {
    for (const index in books) {
      if (books[index].id === id) {
        return index;
      }
    }
   
    return -1;
  }

function moveToRead(id) {
    const targetBook = findBook(id);
    if (targetBook == null) return;
    targetBook.isComplete = true;
    document.dispatchEvent(new Event('renderElement'));
    saveState();
}

function undoRead(id) {
    const targetBook = findBook(id);
    if (targetBook == null) return;
    targetBook.isComplete = false;
    document.dispatchEvent(new Event('renderElement'));
    saveState();
}

function removeBook(id) {
    const bookTarget = findBookIndex(id);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event('renderElement'));
    saveState();
}

function isStorageExist() {
    if (typeof(Storage) === undefined ) {
        alert("This browser not supporting local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function saveState() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage () {
    const jsonData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(jsonData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event('renderElement'));
}