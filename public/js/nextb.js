let profileCount = 0;

document.getElementById('add-profile').addEventListener('click', function () {
            if (profileCount >= 8) {
                alert('You can only add 8 profiles at a time.');
                return;
            }
            profileCount++;
             
            const container = document.getElementById('profilesContainer');
            const profileDiv = document.createElement('div');
            profileDiv.innerHTML = `
                <div class="text-light d-flex align-items-center justify-content-start">
                    Profile - <span class="fs-3">${profileCount}<span>
                </div>                
                <div class="mb-3">
                    <label for="PostprofImage${profileCount}" class="form-label text-light  fs-4">Artist Image</label>
                    <input type="file" class="bg-light text-dark form-control" name="profileimage" accept="image/*" id="profileimage${profileCount}"
                        aria-describedby="profileimage" required>
                </div>
                <div class="d-lg-flex align-items-center gap-4">
                    <div>
                        <label for="Postrefname${profileCount}" class="form-label text-light fs-4">Reference</label>
                        <input type="text" class="bg-light text-dark form-control" name="ref" id="ref${profileCount}" aria-describedby="ref" required>
                    </div>
                    <div class="">
                        <label for="PostRef${profileCount}" class="form-label text-light fs-4">Reference Link</label>
                        <input type="url" class="bg-light text-dark form-control" name="link" id="link${profileCount}" aria-describedby="PostRef"
                            required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="PostName${profileCount}" class="form-label text-light fs-4">Artist name</label>
                    <input type="text" class="bg-light text-dark form-control" name="name" id="name${profileCount}" aria-describedby="ArtistName"
                        required>
                    <div id="AboutArtist" class="form-text text-light fs-4">About Artist</div>
                </div>
                <div class="form-floating mb-3">
                    <textarea class="bg-light text-dark form-control textarea overflow-hidden" placeholder="About Artist" name="about"
                        id="about${profileCount}" required></textarea>
                </div>
            `;
            container.appendChild(profileDiv);
        })

document.getElementById('profilesForm').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData();
    const profiles = [];

    // Loop through each profile and gather data
    for (let i = 1; i <= profileCount; i++) {
        profiles.push({
            name: document.getElementById(`name${i}`).value,
            about: document.getElementById(`about${i}`).value,
            link: document.getElementById(`link${i}`).value,
            ref: document.getElementById(`ref${i}`).value,
        });
        // Append profile images to FormData
        formData.append('profileimage', document.getElementById(`profileimage${i}`).files[0]);
    }

    // Get title and cover image
    const title = document.getElementById("title").value;
    const coverImage = document.getElementById('coverimage').files[0]; // Add cover image

    // Append profiles and title to FormData
    formData.append('profiles', JSON.stringify(profiles));
    formData.append('title', title);
    formData.append('coverimage', coverImage); // Append cover image

    // Send data to the server
    fetch('/nextbeats-post', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('An error occurred');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

