async function fetchDirectoryContents(path = "") {
    try {
        const response = await fetch(`/getdir`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Could not fetch directory contents:", error);
        return null;
    }
}

function updateUIWithDirectoryContents(data) {
    if (!data) return;

    const tableBody = document.querySelector('.pure-table tbody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="updateView('${item.name}', '${item.type}')">${item.name}</a></td>
            <td>${item.type}</td>
            <td>${item.size || '-'}</td>
            <td>${item.accessTime}</td>
            <td>${item.creationTime}</td>
        `;
        tableBody.appendChild(row);
    });

    const breadcrumbs = document.querySelector('.breadcrumbs');
    breadcrumbs.textContent = path.split('/').join(' > ');
}

async function updateView(name, type) {
    if (type === 'directory') {
        const currentPath = document.querySelector('.breadcrumbs').textContent.replace(/ > /g, '/');
        const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;

        const directoryContents = await fetchDirectoryContents(newPath);
        if (directoryContents) {
            updateUIWithDirectoryContents(directoryContents);
        }
    } else {
        console.log(`Opening file: ${name} of type: ${type}`);
        // Implement file opening logic here
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const initialContents = await fetchDirectoryContents('/');
    if (initialContents) {
        updateUIWithDirectoryContents(initialContents);
    }
});