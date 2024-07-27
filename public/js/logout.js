document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await response.json();

        if (response.ok) {
            // Redirect to login page
            var element = document.getElementById("exampleModel")
            element.classList.add("display")

            var LoggedIn = document.getElementById("stayLogged");
            var LoggedOut = document.getElementById("closebtn");
            LoggedOut.addEventListener('click', function () {
                window.location.replace(result.redirectUrl);
            })
            LoggedIn.addEventListener('click', stayLoggedIn);

            function stayLoggedIn() {
                element.classList.remove("display");
                LoggedIn = true;
            }
            setTimeout(() => {
                if (!LoggedIn) {
                    window.location.replace(result.redirectUrl);
                }
            }, 3000)
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// document.getElementById('delete').addEventListener('click', async (e) => {
//     const Trash = document.querySelector('#delete');

//     e.preventDefault();
//     const endpoint = `/blog/${Trash.dataset.doc}`;

//     fetch(endpoint, {
//         method: 'DELETE'
//     })
//         .then((response) => response.json())
//         .then((data) => window.location.href = data.redirect)
//         .catch(err => console.log(err));
//     console.log("deleted");
// })
// Attach event listener to the document or a common parent element
document.addEventListener('click', async (event) => {
    if (event.target.closest('.trash')) {
        const deleteButton = event.target.closest('.trash');
        const id = deleteButton.getAttribute('data-doc');
        const uploadModals = document.getElementById("uploadModal")

                setTimeout(() => {
                    uploadModals.classList.add("display")
                }, 2000)
        try {
            const response = await fetch(`/blog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const result = await response.json();                

                if (result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    // Optionally remove the deleted post from the DOM without redirect
                    deleteButton.closest('.post').remove();
                }
            } else if (response.status === 404) {
                alert('Post not found');
            } else {
                alert('Server Error');
            }
        } catch (error) {
            console.error(error);
            alert('Server Error');
        }
    }
});

const post = document.getElementById("post")
const uploadModal = document.getElementById("uploadModal")
post.addEventListener('click', function () {
    setTimeout(() => {
        uploadModal.classList.add("display")
    }, 2000)
})