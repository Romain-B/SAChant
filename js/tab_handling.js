// tab handling

function openTab(tabId) {
            // Hide all tab content
            let tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Remove active class from all buttons
            let buttons = document.querySelectorAll('.tab-button');
            buttons.forEach(btn => btn.classList.remove('active'));

            // Show the selected tab and highlight its button
            document.getElementById(tabId).classList.add('active');
            event.currentTarget.classList.add('active');
        }