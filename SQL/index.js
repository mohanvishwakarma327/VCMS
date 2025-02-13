// const { faker } = require('@faker-js/faker'); // Use require() instead of import
// const mysql = require('mysql2'); // Import MySQL

// // Create the connection to database
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'vcnow',
//     password: 'Mohansanty@7', // Make sure your credentials are correct
// });

// // Connect to MySQL
// connection.connect((err) => {
//     if (err) {
//         console.error('❌ Database connection failed: ', err);
//         return;
//     }
//     console.log('✅ Connected to the MySQL database.');
// });

// // Run a sample query to show tables
// connection.query('SHOW TABLES;', (err, result) => {
//     if (err) {
//         console.error('❌ Error executing query: ', err);
//         return;
//     }
//     console.log('✅ Tables in the database:', result);
// });

// connection.end();

// const createRandomUser = () => {
//     return {
//         userid: faker.string.uuid(),
//         username: faker.internet.username(), // Updated method
//         email: faker.internet.email(),
//         phone: faker.phone.number(), // Corrected method
//         website: faker.internet.url(),
//         address: {
//             street: faker.location.streetAddress(),
//             city: faker.location.city(),
//             state: faker.location.state(),
//             country: faker.location.country(),
//             zipCode: faker.location.zipCode(),
//         },
//         company: {
//             name: faker.company.name(), // Corrected method
//             catchPhrase: faker.company.catchPhrase(),
//             bs: faker.company.buzzPhrase(), // Corrected method
//         }
//     };
// };

// const user = createRandomUser();
// console.log(user);

// // Close the connection after all queries are executed
// connection.end((err) => {
//     if (err) {
//         console.error('❌ Error closing the connection: ', err);
//         return;
//     }
//     console.log('✅ Database connection closed.');
// });
