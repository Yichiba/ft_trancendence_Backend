// public/js/ui/ui.js

export function initializeUI() {
    // Play audio on button hover
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseover', () => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodHag2k0M3al3OiJZi8xhcD/94ZaJzOr/f/kbEAmPPT//85VKj7///+qQipF////hj1GUP///2dNW2D///9Ma3Ju////Psx3gf///zD/hI////8t6l+Y////L7Q8rP///zOhH8D///86mQDU////Q5j24f///0yrz+7///9Xz6H7////aO1qB////3rSPBX///+Hzxkj////lMX7MP///6K8xz7///+xsx9N////wqr2W////9GhymP////gmZpr////75G2ef///wx5hYL///8dcmuK////LV1Tk////z5OOZv///9PQSej////YTQMq////3MnA7P///+EGPe7////lQnlw////6f70cv////A68TT////0tvA3P///+XLvOX////1vLvu////Bvf/////EwAAABgAAAAdAAAAIgAAACcAAAAsAAAAMQAAADYAAAA7AAAAQAAAAEUAAABKAAAATwAAAFQAAABZAAAAXgAAAGMAAABoAAAAbQAAAHIAAAB3AAAAfAAAAIEAAACGAAAAiwAAAJAAAACVAAAAmgAAAJ8AAACkAAAAqQAAAK4AAAC4AAAAvQAAAMIAAADHAAAAzAAAANEAAADWAAAA2wAAAOAAAADlAAAA6gAAAO8AAAD0AAAA+QAAAPoAAAD7AAAA/AAAAPwAAAD9AAAA/gAAAP4AAAD/AAAA/wAAAA==');
            audio.play();
        });
    });

    // Toggle notification dropdown on icon click
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationDropdown = document.querySelector('.notification-dropdown');

    // notificationIcon.addEventListener('click', () => {
    //     notificationDropdown.classList.toggle('active');
    // });

    // Close notification dropdown if clicking outside
    document.addEventListener('click', (event) => {
        if (notificationIcon && !notificationIcon.contains(event.target) && notificationDropdown) {
            notificationDropdown.classList.remove('active');
        }
    });

    // Search bar input handling
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            //('Searching for:', searchTerm);
        });
    }
}
