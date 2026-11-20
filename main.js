const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

function createWindow() {
    const win = new BrowserWindow({
        width: 450,
        height: 600,
        resizable: false,
        backgroundColor: '#313338',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    win.setMenu(null);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-token', async (event, { email, password }) => {
    try {
        const response = await axios.post('https://discord.com/api/v9/auth/login', {
            login: email,
            password: password 
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Encoding': 'gzip, compress, deflate, br'
            }
        });
        return { success: true, token: response.data.token };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message };
    }
});
