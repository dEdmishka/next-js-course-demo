/** @type {import('next').NextConfig} */
module.exports = {
    // output: 'export',
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '1337',
                pathname: '/uploads/**',
            }
        ]
    }
};