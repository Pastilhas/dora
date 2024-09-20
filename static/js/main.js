async function fetchDirectoryContents(path = '') {
    try {
        const response = await fetch(`/getdir/${path}`);
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

function updateUIWithDirectoryContents(data = []) {
    data.sort((a, b) => a.type < b.type ? -1 : (a.type > b.type ? 1 : 0));
    const tbody = document.querySelector('.pure-table tbody');

    data.forEach(it => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td><a href="#" onclick="updateView('${it.name}', '${it.type}')">${it.name}</a></td>
            <td class="ta-center">${it.type || ''}</td>
            <td class="ta-right">${it.type == 'directory' ? '' : it.size}</td>
            <td class="ta-center">${new Date((it.atime || 0) * 1000).toLocaleString()}</td>
            <td class="ta-center">${new Date((it.mtime || 0) * 1000).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });

    // const breadcrumbs = document.querySelector('.breadcrumbs');
    // breadcrumbs.textContent = path.split('/').join(' > ');
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
    const initialContents = await fetchDirectoryContents('');
    if (initialContents) {
        updateUIWithDirectoryContents(initialContents);
    }
});