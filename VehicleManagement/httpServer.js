
import http from 'http';
import fs from 'fs';

let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    },
    {
        id: 3,
        vehicleName: "Honda City",
        vehicleNumber: "DL10CD1234",
        type: "Sedan",
        price: 1200000
    }
];

const server = http.createServer((req, res) => {

    // Welcome Route
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Welcome to Vehicle Management System</h1>');
    }

    // Get All Vehicles
    else if (req.url === '/vehicles' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(vehicles));
    }

    // About Route
    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Vehicle Management Application</h1><p>Built using Node.js</p>');
    }

    // Static File using FS Module
    else if (req.url === '/info' && req.method === 'GET') {

        fs.readFile('./public/info.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading file');
            }
            else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        });
    }

    // Add Vehicle
    else if (req.url === '/add-vehicle' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            try {
                const vehicle = JSON.parse(body);

                const { id, vehicleName, vehicleNumber, type, price } = vehicle;

                if (
                    id === undefined ||
                    !vehicleName ||
                    !vehicleNumber ||
                    !type ||
                    price === undefined ||
                    !Number.isFinite(price) ||
                    price <= 0
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    return res.end(JSON.stringify({
                        message: 'Missing or invalid required fields'
                    }));
                }

                vehicles.push(vehicle);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Vehicle added successfully',
                    vehicle: vehicle
                }));

            }
            catch (error) {
                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON'
                }));
            }
        });
    }

    // Invalid Route
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('404 Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});