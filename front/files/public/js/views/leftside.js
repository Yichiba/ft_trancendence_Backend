import { navigateTo } from '../router.js';

// return Response({ 'success' : True,'data' : { 'success' : True, 'friends' : active_friends, 'requests':friend_requests}} ,status=200)

console.log('from renderLeftSidebar');
export async function fetchFriends() {
    const response = await fetch(window.self.origin +'/backend' + '/friends/', {
        method: 'GET',
        credentials: 'include'
    });
    const data =  await response.json();
    if ( !data.success) {
        return (data);
    }
    return data;
}

export function renderLeftSidebar(appContainer) {

  
  // Render sidebar with fetched friends data
    async function renderSidebar(appContainer) {
        console.log("from from render side bar")

        const response = await fetchFriends();
        const friendsData = response.data.friends;
        console.log("friendsData from leeeeeeft side ",friendsData);

        const friendsHTML = friendsData.map(friend => `
            <div class="friend-item">
                <img class="friend-avatar" src="${window.self.origin}/backend${friend.profile_picture}" alt="${friend.username}'s avatar"   width="40" height="40">
                <div class="online-indicator ${friend.status ? 'online' : 'offline'}"></div>
                <div class="friend-info">
                    <div class="friend-name">${friend.username}</div>
                    <!-- Status dot instead of text -->
                </div>
            </div>
        `).join('');

        const leftSidebarHTML = `
            <div class="left-sidebar">
                <h3>Online Friends</h3>
                <div class="friends-list">
                    ${friendsHTML || '<p>No friends online.</p>'}
                </div>
                <button id="logoutBtn" class="logout-btn">Logout</button>
            </div>
        `;
        document.getElementById('leftSidebar').innerHTML = leftSidebarHTML;
        document.getElementById('logoutBtn').addEventListener('click', event => handleLogoutBtn(event, appContainer));
        document.querySelectorAll('.friend-avatar').forEach(img => {
            img.addEventListener('click', function(event) {
                const username = event.target.getAttribute('alt').split("'s")[0];
                console.log("username",username)
                navigateTo(`/profile/${username}`, appContainer);
            }); 
        });
    }

    renderSidebar(appContainer);
}

// Handle logout button click
export function handleLogoutBtn(event, appContainer) {
    event.preventDefault();

    fetch(window.self.origin +'/backend' + '/logout/', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(() => {
        console.log('Logged out successfully');
        navigateTo('/login', appContainer);  // Redirect to login page
    })
    .catch(error => {
        console.error('There was a problem with the logout operation:', error);
    });
}



export async function fetch_users(username) {
    let data
    console.log("from fetch users", window.self.origin);
        try {
        const response = await fetch(`${window.self.origin}/backend/users/${username}`, {
            method: 'GET',
            credentials: 'include'
        });
        data = await response.json();
        if (!response.ok) {
            return (data);
        }
        
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return data;
    }
}
