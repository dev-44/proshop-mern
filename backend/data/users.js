import bcrypt from "bcryptjs"

const users = [
    {
        name: 'Admin user',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
        shippingAddresses: [],
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        shippingAddresses: [{address: 'Palma y Elsa Escalante 1343',
                            city: 'Fernando de la Mora',
                            postalCode: '2300',
                            country: 'PY'}],
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        shippingAddresses: [],
    },
]

export default users