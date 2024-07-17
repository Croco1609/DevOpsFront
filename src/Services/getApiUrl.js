const getApiUrl = (path, apiPort = 8000) => {
    const host = window.location.hostname;
    return `http://${host}:${apiPort}/api${path}`;
};

export default getApiUrl;