import { fetch_users } from './leftside.js';
import { renderHomePage, renderTopBar} from './home.js';
import { renderLeftSidebar } from './leftside.js';
import { renderUserProfile } from './home.js';
import { renderEditProfile } from './updateProfile.js';
import { renderChatView } from './chat.js';
import { navigateTo } from '../router.js';
function generateProfileHeader(friend,appContainer) {
    console.log("from generateProfileHeader");
    const user = JSON.parse(localStorage.getItem('me'));
    console.log("friend",friend);
    console.log("user",user);
    const profileHeaderHTML = `
    <div class="profile-header">
        <img class="profile-avatar" src="${friend.profile_picture || 'default_avatar_url'}" alt="${friend.username}'s avatar" width="150" height="150">
        <div class="profile-info">
            <h1 class="profile-name">${friend.username}</h1>
            <p class="profile-rank">Rank: Beginner</p>
            ${friend.friend ? `
                <button id="reject-btn"  class="reject-btn">Remove</button>
                <button id="send-msg-btn" class="accept-btn">Text</button>
            ` : friend.recived ? `
                <button class="accept-btn"  id="accept-btn">Accept </button>
                <button class="reject-btn"  id="reject-btn">Reject </button>
            </div>
            ` : friend.sent ? `
                <button id="reject-btn"  class="edit-profile-btn">Cancel Friend Request</button>
            ` : friend.username === user.username ? `
                    <button id="edit-profile-btn" class="edit-profile-btn">Edit Profile</button>
                ` : `
                    <button id="add-friend-btn" class="edit-profile-btn">Add Friend</button>
                `}
                <button id="close-profile-btn" class="close-profile-btn">✕</button>
            </div>
        </div>
    `;
    document.getElementById('profile-header').innerHTML = profileHeaderHTML;
    if (friend.username === user.username) {
        document.getElementById('edit-profile-btn').addEventListener('click', event => renderEditProfile(appContainer));
    }
    if (friend.friend) {
        document.getElementById('send-msg-btn').addEventListener('click', event => renderChatView(appContainer));
        document.getElementById('reject-btn').addEventListener('click', event => cancelFriend(friend,appContainer));
    }
    else if (friend.recived) {
        console.log("from recived");
        document.getElementById('accept-btn').addEventListener('click', event => acceptFriend(friend,appContainer));
        document.getElementById('reject-btn').addEventListener('click', event => cancelFriend(friend,appContainer));
    }
    else if (friend.sent) {
        document.getElementById('reject-btn').addEventListener('click', event => cancelFriend(friend,appContainer));
    }
    if(!friend.friend && !friend.recived && !friend.sent && friend.username !== user.username) {
        document.getElementById('add-friend-btn').addEventListener('click', event => addFriend(friend,appContainer));
    }

    document.getElementById('close-profile-btn').addEventListener('click', event => renderHomePage(appContainer));

}



export async function acceptFriend(friend,appContainer) {
    console.log("from acceptFriend");
    console.log('Accepting friend:', friend);
    const response = await fetch(`http://127.0.0.1:8000/accept/${friend.username}`, {   
        method: 'POST',
        credentials: 'include',
    });

    const data = await response.json();
    alert(data.message);
    navigateTo('/profile/'+friend.username,appContainer);

}




 export async function addFriend(friend,appContainer) {
    console.log("from addFriend");
    console.log('Adding friend:', friend);
    const response = await fetch(`http://127.0.0.1:8000/send/${friend.username}`, {
        method: 'POST',
        credentials: 'include',
    });

    const data = await response.json();
    alert(data.msg);
    navigateTo('/profile/'+friend.username,appContainer);
    
}


export async function cancelFriend(friend,appContainer) {
    console.log("from cancelFriend");
    console.log('canceling friend:', friend);
    const response = await fetch(`http://127.0.0.1:8000/reject/${friend.username}`, {
        method: 'POST',
        credentials: 'include',
    });
    console.log("response",response);
    const data = await response.json();
    alert(data.message);
    navigateTo('/profile/'+friend.username,appContainer);
}




function generateStatsGrid(data) {
    const profileStasHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${data.matches_played}</div>
                <div class="stat-label">Matches Played</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.win_rate}%</div>
                <div class="stat-label">Win Rate</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.tournaments_won}</div>
                <div class="stat-label">Tournaments Won</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.total_points}</div>
                <div class="stat-label">Total Points</div>
            </div>
        </div>
    `;
    document.querySelector('.profile-stats').innerHTML = profileStasHTML;
}


function generateRecentMatches(recentMatches) {
    const matchCards = recentMatches.map(match => `
        <div class="match-card">
            <div class="match-result">
                <span class="match-score ${match.result === 'win' ? 'win' : 'loss'}">${match.score}</span>
                <span>vs ${match.opponent}</span>
            </div>
            <span class="match-date">${match.date}</span>
        </div>
    `).join('');

    document.querySelector('.profile-matches').innerHTML =`
        <div class="recent-matches">
            <h2>Recent Matches</h2>
            ${matchCards || '<p>No recent matches available.</p>'}
        </div>
    `;

}


function renderNotFoundPage(appContainer, username) {
    document.getElementById('mainContent').innerHTML = `
        <div class="not-found-page">
            <h1>404 Not Found</h1>
            <p>Sorry, the profile for ${username} was not found.</p>
            <button id="close-profile-btn" class="close-profile-btn">Close</button>
        </div>
    `;
    document.getElementById('close-profile-btn').addEventListener('click', event => renderHomePage(appContainer));
}


export async function loadProfilePage(appContainer,username) {
    console.log("from loadProfilePage");
    try {
        const matchData = {
            recent_matches: [
                {
                    score: "11 - 7",
                    opponent: "Player2",
                    date: "2 hours ago",
                    result: "win"
                },
                {
                    score: "9 - 11",
                    opponent: "Player3",
                    date: "5 hours ago",
                    result: "loss"
                },
                {
                    score: "11 - 5",
                    opponent: "Player4",
                    date: "Yesterday",
                    result: "win"
                }
            ]
        };

        // Example function to fetch profile data from the server
        const response = await fetch_users(username);
        if (response.success === false) {
            renderNotFoundPage(appContainer, username);
            return;
        }
        const data=response['user'];
        // Clear and set up the main container
        appContainer.innerHTML = `
            <div id="topBar" class="top-bar"></div>
            <div id="mainContent" class="bodyElement"></div>
            <div id="leftSidebar" class="bodyElement"></div>
        `;

        // Render top bar, sidebar, and profile into placeholders
        renderTopBar(appContainer);
        renderLeftSidebar(appContainer);
        renderUserProfile(appContainer);

        // Assemble profile page HTML
        const profilePageHTML = `
            <div id ="profile-container" class="profile-container">
                <div id="profile-header"></div>
                <div class="profile-stats"></div>
                <div class="profile-matches"></div>
            </div>
            `;
            
            // Insert the profile page into the main content area
            document.getElementById('mainContent').innerHTML = profilePageHTML;
            generateProfileHeader(data,appContainer);
            generateStatsGrid(data,appContainer);
            generateRecentMatches(matchData.recent_matches,appContainer);
            
      
    } catch (error) {
        console.error("Error loading profile data:", error);
        document.getElementById('mainContent').innerHTML = `<p>Error loading profile data.</p>`;
    }
}
