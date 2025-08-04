let search = document.querySelector(".search");
let usernameinp = document.querySelector(".usernameinp");
let card = document.querySelector(".card");

function getProfileData(username) {
    return fetch(`https://api.github.com/users/${username}`).then((raw) => {
        if (!raw.ok) {
            throw new Error(`Error No Such User Found!!!!!`);
        }
        return raw.json();
    })
}

function getRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos?sort=updated`).then((raw) => {
        if (!raw.ok) {
            throw new Error(`Error Fetching Repositories!!!!!`);
        }
        return raw.json();
    })
}

function decorateProfileData(details) {
    console.log(details);
    let data = `<div class="flex flex-col md:flex-row gap-6 md:gap-8">
                        <!-- Avatar -->
                        <img 
                            class="w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-slate-700 flex-shrink-0 mx-auto md:mx-0 bg-slate-700" 
                            src="${details.avatar_url}" 
                            alt="User Avatar"
                            onerror="this.onerror=null;this.src='https://placehold.co/128x128/1e293b/ffffff?text=Error';"
                        >

                        <div class="flex-1 space-y-4 w-full text-center md:text-left">
                            <!-- Name and Username -->
                            <div>
                                <h2 class="text-2xl font-bold text-white">${details.name}</h2>
                                <a href="#" class="text-blue-400 hover:underline">@${details.login}</a>
                            </div>

                            <!-- Bio -->
                            <p class="text-slate-300">
                                ${details.bio ? details.bio : "Sorry No Bio Found "}
                            </p>
                            
                            <!-- Stats with Hover Effects -->
                            <div class="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div class="text-center bg-slate-900/50 p-3 rounded-lg transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 w-24">
                                    <span class="font-bold text-xl text-white">${details.followers ? details.followers : 0}</span>
                                    <p class="text-sm text-slate-400">Followers</p>
                                </div>
                                <div class="text-center bg-slate-900/50 p-3 rounded-lg transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 w-24">
                                    <span class="font-bold text-xl text-white">${details.following ? details.following : 0}</span>
                                    <p class="text-sm text-slate-400">Following</p>
                                </div>
                                <div class="text-center bg-slate-900/50 p-3 rounded-lg transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 w-24">
                                    <span class="font-bold text-xl text-white">${details.public_repos ? details.public_repos : 0}</span>
                                    <p class="text-sm text-slate-400">Public Repos</p>
                                </div>
                            </div>

                            <!-- Details with Icons -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 text-slate-300">
                                <span class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                    </svg>
                                    <span>${details.location ? details.location : "N/A"}</span>
                                </span>
                                <span class="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h2zm4-1a1 1 0 00-1 1v1h2V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                    <span>${details.company ? details.company : "N/A"}
                                    </span>
                                </span>
                                <a href="#" class="flex items-center gap-3 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" />
                                        <path d="M8.603 16.103a4 4 0 005.656-5.656l-1.224-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a2.5 2.5 0 01-3.536-3.536l3-3a2.5 2.5 0 013.536 3.536.75.75 0 001.138.977 4 4 0 00-5.865-.225l-3 3a4 4 0 005.656 5.656z" />
                                    </svg>
                                    <span class="group-hover:text-blue-400 transition-colors">${details.blog ? details.blog : "No Blog Found...."}</span>
                                </a>
                            </div>
                        </div>
                    </div>`

    card.innerHTML = data;
}



// The issue is that the button with class "search" is inside a <form>.
// Clicking the button triggers the form's default submit behavior, which reloads the page
// before the fetch can complete. To fix this, listen for the form's submit event and call preventDefault().

let form = search.closest("form");

form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting and reloading the page
    let username = usernameinp.value.trim();

    if (username.length > 0) {
        getProfileData(username)
            .then(function (data) {
                decorateProfileData(data);
            })
            .catch(function (err) {
                alert(err.message);
            });
    } else {
        alert("Please enter a valid username");
    }
});