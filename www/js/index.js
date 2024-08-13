document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

let contacts = [];
let currentPhoto = ""; 

function selectPhoto() {
    navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY // This will select photo from library.
    });
}

function onPhotoSuccess(imageData) {
    currentPhoto = "data:image/jpeg;base64," + imageData;
    const photoPreview = document.getElementById('photoPreview');
    photoPreview.src = currentPhoto;
    photoPreview.style.display = 'block';
}

function onPhotoFail(message) {
    alert('Failed because: ' + message);
}

function addContact() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (name && phone) {
        contacts.push({ name, phone, photo: currentPhoto });
        updateContactList();
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('photoPreview').style.display = 'none';
        currentPhoto = ""; // Reset photo after adding contact
    } else {
        alert('Please enter both name and phone number.');
    }
}

function updateContactList() {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach((contact) => {
        const li = document.createElement('li');

        // Create image element for the photo
        const img = document.createElement('img');
        img.src = contact.photo;
        img.alt = "Contact Photo";
        img.style.width = "50px";
        img.style.height = "50px";

        // Create text element for name and phone
        const text = document.createElement('span');
        text.textContent = `${contact.name}: ${contact.phone}`;

        li.appendChild(img);
        li.appendChild(text);
        contactList.appendChild(li);
    });
}

function saveContacts() {
    const contactsJSON = JSON.stringify(contacts, null, 2);
    
    const fileName = "contacts.json";
    const directory = cordova.file.externalDataDirectory; 

    window.resolveLocalFileSystemURL(directory, 
        function (dirEntry) {
        dirEntry.getFile(fileName, { create: true, exclusive: false }, 
            function (fileEntry) {
            fileEntry.createWriter(
                function (fileWriter) {
                fileWriter.onwriteend = function () {
                    alert("Contacts saved to " + fileEntry.nativeURL);
                };

                fileWriter.onerror = function (e) {
                    console.error("Failed to write file: " + e.toString());
                };

                const blob = new Blob([contactsJSON], { type: "application/json" });
                fileWriter.write(blob);
            });
        }, onError);
    }, onError);
}

function onError(error) {
    console.error("File error: " + error.code);
}
