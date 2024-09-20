'use strict'

let current_dir = '';

const getdir = async (path = '') => {
    const res = await fetch(`/getdir/${path}`);

    if (!res.ok) {
        console.error(`Failed to list directory: ${res.status} ${res.statusText}`);
        return null;
    }

    return await res.json();
}

const chdir = ({ path, entries }) => {
    current_dir = path.slice(1)
    document.querySelector('.breadcrumbs').textContent = path;

    const tbody = document.querySelector('.pure-table tbody');
    tbody.innerHTML = '';
    entries
        .sort((a, b) => a.type < b.type ? -1 : (a.type > b.type ? 1 : 0))
        .forEach(it => {
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
}

const updateView = async (name = '', type = '') => {
    if (type === 'directory') {
        const dir = await getdir(`${current_dir}/${name}`);
        dir && chdir(dir);
        return;
    }

    console.log(`Opening file: ${name} of type: ${type}`);
}

const moveup = async () => {
    const last = current_dir.lastIndexOf('/');
    const path = last > 0 ? current_dir.slice(0, last) : '';
    const dir = await getdir(path);
    dir && chdir(dir);
}

document.addEventListener('DOMContentLoaded', async () => {
    const dir = await getdir(current_dir);
    dir && chdir(dir);
});