//https://habr.com/post/213515/

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
const  indexedDB		= self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB || self.shimIndexedDB
var	IDBTransaction  = self.IDBTransaction || self.webkitIDBTransaction || self.msIDBTransaction,
    IDBKeyRange =  self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange,
	baseName 	    = "agendaInteligente",
	storeName 	    = "todo";

function logerr(err){
	console.log(err);
}

function connectDB(f){
	// Open (or create) the database
	var request = indexedDB.open(baseName, 10);
	request.onerror = logerr;
	request.onsuccess = function(){
		f(request.result);
	}
	request.onupgradeneeded = function(e){
		//console.log("running onupgradeneeded");
		var Db = e.currentTarget.result;//var Db = e.target.result;
		
		//uncomment if we want to start clean
		//if(Db.objectStoreNames.contains(storeName)) Db.deleteObjectStore("note");
		
		//Create store
		if(!Db.objectStoreNames.contains(storeName)) {
			var store = Db.createObjectStore(storeName, {keyPath: "id", autoIncrement:true,});  
            store.createIndex("category", "category", { unique: false });
            store.createIndex("content", "content", { unique: false });
            store.createIndex("createdAt", "createdAt", { unique: false });
            store.createIndex("date", "date", { unique: false });
            store.createIndex("done", "done", { unique: false });
            store.createIndex("notification", "notification", { unique: false });


			// store.createIndex("todo", ["todo.last", "todo.first"], { unique: false });
		}
		connectDB(f);
	}
}

function get(id,f){
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readonly").objectStore(storeName).get(id);
		transaction.onerror = logerr;
		transaction.onsuccess = function(){
			f(transaction.result ? transaction.result : -1);
		}
	});
}

function getAll(f){
	connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}



function up(obj){//obj with id
	del(obj.id,'up');
	add(obj,'up');
}

function add(obj,info){
    console.log(obj)
	info = typeof info !== 'undefined' ? false : true;
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
		var objectStoreRequest = objectStore.add(obj);
		objectStoreRequest.onerror = logerr;
		objectStoreRequest.onsuccess = function(){
			if(info)
				{console.log("Rows has been added");}
			else
				{console.log("Rows has been updated");}
			console.info(objectStoreRequest.result);
		}
	});
}

function del(id,info){
	info = typeof info !== 'undefined' ? false : true;
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
		var objectStoreRequest = objectStore.delete(id);
		objectStoreRequest.onerror = logerr;
		objectStoreRequest.onsuccess = function(){
			if(info)
				console.log("Rows has been deleted: ", id);
		}
	});
}

function deleteItem(id,info){
	connectDB(function(db){
        // var  keyRangeValue = IDBKeyRange.only(id);

		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
        var objectStore2 = objectStore.index('createdAt');
        var range = IDBKeyRange.only(parseInt(id));
        console.log(range)
        objectStore2.openCursor(range).onsuccess = (event) => {
            const cursor = event.target.result;
            console.log(cursor)
            // cursos.con
            if(cursor){
                objectStore.delete(cursor.primaryKey);
                cursor.continue();
            }

        };
    });


	// info = typeof info !== 'undefined' ? false : true;
	// connectDB(function(db){
    //     const keyRangeValue = IDBKeyRange.bound("createdAt", "F");
    //     console.log(keyRangeValue)
	// 	var transaction = db.transaction([storeName], "readwrite");
	// 	var objectStore = transaction.objectStore(storeName);
	// 	var objectStoreRequest = objectStore.delete({createdAt:id});
	// 	// objectStoreRequest.onerror = logerr;
	// 	// objectStoreRequest.onsuccess = function(){
	// 	// 	if(info)
	// 	// 		console.log("Rows has been deleted: ", id);
	// 	// }
	// });
}

function del(id,info){
	info = typeof info !== 'undefined' ? false : true;
	connectDB(function(db){
		var transaction = db.transaction([storeName], "readwrite");
		var objectStore = transaction.objectStore(storeName);
		var objectStoreRequest = objectStore.delete(id);
		objectStoreRequest.onerror = logerr;
		objectStoreRequest.onsuccess = function(){
			if(info)
				console.log("Rows has been deleted: ", id);
		}
	});
}

// //add data
// add();
// add({word:'two',data:200});
// add({word:'three',data:300});
// add({word:'seven',data:700});

// //edit data
// up({word:'five',data:500,id:1});

// //delete
// del(3);

// //get data
func = async function(result){
	console.log(result);
    return await result;
};



getAll( (e) => {
    console.log(e)
} )

