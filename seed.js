var express                         = require("express"),
    app                             = express(),
    router                          = express.Router();
//======================================================================================================
//                                      MONGOOSE CONFIG
//======================================================================================================
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = 'mongodb://root:root@192.168.254.150:27017/DJV-Test?directConnection=true&authSource=admin';
// var mongoDB = 'mongodb://root:root@192.168.254.150:27017/DJV?directConnection=true&authSource=admin';
//Get the default connection
// mongoose.connect(mongoDB, { useNewUrlParser: true });
//connection with declaired pool size
mongoose.connect(mongoDB, {
    maxPoolSize: 50,
    // bufferMaxEntries: 0,
    // reconnectTries: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ============================================================
// Seed
// ============================================================
// seed the database with initial data
var Client = require("./models/client");
var Product = require("./models/product");
var User = require("./models/users");
// var Supply = require("./models/supply");
// var InventoryLedger = require("./models/ledgerInventory");
var clientList = [];
var productList = [];
var userList = [];
clientList.push({
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "David John",
    LastName: "Villamin Sr.",
    FullName: "David John Villamin",
    BusinessName: "DJV IT Solutions",
    Email: "davidjohnvillamin@gmail.com",
    ContactDetails: [
        "09155443789",
        "09204271113"
    ],
    Address: {
        FullAddress: "Blk 29 Lot 12 Gentree Villas, Pasong Kawayan 1 General Trias, Cavite 4107",
        AddressLine: "Blk 29 Lot 12 Gentree Villas, Pasong Kawayan 1",
        City: "General Trias, Cavite",
        Zip: "4107"
    },
    Notes: "Test Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Juan",
    LastName: "Dela Cruz",
    FullName: "Juan Dela Cruz",
    BusinessName: "JDC Enterprises",
    Email: "juandelacruz@gmail.com"
    , ContactDetails: [
        "09171234567",
        "09219876543"
    ],
    Address: {
        FullAddress: "1234 Sample St, Sample City, Sample Province 1234",
        AddressLine: "1234 Sample St",
        City: "Sample City, Sample Province",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Maria",
    LastName: "Santos",
    FullName: "Maria Santos",
    BusinessName: "",
    Email: "mariasantos@gmail.com", 
    ContactDetails: [
        "09187654321",
        "09212345678"
    ],
    Address: {
        FullAddress: "5678 Example Ave, Example City, Example Province 5678",
        AddressLine: "5678 Example Ave",
        City: "Example City, Example Province",
        Zip: "5678"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "John",
    LastName: "Doe",
    FullName: "John Doe",
    BusinessName: "JD Enterprises",
    Email: "johndoe@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Jane",
    LastName: "Smith",
    FullName: "Jane Smith",
    BusinessName: "JS Enterprises",
    Email: "janesmith@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Alice",
    LastName: "Johnson",
    FullName: "Alice Johnson",
    BusinessName: "AJ Solutions",
    Email: "alicejohnson@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Bob",
    LastName: "Williams",
    FullName: "Bob Williams",
    BusinessName: "BW Services",
    Email: "bobwilliams@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Charlie",
    LastName: "Brown",
    FullName: "Charlie Brown",
    BusinessName: "CB Solutions",
    Email: "charliebrown@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "David",
    LastName: "Johnson",
    FullName: "David Johnson",
    BusinessName: "DJ Solutions",
    Email: "davidjohnson@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
},{
    CreatedDate: "2024-06-12T08:51:28.968Z",
    FirstName: "Eve",
    LastName: "Davis",
    FullName: "Eve Davis",
    BusinessName: "ED Enterprises",
    Email: "evedavis@gmail.com",
    ContactDetails: [
        "09123456789",
        "09234567890"
    ],
    Address: {
        FullAddress: "1234 Main St, Anytown, Anyprovince 1234",
        AddressLine: "1234 Main St",
        City: "Anytown, Anyprovince",
        Zip: "1234"
    },
    Notes: "Sample Notes",
    Transaction: [],
    Devices: [],
});
productList.push({
    Code: "PRD-001",
    Name: "SSD Samsung Model 1 1TB",
    Description: "SSD Samsung Model 1 1TB",
    Type: "SSD",
    withBrand: true,
    Brand: "Samsung",
    withModel: true,
    Model: "Model 1",
    withSerial: true,
    Notes: "Sample Notes",
    idealPrice: 5000,
},{
    Code: "PRD-002",
    Name: "HDD Western Digital 2TB",
    Description: "HDD Western Digital 2TB",
    Type: "HDD",
    withBrand: true,
    Brand: "Western Digital",
    withModel: true,
    Model: "Model 2",
    withSerial: false,
    Notes: "Sample Notes",
    idealPrice: 3000,
},{
    Code: "PRD-003",
    Name: "RAM Corsair 16GB",
    Description: "RAM Corsair 16GB",
    Type: "RAM",
    withBrand: true,
    Brand: "Corsair",
    withModel: true,
    Model: "Model 3",
    withSerial: true,
    Notes: "Sample Notes",
    idealPrice: 2000,
},{
    Code: "PRD-004",
    Name: "Motherboard ASUS Model X",
    Description: "Motherboard ASUS Model X",
    Type: "Motherboard",
    withBrand: true,
    Brand: "ASUS",
    withModel: true,
    Model: "Model X",
    withSerial: false,
    Notes: "Sample Notes",
    idealPrice: 8000,
},{
    Code: "PRD-005",
    Name: "CPU Intel i7 10th Gen",
    Description: "CPU Intel i7 10th Gen",
    Type: "CPU",
    withBrand: true,
    Brand: "Intel",
    withModel: true,
    Model: "i7 10th Gen",
    withSerial: true,
    Notes: "Sample Notes",
    idealPrice: 15000,
},{
    Code: "PRD-006",
    Name: "GPU NVIDIA RTX 3060",
    Description: "GPU NVIDIA RTX 3060",
    Type: "GPU",
    withBrand: true,
    Brand: "NVIDIA",
    withModel: true,
    Model: "RTX 3060",
    withSerial: false,
    Notes: "Sample Notes",
    idealPrice: 12000,
},{
    Code: "PRD-007",
    Name: "Power Supply Corsair 750W",
    Description: "Power Supply Corsair 750W",
    Type: "Power Supply",
    withBrand: true,
    Brand: "Corsair",
    withModel: true,
    Model: "750W",
    withSerial: true,
    Notes: "Sample Notes",
    idealPrice: 6000,
},{
    Code: "PRD-008",
    Name: "Case NZXT H510",
    Description: "Case NZXT H510",
    Type: "Case",
    withBrand: true,
    Brand: "NZXT",
    withModel: true,
    Model: "H510",
    withSerial: false,
    Notes: "Sample Notes",
    idealPrice: 4000,
},{
    Code: "PRD-009",
    Name: "Monitor Dell 24 inch",
    Description: "Monitor Dell 24 inch",
    Type: "Monitor",
    withBrand: true,
    Brand: "Dell",
    withModel: true,
    Model: "24 inch",
    withSerial: true,
    Notes: "Sample Notes",
    idealPrice: 8000,
},{
    Code: "PRD-010",
    Name: "Webcam Logitech C920",
    Description: "Webcam Logitech C920",
    Type: "Webcam",
    withBrand: true,
    Brand: "Logitech",
    withModel: true,
    Model: "C920",
    withSerial: false,
    Notes: "Sample Notes",
    idealPrice: 5000,
});
userList.push({
    username: 'admin',
    role: 'admin'
},
{
    username: 'tech',
    role: 'technical'
},
{
    username: 'root',
    role: 'root'
});

async function seedDatabase() {
    try {
        // Clear existing data
        await Client.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        
        // Seed clients and products
        await Client.insertMany(clientList);
        await Product.insertMany(productList);
        
        // Seed users with proper password hashing
        for (let userData of userList) {
            const newUser = new User({
                username: userData.username,
                role: userData.role
            });
            
            let password;
            if (userData.username === 'admin') password = 'admin';
            else if (userData.username === 'tech') password = 'tech';
            else if (userData.username === 'root') password = 'root';
            
            await User.register(newUser, password);
            console.log(`User ${userData.username} created successfully`);
        }
        
        console.log("Database seeded successfully!");
    } catch (error) {
        console.log("Error seeding database:", error);
    }
}

// Run the seed function
seedDatabase();

// Don't start express server in seed file
// app.listen(function(){
//     console.log("Seeds is up and running!");
// })