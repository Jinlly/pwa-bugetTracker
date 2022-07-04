let db;

//request function to save new transactions
const request = indexedDB.open('budgetTracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.tratget.result;
    db.createObjectStore('newTransaction', { autoIncrement: true });
};

//on error
request.onerror = function(event) {
    console.log(error.errorCode);
};

//on success run upload function
request.onsuccess = function(event) {
    db = event.tratget.result;
    if (navigator.online) {
        upload();
    }
};

//save function on disconnected submitions
function save(record) {
    const transaction = db.transaction(['newTransaction'], 'readwrite');
    const store = transaction.objectStore('newTransaction');
    store.add(record);
};

//send transactions whtn online
function uploadTransaction() {
    const transaction = db.transaction(['newTransaction'], 'readwrite');
    const store = transaction.objectStore('newTransaction');
    const getAll = store.getAll();

    //getAll on success
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                    method: 'POST',
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new_transaction'], 'readwrite');
                    const store = transaction.objectStore('new_transaction');
                    store.clear();
                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};

//listen for back online
window.addEventListener('online', uploadTransaction);