console.log("from generateProfileHeader");
const user = JSON.parse(localStorage.getItem('me'));
console.log("user",friend);
const profileHeaderHTML = `
    <div class="profile-header">
        <img class="profile-avatar" src="${friend.profile_picture || 'default_avatar_url'}" alt="${friend.username}'s avatar" width="150" height="150">
        <div class="profile-info">
            <h1 class="profile-name">${friend.username}</h1>
            <p class="profile-rank">Rank: Beginner</p>
            ${friend.friend ? `
                <button id="remove-friend-btn"  class="reject-btn">Remove</button>
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
}
else if (friend.recived) {
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





            return Response({ 'success' : True,'data' : { 'success' : True, 'friends' : active_friends, 'requests':friend_requests}} ,status=200)
